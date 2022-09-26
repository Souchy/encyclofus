import { DI } from '@aurelia/kernel';

function json(body, replacer) {
    return JSON.stringify((body !== undefined ? body : {}), replacer);
}

const retryStrategy = {
    fixed: 0,
    incremental: 1,
    exponential: 2,
    random: 3
};
const defaultRetryConfig = {
    maxRetries: 3,
    interval: 1000,
    strategy: retryStrategy.fixed
};
class RetryInterceptor {
    constructor(retryConfig) {
        this.retryConfig = { ...defaultRetryConfig, ...(retryConfig !== undefined ? retryConfig : {}) };
        if (this.retryConfig.strategy === retryStrategy.exponential &&
            this.retryConfig.interval <= 1000) {
            throw new Error('An interval less than or equal to 1 second is not allowed when using the exponential retry strategy');
        }
    }
    request(request) {
        if (!request.retryConfig) {
            request.retryConfig = { ...this.retryConfig };
            request.retryConfig.counter = 0;
        }
        request.retryConfig.requestClone = request.clone();
        return request;
    }
    response(response, request) {
        Reflect.deleteProperty(request, 'retryConfig');
        return response;
    }
    responseError(error, request, httpClient) {
        const { retryConfig } = request;
        const { requestClone } = retryConfig;
        return Promise.resolve().then(() => {
            if (retryConfig.counter < retryConfig.maxRetries) {
                const result = retryConfig.doRetry !== undefined ? retryConfig.doRetry(error, request) : true;
                return Promise.resolve(result).then(doRetry => {
                    if (doRetry) {
                        retryConfig.counter++;
                        const delay = calculateDelay(retryConfig);
                        return new Promise(resolve => setTimeout(resolve, !isNaN(delay) ? delay : 0))
                            .then(() => {
                            const newRequest = requestClone.clone();
                            if (typeof (retryConfig.beforeRetry) === 'function') {
                                return retryConfig.beforeRetry(newRequest, httpClient);
                            }
                            return newRequest;
                        })
                            .then(newRequest => {
                            const retryableRequest = { ...newRequest, retryConfig };
                            return httpClient.fetch(retryableRequest);
                        });
                    }
                    Reflect.deleteProperty(request, 'retryConfig');
                    throw error;
                });
            }
            Reflect.deleteProperty(request, 'retryConfig');
            throw error;
        });
    }
}
function calculateDelay(retryConfig) {
    const { interval, strategy, minRandomInterval, maxRandomInterval, counter } = retryConfig;
    if (typeof (strategy) === 'function') {
        return retryConfig.strategy(counter);
    }
    switch (strategy) {
        case (retryStrategy.fixed):
            return retryStrategies[retryStrategy.fixed](interval);
        case (retryStrategy.incremental):
            return retryStrategies[retryStrategy.incremental](counter, interval);
        case (retryStrategy.exponential):
            return retryStrategies[retryStrategy.exponential](counter, interval);
        case (retryStrategy.random):
            return retryStrategies[retryStrategy.random](counter, interval, minRandomInterval, maxRandomInterval);
        default:
            throw new Error('Unrecognized retry strategy');
    }
}
const retryStrategies = [
    interval => interval,
    (retryCount, interval) => interval * retryCount,
    (retryCount, interval) => retryCount === 1 ? interval : interval ** retryCount / 1000,
    (retryCount, interval, minRandomInterval = 0, maxRandomInterval = 60000) => {
        return Math.random() * (maxRandomInterval - minRandomInterval) + minRandomInterval;
    }
];

class HttpClientConfiguration {
    constructor() {
        this.baseUrl = '';
        this.defaults = {};
        this.interceptors = [];
        this.dispatcher = null;
    }
    withBaseUrl(baseUrl) {
        this.baseUrl = baseUrl;
        return this;
    }
    withDefaults(defaults) {
        this.defaults = defaults;
        return this;
    }
    withInterceptor(interceptor) {
        this.interceptors.push(interceptor);
        return this;
    }
    useStandardConfiguration() {
        const standardConfig = { credentials: 'same-origin' };
        Object.assign(this.defaults, standardConfig, this.defaults);
        return this.rejectErrorResponses();
    }
    rejectErrorResponses() {
        return this.withInterceptor({ response: rejectOnError });
    }
    withRetry(config) {
        const interceptor = new RetryInterceptor(config);
        return this.withInterceptor(interceptor);
    }
    withDispatcher(dispatcher) {
        this.dispatcher = dispatcher;
        return this;
    }
}
function rejectOnError(response) {
    if (!response.ok) {
        throw response;
    }
    return response;
}

