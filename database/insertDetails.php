<?php 
// Including database connections
require_once 'database_connections.php';
// Fetching and decoding the inserted data
$data = json_decode(file_get_contents("php://input"));
$columnData = json_decode($data->data);
$tableName = $data->tableName;

$i = 0;
foreach($columnData as $paramName => $value){
        $columnName[$i] = $paramName;
        $i++;
};
$columnName = implode(",", $columnName);

$i = 0;
foreach($columnData as $paramName){
        $columnValue[$i] = $paramName;
        $i++;
};
$columnValue = "'" . implode("','", $columnValue) . "'";


//function displayRecursiveResults($arrayObject) {
//    $i=0;
//    foreach($arrayObject as $key=>$data) {
//        if(is_array($data)) {
//            displayRecursiveResults($data);
//        } elseif(is_object($data)) {
//            displayRecursiveResults($data);
//        } else {
//            $out[$i] = "'".$key."'"."="."'".$data."'";
//            $i++;
//        }
//    }
//    return $out;
//};

// mysqli insert query
$query = "INSERT into $tableName ($columnName) VALUES ($columnValue)";
// Inserting data into database
if (mysqli_query($con, $query)) {
    echo true;
} else {
    echo mysqli_error($con);
}
?>