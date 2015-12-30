<?php
include('db.php');
ValidateAjaxRequest();

function ValidateAjaxRequest() {
    if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest'){
        ValidateAction();
    }
}

function ValidateAction(){
    if (isset($_POST["action"]) && !empty($_POST["action"])) {
        global $Action;
        $Action = $_POST["action"];
        DBOperation($Action);
    }
}

function DBOperation($Action){
    switch($Action) {
        case "UnitTest": UnitTest();
            break;
        case "Register": Register();
            break;
        case "CreatePet": CreatePet();
            break;
        case "SignIn": SignIn();
            break;
        case "CheckEmail": CheckEmail();
            break;
    }
}

function Execute($Statement){
    global $Action;
    try {
        if(!$Statement->execute()) {
            $Response = array('action' => $Action, 'status' => "0");
            echo json_encode($Response);
        }
    } catch (PDOException $e) {
        //echo 'Connection failed: ' . $e->getMessage() . "\n";
        $ErrorMSG = 'Connection failed: ' . $e->getMessage() . "\n";
        Debugging($ErrorMSG);
    }
}

function Fetch($Statement){
    global $Action;
    try {
        if($Response = $Statement->fetch(PDO::FETCH_ASSOC)) {
            $Response = array('action' => $Action, 'status' => "1", $Response);
            echo json_encode($Response);
        }else{
            $Response = array('action' => $Action, 'status' => "0");
            echo json_encode($Response);
        }
    } catch (PDOException $e) {
        //echo 'Connection failed: ' . $e->getMessage() . "\n";
        $ErrorMSG = 'Connection failed: ' . $e->getMessage() . "\n";
        Debugging($ErrorMSG);
    }
}

function UnitTest(){
    global $PDOconn;
    $Query = 'DROP TABLE IF EXISTS djkabau1_petsignin.UnitTest ;
	CREATE TABLE IF NOT EXISTS djkabau1_petsignin.UnitTest (
	TestColumn INT NOT NULL,
	PRIMARY KEY (TestColumn))
	ENGINE = InnoDB;
	USE djkabau1_petsignin';
    $Statement = $PDOconn->prepare($Query);
    Execute($Statement);

    $NewValue = "1";
    $Query = 'INSERT INTO djkabau1_petsignin.UnitTest (TestColumn) VALUES (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $NewValue, PDO::PARAM_INT);
    Execute($Statement);

    $UpdatedValue = "2";
    $Query = 'UPDATE djkabau1_petsignin.UnitTest set TestColumn = (?) where TestColumn = (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $UpdatedValue, PDO::PARAM_INT);
    $Statement->bindParam(2, $NewValue, PDO::PARAM_INT);
    Execute($Statement);

    $Query = 'DELETE FROM djkabau1_petsignin.UnitTest WHERE TestColumn = (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $UpdatedValue, PDO::PARAM_INT);
    Execute($Statement);

    $Query = 'DROP TABLE IF EXISTS djkabau1_petsignin.UnitTest';
    $Statement = $PDOconn->prepare($Query);
    Execute($Statement);
    $PDOconn = null;
}

function Debugging($ErrorMSG){
    global $PDOconn;
    global $Action;
    $Email = 'a@a.com';

    $Query = 'INSERT INTO djkabau1_petsignin.Debugging (Email, Action, ErrorMSG) VALUES (?,?,?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
    $Statement->bindParam(2, $Action, PDO::PARAM_STR, 45);
    $Statement->bindParam(3, $ErrorMSG, PDO::PARAM_STR, 100);
    $Statement->execute();
    $PDOconn = null;
}

function Audit($AuditMSG){
    global $PDOconn;
    global $Action;
    CheckSession();
    $Email = 'a@a.com';

    $Query = 'INSERT INTO djkabau1_petsignin.Audit (Email, $AuditMSG) VALUES (?,?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
    $Statement->bindParam(2, $AuditMSG, PDO::PARAM_STR, 45);
    $Statement->execute();
    $PDOconn = null;
}

function HashIt($Password){
    $HashedPassword = password_hash($Password, PASSWORD_DEFAULT);
    return $HashedPassword;
}

function Register(){
    global $PDOconn;
    $Email = stripslashes($_POST["Email"]);
    $Password = stripslashes($_POST["Password"]);
    $HashedPassword = HashIt($Password);
    $Admin = stripslashes($_POST["Admin"]);
    $Active = stripslashes($_POST["Active"]);


    $Query = 'INSERT INTO djkabau1_petsignin.Users (Email, Password, Admin, Active) VALUES (?,?,?,?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
    $Statement->bindParam(2, $HashedPassword, PDO::PARAM_STR, 255);
    $Statement->bindParam(3, $Admin, PDO::PARAM_INT, 1);
    $Statement->bindParam(4, $Active, PDO::PARAM_INT, 1);
    Execute($Statement);
    $PDOconn = null;
}

function SignIn(){
    global $PDOconn;
    $Email = stripslashes($_POST["Email"]);
    $Password = stripslashes($_POST["Password"]);
    $HashedPassword = HashIt($Password);

    $Query = 'SELECT count(*) FROM Users where Email = (?) and Password = (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
    $Statement->bindParam(2, $HashedPassword, PDO::PARAM_STR, 255);
    Execute($Statement);
    Fetch($Statement);

    $PDOconn = null;
}

function CheckEmail(){
    global $PDOconn;
    $Email = stripslashes($_POST["Email"]);

    $Query = 'SELECT Email FROM Users WHERE Email = (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
    Execute($Statement);
    Fetch($Statement);
    $PDOconn = null;
}

function CheckSession(){
    $Time = $_SERVER["REQUEST_TIME"];
    $Timeout_Duration = 1800;
    if (isset($LastDate) && ($Time - $LastDate) > $Timeout_Duration) {
    session_unset();
    session_destroy();
    session_start();
    }
}

function DBTime(){
    global $PDOconn;

    $Query = 'SELECT NOW()';
    $Statement = $PDOconn->prepare($Query);
    Execute($Statement);
    //Fetch($Statement);
    $Response = $Statement->fetch(PDO::FETCH_ASSOC);
    return $Response;
    $PDOconn = null;
}