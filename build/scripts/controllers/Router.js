define("Router",["BaseNode","underscore","Gain"],function(e,t,n){var r=function(e){return typeof e!="undefined"},i=e.extend({init:function(){this._super.apply(this,arguments),this.route=0,this.routes=[],this.node=new n(this.context),this.setInputNode(this.node.getInputNode()),this.setOutputNode(this.node.getOutputNode())},addRouteTo:function(e,t){r(t)?t>this.routes.length?this.routes.push([e]):this.routes[t-1].push(e):this.routes.push([e])},removeRouteTo:function(e,n){if(r(e))if(r(n))this.routes[n-1]=t.without(this.routes[n-1],e);else for(var i=0,s=this.routes.length;i<s;i++)this.routes[i]=t.without(this.routes[i],e);else this.routes=[],this.route=0},setRoute:function(e){var t,n;e=parseInt(e),this.disconnectAll();if(e!==0)for(n=0,_len=this.routes[e-1].length;n<_len;n++)t=this.routes[e-1][n],this.connect(t);this.route=e}});return i});