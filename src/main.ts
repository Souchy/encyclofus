import { Breed } from './pages/breed';
import Aurelia from 'aurelia';
import { I18nConfiguration } from '@aurelia/i18n';
import { RouterConfiguration } from '@aurelia/router';
import { App } from './app';

import * as fr from './i18n/fr.json';
import * as en from './i18n/en.json';

Aurelia
	.register(
		I18nConfiguration.customize((options) => {
			options.initOptions = {
				resources: {
					en: { translation: en },
					fr: { translation: fr },
				}
			};
		})
	)
	// .register(Breed)
	// .register(RouterConfiguration)
	.register(RouterConfiguration.customize({ 
		useUrlFragmentHash: true, 
		// useDirectRouting: false,
		useHref: false,
	}))
	.app(App)
	.start();
