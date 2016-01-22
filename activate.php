<?php
include('db.php');

$ActivationCode = stripslashes($_GET["confirm"]);
CheckActivationCode($ActivationCode);

function CheckActivationCode($ActivationCode){
    global $PDOconn;
    $Query = 'SELECT count(*) as Count FROM djkabau1_petsignin.Account WHERE ActivationCode NOT IN (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $ActivationCode, PDO::PARAM_STR, 64);
    $Statement->execute();
    $Response = $Statement->fetch(PDO::FETCH_ASSOC);
    echo $Response;
    $PDOconn = null;
}

function Activate($Action){
    $ActivationCode = stripslashes($_POST["ActivationCode"]);
    CheckActivationCode($ActivationCode);
    global $PDOconn;
    $Query = 'UPDATE djkabau1_petsignin.UnitTest set ValidateEmail = (?) where ActivationCode = (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Active, PDO::PARAM_STR, 64);
    $Statement->bindParam(2, $ActivationCode, PDO::PARAM_STR, 64);
    $Statement->execute();
    $PDOconn = null;
}