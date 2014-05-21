/* Native browser extensions */

// make sure window.requestAnimationFrame is set up
window.requestAnimationFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();


// String extensions.
$.extend(String.prototype, {
	// Expand some HTML given a scope object
	//	eg:		"abc{{foo}}def".expand({foo:"BAR"}) =>  "abcBARdef"
	//  eg:		"abc{{foo.bar}}def".expand({foo:{bar:"BAR"}}) => "abcBARdef"
	//	eg:		"abc{{this}}def".expand({}) => "abc[Object object]def"
	//			NOTE: the {{this}} form is useful if your object has a meaningful "toString" method.
	//
	// If you have a global "Messages" object defined, we'll expand those values automatically when we see "[[]]":
	// 	eg:		"abc[[messageName]]def".expand()			=>  "abcMESSAGE TEXTdef" (assuming Messages.messageName === "MESSAGE TEXT")
	// 	eg:		"abc[[dotted.message.name]]def".expand()	=>  "abcMESSAGE TEXTdef" (assuming Messages.dotted.message.name === "MESSAGE TEXT")
	_TEMPLATE_PATTERN : /\{\{([^}]*)\}\}/,
	expand : function(scope) {
		var value = this;
		// now do scope subs
		if (this.contains("{{")) value = value._replaceFromScope(scope, this._TEMPLATE_PATTERN);
		return ""+value;
	},
	_replaceFromScope : function(scope, pattern) {
		if (!scope) scope = {};
		var matches = this.split(pattern);
		// yields:  ["string", "<match_string>", "string", "<match_string>", "string"]
		for (var i = 1, last = matches.length, token, replacement; i < last; i+=2) {
			token = matches[i];
			replacement = null;

			// If token has a "?", it's a ternary expression (eg: for pluralization).
			if (token.contains("?")) {
				// Split the token up into:  `"expression"` and `["truthy value", "falsy value"]`,
				// We generally separate values by colon,
				// but if you want a colon in the output you can use a pipe char instead.
				var expression = token.substr(0, token.indexOf("?"));
				var values = token.substr(expression.length+1);
				if (values.contains("|")) 	values = values.split("|");
				else						values = values.split(":");
//console.warn(expression, values);
				// Good 'ol eval, it's our friend.
				// NOTE: if the eval excepts, we default to the second (falsy) value.
				var result = false;
				try {
					with (scope) {
						result = eval(expression);
					}
				} catch (e) {}
				replacement = (!!result ? values[0] : values[1]);
			}
			// if we have parens, it's a function call -- do an eval().
			else if (token.contains("(")) {
				try {
					with (scope) {
						replacement = eval(token);
					}
				} catch (e) {}
			}
			// nested.reference.inside.scope
			else if (token.contains(".")) {
				var tokens = token.split(".");
				var nested = scope;
				while (token = tokens.shift()) {
					nested = nested[token];
					if (nested == null) break;
				}
				replacement = nested;
			}
			// reference to the scope itself
			else if (token === "this") {
				token = ""+scope;
			}
			// normal case
			else {
				replacement = scope[token];
			}
			matches[i] = (replacement == null ? "" : replacement);
		}
		return matches.join("");
	},
});


// Number.prototype extensions
$.extend(Number.prototype, {
	// pad the integer part of this number to a certain number of digits, returns a string
	pad : function(digits) {
		var intString = ""+this;
		if (!digits) return intString;

		var periodIndex = intString.indexOf("."), decimal = "", sign = "";
		if (periodIndex > -1) {
			decimal = intString.substr(periodIndex);
			intString = intString.substr(0, periodIndex);
		}
		if (intString.charAt(0) == "-") {
			sign = "-";
			intString = intString.substr(1);
		}
		while (intString.length < digits) intString = "0" + intString;
		return sign + intString + decimal;
	},
});
