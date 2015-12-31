<?php
$dsn = "mysql:host=localhost;dbname=djkabau1_petsignin";
$u = "djkabau1_admin";
$p = "v,w_v;cpxzag";
$PDOconn = new PDO($dsn, $u, $p);
try {
    $PDOconn = new PDO($dsn, $u, $p);
    $PDOconn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo 'Connection failed: ' . $e->getMessage() . "\n";
}