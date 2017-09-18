var noEdge = new Image();
noEdge.src = "noedge.png";
var viv = new Image();
viv.src = "browser.png";
var vectori = new Image();
vectori.src = "bgVector.jpg";
var vectorii = new Image();
vectorii.src = "endVector.jpg";
var URL = window.URL || window.webkitURL;
	if(!navigator.hardwareConcurrency){window.alert('This browser is not supported.');  throw new Error('This browser does fully not support Web Workers.')}if(!URL) {
window.alert('This browser is not supported.');		throw new Error('This browser does not support Blob URLs');
	}

	if(!window.Worker) {
window.alert('This browser is not supported.');		throw new Error('This browser does not support Web Workers');
	}

//Smooth Scroll.js
(function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define([], function () {
			return factory(root);
		});
	} else if ( typeof exports === 'object' ) {
		module.exports = factory(root);
	} else {
		root.SmoothScroll = factory(root);
	}
})(typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this, function (window) {

	'use strict';

	//
	// Feature Test
	//

	var supports =
		'querySelector' in document &&
		'addEventListener' in window &&
		'requestAnimationFrame' in window &&
		'closest' in window.Element.prototype;


	//
	// Default settings
	//

	var defaults = {
		// Selectors
		ignore: '[data-scroll-ignore]',
		header: null,

		// Speed & Easing
		speed: 1500,
		offset: 0,
		easing: 'easeInOutCubic',
		customEasing: null,

		// Callback API
		before: function () {},
		after: function () {}
	};


	//
	// Utility Methods
	//

	/**
	 * Merge two or more objects. Returns a new object.
	 * @param {Object}   objects  The objects to merge together
	 * @returns {Object}          Merged values of defaults and options
	 */
	var extend = function () {

		// Variables
		var extended = {};
		var deep = false;
		var i = 0;
		var length = arguments.length;

		// Merge the object into the extended object
		var merge = function (obj) {
			for (var prop in obj) {
				if (obj.hasOwnProperty(prop)) {
					extended[prop] = obj[prop];
				}
			}
		};

		// Loop through each object and conduct a merge
		for ( ; i < length; i++ ) {
			var obj = arguments[i];
			merge(obj);
		}

		return extended;

	};

	/**
	 * Get the height of an element.
	 * @param  {Node} elem The element to get the height of
	 * @return {Number}    The element's height in pixels
	 */
	var getHeight = function (elem) {
		return parseInt(window.getComputedStyle(elem).height, 10);
	};

	/**
	 * Escape special characters for use with querySelector
	 * @param {String} id The anchor ID to escape
	 * @author Mathias Bynens
	 * @link https://github.com/mathiasbynens/CSS.escape
	 */
	var escapeCharacters = function (id) {

		// Remove leading hash
		if (id.charAt(0) === '#') {
			id = id.substr(1);
		}

		var string = String(id);
		var length = string.length;
		var index = -1;
		var codeUnit;
		var result = '';
		var firstCodeUnit = string.charCodeAt(0);
		while (++index < length) {
			codeUnit = string.charCodeAt(index);
			// Note: thereâ€™s no need to special-case astral symbols, surrogate
			// pairs, or lone surrogates.

			// If the character is NULL (U+0000), then throw an
			// `InvalidCharacterError` exception and terminate these steps.
			if (codeUnit === 0x0000) {
				throw new InvalidCharacterError(
					'Invalid character: the input contains U+0000.'
				);
			}

			if (
				// If the character is in the range [\1-\1F] (U+0001 to U+001F) or is
				// U+007F, [â€¦]
				(codeUnit >= 0x0001 && codeUnit <= 0x001F) || codeUnit == 0x007F ||
				// If the character is the first character and is in the range [0-9]
				// (U+0030 to U+0039), [â€¦]
				(index === 0 && codeUnit >= 0x0030 && codeUnit <= 0x0039) ||
				// If the character is the second character and is in the range [0-9]
				// (U+0030 to U+0039) and the first character is a `-` (U+002D), [â€¦]
				(
					index === 1 &&
					codeUnit >= 0x0030 && codeUnit <= 0x0039 &&
					firstCodeUnit === 0x002D
				)
			) {
				// http://dev.w3.org/csswg/cssom/#escape-a-character-as-code-point
				result += '\\' + codeUnit.toString(16) + ' ';
				continue;
			}

			// If the character is not handled by one of the above rules and is
			// greater than or equal to U+0080, is `-` (U+002D) or `_` (U+005F), or
			// is in one of the ranges [0-9] (U+0030 to U+0039), [A-Z] (U+0041 to
			// U+005A), or [a-z] (U+0061 to U+007A), [â€¦]
			if (
				codeUnit >= 0x0080 ||
				codeUnit === 0x002D ||
				codeUnit === 0x005F ||
				codeUnit >= 0x0030 && codeUnit <= 0x0039 ||
				codeUnit >= 0x0041 && codeUnit <= 0x005A ||
				codeUnit >= 0x0061 && codeUnit <= 0x007A
			) {
				// the character itself
				result += string.charAt(index);
				continue;
			}

			// Otherwise, the escaped character.
			// http://dev.w3.org/csswg/cssom/#escape-a-character
			result += '\\' + string.charAt(index);

		}

		return '#' + result;

	};

	/**
	 * Calculate the easing pattern
	 * @link https://gist.github.com/gre/1650294
	 * @param {String} type Easing pattern
	 * @param {Number} time Time animation should take to complete
	 * @returns {Number}
	 */
	var easingPattern = function (settings, time) {
		var pattern;

		// Default Easing Patterns
		if (settings.easing === 'easeInQuad') pattern = time * time; // accelerating from zero velocity
		if (settings.easing === 'easeOutQuad') pattern = time * (2 - time); // decelerating to zero velocity
		if (settings.easing === 'easeInOutQuad') pattern = time < 0.5 ? 2 * time * time : -1 + (4 - 2 * time) * time; // acceleration until halfway, then deceleration
		if (settings.easing === 'easeInCubic') pattern = time * time * time; // accelerating from zero velocity
		if (settings.easing === 'easeOutCubic') pattern = (--time) * time * time + 1; // decelerating to zero velocity
		if (settings.easing === 'easeInOutCubic') pattern = time < 0.5 ? 4 * time * time * time : (time - 1) * (2 * time - 2) * (2 * time - 2) + 1; // acceleration until halfway, then deceleration
		if (settings.easing === 'easeInQuart') pattern = time * time * time * time; // accelerating from zero velocity
		if (settings.easing === 'easeOutQuart') pattern = 1 - (--time) * time * time * time; // decelerating to zero velocity
		if (settings.easing === 'easeInOutQuart') pattern = time < 0.5 ? 8 * time * time * time * time : 1 - 8 * (--time) * time * time * time; // acceleration until halfway, then deceleration
		if (settings.easing === 'easeInQuint') pattern = time * time * time * time * time; // accelerating from zero velocity
		if (settings.easing === 'easeOutQuint') pattern = 1 + (--time) * time * time * time * time; // decelerating to zero velocity
		if (settings.easing === 'easeInOutQuint') pattern = time < 0.5 ? 16 * time * time * time * time * time : 1 + 16 * (--time) * time * time * time * time; // acceleration until halfway, then deceleration

		// Custom Easing Patterns
		if (!!settings.customEasing) pattern = settings.customEasing(time);

		return pattern || time; // no easing, no acceleration
	};

	/**
	 * Determine the document's height
	 * @returns {Number}
	 */
	var getDocumentHeight = function () {
		return Math.max(
			document.body.scrollHeight, document.documentElement.scrollHeight,
			document.body.offsetHeight, document.documentElement.offsetHeight,
			document.body.clientHeight, document.documentElement.clientHeight
		);
	};

	/**
	 * Calculate how far to scroll
	 * @param {Element} anchor The anchor element to scroll to
	 * @param {Number} headerHeight Height of a fixed header, if any
	 * @param {Number} offset Number of pixels by which to offset scroll
	 * @returns {Number}
	 */
	var getEndLocation = function (anchor, headerHeight, offset) {
		var location = 0;
		if (anchor.offsetParent) {
			do {
				location += anchor.offsetTop;
				anchor = anchor.offsetParent;
			} while (anchor);
		}
		location = Math.max(location - headerHeight - offset, 0);
		return location;
	};

	/**
	 * Get the height of the fixed header
	 * @param  {Node}   header The header
	 * @return {Number}        The height of the header
	 */
	var getHeaderHeight = function (header) {
		return !header ? 0 : (getHeight(header) + header.offsetTop);
	};

	/**
	 * Bring the anchored element into focus
	 * @param {Node}     anchor      The anchor element
	 * @param {Number}   endLocation The end location to scroll to
	 * @param {Boolean}  isNum       If true, scroll is to a position rather than an element
	 */
	var adjustFocus = function (anchor, endLocation, isNum) {

		// Don't run if scrolling to a number on the page
		if (isNum) return;

		// Otherwise, bring anchor element into focus
		anchor.focus();
		if (document.activeElement.id !== anchor.id) {
			anchor.setAttribute('tabindex', '-1');
			anchor.focus();
			anchor.style.outline = 'none';
		}
		window.scrollTo(0 , endLocation);

	};

	/**
	 * Check to see if user prefers reduced motion
	 * @param  {Object} settings Script settings
	 */
	var reduceMotion = function (settings) {
		if ('matchMedia' in window && window.matchMedia('(prefers-reduced-motion)').matches) {
			return true;
		}
		return false;
	};


	//
	// SmoothScroll Constructor
	//

	var SmoothScroll = function (selector, options) {

		//
		// Variables
		//

		var smoothScroll = {}; // Object for public APIs
		var settings, anchor, toggle, fixedHeader, headerHeight, eventTimeout, animationInterval;


		//
		// Methods
		//

		/**
		 * Cancel a scroll-in-progress
		 */
		smoothScroll.cancelScroll = function () {
			// clearInterval(animationInterval);
			cancelAnimationFrame(animationInterval);
		};

		/**
		 * Start/stop the scrolling animation
		 * @param {Node|Number} anchor  The element or position to scroll to
		 * @param {Element}     toggle  The element that toggled the scroll event
		 * @param {Object}      options
		 */
		smoothScroll.animateScroll = function (anchor, toggle, options) {

			// Local settings
			var animateSettings = extend(settings || defaults, options || {}); // Merge user options with defaults

			// Selectors and variables
			var isNum = Object.prototype.toString.call(anchor) === '[object Number]' ? true : false;
			var anchorElem = isNum || !anchor.tagName ? null : anchor;
			if (!isNum && !anchorElem) return;
			var startLocation = window.pageYOffset; // Current location on the page
			if (animateSettings.header && !fixedHeader) {
				// Get the fixed header if not already set
				fixedHeader = document.querySelector( animateSettings.header );
			}
			if (!headerHeight) {
				// Get the height of a fixed header if one exists and not already set
				headerHeight = getHeaderHeight(fixedHeader);
			}
			var endLocation = isNum ? anchor : getEndLocation(anchorElem, headerHeight, parseInt((typeof animateSettings.offset === 'function' ? animateSettings.offset() : animateSettings.offset), 10)); // Location to scroll to
			var distance = endLocation - startLocation; // distance to travel
			var documentHeight = getDocumentHeight();
			var timeLapsed = 0;
			var start, percentage, position;

			/**
			 * Stop the scroll animation when it reaches its target (or the bottom/top of page)
			 * @param {Number} position Current position on the page
			 * @param {Number} endLocation Scroll to location
			 * @param {Number} animationInterval How much to scroll on this loop
			 */
			var stopAnimateScroll = function (position, endLocation) {

				// Get the current location
				var currentLocation = window.pageYOffset;

				// Check if the end location has been reached yet (or we've hit the end of the document)
				if ( position == endLocation || currentLocation == endLocation || ((startLocation < endLocation && window.innerHeight + currentLocation) >= documentHeight )) {

					// Clear the animation timer
					smoothScroll.cancelScroll();

					// Bring the anchored element into focus
					adjustFocus(anchor, endLocation, isNum);

					// Run callback after animation complete
					animateSettings.after(anchor, toggle);

					// Reset start
					start = null;

					return true;

				}
			};

			/**
			 * Loop scrolling animation
			 */
			var loopAnimateScroll = function (timestamp) {
				if (!start) { start = timestamp; }
				timeLapsed += timestamp - start;
				percentage = (timeLapsed / parseInt(animateSettings.speed, 10));
				percentage = (percentage > 1) ? 1 : percentage;
				position = startLocation + (distance * easingPattern(animateSettings, percentage));
				window.scrollTo(0, Math.floor(position));
				if (!stopAnimateScroll(position, endLocation)) {
					window.requestAnimationFrame(loopAnimateScroll);
					start = timestamp;
				}
			};

			/**
			 * Reset position to fix weird iOS bug
			 * @link https://github.com/cferdinandi/smooth-scroll/issues/45
			 */
			if (window.pageYOffset === 0) {
				window.scrollTo( 0, 0 );
			}

			// Run callback before animation starts
			animateSettings.before(anchor, toggle);

			// Start scrolling animation
			smoothScroll.cancelScroll();
			window.requestAnimationFrame(loopAnimateScroll);


		};

		/**
		 * Handle has change event
		 */
		var hashChangeHandler = function (event) {

			// Only run if there's an anchor element to scroll to
			if (!anchor) return;

			// Reset the anchor element's ID
			anchor.id = anchor.getAttribute('data-scroll-id');

			// Scroll to the anchored content
			smoothScroll.animateScroll(anchor, toggle);

			// Reset anchor and toggle
			anchor = null;
			toggle = null;

		};

		/**
		 * If smooth scroll element clicked, animate scroll
		 */
		var clickHandler = function (event) {

			// Don't run if the user prefers reduced motion
			if (reduceMotion(settings)) return;

			// Don't run if right-click or command/control + click
			if (event.button !== 0 || event.metaKey || event.ctrlKey) return;

			// Check if a smooth scroll link was clicked
			toggle = event.target.closest(selector);
			if (!toggle || toggle.tagName.toLowerCase() !== 'a' || event.target.closest(settings.ignore)) return;

			// Only run if link is an anchor and points to the current page
			if (toggle.hostname !== window.location.hostname || toggle.pathname !== window.location.pathname || !/#/.test(toggle.href)) return;

			// Get the sanitized hash
			var hash;
			try {
				hash = escapeCharacters(decodeURIComponent(toggle.hash));
			} catch(e) {
				hash = escapeCharacters(toggle.hash);
			}

			// If the hash is empty, scroll to the top of the page
			if (hash === '#') {

				// Prevent default link behavior
				event.preventDefault();

				// Set the anchored element
				anchor = document.body;

				// Save or create the ID as a data attribute and remove it (prevents scroll jump)
				var id = anchor.id ? anchor.id : 'smooth-scroll-top';
				anchor.setAttribute('data-scroll-id', id);
				anchor.id = '';

				// If no hash change event will happen, fire manually
				// Otherwise, update the hash
				if (window.location.hash.substring(1) === id) {
					hashChangeHandler();
				} else {
					window.location.hash = id;
				}

				return;

			}

			// Get the anchored element
			anchor = document.querySelector(hash);

			// If anchored element exists, save the ID as a data attribute and remove it (prevents scroll jump)
			if (!anchor) return;
			anchor.setAttribute('data-scroll-id', anchor.id);
			anchor.id = '';

			// If no hash change event will happen, fire manually
			if (toggle.hash === window.location.hash) {
				event.preventDefault();
				hashChangeHandler();
			}

		};

		/**
		 * On window scroll and resize, only run events at a rate of 15fps for better performance
		 */
		var resizeThrottler = function (event) {
			if (!eventTimeout) {
				eventTimeout = setTimeout(function() {
					eventTimeout = null; // Reset timeout
					headerHeight = getHeaderHeight(fixedHeader); // Get the height of a fixed header if one exists
				}, 66);
			}
		};

		/**
		 * Destroy the current initialization.
		 */
		smoothScroll.destroy = function () {

			// If plugin isn't already initialized, stop
			if (!settings) return;

			// Remove event listeners
			document.removeEventListener('click', clickHandler, false);
			window.removeEventListener('resize', resizeThrottler, false);

			// Cancel any scrolls-in-progress
			smoothScroll.cancelScroll();

			// Reset variables
			settings = null;
			anchor = null;
			toggle = null;
			fixedHeader = null;
			headerHeight = null;
			eventTimeout = null;
			animationInterval = null;
		};

		/**
		 * Initialize Smooth Scroll
		 * @param {Object} options User settings
		 */
		smoothScroll.init = function (options) {

			// feature test
			if (!supports) return;

			// Destroy any existing initializations
			smoothScroll.destroy();

			// Selectors and variables
			settings = extend(defaults, options || {}); // Merge user options with defaults
			fixedHeader = settings.header ? document.querySelector(settings.header) : null; // Get the fixed header
			headerHeight = getHeaderHeight(fixedHeader);

			// When a toggle is clicked, run the click handler
			document.addEventListener('click', clickHandler, false);

			// Listen for hash changes
			window.addEventListener('hashchange', hashChangeHandler, false);

			// If window is resized and there's a fixed header, recalculate its size
			if (fixedHeader) {
				window.addEventListener('resize', resizeThrottler, false);
			}

		};


		//
		// Initialize plugin
		//

		smoothScroll.init(options);


		//
		// Public APIs
		//

		return smoothScroll;

	};

	return SmoothScroll;

});

var scrPXT = 0;
function uA() {if(navigator.userAgent.includes("Edge")){return true;}else{return false;}}
function exec(){
	scrPXT++;
}
function scrubPicky(){
	document.getElementById("picky").outerHTML = "";
}
function github() {
	window.history.pushState("display.html#/github", "","display.html#/github");
	setTimeout(function(){
		window.location = "https://github.com/QWERTYUIOPYOZO/TheResistanceMark#";
	}, 500);
}
function init() {
    data = document.getElementById('benchQu').value;
    document.getElementById("wait").className = "to";
    document.body.style.overflow = "hidden";
    setTimeout(function(){
  	  window.location = "index.htm?test=" + data;	
    },1050);    
}
function to() {
    document.getElementById("wait").className = "to";	
}


function onscrollFrontpage(){

    if (document.body.scrollTop >= 0) {	
			var value1 = document.body.scrollTop / document.body.scrollTopMax * 100;
			document.getElementById("scrollMonitor").style.width = value1 + "%";
	        if(document.body.scrollTop < 5){
	    		window.history.pushState("display.html#/", "","display.html#/");
			 document.title = "Test Your Browser...";
		}
	    	else{
			window.history.pushState("display.html#/scroll", "","display.html#/scroll");
		}
	    	if(document.body.scrollTop > 5){
			document.getElementById("back2").style.height = (document.body.scrollTop * 2) + "px";
		}
	    	else{
			document.getElementById("back2").style.height = "0px";
		}
		var value1 = document.body.scrollTop + 50;
		var value2 = document.body.scrollTop / 10;
		var value3 = 15 / document.body.scrollTop;
		var value4 = document.body.scrollTop * 4 + 50;
		var element1 = document.getElementById("view1");
		element1.style.transform = "translate(-50%,-" + value1 + "%";
		element1.style.filter = "blur(" + value2 + "px)";
		var element2 = document.getElementById("view3");;
		element2.style.opacity = value3;
		var element3 = document.getElementById("benchQu");
		var element4 = document.getElementById("gButton");
		if(document.body.scrollTop <= document.body.clientHeight / 3.35){
			element3.style.transform = "translate(-50%,-" + value4 + "%)";
		}
		if(document.body.scrollTop > document.body.clientHeight / 3.35){
			element3.style.top = "0px";
			element3.style.transform = "translate(-50%,0)";
		}

		else{
			element3.style.top = "";
		}
		if(document.body.scrollTop <=  document.body.clientHeight / 3.15){
			element4.style.transform = "translate(250px,-" + value4 + "%)";
		}
		if(document.body.scrollTop > document.body.clientHeight / 3.15){
			element4.style.top = "0px";
			element4.style.transform = "translate(250px,0)";
		}
		else{
			element4.style.top = "";
		}
		var element1 = document.getElementById("scrollButton")
		if(document.body.scrollTop > 0){
			element1.style.display = "block";
			element1.style.opacity = 1;
		}
		else{
			element1.style.opacity = 0;
		}
		var element1 = document.getElementById("firefoxLogo");	
		var element2 = document.getElementById("chromeLogo");	
		var element3 = document.getElementById("operaLogo");
	    	if(document.body.scrollTop > 5 && document.body.scrollTop < 630){
			document.title = "Compare the best...";
		}
		if(document.body.scrollTop < 50){
			element1.style.display = "none";
			element2.style.display = "none";
			element3.style.display = "none";
			var value1 = 0;
			var valueA = 0;
		}
		else{
			element1.style.display = "block";
			element2.style.display = "block";
			element3.style.display = "block";			
			var value1 = (document.body.scrollTop - 50) / 5;
			var valueA = (document.body.scrollTop - 50) / 100;
		}
		if(document.body.scrollTop < 150){
			var value2 = 0;
			var valueB = 0;
		}
		else{
			var value2 = (document.body.scrollTop - 150) / 5;
			var valueB = (document.body.scrollTop - 150) / 100;
		}
		if(document.body.scrollTop < 250){
			var value3 = 0;
			var valueC = 0;
		}
		else{
			var value3 = (document.body.scrollTop - 250) / 5;
			var valueC = (document.body.scrollTop - 250) / 100;
		}	
		element1.style.left = value1 + "%";
		element1.style.opacity = valueA;
		element2.style.left = value2 + "%";
		element2.style.opacity = valueB;
		element3.style.left = value3 + "%";
		element3.style.opacity = valueC;
		if(document.body.scrollTop > 120){
			var value1 = (document.body.scrollTop - 120) / 1000;
			var value2 = (document.body.scrollTop - 120) / 100 + 0.75;
			var value3 = 0;
		}
		else{
			var value1 = 0;
			var value2 = 0.75;
			var value3 = 0;

		}
		if(document.body.scrollTop > 550){
			var value3 = (document.body.scrollTop - 550) / 25;
		}
		if(document.body.scrollTop > 770){
			var value1 = 0;
		}
		var element1 = document.getElementById("view4");
		element1.style.opacity = value1;
		element1.style.transform = "scale(" + value2 + ")";
		element1.style.filter = "blur(" + value3 + "px)"
		var element1 = document.getElementsByClassName("view5a");
		var element2 = document.getElementsByClassName("view5b");
		var element3 = document.getElementById("view6");
		var element4 = document.getElementById("view7")
	    	if(document.body.scrollTop > 630 && document.body.scrollTop < 1980){
			document.title = "Async adds zest...";
		}		
		if(document.body.scrollTop > 630){
			var value1 = (document.body.scrollTop - 630) / 750;
		}
		else{
			var value1 = 0;
		}
			var value2a = document.body.scrollTop - 630;
			var value2b = value2a -150;
			var value2c = value2b- 150;
			var value2d = value2c -150;
			var value2e = value2d -150;
			var value2f = value2e -150;
			var value2g = value2f -150;
			var value2h = value2g- 150;
			var value2i = value2h -150;
			var value2j = value2i -150;
			var value3 = (document.body.scrollTop - 1980) * 3;
		if(document.body.scrollTop > 630){
		element1[0].style.opacity = value1;
		element2[0].style.opacity = value1;
		element1[1].style.opacity = value1 - 0.2;
		element2[1].style.opacity = value1 - 0.2;
		element1[2].style.opacity = value1 - 0.4;
		element2[2].style.opacity = value1 - 0.4;
		element1[3].style.opacity = value1 - 0.6;
		element2[3].style.opacity = value1 - 0.6;
		element1[4].style.opacity = value1 - 0.8;
		element2[4].style.opacity = value1 - 0.8;
		element1[5].style.opacity = value1 - 1;
		element2[5].style.opacity = value1 - 1;
		element1[6].style.opacity = value1 - 1.2;
		element2[6].style.opacity = value1 - 1.2;
		element1[7].style.opacity = value1 - 1.4;
		element2[7].style.opacity = value1 - 1.4;
		element1[8].style.opacity = value1 - 1.6;
		element2[8].style.opacity = value1 - 1.6;
		element1[9].style.opacity = value1 - 1.8;
		element2[9].style.opacity = value1 - 1.8;
	
		element1[0].style.transform = "translate(" + value2a + "px,0)";
		element2[0].style.transform = "translate(-" + value2a + "px,0)";
		element1[1].style.transform = "translate(" + value2b + "px,0)";
		element2[1].style.transform = "translate(-" + value2b + "px,0)";
		element1[2].style.transform = "translate(" + value2c + "px,0)";
		element2[2].style.transform = "translate(-" + value2c + "px,0)";
		element1[3].style.transform = "translate(" + value2d + "px,0)";
		element2[3].style.transform = "translate(-" + value2d + "px,0)";
		element1[4].style.transform = "translate(" + value2e + "px,0)";
		element2[4].style.transform = "translate(-" + value2e + "px,0)";
		element1[5].style.transform = "translate(" + value2f + "px,0)";
		element2[5].style.transform = "translate(-" + value2f + "px,0)";
		element1[6].style.transform = "translate(" + value2g + "px,0)";
		element2[6].style.transform = "translate(-" + value2g + "px,0)";
		element1[7].style.transform = "translate(" + value2h + "px,0)";
		element2[7].style.transform = "translate(-" + value2h + "px,0)";
		element1[8].style.transform = "translate(" + value2i + "px,0)";
		element2[8].style.transform = "translate(-" + value2i + "px,0)";
		element1[9].style.transform = "translate(" + value2j + "px,0)";
		element2[9].style.transform = "translate(-" + value2j + "px,0)";
		element3.style.opacity = 1;
		}
		else{
		element1[0].style.opacity = 0;
		element2[0].style.opacity = 0;
		element1[1].style.opacity = 0;
		element2[1].style.opacity = 0;
		element1[2].style.opacity = 0;
		element2[2].style.opacity = 0;
		element1[3].style.opacity = 0;
		element2[3].style.opacity = 0;
		element1[4].style.opacity = 0;
		element2[4].style.opacity = 0;
		element4.style.width = "0px";
	
		element1[0].style.transform = "";
		element2[0].style.transform = "";
		element1[1].style.transform = "";
		element2[1].style.transform = "";
		element1[2].style.transform = "";
		element2[2].style.transform = "";
		element1[3].style.transform = "";
		element2[3].style.transform = "";
		element1[4].style.transform = "";
		element2[4].style.transform = "";	
		element3.style.opacity = 0;	
		}
		if(document.body.scrollTop > 1980){
			document.title = "Does your browser top the rest?";
			element4.style.width = value3 + "px";
		}
		else{
			element4.style.width = "0px";
		}
		if(document.body.scrollTop > 2700){
			document.getElementById("bottomContent").style.opacity = 0.25;
		}
		else{
			document.getElementById("bottomContent").style.opacity = 0;			
		}
    }

}




function onloadFrontpage(){
window.history.pushState("display.html#/", "","display.html#/");
document.title = "Test Your Browser..."
var x = document.getElementById("scrollable").style.height = 2700 + document.body.clientHeight + "px";
var y = document.getElementById("view8").style.width = document.body.clientWidth + "px";
var z = document.getElementById("bottomContent").style.left = (document.body.clientWidth / 2) + "px";
	var x = uA();
	if(x == true){
		var picky = document.getElementById("picky");
		picky.innerHTML = '<img src="noedge.png" style="height: 55px"><i>Look strange?</i><b>EdgeHTML and Edge Scrolling are not yet fully supported.    </b><a style="color: red; background: white;" onclick="scrubPicky()">Close</a>';
		picky.style.display = "block";
	}
document.body.className = "";
document.getElementById("scrollDisplay").className = "";
	document.body.scrollTop = 0;
setTimeout(function(){
	var x = document.getElementsByClassName("testBrowser")[0];
	var y = document.getElementsByClassName("resistanceMark")[0];
	x.style.filter = "blur(75px)";
	y.style.opacity = "1";
	
},2150);
}




window.onload = onloadFrontpage;
window.onscroll = onscrollFrontpage;
window.onbeforeunload = to;
