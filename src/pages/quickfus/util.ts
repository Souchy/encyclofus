import * as Masonry from 'masonry-layout'

export class Mason {
	public obj: any;

	// full data
	public fulldata: any[] = [];
	public index: number = 0;

	// chosen data
	public data: any[] = [];
	public msnry: Masonry;

	public constructor() {
		console.log("mason ctor");
	}

	public showMore(count?) {
		var numPerPage = 50;
		if (count) numPerPage = count;
		// this.data.concat(response.content); //JSON.stringify(response.content);
		// console.log("itemsearch fulldata : " + this.fulldata);
		for (var j = 0; j < numPerPage; j++) {
			if (this.index >= this.fulldata.length) return;
			// console.log("itemsearch fulldata[" + this.index + "] : " + this.fulldata[this.index]);
			this.data.push(this.fulldata[this.index]);
			this.index++;
		}
		// this.initMasonry();
		// this.msnry.reloadItems();
		// this.reloadMsnry();  // cant reload here because it takes time before the item sheets are actually added to the HTML
		// this.layout();
	}

	// event
	public loadedCountChanged() {
		this.reloadMsnry();
	}

	public reloadMsnry() {
		// console.log("mason reloadMsnry");
		if (this.msnry) {
			this.msnry.reloadItems();
			this.msnry.layout();
		}
	}
	public layout() {
		// console.log("mason layout()");
		if (this.msnry) {
			this.msnry.layout();
		}
	}

	public initMasonry() {
		console.log("mason init");
		if (!this.obj.grid) return;
		if (this.msnry) this.msnry.destroy();
		if (!this.obj.attachedb || !this.obj.queriedb) return;
		// if (this.msnry != null) {
		// 	if (this.msnry.getItemElements().length != 0) return;
		// }

		var ref = this;
		// if (this.obj.grid) console.log("mason count : " + this.obj.grid.children.length);
		// else console.log("mason val : " + this.obj.grid);

		this.msnry = new Masonry(this.obj.grid, {
			itemSelector: '.grid-item',
			// horizontalOrder: true,
			columnWidth: '.grid-item', // 270, // 250 + 5*2 + 5*2
			gutter: 10,
			// transitionDuration: 0,
			fitWidth: true,
			// initLayout: true,
		});
		function onLayout(items) {
			var gridlength = ref.obj.grid ? ref.obj.grid.children.length : 0;
			var datalength = ref.data ? ref.data.length : 0;
			// console.log(" mason layout : " + items.length + " / " + gridlength + " / " + datalength);
			// console.log(" mason element : " + items.keys());
			// console.log(" mason element : " + JSON.stringify(items[0]));
			// for (var i = 0; i < this.msnry.getItemElements().length; i++) {
			// 	console.log("mason element : " + this.msnry.getItemElements()[i]);
			// }
		}
		function onLayoutOnce(items) {
			// console.log("itemsearch mason layout once : " + items.length);
		}
		// bind event listener
		this.msnry.on('layoutComplete', onLayout);
		this.msnry.once('onLayoutOnce', onLayout);
		this.msnry.layout();
		// if (this.grid) console.log("itemsearch mason 2 : " + this.grid.children.length);
		// else console.log("itemsearch mason 2 : " + this.grid);
	}

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
			return "(?i)" + textFold;
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
			timeout = setTimeout(function() {

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
