<?php
// $servername = "localhost"; 
// $username = "root"; 
// $password = ""; 
// $dbname = "sambelverse_pg";
$servername = "localhost"; 
$username = "eijivers_ajiji"; 
$password = "@47171_aida"; 
$dbname = "eijivers_sambelverse";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Koneksi gagal: " . $e->getMessage());
}
?>
