<?php
  $data = $_POST['data'];
  file_put_contents('log.txt', $data, FILE_APPEND);
  mail("enguerrand.granoux@epfl.ch","My subject",$data); 
?>