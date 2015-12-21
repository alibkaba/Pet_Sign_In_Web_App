<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
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

Validate_Ajax_Request();

function Validate_Ajax_Request() {
	if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest'){
		Validate_action();
	}
}

function Validate_action(){
	if (isset($_POST["action"]) && !empty($_POST["action"])) {
        global $action;
		$action = $_POST["action"];
		DB_Operation($action);
	}
}

function DB_Operation($action){
	switch($action) {
		case "Unit_Test": Unit_Test();
			break;
		case "Register": Register();
			break;
        case "Create_Company": Create_Company();
            break;
        case "Create_Pet": Create_Pet();
            break;
		case "Sign_In": Sign_In();
			break;
        case "Check_Email": Check_Email();
            break;
        case "Check_Company_ID": Check_Company_ID();
            break;
	}
}

function Execute($Statement){
    global $action;
    try {
        if(!$Statement->execute()) {
            $Response = array('action' => $action, 'status' => 0);
            echo json_encode($Response);
            Debugging();
        }
    } catch (PDOException $e) {
        echo 'Connection failed: ' . $e->getMessage() . "\n";
        $ErrorMSG = 'Connection failed: ' . $e->getMessage() . "\n";
        //echo $ErrorMSG;
        Debugging($ErrorMSG);
    }
}

function Fetch($Statement){
    global $action;
    try {
        if($Response = $Statement->fetchAll()) {
            echo json_encode(array($action => $Response));
        }else{
            $Response = array('action' => $action, 'status' => 0);
            echo json_encode($Response);
            Debugging();
    }
    } catch (PDOException $e) {
        echo 'Connection failed: ' . $e->getMessage() . "\n";
        $ErrorMSG = $e->getMessage();
        Debugging($ErrorMSG);
    }
}

function Unit_Test(){
	global $PDOconn;
	$Query = 'DROP TABLE IF EXISTS djkabau1_petsignin.Unit_Test ;
	CREATE TABLE IF NOT EXISTS djkabau1_petsignin.Unit_Test (
	Test_Column INT NOT NULL,
	PRIMARY KEY (Test_Column))
	ENGINE = InnoDB;
	USE djkabau1_petsignin';
	$Statement = $PDOconn->prepare($Query);
    Execute($Statement);

	$New_Value = "1";
	$Query = 'INSERT INTO djkabau1_petsignin.Unit_Test (Test_Column) VALUES (?)';
	$Statement = $PDOconn->prepare($Query);
	$Statement->bindParam(1, $New_Value, PDO::PARAM_INT);
    Execute($Statement);

	$Updated_Value = "2";
	$Query = 'UPDATE djkabau1_petsignin.Unit_Test set Test_Column = (?) where Test_Column = (?)';
	$Statement = $PDOconn->prepare($Query);
	$Statement->bindParam(1, $Updated_Value, PDO::PARAM_INT);
	$Statement->bindParam(2, $New_Value, PDO::PARAM_INT);
    Execute($Statement);

	$Query = 'DELETE FROM djkabau1_petsignin.Unit_Test WHERE Test_Column = (?)';
	$Statement = $PDOconn->prepare($Query);
	$Statement->bindParam(1, $Updated_Value, PDO::PARAM_INT);
    Execute($Statement);

	$Query = 'DROP TABLE IF EXISTS djkabau1_petsignin.Unit_Test';
	$Statement = $PDOconn->prepare($Query);
    Execute($Statement);
	$PDOconn = null;
}

//this handles errors when an action fails on the database
function Debugging($ErrorMSG){
    global $PDOconn;
    global $action;
    $Email = 'a@a.com';

    $Query = 'INSERT INTO djkabau1_petsignin.Debugging (Email, Action, ErrorMSG) VALUES (?,?,?);';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
    $Statement->bindParam(2, $action, PDO::PARAM_STR, 45);
    $Statement->bindParam(3, $ErrorMSG, PDO::PARAM_STR, 100);
    $Statement->execute();
    $PDOconn = null;
}

function Register(){
	global $PDOconn;
	$Email = stripslashes($_POST["Email"]);
	$Password = stripslashes($_POST["Password"]);
	$Company_ID = stripslashes($_POST["Company_ID"]);
    //validate company id
    //generate company id
	$Admin = stripslashes($_POST["Admin"]);
	$Status = stripslashes($_POST["Status"]);
	
	$Query = 'CALL Create_Account (?,?,?,?,?)';
	$Statement = $PDOconn->prepare($Query);
	$Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
	$Statement->bindParam(2, $Password, PDO::PARAM_STR, 45);
	$Statement->bindParam(3, $Company_ID, PDO::PARAM_INT, 6);
	$Statement->bindParam(4, $Admin, PDO::PARAM_INT, 1);
	$Statement->bindParam(5, $Status, PDO::PARAM_INT, 1);
    Execute($Statement);
	$PDOconn = null;
}

function Check_Email(){
    global $PDOconn;
    $Email = stripslashes($_POST["Email"]);

    $Query = 'SELECT Email FROM User WHERE Email = (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
    Execute($Statement);
    Fetch($Statement);
    $PDOconn = null;
}

function Check_Company_ID(){
    global $PDOconn;
	$Company_ID = stripslashes($_POST["Company_ID"]);
	
	$Query = 'CALL Check_Company_ID (?)';
	$Statement = $PDOconn->prepare($Query);
	$Statement->bindParam(1, $New_Company_ID, PDO::PARAM_INT, 6);
    Execute($Statement);
    $PDOconn = null;
}
?>