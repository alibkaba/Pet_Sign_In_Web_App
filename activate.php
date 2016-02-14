<?php
include('db.php');
error_reporting(E_ALL);
ini_set('display_errors', 1);
$ActivationCode = stripslashes($_GET["confirm"]);
CheckActivationCode($ActivationCode);

function CheckActivationCode($ActivationCode){
    global $PDOconn;
    $Query = 'CALL CheckActivationCode (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $ActivationCode, PDO::PARAM_STR, 64);
    $Statement->execute();
    $Response = $Statement->fetch(PDO::FETCH_ASSOC);
    if($Response['Count'] == 1){
        Activate($ActivationCode);
        $MSG = "ACCOUNT HAS BEEN ACTIVATED.  You are being re-directed to the home page to sign in.";
    }else{
        $MSG = "Invalid activation code.  Please reset your account activation code/password";
    }
    echo "<script type='text/javascript'>alert('$MSG'); window.location = \"/petsignin/\";</script>";
    $PDOconn = null;
}

function Activate($ActivationCode){
    $ValidateEmail = 1;
    global $PDOconn;
    $Query = 'CALL ActivateAccount (?,?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $ValidateEmail, PDO::PARAM_STR, 64);
    $Statement->bindParam(2, $ActivationCode, PDO::PARAM_STR, 64);
    $Statement->execute();
}