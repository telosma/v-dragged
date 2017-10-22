/*
 * v-dragged v0.0.2
 * https://github.com/zhanziyang/v-dragged
 * 
 * Copyright (c) 2017 zhanziyang
 * Released under the ISC license
 */
  
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.VDragged = factory());
}(this, (function () { 'use strict';

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

var index = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

var u = {
  addEventListeners: function addEventListeners(el, events, handler) {
    for (var i = 0, len = events.length; i < len; i++) {
      el.addEventListener(events[i], handler);
    }
  },
  removeEventListeners: function removeEventListeners(el, events, handler) {
    for (var i = 0, len = events.length; i < len; i++) {
      el.removeEventListener(events[i], handler);
    }
  }
};

var POINTER_START_EVENTS = ['mousedown', 'touchstart'];
var POINTER_MOVE_EVENTS = ['mousemove', 'touchmove'];
var POINTER_END_EVENTS = ['mouseup', 'touchend'];
var draggedElem;

var directive = {
  inserted: function inserted(el, binding, vnode) {
    if (!document) return;
    function onPointerStart(evt) {
      el.lastCoords = el.firstCoords = {
        x: evt.clientX,
        y: evt.clientY
      };
      binding.value({
        el: el,
        first: true,
        clientX: evt.clientX,
        clientY: evt.clientY
      });
      draggedElem = el;
    }
    function onPointerEnd(evt) {
      if (el !== draggedElem) return;
      evt.preventDefault();
      el.lastCoords = null;
      binding.value({
        el: el,
        last: true,
        clientX: evt.clientX,
        clientY: evt.clientY
      });
      draggedElem = null;
    }
    function onPointerMove(evt) {
      if (el !== draggedElem) return;
      evt.preventDefault();
      if (el.lastCoords) {
        var deltaX = evt.clientX - el.lastCoords.x;
        var deltaY = evt.clientY - el.lastCoords.y;
        var offsetX = evt.clientX - el.firstCoords.x;
        var offsetY = evt.clientY - el.firstCoords.y;
        var clientX = evt.clientX;
        var clientY = evt.clientY;

        binding.value({
          el: el,
          deltaX: deltaX,
          deltaY: deltaY,
          offsetX: offsetX,
          offsetY: offsetY,
          clientX: clientX,
          clientY: clientY
        });
        el.lastCoords = {
          x: evt.clientX,
          y: evt.clientY
        };
      }
    }
    u.addEventListeners(el, POINTER_START_EVENTS, onPointerStart);
    u.addEventListeners(document.documentElement, POINTER_END_EVENTS, onPointerEnd);
    u.addEventListeners(document.documentElement, POINTER_MOVE_EVENTS, onPointerMove);
  },
  unbind: function unbind(el) {
    u.removeEventListeners(el, POINTER_START_EVENTS);
    u.removeEventListeners(document.documentElement, POINTER_END_EVENTS);
    u.removeEventListeners(document.documentElement, POINTER_MOVE_EVENTS);
  }
};

var defaultOptions = {};

var VDragged = {
  install: function install(Vue, options) {
    options = index({}, defaultOptions, options);
    var major = Number(Vue.version.split('.')[0]);
    var minor = Number(Vue.version.split('.')[1]);
    if (major < 2 && minor < 1) {
      throw new Error('v-dragged supports vue version 2.1 and above. You are using Vue@' + Vue.version + '. Please upgrade to the latest version of Vue.');
    }
    // registration
    Vue.directive('dragged', directive);
  },

  directive: directive
};

return VDragged;

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidi1kcmFnZ2VkLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9ub2RlX21vZHVsZXMvb2JqZWN0LWFzc2lnbi9pbmRleC5qcyIsIi4uLy4uLy4uL3NyYy91dGlsLmpzIiwiLi4vLi4vLi4vc3JjL2RpcmVjdGl2ZS5qcyIsIi4uLy4uLy4uL3NyYy9tYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qXG5vYmplY3QtYXNzaWduXG4oYykgU2luZHJlIFNvcmh1c1xuQGxpY2Vuc2UgTUlUXG4qL1xuXG4ndXNlIHN0cmljdCc7XG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xudmFyIGdldE93blByb3BlcnR5U3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHByb3BJc0VudW1lcmFibGUgPSBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG5mdW5jdGlvbiB0b09iamVjdCh2YWwpIHtcblx0aWYgKHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IHVuZGVmaW5lZCkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5hc3NpZ24gY2Fubm90IGJlIGNhbGxlZCB3aXRoIG51bGwgb3IgdW5kZWZpbmVkJyk7XG5cdH1cblxuXHRyZXR1cm4gT2JqZWN0KHZhbCk7XG59XG5cbmZ1bmN0aW9uIHNob3VsZFVzZU5hdGl2ZSgpIHtcblx0dHJ5IHtcblx0XHRpZiAoIU9iamVjdC5hc3NpZ24pIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBEZXRlY3QgYnVnZ3kgcHJvcGVydHkgZW51bWVyYXRpb24gb3JkZXIgaW4gb2xkZXIgVjggdmVyc2lvbnMuXG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD00MTE4XG5cdFx0dmFyIHRlc3QxID0gbmV3IFN0cmluZygnYWJjJyk7ICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ldy13cmFwcGVyc1xuXHRcdHRlc3QxWzVdID0gJ2RlJztcblx0XHRpZiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDEpWzBdID09PSAnNScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QyID0ge307XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG5cdFx0XHR0ZXN0MlsnXycgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGkpXSA9IGk7XG5cdFx0fVxuXHRcdHZhciBvcmRlcjIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MikubWFwKGZ1bmN0aW9uIChuKSB7XG5cdFx0XHRyZXR1cm4gdGVzdDJbbl07XG5cdFx0fSk7XG5cdFx0aWYgKG9yZGVyMi5qb2luKCcnKSAhPT0gJzAxMjM0NTY3ODknKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MyA9IHt9O1xuXHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24gKGxldHRlcikge1xuXHRcdFx0dGVzdDNbbGV0dGVyXSA9IGxldHRlcjtcblx0XHR9KTtcblx0XHRpZiAoT2JqZWN0LmtleXMoT2JqZWN0LmFzc2lnbih7fSwgdGVzdDMpKS5qb2luKCcnKSAhPT1cblx0XHRcdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9IGNhdGNoIChlcnIpIHtcblx0XHQvLyBXZSBkb24ndCBleHBlY3QgYW55IG9mIHRoZSBhYm92ZSB0byB0aHJvdywgYnV0IGJldHRlciB0byBiZSBzYWZlLlxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNob3VsZFVzZU5hdGl2ZSgpID8gT2JqZWN0LmFzc2lnbiA6IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSkge1xuXHR2YXIgZnJvbTtcblx0dmFyIHRvID0gdG9PYmplY3QodGFyZ2V0KTtcblx0dmFyIHN5bWJvbHM7XG5cblx0Zm9yICh2YXIgcyA9IDE7IHMgPCBhcmd1bWVudHMubGVuZ3RoOyBzKyspIHtcblx0XHRmcm9tID0gT2JqZWN0KGFyZ3VtZW50c1tzXSk7XG5cblx0XHRmb3IgKHZhciBrZXkgaW4gZnJvbSkge1xuXHRcdFx0aWYgKGhhc093blByb3BlcnR5LmNhbGwoZnJvbSwga2V5KSkge1xuXHRcdFx0XHR0b1trZXldID0gZnJvbVtrZXldO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChnZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcblx0XHRcdHN5bWJvbHMgPSBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZnJvbSk7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHN5bWJvbHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKHByb3BJc0VudW1lcmFibGUuY2FsbChmcm9tLCBzeW1ib2xzW2ldKSkge1xuXHRcdFx0XHRcdHRvW3N5bWJvbHNbaV1dID0gZnJvbVtzeW1ib2xzW2ldXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0bztcbn07XG4iLCJcclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIGFkZEV2ZW50TGlzdGVuZXJzIChlbCwgZXZlbnRzLCBoYW5kbGVyKSB7XHJcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gZXZlbnRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2ldLCBoYW5kbGVyKVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHJlbW92ZUV2ZW50TGlzdGVuZXJzIChlbCwgZXZlbnRzLCBoYW5kbGVyKSB7XHJcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gZXZlbnRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnRzW2ldLCBoYW5kbGVyKVxyXG4gICAgfVxyXG4gIH1cclxufSIsImltcG9ydCB1IGZyb20gJy4vdXRpbCdcblxuY29uc3QgUE9JTlRFUl9TVEFSVF9FVkVOVFMgPSBbJ21vdXNlZG93bicsICd0b3VjaHN0YXJ0J11cbmNvbnN0IFBPSU5URVJfTU9WRV9FVkVOVFMgPSBbJ21vdXNlbW92ZScsICd0b3VjaG1vdmUnXVxuY29uc3QgUE9JTlRFUl9FTkRfRVZFTlRTID0gWydtb3VzZXVwJywgJ3RvdWNoZW5kJ11cbnZhciBkcmFnZ2VkRWxlbVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGluc2VydGVkKGVsLCBiaW5kaW5nLCB2bm9kZSkge1xuICAgIGlmICghZG9jdW1lbnQpIHJldHVyblxuICAgIGZ1bmN0aW9uIG9uUG9pbnRlclN0YXJ0KGV2dCkge1xuICAgICAgZWwubGFzdENvb3JkcyA9IGVsLmZpcnN0Q29vcmRzID0ge1xuICAgICAgICB4OiBldnQuY2xpZW50WCxcbiAgICAgICAgeTogZXZ0LmNsaWVudFlcbiAgICAgIH1cbiAgICAgIGJpbmRpbmcudmFsdWUoe1xuICAgICAgICBlbCxcbiAgICAgICAgZmlyc3Q6IHRydWUsXG4gICAgICAgIGNsaWVudFg6IGV2dC5jbGllbnRYLFxuICAgICAgICBjbGllbnRZOiBldnQuY2xpZW50WVxuICAgICAgfSlcbiAgICAgIGRyYWdnZWRFbGVtID0gZWxcbiAgICB9XG4gICAgZnVuY3Rpb24gb25Qb2ludGVyRW5kKGV2dCkge1xuICAgICAgaWYgKGVsICE9PSBkcmFnZ2VkRWxlbSkgcmV0dXJuXG4gICAgICBldnQucHJldmVudERlZmF1bHQoKVxuICAgICAgZWwubGFzdENvb3JkcyA9IG51bGxcbiAgICAgIGJpbmRpbmcudmFsdWUoe1xuICAgICAgICBlbCxcbiAgICAgICAgbGFzdDogdHJ1ZSxcbiAgICAgICAgY2xpZW50WDogZXZ0LmNsaWVudFgsXG4gICAgICAgIGNsaWVudFk6IGV2dC5jbGllbnRZXG4gICAgICB9KVxuICAgICAgZHJhZ2dlZEVsZW0gPSBudWxsXG4gICAgfVxuICAgIGZ1bmN0aW9uIG9uUG9pbnRlck1vdmUoZXZ0KSB7XG4gICAgICBpZiAoZWwgIT09IGRyYWdnZWRFbGVtKSByZXR1cm5cbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBpZiAoZWwubGFzdENvb3Jkcykge1xuICAgICAgICB2YXIgZGVsdGFYID0gZXZ0LmNsaWVudFggLSBlbC5sYXN0Q29vcmRzLnhcbiAgICAgICAgdmFyIGRlbHRhWSA9IGV2dC5jbGllbnRZIC0gZWwubGFzdENvb3Jkcy55XG4gICAgICAgIHZhciBvZmZzZXRYID0gZXZ0LmNsaWVudFggLSBlbC5maXJzdENvb3Jkcy54XG4gICAgICAgIHZhciBvZmZzZXRZID0gZXZ0LmNsaWVudFkgLSBlbC5maXJzdENvb3Jkcy55XG4gICAgICAgIHZhciBjbGllbnRYID0gZXZ0LmNsaWVudFhcbiAgICAgICAgdmFyIGNsaWVudFkgPSBldnQuY2xpZW50WVxuXG4gICAgICAgIGJpbmRpbmcudmFsdWUoe1xuICAgICAgICAgIGVsLFxuICAgICAgICAgIGRlbHRhWCxcbiAgICAgICAgICBkZWx0YVksXG4gICAgICAgICAgb2Zmc2V0WCxcbiAgICAgICAgICBvZmZzZXRZLFxuICAgICAgICAgIGNsaWVudFgsXG4gICAgICAgICAgY2xpZW50WVxuICAgICAgICB9KVxuICAgICAgICBlbC5sYXN0Q29vcmRzID0ge1xuICAgICAgICAgIHg6IGV2dC5jbGllbnRYLFxuICAgICAgICAgIHk6IGV2dC5jbGllbnRZXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgdS5hZGRFdmVudExpc3RlbmVycyhlbCwgUE9JTlRFUl9TVEFSVF9FVkVOVFMsIG9uUG9pbnRlclN0YXJ0KVxuICAgIHUuYWRkRXZlbnRMaXN0ZW5lcnMoXG4gICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsXG4gICAgICBQT0lOVEVSX0VORF9FVkVOVFMsXG4gICAgICBvblBvaW50ZXJFbmRcbiAgICApXG4gICAgdS5hZGRFdmVudExpc3RlbmVycyhcbiAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCxcbiAgICAgIFBPSU5URVJfTU9WRV9FVkVOVFMsXG4gICAgICBvblBvaW50ZXJNb3ZlXG4gICAgKVxuICB9LFxuXG4gIHVuYmluZChlbCkge1xuICAgIHUucmVtb3ZlRXZlbnRMaXN0ZW5lcnMoZWwsIFBPSU5URVJfU1RBUlRfRVZFTlRTKVxuICAgIHUucmVtb3ZlRXZlbnRMaXN0ZW5lcnMoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCBQT0lOVEVSX0VORF9FVkVOVFMpXG4gICAgdS5yZW1vdmVFdmVudExpc3RlbmVycyhkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIFBPSU5URVJfTU9WRV9FVkVOVFMpXG4gIH1cbn1cbiIsImltcG9ydCBhc3NpZ24gZnJvbSAnb2JqZWN0LWFzc2lnbidcclxuaW1wb3J0IGRpcmVjdGl2ZSBmcm9tICcuL2RpcmVjdGl2ZSdcclxuXHJcbmNvbnN0IGRlZmF1bHRPcHRpb25zID0ge31cclxuXHJcbmNvbnN0IFZEcmFnZ2VkID0ge1xyXG4gIGluc3RhbGw6IGZ1bmN0aW9uIChWdWUsIG9wdGlvbnMpIHtcclxuICAgIG9wdGlvbnMgPSBhc3NpZ24oe30sIGRlZmF1bHRPcHRpb25zLCBvcHRpb25zKVxyXG4gICAgbGV0IG1ham9yID0gTnVtYmVyKFZ1ZS52ZXJzaW9uLnNwbGl0KCcuJylbMF0pXHJcbiAgICBsZXQgbWlub3IgPSBOdW1iZXIoVnVlLnZlcnNpb24uc3BsaXQoJy4nKVsxXSlcclxuICAgIGlmIChtYWpvciA8IDIgJiYgbWlub3IgPCAxKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgdi1kcmFnZ2VkIHN1cHBvcnRzIHZ1ZSB2ZXJzaW9uIDIuMSBhbmQgYWJvdmUuIFlvdSBhcmUgdXNpbmcgVnVlQCR7VnVlLnZlcnNpb259LiBQbGVhc2UgdXBncmFkZSB0byB0aGUgbGF0ZXN0IHZlcnNpb24gb2YgVnVlLmApXHJcbiAgICB9XHJcbiAgICAvLyByZWdpc3RyYXRpb25cclxuICAgIFZ1ZS5kaXJlY3RpdmUoJ2RyYWdnZWQnLCBkaXJlY3RpdmUpXHJcbiAgfSxcclxuXHJcbiAgZGlyZWN0aXZlXHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgVkRyYWdnZWQiXSwibmFtZXMiOlsiZWwiLCJldmVudHMiLCJoYW5kbGVyIiwiaSIsImxlbiIsImxlbmd0aCIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiUE9JTlRFUl9TVEFSVF9FVkVOVFMiLCJQT0lOVEVSX01PVkVfRVZFTlRTIiwiUE9JTlRFUl9FTkRfRVZFTlRTIiwiZHJhZ2dlZEVsZW0iLCJiaW5kaW5nIiwidm5vZGUiLCJkb2N1bWVudCIsIm9uUG9pbnRlclN0YXJ0IiwiZXZ0IiwibGFzdENvb3JkcyIsImZpcnN0Q29vcmRzIiwiY2xpZW50WCIsImNsaWVudFkiLCJ2YWx1ZSIsIm9uUG9pbnRlckVuZCIsInByZXZlbnREZWZhdWx0Iiwib25Qb2ludGVyTW92ZSIsImRlbHRhWCIsIngiLCJkZWx0YVkiLCJ5Iiwib2Zmc2V0WCIsIm9mZnNldFkiLCJhZGRFdmVudExpc3RlbmVycyIsImRvY3VtZW50RWxlbWVudCIsInJlbW92ZUV2ZW50TGlzdGVuZXJzIiwiZGVmYXVsdE9wdGlvbnMiLCJWRHJhZ2dlZCIsIlZ1ZSIsIm9wdGlvbnMiLCJhc3NpZ24iLCJtYWpvciIsIk51bWJlciIsInZlcnNpb24iLCJzcGxpdCIsIm1pbm9yIiwiRXJyb3IiLCJkaXJlY3RpdmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7OztBQU1BLEFBRUEsSUFBSSxxQkFBcUIsR0FBRyxNQUFNLENBQUMscUJBQXFCLENBQUM7QUFDekQs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
