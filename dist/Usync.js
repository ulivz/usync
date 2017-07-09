(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Usync"] = factory();
	else
		root["Usync"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var utils_1 = __webpack_require__(1);
var STATE;
(function (STATE) {
    STATE[STATE["READY"] = 0] = "READY";
    STATE[STATE["PENDING"] = 1] = "PENDING";
    STATE[STATE["FULFILLED"] = 2] = "FULFILLED";
    STATE[STATE["REJECTED"] = 3] = "REJECTED";
})(STATE || (STATE = {}));
var LIFE_CYCLE = {
    start: 1,
    taskStart: 2,
    taskEnd: 3,
    end: 4
};
var Usync = (function () {
    function Usync(state, options) {
        this.lifecycleList = (function () {
            var list = {};
            for (var _i = 0, _a = Object.keys(LIFE_CYCLE); _i < _a.length; _i++) {
                var cycle = _a[_i];
                list[cycle] = [];
            }
            return list;
        })();
        this.root = Array.isArray(state) ? state :
            typeof state === 'string' ? ((this.name(state)) && {}) :
                typeof state === 'object' ? [state] : {};
        options = utils_1.assign({}, options);
        if (options.name) {
            this.name(options.name);
        }
        this.root.$name = this.__name__;
        this.defferd = [];
        this.index = -1;
        this.state = STATE.READY;
    }
    // Wait to reset value
    Usync.prototype.fulfilledBroadcast = function () {
    };
    Object.defineProperty(Usync.prototype, "currentDefferd", {
        get: function () {
            return this.defferd[this.index];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Usync.prototype, "prevDefferd", {
        get: function () {
            return this.defferd[this.index - 1];
        },
        enumerable: true,
        configurable: true
    });
    Usync.prototype.name = function (name) {
        this.__name__ = name;
        return this;
    };
    Usync.prototype.use = function (handler) {
        if (Array.isArray(handler)) {
            for (var _i = 0, handler_1 = handler; _i < handler_1.length; _i++) {
                var childHandler = handler_1[_i];
                this.use(childHandler);
            }
            return;
        }
        this.defferd.push(handler);
        if (this.defferd.length === 1) {
            this.state = STATE.PENDING;
            this.index = 0;
        }
        else {
            // Previous task has been FULFILLED, directly to the next task execution
            if (this.defferd[this.defferd.length - 2].__state__ === STATE.FULFILLED) {
                this.then();
            }
        }
        return this;
    };
    Usync.prototype.then = function () {
        // Add Support for time record
        var time = new Date().getTime();
        this.root.$time = time - this.startTime;
        this.startTime = time;
        var argues = [this.root].concat(this.done.bind(this));
        try {
            if (typeof this.currentDefferd === 'function') {
                this.currentDefferd.apply(this, argues);
            }
            else if (this.currentDefferd instanceof Usync) {
                this.currentDefferd.fulfilledBroadcast = this.done.bind(this);
                this.currentDefferd.start();
            }
        }
        catch (err) {
            if (this.catch) {
                var errArgues = [err].concat([this.root], this.done.bind(this));
                this.catch.apply(this, errArgues);
            }
            else {
                throw new Error(err);
            }
        }
    };
    Usync.prototype.done = function () {
        this.currentDefferd.__state__ = STATE.FULFILLED;
        this.index++;
        // defferd running finished
        if (this.index === this.defferd.length) {
            this.state = STATE.FULFILLED;
            this.defferd = [];
            this.index = -1;
            this.HOOK_END();
            // When a Usync instance set as a child task for another Usync instance
            // fulfilledBroadcast() will tell the parent it was fulfilled
            if (typeof this.fulfilledBroadcast === 'function') {
                this.fulfilledBroadcast();
            }
            return;
        }
        // Synchronous task call next,
        // subsequent task at this time has not yet been push, return directly
        if (this.currentDefferd === undefined) {
            return;
        }
        else if (this.currentDefferd.__state__ === undefined) {
            this.then();
        }
    };
    Usync.prototype.catch = function (fn) {
        this.vessel.catch = fn;
        return this;
    };
    Usync.prototype.start = function () {
        this.HOOK_START();
        this.startTime = new Date().getTime();
        this.then();
    };
    Usync.prototype.HOOK_START = function () {
        var _this = this;
        this.lifecycleList.start.forEach(function (start) { return start.call(_this, _this.root); });
    };
    Usync.prototype.HOOK_END = function () {
        var _this = this;
        this.lifecycleList.end.forEach(function (end) { return end.call(_this, _this.root); });
    };
    Usync.createApp = function (state) {
        return new Usync(state);
    };
    Usync.prototype.lifecycle = function (hooks) {
        for (var _i = 0, _a = Object.keys(this.lifecycleList); _i < _a.length; _i++) {
            var key = _a[_i];
            if (hooks[key]) {
                this.lifecycleList[key].push(hooks[key]);
            }
        }
    };
    Usync.lifecycleList = (function () {
        var list = {};
        for (var _i = 0, _a = Object.keys(LIFE_CYCLE); _i < _a.length; _i++) {
            var cycle = _a[_i];
            list[cycle] = [];
        }
        return list;
    })();
    return Usync;
}());
module.exports = Usync;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function assign(target) {
    var restOb = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        restOb[_i - 1] = arguments[_i];
    }
    if (target == null) {
        throw new TypeError('Cannot convert undefined or null to object');
    }
    target = Object(target);
    for (var index = 0; index < restOb.length; index++) {
        var source = restOb[index];
        if (source != null) {
            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
    }
    return target;
}
exports.assign = assign;
;


/***/ })
/******/ ]);
});
//# sourceMappingURL=Usync.js.map