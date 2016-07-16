<?php 

$files = array();

$dir = "../chat/";
$i = 0;
if ($handle = opendir($dir)) {
  while (false !== ($file = readdir($handle))) {
    if ($file == '.' || $file == '..') {
      continue;
    }
    $files[$i]["room"] = str_replace(".json","",$file);
    $files[$i]["size"] = filesize($dir.$file);
    $i++;
  }
  header('Content-type: application/json');
  echo json_encode($files);
  
  closedir($handle);
}

?>