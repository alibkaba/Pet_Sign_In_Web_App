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
		$action = $_POST["action"];
		DB_Operation($action);
	}
}

function DB_Operation($action){
	switch($action) {
		case "Create_Group": Create_Group();
			break;
		case "Create_Account": Create_Account();
			break;
		case "Create_Pet": Create_Pet();
			break;
		case "Update_Account": Update_Account();
			break;
		case "Update_Pet": Update_Pet();
			break;
		case "Reset_Password": Reset_Password();
			break;
		case "Verify_Account": Verify_Account();
			break;
		case "Sign_In": Sign_In();
			break;
		case "Sign_In_Pet": Sign_In_Pet();
			break;
	}
}

function Create_Group(){
	global $DB2conn;

	$Query = 'CREATE TABLE MYTABLE (  COL1 INT,  COL2 VARCHAR(5) )';
	$Result = db2_exec($DB2conn, $Query);
	$Result = $Statement->fetchAll();
	if ($Result) {
    print "Successfully created the table.\n";
	}
	$DB2close;
}

function Create_Groupc(){
	global $DB2conn;
	$Email = stripslashes($_POST["Email"]);
	$Password = stripslashes($_POST["Password"]);
	$Admin = $_POST["Admin"];
	$Status = $_POST["Status"];
	
	$Query = 'CALL Create_Group (?,?,?,?,?,?,?) INTO STATES (STATE_NAME) VALUES (?)';
	$Statement = $PDOconn->prepare($Query);
	$Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
	$Statement->bindParam(2, $Password, PDO::PARAM_STR, 45);
	$Statement->bindParam(3, $Admin, PDO::PARAM_INT, 1);
	$Statement->bindParam(4, $Status, PDO::PARAM_INT, 1);
	$Statement->execute();
	$Response = $Statement->fetchAll();
	echo json_encode($Response);
	$DB2close;
}

function Create_Groupx(){
	global $PDOconn;
	$Email = stripslashes($_POST["Email"]);
	$Password = stripslashes($_POST["Password"]);
	$Group_ID = $_POST["Group_ID"];
	$Admin = $_POST["Admin"];
	$Activation_Number = $_POST["Activation_Number"];
	$Status = $_POST["Status"];
	
	$Query = 'CALL Create_Group (?,?,?,?,?,?,?) INTO STATES (STATE_NAME) VALUES (?)';
	$Statement = $PDOconn->prepare($Query);
	$Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
	$Statement->bindParam(2, $Password, PDO::PARAM_STR, 45);
	$Statement->bindParam(3, $Group_ID, PDO::PARAM_STR, 45);
	$Statement->bindParam(4, $Admin, PDO::PARAM_INT, 1);
	$Statement->bindParam(5, $Activation_Number, PDO::PARAM_STR, 45);
	$Statement->bindParam(6, $Status, PDO::PARAM_INT, 1);
	$Statement->execute();
	$Response = $Statement->fetchAll();
	echo json_encode($Response);
	$PDOconn = null;
}

function Create_Account(){
	global $PDOconn;
	$State_Name = stripslashes($_POST["State_Name"]);

	$Query = 'INSERT INTO STATES (STATE_NAME) VALUES (?)';
	$Statement = $PDOconn->prepare($Query);
	$Statement->bindParam(1, $State_Name, PDO::PARAM_INT);
	$Statement->execute();
	$Response = $Statement->fetchAll();
	echo json_encode($Response);
	$PDOconn = null;
}

function Create_Unit_Test(){
	global $PDOconn;

	$Query = 
	$Statement = $PDOconn->prepare($Query);
	$Statement->execute();
	$Response = $Statement->fetchAll();
	echo json_encode($Response);
	$PDOconn = null;
}

function Write_Unit_Test(){
	global $PDOconn;
	$New_Season = stripslashes($_POST["New_Season"]);

	$Query = 'INSERT INTO USERS (SEASONS) VALUES (?)';
	$Statement = $PDOconn->prepare($Query);
	$Statement->bindParam(1, $New_Season, PDO::PARAM_STR, 45);
	$Statement->execute();
	$Response = $Statement->fetchAll();
	echo json_encode($Response);
	$PDOconn = null;
}

function Update_Unit_Test(){
	global $PDOconn;
	$New_Season = stripslashes($_POST["New_Season"]);
	$Old_Season = stripslashes($_POST["Old_Season"]);

	$Query = 'UPDATE SEASONS SET SEASONS = (?) WHERE SEASONS = (?)';
	$Statement = $PDOconn->prepare($Query);
	$Statement->bindParam(1, $New_Season, PDO::PARAM_STR, 45);
	$Statement->bindParam(2, $Old_Season, PDO::PARAM_STR, 45);
	$Statement->execute();
	$Response = $Statement->fetchAll();
	echo json_encode($Response);
	$PDOconn = null;
}

function Delete_Unit_Test(){
	global $PDOconn;

	$Query = 'DROP TABLE IF EXISTS `djkabau1_BUSTOP`.`SEASONS` ';
	$Statement = $PDOconn->prepare($Query);
	$Statement->execute();
	$Response = $Statement->fetchAll();
	echo json_encode($Response);
	$PDOconn = null;
}
?>