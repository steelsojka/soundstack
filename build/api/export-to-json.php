<?php

	$link = mysql_connect('localhost', 'root', 'root') or die('Cannot connect to DB');
  mysql_select_db('1195333_ssojka', $link) or die("Cannot select DB");


    $query = "SELECT * FROM Modules WHERE ready=1;";
    $results = mysql_query($query, $link) or die("Error query: " . $query);
    $modules = array();
    if (mysql_num_rows($results)) {
	    while ($module = mysql_fetch_assoc($results)) {
	      if ($module['interface_path'] != "") {
	        $interface = file_get_contents("../interface/" . $module['interface_path'] . ".json");
	        $versionReplaced = preg_replace('/@VERSION@/', $module['version'], $interface);
	        $module['interface'] = json_decode($versionReplaced, true);
	      }
	      $modules[] = $module;
	    }
	  }
    $file = fopen('../modules.json', 'w+');
    fwrite($file, json_encode(array('modules'=>$modules)));
    fclose($file);

    print "Done";

?>