<?php
  
  $template_dump = true;
  $js_includes = array(
    "library/jquery-1.8.2.min.js",
    "library/jquery-ui-1.9.1.custom.min.js",
    "library/underscore.js",
    "library/backbone.js",
    "library/Recorder.js"  
  );

?>

<!DOCTYPE HTML>
<html lang="en-US">
<head>
  <meta charset="UTF-8">
  <title></title>
  <script data-main="scripts/" type="text/javascript" src="scripts/require.js"></script>
  <?php for ($i = 0; $i < count($js_includes); $i++) { ?>
    <script type='text/javascript' src='scripts/<?php echo $js_includes[$i]; ?>'></script>
  <?php } ?>

  <link rel="stylesheet" href="stylesheets/css/normalize.css">
  <link rel="stylesheet" href="stylesheets/css/jquery-ui-1.9.1.custom.min.css">
  <link rel="stylesheet" href="stylesheets/css/main.css">
  <!-- <link href='http://fonts.googleapis.com/css?family=Audiowide' rel='stylesheet' type='text/css'> -->
  <script>
    var env = "web";

    window.global_relay = _.extend({}, Backbone.Events);

    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function( callback ){
                window.setTimeout(callback, 1000 / 60);
              };
    })();

    _.mixin({
      modify : function(obj, interceptor) {
        return interceptor(obj);
      },
      slice : function(array, start, end) {
        var slice = Array.prototype.slice;
        if (start > end) {
          return slice.call(array, end, start);
        } else {
          return slice.call(array, start, end);
        }
      },
      round : function(num, pre) {
        return Math.round(num / pre) * pre;
      },
      inRange : function(value, min, max) {
        return value >= min ? value <= max ? value : max : min;
      },
      pad : function(num, size) {
        var s = parseInt(num, 10) + "";
        while (s.length < size) s = 0 + s;
        return s;
      },
      arrayTo32Float : function(array) {
        return new Float32Array(array);
      }
    });

    Math.log10 = function(val) {
      return Math.log(val) / Math.log(10);
    }


    window.worker = new Worker("scripts/worker.js");
        
    window.globals = {
      isPlaying : false,
      version : "0.1.2b"
    };


  </script>

</head>
<body>
  
  <div id="main-content-wrapper">
    <div id="navbar-container"></div>
    <!-- <div id="left-pane-container"></div> -->
    <div id="right-pane-container">
      <div class="background-fade"></div>
    </div>
    <div id="tooltip-container"></div>
  </div>

  <script type="text/javascript">
    
  <?php if ($template_dump == true) { ?>

    ( function( global, _, undefined ) {
      var templates = {};

      _.getTemplate = function( selector ) {
        var template = templates[ selector ] || ( function() {
          var compiled = _.template( $( selector ).html() );
          templates[ selector ] = compiled;

          return compiled;
        }() );

        return template;
      };

    }( this, _ ) );

    $(function() {
      var str = "var templates = { ";
      $('#templates script').each(function() {
        str += this.id.replace(/-/g, "_") + " : ";
        str += _.getTemplate("#" + this.id).source;
        str += ",\n";
      });
      str += " }; "
      console.log(str);
    });
  <?php } ?>

    require(["views/MainView", "models/MainModel", "components/AudioContext"], 

    function(MainView, MainModel, AudioContext) {

      window.mainView = new MainView({
        model : new MainModel(),
        el : document.getElementById("main-content-wrapper")
      });
    
      
    });
  </script>


  <div id="templates">
    <?php include 'templates.php' ?>
  </div>
  <script type="text/javascript" src="scripts/HotKeys.js"></script>
  <script type="text/javascript" src="scripts/HistoryManager.js"></script>
  <script type="text/javascript" src="scripts/WorkerManager.js"></script>
</body>
</html>