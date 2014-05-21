/* Copyright (c) 2010-2014  Padopolis Inc.  All rights reserved. */

/*
	Browser detection and normalization, specifically for use in a web browser.

	NOTE:	We assume that this file is loaded FIRST, jQuery, Module, etc.

			The pattern is that immediately AFTER this is loaded,
			 we'll check Browser.is.supported and, if that's false,
			 we'll eject the user to a page which tells them to get a better browser.
*/

(function() {	// begin hidden from global scope

	var global = window;

	// if Browser is already defined, this script has been loaded twice, so bail!
	if (global.Browser) return;

//
//	Stub-in "console" methods for stupid browsers ( *cough* IE *cough* ).
//
//	Note that not only is it the case that many console methods are not defined for IE 9,
//	  if the console itself is not "shown" in IE9, ALL console methods are undefined.  Ugh.
//

	// no-op function for the stubbing in console
	function noop() {}

	var konsole = global.console;
	if (!konsole) {
		konsole = global.console = {
			log : noop
		};
	}

	//
	//  Console Fixes
	//  Certain browsers that we support (*cough* IE9 *cough*) don't have some
	//  console debugging/output functions that have been written into the
	//  front-end application. As a result, we need to check for them, and point
	//  them to nearest-equivalents, if such a thing exists.
	//
	var methods = ["debug", "warn", "info", "error", "group", "groupCollapsed", "time", "timeEnd"];
	for (var i = 0; i < methods.length; i++) {
		var method = methods[i];
		if (!konsole[method]) konsole[method] = konsole.log;
	}
	// special case for groupEnd and timeEnd
	if (!konsole.groupEnd) konsole.groupEnd = noop;
	if (!konsole.timeEnd) konsole.timeEnd = noop;

	if (!konsole.dir) {
		konsole.dir = function(it) {
			var propertyFound = false;
			for (var key in it) {
				propertyFound = true;
				var value = it[key];
				if (typeof value === "function") continue; //value = "<function>";
				konsole.log(key + " : " + value);
			}
			if (!propertyFound) konsole.log("  [object with no properties]");
		};
	}

	//
	// just a smidgen o' sugar
	//
	String.prototype.contains = function(substring) {
		return (this.indexOf(substring) !== -1);
	};


	//
	//	Good old-fashioned browser sniffing
	//
	var userAgent = navigator.userAgent.toLowerCase();
	function userAgentVersion(regex1, regex2, etc) {
		for (var i = 0; i < arguments.length; i++) {
			var match = arguments[i].exec(userAgent);
			if (match) {
				return parseFloat(match[2]);
			}
		}
		return 0;
	}

	// Global Browser object which tells you about your platform...
	var Browser = global.Browser = {
// TODO: BREAKS GLOBAL ENCAPSULATION!
		getLocation : function(){return global.location; },

		// browser characteristics
		is : {
			gecko			: userAgent.contains("firefox"),
			webkit			: userAgent.contains("webkit"),
			chrome			: userAgent.contains("chrome"),
			phantom			: userAgent.contains("phantomjs"),
			ie				: userAgent.contains("msie") || userAgent.contains("trident"),
			opera			: userAgent.contains("opera"),
			ipad			: userAgent.contains("ipad"),
			ipod			: userAgent.contains("ipod"),
			// facebook app adds "iphone" to user agent string on ipads
			iphone			: userAgent.contains("iphone") && !userAgent.contains("ipad"),
			android			: userAgent.contains("android"),
			// http://bit.ly/LVc3uR
			androidPhone	: userAgent.contains("android") && userAgent.contains("mobile"),
			macos			: userAgent.contains("mac os"),
			windows			: userAgent.contains("win"),		// TODO: test this!
			nativeapp		: !!window.NativeApp,
		}
	};
	Browser.is.ios = (Browser.is.ipad || Browser.is.iphone);
	Browser.is.safari = (userAgent.contains("safari") && !Browser.is.chrome && !Browser.is.phantom);
	Browser.is.phone = Browser.is.ipod || Browser.is.iphone || Browser.is.androidPhone;
	Browser.is.mobile = Browser.is.phone || Browser.is.ipad;
	Browser.is.desktop = !Browser.is.mobile;
	Browser.is.tablet = Browser.is.ipad || (Browser.is.android && !Browser.is.androidPhone);

	// 3d effects only work in webkit for now
	Browser.is.threeD = Browser.is.webkit;
	Browser.is.noThreeD = !Browser.is.ThreeD;

	// TODO: "fire" or some other indicator for 7inch tablet ???

	// figure out browser version -- this is SUPER grotty!
	if      (Browser.is.gecko)	Browser.version = userAgentVersion(/(mozilla)(?:.*? rv:([\w.]+))?/);
	else if (Browser.is.webkit)	Browser.version = userAgentVersion(/(webkit)[ \/]([\w.]+)/);
	else if (Browser.is.ie)		Browser.version = userAgentVersion(/(msie) ([\w.]+)/,/(rv):(\d+)/);
	else if (Browser.is.opera)	Browser.version = userAgentVersion(/(mozilla)(?:.*? rv:([\w.]+))?/);
	Browser.is["v"+Browser.version] = true;

	//
	//	Browser.params will be query params for the current page URL
	//
	var params = window.location.search.replace("?","");
	Browser.initParams = params;
	Browser.params = {};
	params = params.split("&");
	for (i = 0; i < params.length; i++) {
		var index = params[i].indexOf("=");
		var key = params[i].substr(0,index) || "";
		var value = params[i].substr(index+1) || "";
		if (key) Browser.params[key] = value;
	}


	// host name
	Browser.hostname = location.hostname;

	// Are we running inside the facebook frame?
	// Check for an 'fb_source' parameter
	Browser.is.facebook = !!Browser.params.fb_source;

	//Check if browser is ssl by looking for https in window location
	Browser.is.ssl = 'https:' == document.location.protocol;

	// Is this browser supported?
	//	Currently:   Gecko (firefox) + Webkit (safari + chrome + phantom) + IE9
	Browser.is.supported =
						   (Browser.is.gecko && Browser.version >= 3.5)
						|| (Browser.is.safari && Browser.version >= 4)
						|| (Browser.is.chrome)
						|| (Browser.is.phantom)
						|| (Browser.is.ie && Browser.version >= 9)
						|| (Browser.is.ipad)
						|| (Browser.is.nativeapp)
					;
	Browser.is.unsupported = !Browser.is.supported;

	// add matching browser tokens to the HTML element for styling purposes
	var classes = [];
	for (var type in Browser.is) {
		if (Browser.is[type] == true) {
			classes.push(type);
		}
	}
	classes = classes.join(" ");
	document.getElementsByTagName("html")[0].className += " " + classes;
	// UNCOMMENT TO ALERT THE BROWSERS WE THINK THIS PLATFORM REPRESENTS
	console.info("BROWSER MATCH: "+ classes);


	//
	//	JSON -- load as an external script during page load if needed
	//
	if (global.JSON == null) {
		document.write("<script src='js/others/crockford_json2.js'></script>");
	}


	// Convert any type of (simple) values (eg: strings, numbers, objects, arrays) to a single string via JSON.
	// Use Browser.stringToObject() to return the equivalent value.
	//
	// If value is a string, returns value without modification.
	// Otherwise, we do a JSON.stringify() on the object and prepend "::JSON::" so we know it's been converted.
	Browser.JSON_PREFIX = "::JSON::";
	Browser.objectToString = function(value) {
		if (typeof value === "string") return value;
		return Browser.JSON_PREFIX + JSON.stringify(value);
	};

	// Convert string value resulting from Browser.stringToObject() back into its (simple) object form.
	// Uses JSON.parse() to turn things back into objects.
	// If JSON.parse() throws an error, logs a warning and returns null.
	Browser.stringToObject = function(value) {
		if (value === null || value === undefined) return value;
		if (typeof value !== "string") return value;

		if (value.indexOf(Browser.JSON_PREFIX) === 0) {
			value = value.substr(Browser.JSON_PREFIX.length);
			try {
				value = JSON.parse(value);
			} catch (e) {
				console.warn("Browser.stringToObject('::JSON::"+value+"'): couldn't parse JSON.");
				value = null;
			}
		}
		return value;
	};


	//
	//	stub in localStorage if not defined
	//
	if (!global.localStorage) {
		console.warn("localStorage is not defined!  Browser.preference() calls will not persist.");
		Browser.hasLocalStorage = false;
		global.localStorage = {};
	}

	// Sometimes we cannot safely write to localStorage, eg, in Safari's "private browsing" mode.
	// Wrap things, so we'll use `Browser.localStorage` instead, which will at least be consistent.
	Browser.localStorage = global.localStorage;

	// Deleting from localStorage works differently in different browsers (sigh).
	// Wrap it.  Use:   Browser.removeFromLocalStorage() to delete.
	Browser.removeFromLocalStorage = function(key){
		if (typeof Browser.localStorage.removeItem === "function") {
			Browser.localStorage.removeItem(key);
		} else {
			delete Browser.localStorage[key];
		}
	};

	// make sure it actually works
	try {
		var testKey = "___TEST___";
		// write test
		Browser.localStorage[testKey] = "test";
		if (Browser.localStorage[testKey] !== "test") throw "Writing to localStorage failed.";

		// remove test
		Browser.removeFromLocalStorage(testKey);
		if (Browser.localStorage[testKey] != null) throw "Deleting from localStorage failed.";

		// OK, I guess it works
		Browser.hasLocalStorage = true;
	} catch (e) {
		console.warn("window.localStorage appears to be disabled!", e);
		// something didn't work -- just use a temporary object so at least the API is consistent
		//	even though the values won't be stored across page loads.
		Browser.hasLocalStorage = false;
		Browser.localStorage = {};
	}


	//
	//	Simple "preferences" cover for localStorage.
	//	Use this rather than writing to localStorage explicitly.
	//		- Converts non-string values to/from strings automatically
	//		- Doesn't fail in browsers where localStorage isn't defined (eg: Safari in 'safe browsing' mode).
	//
	//	eg:		Browser.preference("foo", "bar")		<=== simple string set
	//			Browser.preference("foo") === "bar"		<=== gives back value you put in.
	//			Browser.preference("foo", null)			<=== clears the value and returns null.
	//
	//			Browser.preference("foo", [1,2,3])		<=== will JSONify results...
	//			Browser.preference("foo") // == [1,2,3]	<=== you get an array back
	//
	Browser.preference = function(key, value) {
		// if exactly one argument, just return the current value.
		if (arguments.length === 1) {
			value = Browser.localStorage[key];
			// convert from JSON if necessary
			value = Browser.stringToObject(value);
			return value;
		}
		// if 2 arguments, this is a set/clear
		else {
			// if value is null or undefined, clear the current value
			if (value == null) {
				Browser.removeFromLocalStorage(key);
			}
			// otherwise set the value, converting objects to a JSON string as necessary
			else {
				var stringValue = Browser.objectToString(value);
				Browser.localStorage[key] = stringValue;

				// return the value passed in
				return value;
			}
		}
	};

	// Wrapper to remove all keys from localStorage which start with a given prefix.
	// Pass null to clear ALL prefs.
	Browser.clearPrefs = function(prefix, skipDebugPrefs) {
		if (prefix == null) prefix = "";
		for (var key in Browser.localStorage) {
			if (key.startsWith(prefix)) {
				if (skipDebugPrefs && key.contains("__debug__")) continue;
				console.info("Clearing preference ",key);
				Browser.preference(key, null);
			}
		}
	};



	//
	//	simple cookie object (stolen from hope)
	//

	var _COOKIE_PATTERNS = {};
	function _getRawCookie(name) {
		if (!document.cookie) return;
		var pattern = _COOKIE_PATTERNS[name] || (_COOKIE_PATTERNS[name] = new RegExp(name+"=([^;]*)"));
		var match = document.cookie.match(pattern);
		return (match ? match[1] : undefined);
	}
	Browser.cookie = function(name, value, expires, path, domain) {
		var currentValue = _getRawCookie(name);

		// if 1 argument, return current value
		if (arguments.length === 1) {
			if (typeof currentValue === "string") {
				// unescape the value (we always escape before setting)
				value = unescape(currentValue);

				// convert back from JSON if necessary
				value = Browser.stringToObject(value);

				return value;
			}
		}
		// setting/clearing
		else {
			// If setting to null, we want to clear the value.
			if (value == null)	value = "";
			// Use Browser.objectToString() to convert simple objects to strings.
			else				value = Browser.objectToString(value);

			// don't change if already the same as what's set now
			if (value === currentValue && !expires) return;

			// NOTE: escape the value before setting in the cookie!
			var params = [name+"="+escape(value)];

			// if clearing, set expires to long time ago
			if (value === "" || value == null) expires = "Thu, 01 Jan 1970 00:00:00 GMT";
			// otherwise convert date to standard string
			else if (expires instanceof Date) expires = expires.toGMTString();
			if (expires) params.push("expires="+expires);

			// set path to "/" if not defined
			if (!path) path = "/";
			params.push("path="+path);

			// add domain if defined
			if (domain) params.push("domain="+domain);

			document.cookie = params.join(";");
			return Browser.cookie(name);
		}
	};

	// return all cookies as a map
	Browser.cookies = function() {
		var cookies = {};
		document.cookie.split(/\s*;\s*/).forEach(function(cookie) {
			var index = cookie.indexOf("=");
			if (index != -1) {
				var name = cookie.substr(0, index);
				cookies[name] = Browser.cookie(name);
			}
		});
		return cookies;
	};

		// debug: show all cookies
	Browser.showCookies = function() {
		var cookies = Browser.cookies();
		console.group("Cookies:");
		for (var name in cookies) {
			console.info(name + " = " + cookies[name]);
		}
		console.groupEnd();
	};

	// Clear ALL cookies that we can reset.
	//	NOTE: this will not work if the cookie's domain is not exactly that of window.location!
	Browser.clearAllCookies = function() {
		var cookies = Browser.cookies();
		for (var name in cookies) {
			Browser.cookie(name, '');
		}
	};

	//
	//	scroll body to top -- sometimes this fixes layout glitches in iOS
	//
	Browser.scrollToTop = function() {
		window.scrollTo(0,0);
		document.body.scrollTop = 0;
	};


	//
	//	Redirect to native app if installed.  (PADO-2425)
	//
	//	Note that we can only attempt the redirect:
	//		- on iPads.
	//		- if the "appUrlMap" contains the hostname of the current window.
	//		- if we haven't tried before and had it fail.
	//
	//	@appUrlMap is a map of { hostname => URL scheme for that host name }
	//	@redirectOnFailureUrl is a URL to redirect to if it fails
	//		(default if unspecified is to NOT redirect at all).
	Browser.attemptToLoadNativeApp = function(appUrlMap, redirectOnFailureUrl) {
		// if not on an ipad, forget it!
		if (!Browser.is.ipad) return;

		// if the provided URL map doesn't have a match this server, forget it!
		var appUrlScheme = (appUrlMap ? appUrlMap[Browser.hostname.toLowerCase()] : null);
		if (!appUrlScheme) return;

		// generate a unique localStorage key for this url scheme, so we can remember for next time
		var prefName = "scheme-" + appUrlScheme + "-appInstalled";

		// if the pref is "no", we tried before and it didn't work!  So forget it!
		if (localStorage[prefName] == "no") return;

		// NOTE:  If we get here, we want to make the attempt.

		// Transform the hash (if defined) into a URL in our app scheme.
		var hash = (window.location.hash || "").replace("#","");
		var newUrl = appUrlScheme + "://" + hash;

		// Append any query parameters to the hash for tracking.  (PADO-2693)
		newUrl += window.location.search;

		// remember the attempt as if it worked -- if it doesn't work, we'll reset in the timeout
		localStorage[prefName] = "yes";
		var attemptStartTime = (new Date()).getTime();

		// if it doesn't work, we'll get a quick failure
		//	NOTE: time needs to be at least 500ms for 3g/3gs networks
		setTimeout(function() {
			// if we fail to open the app, note the failure and redirect if necessary
			if ((new Date()).getTime() - attemptStartTime < 2000){
				localStorage[prefName] = "no";
				// redirect if we were provided a URL to go to
				if (redirectOnFailureUrl) {
					window.open(redirectOnFailureUrl, "_self");
				} else {
					location.reload();
				}
			}
		}, 1000);
		window.open(newUrl, "_self");
	};


	//
	//	Stub in our Module loader,
	//	  just enough that we can include modules statically and not have them break.
	//
	if (!window.Module) {
		window.Module = {
			// Module.globalize() just makes a global pointer to some object
			globalize : function(name, thing) {
				window[name] = thing;
			},

			// Module.define() creates a named module (+ optional dependencies) + a factory function
			//	- Throw an error if they specify dependencies (since that doesn't work w/the stub)
			//	- just execute the factory function
			define : function(moduleId, dependencies, factory) {
				if (typeof dependencies === "function") {
					factory = dependencies;
					dependencies = null;
				}
				if (dependencies) {
					throw "Module.define() stub -- loading dependencies not supported.  Use full Module.js instead!";
				}
				if (typeof factory === "function") {
					factory();
				}
			}
		};
	}


	return Browser;
})();	// end hidden from global scope
