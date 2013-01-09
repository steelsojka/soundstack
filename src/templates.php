<script id="navbar-template" type="text/template">
  <div class="add-module-btn btn">+</div>
  <div class="cancel-add-btn btn hide">&times</div>
  <div class="main-menu">
    <div></div><div></div><div></div>
    <select>
      <option value="null">No action</option>
      <option value="collapseAll">Collapse All</option>
      <option value="expandAll">Expand All</option>
      <option value="load">Load...</option>
      <option value="save">Save...</option>
      <option value="help">Help...</option>
      <option value="settings">Settings...</option>
      <option value="about">About</option>
    </select>
  </div>
  <div id="bpm">
    <input class="frosted-glass" maxlength="3" value="120" type="text" pattern="\d{2,3}" placeholder="BPM"></div>
  </div>
  <div class="logo"></div>
</script>

<script id="save-input-template" type="text/template">
  <div id="save-dialog" class="hide">
    <input type="text" maxlength="50" placeholder="Stack name...">
  </div>
</script>

<script id="right-pane-template" type="text/template">
  <div class="rack-case"></div>
  <div class="body-overlay hide"></div>
  <div class="logo main-view-hide"></div>
  <div class="left-rail"></div>
  <div class="right-rail"></div>
</script>

<script id="left-pane-template" type="text/template">
</script>

<script id="tab-view-template" type="text/template">
  <% var tabWidth = 100 / tabs.length %>
  <% for (var i = 0, _len = tabs.length; i < _len; i++) { %>
    <div class="tab <% if (tabs[i].selected){%>selected<%}%>" style="width:<%= tabWidth + '%' %>;" data-view="<%= tabs[i].domID %>"><%= tabs[i].title %></div>
  <% } %>
</script>

<script id="effects-stack-template" type="text/template">

</script>

<script id="module-loader-template" type="text/template">
</script>

<script id="module-select-template" type="text/template">
  <div class="module-name">
    <%= name %>
    <div class="add-btn btn">Add</div>
  </div>
  <div class="module-description hide"><%= description %></div>
</script>

<script id="stack-module-template" type="text/template">
  <% var interface = interface.interface; %>
  <div class="arrow-box"><div></div></div>

  <div class="rail-screw rail-screw-top-left"></div>
  <div class="rail-screw rail-screw-top-right"></div>
  <div class="rail-screw rail-screw-bottom-left"></div>
  <div class="rail-screw rail-screw-bottom-right"></div>
  <div class="handle"></div>
  <div class="module-name"><%= name %></div>
  <div class="active-toggle">
    <% if (parseInt(disable, 10)) { %>
      <div class="power-switch <% if (module.isEnabled()) { %>on<% } else { %>off<% } %>"></div>
      <input class="hide" type="checkbox" <% if (module.isEnabled()) { %>checked="checked"<% } %>>
    <% } %>
  </div>

  <% if (category === "Source") { %>
    <div class="bypassFx">
      FX
      <input type="checkbox" checked="checked"></input>
    </div>
  <% } %>

  <div class="module-menu">
    <div></div><div></div><div></div>
    <select>
      <option value="null">No action</option>
      <option value="collapse">Collapse/Expand</option>
      <% if (parseInt(disable, 10)) { %>
        <option value="disable">Disable/Enable</option>
      <% } %>
      <% if (removable) { %>
        <option value="remove">Remove</option>
      <% } %>
    </select>
  </div>
 
  <div class="ui-controls" data-uid="<%_.uniqueId('module_')%>">
  <% if (typeof interface !== "string" && typeof interface !== "undefined") { %>
    <% for (var i = 0, _len = interface.length; i < _len; i++) { %>
      <% var row = interface[i];%>
      <div class="ui-row">
        <% for (var x = 0, _len2 = row.length; x < _len2; x++) { %>
          <% var c = row[x]; %>
          <div class="ui-component<% if (!_.isUndefined(c.class)) { %> <%= c.class %><% } %>">
            <% if(c.type === "slider") { %>
              <div class="slider-tooltip"></div>
              <input type="text" class="slider-input hide"
                     value="<%= c.defaultValue %>" 
                     maxlength="5" 
                     minlength="1">
            <% } %>
            <div class="ui-<%= c.type %>" data-name="<%= c.name %>" data-type="<%= c.type %>"></div>
            <% if (c.type === "slider" || c.type === "select") { %>
              <div class="ui-name"><%= c.name %></div>
            <% } %>
          </div>
        <% } %>
      </div>
    <% } %>
  <% } %>
  </div>
