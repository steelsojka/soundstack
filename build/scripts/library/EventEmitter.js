/**
 * EventEmitter v3.1.5
 * https://github.com/Wolfy87/EventEmitter
 *
 * Oliver Caldwell (http://oli.me.uk)
 * Creative Commons Attribution 3.0 Unported License (http://creativecommons.org/licenses/by/3.0/)
 */

/**
 * EventRegistry.js v1.1.0
 * @author Steven Sojka
 *
 * This module extends EventEmitter.js to allow event binding to
 * classes or objects and register them to a specific event emitter.
 *
 * https://github.com/steelsojka/EventRegistry
 *
 * - Licensed under the MIT license
**/

(function(e){function t(){this._events={},this._maxListeners=10}function n(e,t,n,r,i){this.type=e,this.listener=t,this.scope=n,this.once=r,this.instance=i}n.prototype.fire=function(e){this.listener.apply(this.scope||this.instance,e);if(this.once)return this.instance.removeListener(this.type,this.listener,this.scope),!1},t.prototype.eachListener=function(e,t){var n=null,r=null,i=null;if(this._events.hasOwnProperty(e)){r=this._events[e];for(n=0;n<r.length;n+=1){i=t.call(this,r[n],n);if(i===!1)n-=1;else if(i===!0)break}}return this},t.prototype.addListener=function(e,t,r,i){return this._events.hasOwnProperty(e)||(this._events[e]=[]),this._events[e].push(new n(e,t,r,i,this)),this.emit("newListener",e,t,r,i),this._maxListeners&&!this._events[e].warned&&this._events[e].length>this._maxListeners&&(typeof console!="undefined"&&console.warn("Possible EventEmitter memory leak detected. "+this._events[e].length+" listeners added. Use emitter.setMaxListeners() to increase limit."),this._events[e].warned=!0),this},t.prototype.on=t.prototype.addListener,t.prototype.once=function(e,t,n){return this.addListener(e,t,n,!0)},t.prototype.removeListener=function(e,t,n){return this.eachListener(e,function(r,i){r.listener===t&&(!n||r.scope===n)&&this._events[e].splice(i,1)}),this._events[e]&&this._events[e].length===0&&delete this._events[e],this},t.prototype.off=t.prototype.removeListener,t.prototype.removeAllListeners=function(e){return e&&this._events.hasOwnProperty(e)?delete this._events[e]:e||(this._events={}),this},t.prototype.listeners=function(e){if(this._events.hasOwnProperty(e)){var t=[];return this.eachListener(e,function(e){t.push(e.listener)}),t}return[]},t.prototype.emit=function(e){var t=[],n=null;for(n=1;n<arguments.length;n+=1)t.push(arguments[n]);return this.eachListener(e,function(e){return e.fire(t)}),this},t.prototype.setMaxListeners=function(e){return this._maxListeners=e,this},t.extend=function(){var e={},t=this.prototype,n=null;for(n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);return e},e.EventEmitter=t})(this),function(e,t){"use strict";var n;"extend"in t?n=t.extend():n=u({},t.prototype);var r=n.addListener,i=n.removeListener;n.addListener=function(e,t,n,i){var s=e.split(" ");for(var o=s.length-1;o>=0;o--)r.call(this,s[o],t,n,i)},n.removeListener=function(e,t,n){var r=e.split(" ");for(var s=r.length-1;s>=0;s--)i.call(this,r[s],t,n)},n.on=n.addListener,n.off=n.removeListener,n.register=function(e){var t=this,n={on:function(e,n,r,i){var s=r||this;return t.on.call(t,e,n,s,i),s},emit:function(){return t.emit.apply(t,arguments),this},once:function(e,n,r){var i=r||this;return t.once.call(t,e,n,r),i},off:function(e,n,r){var i=r||this;return t.off.call(t,e,n,i),i}};n.addListener=n.on,n.removeListener=n.off;if(s(e))for(var r=e.length-1;r>=0;r--)o(e[r],n);else o(e,n);return this},t.prototype=n;var s=function(e){return Object.prototype.toString.apply(e)==="[object Array]"},o=function(e,t){typeof e=="function"?e.prototype=u(e.prototype,t):typeof e=="object"&&(e=u(e,t))},u=function(e,t){var n;for(n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);return e};typeof define=="function"&&define([],function(){return t})}(this,EventEmitter);