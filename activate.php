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
        $ValidateEmail = 1;
        $Query = 'CALL ActivateAccount (?,?)';
        $Statement = $PDOconn->prepare($Query);
        $Statement->bindParam(1, $ValidateEmail, PDO::PARAM_STR, 45);
        $Statement->bindParam(2, $ActivationCode, PDO::PARAM_STR, 64);
        $Statement->execute();
        $MSG = "ACCOUNT HAS BEEN ACTIVATED.  You are being re-directed to the home page to sign in.";
    }else{
        $MSG = "Invalid activation code or your account has already been activated.  Please reset your account or contact an administrator.";
    }
    echo "<script type='text/javascript'>alert('$MSG'); window.location = \"/petsignin/\";</script>";
    $PDOconn = null;
}