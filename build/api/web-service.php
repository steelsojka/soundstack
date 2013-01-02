<?php

if(isset($_REQUEST['request'])) {

  $request_type = $_REQUEST['request'];
  $link = mysql_connect('localhost', 'root', 'root') or die('Cannot connect to DB');
  mysql_select_db('1195333_ssojka', $link) or die("Cannot select DB");

  header('Cache-Control: no-cache');

  if ($request_type == "get_modules") {
    $query = "SELECT * FROM Modules WHERE ready=1;";
    $results = mysql_query($query, $link) or die("Error query: " . $query);

    $modules = array();
    if (mysql_num_rows($results)) {
      while ($module = mysql_fetch_assoc($results)) {
        // if ($module['interface'] != "") {
        //   $interface = file_get_contents("../" . $module['interface']);
        //   $module['interface'] = json_decode($interface, true);
        // }
        $modules[] = $module;
      }
    }

    header('Content-type: application/json');
    echo json_encode(array('modules'=>$modules));
  
  } elseif ($request_type == "get_interface") {
    if (isset($_GET['module'])) {
      $interface = $_GET['module'];
      $version = $_GET['version'];

      if ($interface != "") {
        $interface = file_get_contents("../interface/" . $interface . ".json");
        $versionReplaced = preg_replace('/@VERSION@/', $version, $interface);

        header('Content-type: application/json');
        echo $versionReplaced;
      }
    }
  } elseif ($request_type == "save_stack") {

    $json = $_POST['data'];

    if (!file_exists("../user_stacks/" . $_POST['user'] . "/")) {
      mkdir("../user_stacks/" . $_POST['user'], 0777);
    }

    if (json_decode($json) != null) {
      $file = fopen('../user_stacks/' . $_POST['user'] . '/' . $_POST['name'] . '.json', 'w+');
      fwrite($file, $json);
      fclose($file);
    }

  } else {
    echo "Request type does not exist!";
  }

  @mysql_close($link);

}

?>