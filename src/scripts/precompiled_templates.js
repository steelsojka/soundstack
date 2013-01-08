var templates = { navbar_template : function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='\n  <div class="add-module-btn btn">+</div>\n  <div class="cancel-add-btn btn hide">&times</div>\n  <div class="main-menu">\n    <div></div><div></div><div></div>\n    <select>\n      <option value="null">No action</option>\n      <option value="collapseAll">Collapse All</option>\n      <option value="expandAll">Expand All</option>\n      <option value="load">Load...</option>\n      <option value="save">Save...</option>\n      <option value="help">Help...</option>\n      <option value="settings">Settings...</option>\n      <option value="about">About</option>\n    </select>\n  </div>\n  <div id="bpm">\n    <input class="frosted-glass" maxlength="3" value="120" type="text" pattern="\\d{2,3}" placeholder="BPM"></div>\n  </div>\n  <div class="logo"></div>\n';
}
return __p;
},
save_input_template : function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='\n  <div id="save-dialog" class="hide">\n    <input type="text" maxlength="50" placeholder="Stack name...">\n  </div>\n';
}
return __p;
},
right_pane_template : function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='\n  <div class="rack-case"></div>\n  <div class="body-overlay hide"></div>\n  <div class="logo main-view-hide"></div>\n  <div class="left-rail"></div>\n  <div class="right-rail"></div>\n';
}
return __p;
},
left_pane_template : function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='\n';
}
return __p;
},
tab_view_template : function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='\n  ';
 var tabWidth = 100 / tabs.length 
__p+='\n  ';
 for (var i = 0, _len = tabs.length; i < _len; i++) { 
__p+='\n    <div class="tab ';
 if (tabs[i].selected){
__p+='selected';
}
__p+='" style="width:'+
((__t=( tabWidth + '%' ))==null?'':__t)+
';" data-view="'+
((__t=( tabs[i].domID ))==null?'':__t)+
'">'+
((__t=( tabs[i].title ))==null?'':__t)+
'</div>\n  ';
 } 
__p+='\n';
}
return __p;
},
effects_stack_template : function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='\n\n';
}
return __p;
},
module_loader_template : function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='\n';
}
return __p;
},
module_select_template : function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='\n  <div class="module-name">\n    '+
((__t=( name ))==null?'':__t)+
'\n    <div class="add-btn btn">Add</div>\n  </div>\n  <div class="module-description hide">'+
((__t=( description ))==null?'':__t)+
'</div>\n';
}
return __p;
},
stack_module_template : function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='\n  ';
 var interface = interface.interface; 
__p+='\n  <div class="arrow-box"><div></div></div>\n\n  <div class="rail-screw rail-screw-top-left"></div>\n  <div class="rail-screw rail-screw-top-right"></div>\n  <div class="rail-screw rail-screw-bottom-left"></div>\n  <div class="rail-screw rail-screw-bottom-right"></div>\n  <div class="handle"></div>\n  <div class="module-name">'+
((__t=( name ))==null?'':__t)+
'</div>\n  <div class="active-toggle">\n    ';
 if (parseInt(disable, 10)) { 
__p+='\n      <div class="power-switch ';
 if (module.isEnabled()) { 
__p+='on';
 } else { 
__p+='off';
 } 
__p+='"></div>\n      <input class="hide" type="checkbox" ';
 if (module.isEnabled()) { 
__p+='checked="checked"';
 } 
__p+='>\n    ';
 } 
__p+='\n  </div>\n\n  ';
 if (category === "Source") { 
__p+='\n    <div class="bypassFx">\n      FX\n      <input type="checkbox" checked="checked"></input>\n    </div>\n  ';
 } 
__p+='\n\n  <div class="module-menu">\n    <div></div><div></div><div></div>\n    <select>\n      <option value="null">No action</option>\n      <option value="collapse">Collapse/Expand</option>\n      ';
 if (parseInt(disable, 10)) { 
__p+='\n        <option value="disable">Disable/Enable</option>\n      ';
 } 
__p+='\n      ';
 if (removable) { 
__p+='\n        <option value="remove">Remove</option>\n      ';
 } 
__p+='\n    </select>\n  </div>\n \n  <div class="ui-controls" data-uid="';
_.uniqueId('module_')
__p+='">\n  ';
 if (typeof interface !== "string" && typeof interface !== "undefined") { 
__p+='\n    ';
 for (var i = 0, _len = interface.length; i < _len; i++) { 
__p+='\n      ';
 var row = interface[i];
__p+='\n      <div class="ui-row">\n        ';
 for (var x = 0, _len2 = row.length; x < _len2; x++) { 
__p+='\n          ';
 var c = row[x]; 
__p+='\n          <div class="ui-component';
 if (!_.isUndefined(c.class)) { 
__p+=' '+
((__t=( c.class ))==null?'':__t)+
'';
 } 
__p+='">\n            ';
 if(c.type === "slider") { 
__p+='\n              <div class="slider-tooltip"></div>\n              <input type="text" class="slider-input hide"\n                     value="'+
((__t=( c.defaultValue ))==null?'':__t)+
'" \n                     maxlength="5" \n                     minlength="1">\n            ';
 } 
__p+='\n            <div class="ui-'+
((__t=( c.type ))==null?'':__t)+
'" data-name="'+
((__t=( c.name ))==null?'':__t)+
'" data-type="'+
((__t=( c.type ))==null?'':__t)+
'"></div>\n            ';
 if (c.type === "slider" || c.type === "select") { 
__p+='\n              <div class="ui-name">'+
((__t=( c.name ))==null?'':__t)+
'</div>\n            ';
 } 
__p+='\n          </div>\n        ';
 } 
__p+='\n      </div>\n    ';
 } 
__p+='\n  ';
 } 
