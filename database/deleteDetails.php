<?php 
require_once 'database_connections.php';
$data = json_decode(file_get_contents("php://input"));
$rowData = json_decode($data->data);
$idVal = reset($rowData);
$idKey = key($rowData);
$query = "DELETE FROM $data->tableName WHERE $idKey=$idVal";

if (mysqli_query($con, $query)) {
    echo true;
} else {
    echo mysqli_error($con);
}
?>