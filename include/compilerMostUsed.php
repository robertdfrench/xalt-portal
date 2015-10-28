<?php

$sysHost   = $_GET["sysHost"];
$startDate = $_GET["startDate"];
$endDate   = $_GET["endDate"];


try {

    include (__DIR__ ."/conn.php");


    $conn = new PDO("mysql:host=$servername;dbname=$db", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "SELECT xl.link_program AS LinkProgram, 
        COUNT(xl.date) AS Count 
        FROM xalt_link xl
        WHERE xl.build_syshost='$sysHost' AND 
        xl.link_program IS NOT NULL AND 
        xl.exec_path NOT LIKE '%.so' AND -- exec filter starts  
        xl.exec_path NOT LIKE '%.o' AND                         
        xl.exec_path NOT LIKE '%.o.%' AND                       
        xl.exec_path NOT LIKE '%.so.%' AND -- exec filter ends  
        xl.date BETWEEN '$startDate' AND '$endDate' 
        GROUP BY xl.link_program 
        ORDER BY Count DESC 
        ;";

    $query = $conn->prepare($sql);
    $query->execute();

    $result = $query->fetchAll(PDO:: FETCH_ASSOC);

    #	print_r($result);

    echo "{ \"cols\": [
{\"id\":\"\",\"label\":\"LinkProgram\",\"pattern\":\"\",\"type\":\"string\"}, 
{\"id\":\"\",\"label\":\"Count\",\"pattern\":\"\",\"type\":\"number\"} 
], 
\"rows\": [ ";

$total_rows = $query->rowCount();
$row_num = 0;

foreach($result as $row){
    $row_num++;

    if ($row_num == $total_rows){
        echo "{\"c\":[
    {\"v\":\"" . $row['LinkProgram'] . "\",\"f\":null},
    {\"v\":" . $row['Count'] . ",\"f\":null}
    ]}";
    } else {
        echo "{\"c\":[
    {\"v\":\"" . $row['LinkProgram'] . "\",\"f\":null},
    {\"v\":" . $row['Count'] . ",\"f\":null}
    ]}, ";
    } 

}
echo " ] }";

}


catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}
$conn = null;

?>