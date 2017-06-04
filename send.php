<?php
  echo 'hello';  
  $myfile = fopen("log.txt", "w") or die("Unable to open file!");
  $dataObject = $_POST['data'];
  $json = json_decode($dataObject);
  file_put_contents('log.txt', $json);
  mail("enguerrand.granoux@epfl.ch","My subject",$json); 
?>