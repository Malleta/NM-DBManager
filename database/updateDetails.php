<?php 
require_once 'database_connections.php';
$data = json_decode(file_get_contents("php://input"));
$currentData = json_decode($data->currentData);
$columnData = json_decode($data->data);
$tableName = $data->tableName;

$currentData = displayRecursiveResults($currentData);
$columnData = displayRecursiveResults($columnData);

$currentDataSQL = implode(" AND ", $currentData);
$columnDataSQL = implode(",", $columnData);

function displayRecursiveResults($arrayObject) {
    $i=0;
    foreach($arrayObject as $key=>$data) {
        if(is_array($data)) {
            displayRecursiveResults($data);
        } elseif(is_object($data)) {
            displayRecursiveResults($data);
        } else {
            $out[$i] = $key."="."'".$data."'";
            $i++;
        }
    }
    return $out;
};


// mysqli insert query
$query = "UPDATE $tableName SET $columnDataSQL WHERE $currentDataSQL";

if (mysqli_query($con, $query)) {
    echo true;
} else {
    echo mysqli_error($con);
}
?>