<?php
$data = file_get_contents("php://input");
file_put_contents("dailylogs.json", $data);
echo "Saved";
?>
