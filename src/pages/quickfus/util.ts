import InfiniteScroll from 'infinite-scroll';
import Masonry from 'masonry-layout';

export class Mason {
	public obj: any;

	// full data
	public fulldata: any[] = [];

	// chosen data
	public data: any[] = [];
	public msnry: Masonry;

	public page: number = 0;
	public itemsPerPage: number = 30;

	public constructor() {
		// console.log("mason ctor");
	}

	public async showMore() {
		let start = this.page * this.itemsPerPage;
		let slice = this.fulldata.slice(start, start + this.itemsPerPage); 
		// console.log("mason slice (" + this.fulldata.length + ") vs (" + slice.length + ") vs (" + this.data.length + "): " + slice)
		// console.log("slice ids: " + slice.map(s => s.id))
		this.data.push(...slice);
		this.page++;
	}

	public async append(element: HTMLElement) {
		// console.log("Mason append: ")
		// console.log(element);
		this.msnry.appended([element]);
	}

	public async reloadMsnry() {
		console.log("mason reloadMsnry");
		if (this.msnry) {
			this.msnry.reloadItems();
			this.msnry.layout();
		}
	}

	public initMasonry() {
		console.log("mason init grid: " + this.obj.grid);
		if (!this.obj.grid) return;
		if (this.msnry) this.msnry.destroy();

		this.msnry = new Masonry(this.obj.grid, {
			itemSelector: '.grid-item',
			columnWidth: '.grid-item', // 270, // 250 + 5*2 + 5*2
			horizontalOrder: true,
			gutter: 10,
			fitWidth: true,
			transitionDuration: 0,
			// resize: false
			// transitionDuration: '0.2s',
			// stagger: '0.03s'
			// initLayout: true,
		});
		this.msnry.layout();
	}

}

export class Infinite {
    public infScroll = new InfiniteScroll( '.container', {
        // defaults listed
      
        path: undefined,
        // REQUIRED. Determines the URL for the next page
        // Set to selector string to use the href of the next page's link
        // path: '.pagination__next'
        // Or set with {{#}} in place of the page number in the url
        // path: '/blog/page/{{#}}'
        // or set with function
        // path: function() {
        //   return return '/articles/P' + ( ( this.loadCount + 1 ) * 10 );
        // }
      
        append: undefined,
        // REQUIRED for appending content
        // Appends selected elements from loaded page to the container
      
        checkLastPage: true,
        // Checks if page has path selector element
        // Set to string if path is not set as selector string:
        //   checkLastPage: '.pagination__next'
      
        // prefill: false,
        // Loads and appends pages on intialization until scroll requirement is met.
      
        responseBody: 'text',
        // Sets the method used on the response.
        // Set to 'json' to load JSON.
      
        domParseResponse: true,
        // enables parsing response body into a DOM
        // disable to load flat text
      
        fetchOptions: undefined,
        // sets custom settings for the fetch() request
        // for setting headers, cors, or POST method
        // can be set to an object, or a function that returns an object
      
        // outlayer: false,
        // Integrates Masonry, Isotope or Packery
        // Appended items will be added to the layout
      
        scrollThreshold: 400,
        // Sets the distance between the viewport to scroll area
        // for scrollThreshold event to be triggered.
      
        // elementScroll: false,
        // Sets scroller to an element for overflow element scrolling
      
        loadOnScroll: true,
        // Loads next page when scroll crosses over scrollThreshold
      
        history: 'replace',
        // Changes the browser history and URL.
        // Set to 'push' to use history.pushState()
        //    to create new history entries for each page change.
      
        historyTitle: true,
        // Updates the window title. Requires history enabled.
      
        hideNav: undefined,
        // Hides navigation element
      
        status: undefined,
        // Displays status elements indicating state of page loading:
        // .infinite-scroll-request, .infinite-scroll-load, .infinite-scroll-error
        // status: '.page-load-status'
      
        button: undefined,
        // Enables a button to load pages on click
        // button: '.load-next-button'
      
        onInit: undefined,
        // called on initialization
        // useful for binding events on init
        // onInit: function() {
        //   this.on( 'append', function() {...})
        // }
      
        debug: false,
        // Logs events and state changes to the console.
      });

}


export class util {

	public static caseAndAccentInsensitive(text) {
		const accentMap = (function(letters) {
			let map = {};
			while (letters.length > 0) {
				let letter = "[" + letters.shift() + "]",
					chars = letter.split('');
				while (chars.length > 0) {
					map[chars.shift()] = letter;
				}
			}
			return map;
		})([
			'aàáâãäå', // a
			'cç',      // c
			'eèéêë',   // e
			'iìíîï',   // i
			'nñ',      // n
			'oòóôõöø', // o
			'sß',      // s
			'uùúûü',   // u
			'yÿ'       // y
		]);
		let f = function(text) {
			var textFold = '';
			if (!text)
				return textFold;
			text = text.toLowerCase();
			for (var idx = 0; idx < text.length; idx++) {
				let charAt = text.charAt(idx);
				textFold += accentMap[charAt] || charAt;
			}
			// return "(?i)" + textFold;
			return textFold;
		}
		return f(text);
	}

	// Returns a function, that, as long as it continues to be invoked, will not
	// be triggered. The function will be called after it stops being called for
	// N milliseconds.
	public static debounce(func, wait, immediate) {
		// 'private' variable for instance
		// The returned function will be able to reference this due to closure.
		// Each call to the returned function will share this common timer.
		var timeout;

		// Calling debounce returns a new anonymous function
		return function() {
			// reference the context and args for the setTimeout function
			var context = this,
				args = arguments;

			// Should the function be called now? If immediate is true
			//   and not already in a timeout then the answer is: Yes
			var callNow = immediate && !timeout;

			// This is the basic debounce behaviour where you can call this
			//   function several times, but it will only execute once
			//   [before or after imposing a delay].
			//   Each time the returned function is called, the timer starts over.
			clearTimeout(timeout);

			// Set the new timeout
			timeout = setTimeout(() => {

				// Inside the timeout function, clear the timeout variable
				// which will let the next execution run when in 'immediate' mode
				timeout = null;

				// Check if the function already ran with the immediate flag
				if (!immediate) {
					// Call the original function with apply
					// apply lets you define the 'this' object as well as the arguments
					//    (both captured before setTimeout)
					func.apply(context, args);
				}
			}, wait);

			// Immediate mode and no wait timer? Execute the function..
			if (callNow) func.apply(context, args);
		}
	}


}