</script>

<script id="stack-module-select" type="text/template">
  <select data-name="<%= name %>" data-type="<%= type %>">>
    <% for (var i = 0, _len = valueArray.length; i < _len; i++) { %>
      <option value="<%= valueArray[i] %>" <% if (defaultValue === valueArray[i]) { %>selected="selected" <% } %>><%= valueDisplayArray[i] %></option>
    <% } %>
  </select>
</script>

<script id="stack-module-checkbox" type="text/template">
    <div class="ui-name"><%= name %></div><input type="checkbox" data-name="<%= name %>" data-type="<%= type %>" <% if (selected) { %>checked="checked"<% } %>>
</script>

<script id="stack-module-button" type="text/template">
  <input type="button" data-name="<%= name %>" value="<%= name %>" data-type="<%= type %>">
</script>

<script id="stack-module-indicator" type="text/template">
  <canvas class="indicator" height="50" width="50"></canvas>
  <div class="frosted-glass-light">
</script>

<script id="stack-module-file-upload" type="text/template">
  <input type="file" data-name="<%= name %>" value="<%= name %>" data-type="<%= type %>">
</script>

<script id="stack-module-meter" type="text/template">
  <div>
    <div class="frosted-glass"></div>
    <canvas height="30" width="255"></canvas>
    <!--<canvas height="30" width="255"></canvas>-->
  </div>
</script>

<script id="stack-module-reduction-meter" type="text/template">
  <div>
    <div class="frosted-glass"></div>
    <div class="counter"></div>
    <canvas height="40" width="100"></canvas>
  </div>
</script>

<script id="stack-module-spectrum" type="text/template">
  <canvas height="300" width="300"></canvas>
  <div class="frosted-glass"></div>
</script>

<script id="stack-module-waveform" type="text/template">
  <canvas height="300" width="300"></canvas>
</script>

<script id="waveform-menu-bar" type="text/template">
  <div class="waveform-menu">
    <div class="file-menu">
      <div>File</div>
      <select>
        <option value="null">No action</option>
        <option value="export">Export...</option>
        <option value="export selection">Export selection...</option>
      </select>
    </div>
    <div class="edit-menu">
      <div>Edit</div>
      <select>
        <option value="null">No action</option>
        <option value="trim to selection">Trim to selection</option>
        <option value="cut">Cut</option>
        <option value="copy">Copy</option>        
        <option value="paste">Paste</option>
      </select>
    </div>
     <div class="process-menu">
      <div>Process</div>
      <select>
        <option value="null">No action</option>
        <option value="normalize">Normalize</option>
      </select>
    </div>
  </div>
</script>

<script id="stack-module-static-waveform" type="text/template">
  <div>
    <div class="waveform-status">No audio loaded</div>
    <canvas height="300" width="300"></canvas>
    <canvas height="300" width="300"></canvas>
    <canvas height="300" width="300"></canvas>
    <div class="frosted-glass"></div>
  </div>
</script>

<script id="settings-template" type="text/template">
  <div class="popup-heading">Settings</div>
  <div class="global-setting">
    <label for="buffer-size">Buffer Size:</label>
    <input class="glass-input" data-setting="bufferSize" id="buffer-size" type="text" value="<%= bufferSize %>" pattern="\d*"/>
    <span class="small">* Requires a restart</span>
  </div>
  <!--<div class="global-setting">
    <label for="buffer-size">Sample Rate:</label>
    <input class="glass-input" data-setting="sampleRate" id="sample-rate" type="text" value="<%= sampleRate %>" pattern="\d*"/>
    <span class="small">* Requires a restart</span>
  </div>-->
</script>

<script id="preset-template" type="text/template">
  <%= presetName %>
</script>

<script id="mouse-tooltip-template" type="text/template">
  <div id="mouse-tooltip">
    <%= _.pad(minutes, 2) %>:<%= _.pad(seconds, 2) %>:<%= _.pad(milliseconds, 2) %>
  </div>
</script>

<script id="about-template" type="text/template">
  <div id="about-dialog" class="hide">
    <div class="close">&times</div>
    <div class="about-logo"></div>
    <div>Version <%= version %><br>
    Developed by Steven Sojka<br>
    At Sojka Studios 2012</div>
  </div>
</script>

<script id="help-template" type="text/template">
  <div class="title"><%= title %></div>
  <div class="description hide"><%= description %></div>
</script>