define(["controllers/BaseController"],function(e){var t=function(e,t){var n=this,r=this.context.currentTime,i=this.type===0?"linear":"exponential";e.cancelScheduledValues(r),e.setValueAtTime(this._startValue,r),e[i+"RampToValueAtTime"](this._maxValue,r+this._attack),r+=this._attack,e[i+"RampToValueAtTime"](this._maxValue,r+this._decay),t&&setTimeout(function(){n.release()},t*1e3)},n=function(e){var t=this,n=this.context.currentTime,r=this.type===0?"linear":"exponential";e.cancelScheduledValues(n),e.setValueAtTime(e.value,n),e[r+"RampToValueAtTime"](this._startValue,n+this._release)},r=e.extend({init:function(e,t,n,r,i){this._super.apply(this,arguments),this._attack=t,this._decay=n,this._sustain=r,this._release=i,this._startValue=0,this._maxValue=1,this.type=0,this.Types.LINEAR=0,this.Types.EXPONENTIAL=1},trigger:function(e){for(var n=0,r=this.params.length;n<r;n++)t.call(this,this.params[n],e)},triggerFromCurrentValue:function(e,n){var r,i;for(var s=0,o=this.params.length;s<o;s++)r=this.params[s].value,this.params[s].startValue=r,i=r+e,t.call(this,this.params[s],r,i,n)},release:function(){var e;for(var t=0,r=this.params.length;t<r;t++)n.call(this,this.params[t])},setType:function(e){this.type=e},setAttack:function(e){this._attack=parseFloat(e,10)},setDecay:function(e){this._decay=parseFloat(e,10)},setSustain:function(e){this._sustain=parseFloat(e,10)},setRelease:function(e){this._release=parseFloat(e,10)},setStartValue:function(e){this._startValue=parseFloat(e,10)},setMaxValue:function(e){this._maxValue=parseFloat(e,10)}});return r});