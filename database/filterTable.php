<?php
require_once 'database_connections.php';
$data = json_decode(file_get_contents("php://input"));
$columnName = json_decode($data->data);
$columnNames = implode(",", displayRecursiveResults($columnName));
function displayRecursiveResults($arrayObject) {
    $i=0;
    foreach($arrayObject as $key=>$data) {
        if(is_array($data)) {
            displayRecursiveResults($data);
        } elseif(is_object($data)) {
            displayRecursiveResults($data);
        } else {
            $out[$i] = $data;
            $i++;
        }
    }
    return $out;
};
$query = "SELECT $columnNames from $data->tableName";
$result = mysqli_query($con, $query);
$arr = array();
if(mysqli_num_rows($result) != 0) {
	while($row = mysqli_fetch_assoc($result)) {
			$arr[] = $row;
	}
}
echo $json_info = json_encode($arr);
?>