const absoluteUrlRegexp = /^([a-z][a-z0-9+\-.]*:)?\/\//i;
const IHttpClient = DI.createInterface('IHttpClient', x => x.singleton(HttpClient));
class HttpClient {
    constructor() {
        this.dispatcher = null;
        this.activeRequestCount = 0;
        this.isRequesting = false;
        this.isConfigured = false;
        this.baseUrl = '';
        this.defaults = null;
        this.interceptors = [];
    }
    configure(config) {
        let normalizedConfig;
        if (typeof config === 'object') {
            const requestInitConfiguration = { defaults: config };
            normalizedConfig = requestInitConfiguration;
        }
        else if (typeof config === 'function') {
            normalizedConfig = new HttpClientConfiguration();
            normalizedConfig.baseUrl = this.baseUrl;
            normalizedConfig.defaults = { ...this.defaults };
            normalizedConfig.interceptors = this.interceptors;
            normalizedConfig.dispatcher = this.dispatcher;
            const c = config(normalizedConfig);
            if (Object.prototype.isPrototypeOf.call(HttpClientConfiguration.prototype, c)) {
                normalizedConfig = c;
            }
        }
        else {
            throw new Error('invalid config');
        }
        const defaults = normalizedConfig.defaults;
        if (defaults !== undefined && Object.prototype.isPrototypeOf.call(Headers.prototype, defaults.headers)) {
            throw new Error('Default headers must be a plain object.');
        }
        const interceptors = normalizedConfig.interceptors;
        if (interceptors !== undefined && interceptors.length) {
            if (interceptors.filter(x => Object.prototype.isPrototypeOf.call(RetryInterceptor.prototype, x)).length > 1) {
                throw new Error('Only one RetryInterceptor is allowed.');
            }
            const retryInterceptorIndex = interceptors.findIndex(x => Object.prototype.isPrototypeOf.call(RetryInterceptor.prototype, x));
            if (retryInterceptorIndex >= 0 && retryInterceptorIndex !== interceptors.length - 1) {
                throw new Error('The retry interceptor must be the last interceptor defined.');
            }
        }
        this.baseUrl = normalizedConfig.baseUrl;
        this.defaults = defaults;
        this.interceptors = normalizedConfig.interceptors !== undefined ? normalizedConfig.interceptors : [];
        this.dispatcher = normalizedConfig.dispatcher;
        this.isConfigured = true;
        return this;
    }
    fetch(input, init) {
        this.trackRequestStart();
        let request = this.buildRequest(input, init);
        return this.processRequest(request, this.interceptors).then(result => {
            let response;
            if (Object.prototype.isPrototypeOf.call(Response.prototype, result)) {
                response = Promise.resolve(result);
            }
            else if (Object.prototype.isPrototypeOf.call(Request.prototype, result)) {
                request = result;
                response = fetch(request);
            }
            else {
                throw new Error(`An invalid result was returned by the interceptor chain. Expected a Request or Response instance, but got [${result}]`);
            }
            return this.processResponse(response, this.interceptors, request);
        })
            .then(result => {
            if (Object.prototype.isPrototypeOf.call(Request.prototype, result)) {
                return this.fetch(result);
            }
            return result;
        })
            .then(result => {
            this.trackRequestEnd();
            return result;
        }, error => {
            this.trackRequestEnd();
            throw error;
        });
    }
    buildRequest(input, init) {
        const defaults = this.defaults !== null ? this.defaults : {};
        let request;
        let body;
        let requestContentType;
        const parsedDefaultHeaders = parseHeaderValues(defaults.headers);
        if (Object.prototype.isPrototypeOf.call(Request.prototype, input)) {
            request = input;
            requestContentType = new Headers(request.headers).get('Content-Type');
        }
        else {
            if (!init) {
                init = {};
            }
            body = init.body;
            const bodyObj = body !== undefined ? { body: body } : null;
            const requestInit = { ...defaults, headers: {}, ...init, ...bodyObj };
            requestContentType = new Headers(requestInit.headers).get('Content-Type');
            request = new Request(getRequestUrl(this.baseUrl, input), requestInit);
        }
        if (!requestContentType) {
            if (new Headers(parsedDefaultHeaders).has('content-type')) {
                request.headers.set('Content-Type', new Headers(parsedDefaultHeaders).get('content-type'));
            }
            else if (body !== undefined && isJSON(body)) {
                request.headers.set('Content-Type', 'application/json');
            }
        }
        setDefaultHeaders(request.headers, parsedDefaultHeaders);
        if (body !== undefined && Object.prototype.isPrototypeOf.call(Blob.prototype, body) && body.type) {
            request.headers.set('Content-Type', body.type);
        }
        return request;
    }
    get(input, init) {
        return this.fetch(input, init);
    }
    post(input, body, init) {
        return this.callFetch(input, body, init, 'POST');
    }
    put(input, body, init) {
        return this.callFetch(input, body, init, 'PUT');
    }
    patch(input, body, init) {
        return this.callFetch(input, body, init, 'PATCH');
    }
    delete(input, body, init) {
        return this.callFetch(input, body, init, 'DELETE');
    }
    trackRequestStart() {
        this.isRequesting = !!(++this.activeRequestCount);
        if (this.isRequesting && this.dispatcher !== null) {
            const evt = new this.dispatcher.ownerDocument.defaultView.CustomEvent('aurelia-fetch-client-request-started', { bubbles: true, cancelable: true });
            setTimeout(() => { this.dispatcher.dispatchEvent(evt); }, 1);
        }
    }
    trackRequestEnd() {
        this.isRequesting = !!(--this.activeRequestCount);
        if (!this.isRequesting && this.dispatcher !== null) {
            const evt = new this.dispatcher.ownerDocument.defaultView.CustomEvent('aurelia-fetch-client-requests-drained', { bubbles: true, cancelable: true });
            setTimeout(() => { this.dispatcher.dispatchEvent(evt); }, 1);
        }
    }
    processRequest(request, interceptors) {
        return this.applyInterceptors(request, interceptors, 'request', 'requestError', this);
    }
    processResponse(response, interceptors, request) {
        return this.applyInterceptors(response, interceptors, 'response', 'responseError', request, this);
    }
    applyInterceptors(input, interceptors, successName, errorName, ...interceptorArgs) {
        return (interceptors !== undefined ? interceptors : [])
            .reduce((chain, interceptor) => {
            const successHandler = interceptor[successName];
            const errorHandler = interceptor[errorName];
            return chain.then(successHandler ? (value => successHandler.call(interceptor, value, ...interceptorArgs)) : identity, errorHandler ? (reason => errorHandler.call(interceptor, reason, ...interceptorArgs)) : thrower);
        }, Promise.resolve(input));
    }
    callFetch(input, body, init, method) {
        if (!init) {
            init = {};
        }
        init.method = method;
        if (body) {
            init.body = body;
        }
        return this.fetch(input, init);
    }
}
function parseHeaderValues(headers) {
    const parsedHeaders = {};
    const $headers = headers !== undefined ? headers : {};
    for (const name in $headers) {
        if (Object.prototype.hasOwnProperty.call($headers, name)) {
            parsedHeaders[name] = (typeof $headers[name] === 'function')
                ? $headers[name]()
                : $headers[name];
        }
    }
    return parsedHeaders;
}
function getRequestUrl(baseUrl, url) {
    if (absoluteUrlRegexp.test(url)) {
        return url;
    }
    return (baseUrl !== undefined ? baseUrl : '') + url;
}
function setDefaultHeaders(headers, defaultHeaders) {
    const $defaultHeaders = defaultHeaders !== undefined ? defaultHeaders : {};
    for (const name in $defaultHeaders) {
        if (Object.prototype.hasOwnProperty.call($defaultHeaders, name) && !headers.has(name)) {
            headers.set(name, $defaultHeaders[name]);
        }
    }
}
function isJSON(str) {
    try {
        JSON.parse(str);
    }
    catch (err) {
        return false;
    }
    return true;
}
function identity(x) {
    return x;
}
function thrower(x) {
    throw x;
}

export { HttpClient, HttpClientConfiguration, IHttpClient, RetryInterceptor, json, retryStrategy };
//# sourceMappingURL=index.dev.mjs.map