__p+='\n  </div>\n';
}
return __p;
},
stack_module_select : function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='\n  <select data-name="'+
((__t=( name ))==null?'':__t)+
'" data-type="'+
((__t=( type ))==null?'':__t)+
'">>\n    ';
 for (var i = 0, _len = valueArray.length; i < _len; i++) { 
__p+='\n      <option value="'+
((__t=( valueArray[i] ))==null?'':__t)+
'" ';
 if (defaultValue === valueArray[i]) { 
__p+='selected="selected" ';
 } 
__p+='>'+
((__t=( valueDisplayArray[i] ))==null?'':__t)+
'</option>\n    ';
 } 
__p+='\n  </select>\n';
}
return __p;
},
stack_module_checkbox : function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='\n    <div class="ui-name">'+
((__t=( name ))==null?'':__t)+
'</div><input type="checkbox" data-name="'+
((__t=( name ))==null?'':__t)+
'" data-type="'+
((__t=( type ))==null?'':__t)+
'" ';
 if (selected) { 
__p+='checked="checked"';
 } 
__p+='>\n';
}
return __p;
},
stack_module_button : function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='\n  <input type="button" data-name="'+
((__t=( name ))==null?'':__t)+
'" value="'+
((__t=( name ))==null?'':__t)+
'" data-type="'+
((__t=( type ))==null?'':__t)+
'">\n';
}
return __p;
},
stack_module_indicator : function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='\n  <canvas class="indicator" height="50" width="50"></canvas>\n  <div class="frosted-glass-light">\n';
}
return __p;
},
stack_module_file_upload : function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='\n  <input type="file" data-name="'+
((__t=( name ))==null?'':__t)+
'" value="'+
((__t=( name ))==null?'':__t)+
'" data-type="'+
((__t=( type ))==null?'':__t)+
'">\n';
}
return __p;
},
stack_module_meter : function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='\n  <div>\n    <div class="frosted-glass"></div>\n    <canvas height="30" width="255"></canvas>\n    <!--<canvas height="30" width="255"></canvas>-->\n  </div>\n';
}
return __p;
},
stack_module_reduction_meter : function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='\n  <div>\n    <div class="frosted-glass"></div>\n    <div class="counter"></div>\n    <canvas height="40" width="100"></canvas>\n  </div>\n';
}
return __p;
},
stack_module_spectrum : function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='\n  <canvas height="300" width="300"></canvas>\n  <div class="frosted-glass"></div>\n';
}
return __p;
},
stack_module_waveform : function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='\n  <canvas height="300" width="300"></canvas>\n';
}
return __p;
},
waveform_menu_bar : function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='\n  <div class="waveform-menu">\n    <div class="file-menu">\n      <div>File</div>\n      <select>\n        <option value="null">No action</option>\n        <option value="export">Export...</option>\n        <option value="export selection">Export selection...</option>\n      </select>\n    </div>\n    <div class="edit-menu">\n      <div>Edit</div>\n      <select>\n        <option value="null">No action</option>\n        <option value="trim to selection">Trim to selection</option>\n        <option value="normalize">Normalize</option>\n        <option value="normalize selection">Normalize selection</option>\n      </select>\n    </div>\n  </div>\n';
}
return __p;
},
stack_module_static_waveform : function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='\n  <div>\n    <div class="waveform-status">No audio loaded</div>\n    <canvas height="300" width="300"></canvas>\n    <canvas height="300" width="300"></canvas>\n    <canvas height="300" width="300"></canvas>\n    <div class="frosted-glass"></div>\n  </div>\n';
}
return __p;
},
settings_template : function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='\n  <div class="popup-heading">Settings</div>\n  <div class="global-setting">\n    <label for="buffer-size">Buffer Size:</label>\n    <input class="glass-input" data-setting="bufferSize" id="buffer-size" type="text" value="'+
((__t=( bufferSize ))==null?'':__t)+
'" pattern="\\d*"/>\n    <span class="small">* Requires a restart</span>\n  </div>\n  <!--<div class="global-setting">\n    <label for="buffer-size">Sample Rate:</label>\n    <input class="glass-input" data-setting="sampleRate" id="sample-rate" type="text" value="'+
((__t=( sampleRate ))==null?'':__t)+
'" pattern="\\d*"/>\n    <span class="small">* Requires a restart</span>\n  </div>-->\n';
}
return __p;
},
preset_template : function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='\n  '+
((__t=( presetName ))==null?'':__t)+
'\n';
}
return __p;
},
mouse_tooltip_template : function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='\n  <div id="mouse-tooltip">\n    '+
((__t=( _.pad(minutes, 2) ))==null?'':__t)+
':'+
((__t=( _.pad(seconds, 2) ))==null?'':__t)+
':'+
((__t=( _.pad(milliseconds, 2) ))==null?'':__t)+
'\n  </div>\n';
}
return __p;
},
about_template : function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='\n  <div id="about-dialog" class="hide">\n    <div class="close">&times</div>\n    <div class="about-logo"></div>\n    <div>Version '+
((__t=( version ))==null?'':__t)+
'<br>\n    Developed by Steven Sojka<br>\n    At Sojka Studios 2012</div>\n  </div>\n';
}
return __p;
},
help_template : function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='\n  <div class="title">'+
((__t=( title ))==null?'':__t)+
'</div>\n  <div class="description hide">'+
((__t=( description ))==null?'':__t)+
'</div>\n';
}
return __p;
},
 }; 