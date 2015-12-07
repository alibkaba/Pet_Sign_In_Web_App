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
		case "Unit_Test": Unit_Test();
			break;
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
		case "Check_Group_ID": Check_Group_ID();
			break;
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
	$Statement->execute();
	
	$New_Value = "1";
	$Query = 'INSERT INTO djkabau1_petsignin.Unit_Test (Test_Column) VALUES (?)';
	$Statement = $PDOconn->prepare($Query);
	$Statement->bindParam(1, $New_Value, PDO::PARAM_INT);
	$Statement->execute();
	
	$Updated_Value = "2";
	$Query = 'UPDATE djkabau1_petsignin.Unit_Test set Test_Column = (?) where Test_Column = (?)';
	$Statement = $PDOconn->prepare($Query);
	$Statement->bindParam(1, $Updated_Value, PDO::PARAM_INT);
	$Statement->bindParam(2, $New_Value, PDO::PARAM_INT);
	$Statement->execute();
	
	$Query = 'DELETE FROM djkabau1_petsignin.Unit_Test WHERE Test_Column = (?)';
	$Statement = $PDOconn->prepare($Query);
	$Statement->bindParam(1, $Updated_Value, PDO::PARAM_INT);
	$Statement->execute();
	
	$Query = 'DROP TABLE IF EXISTS djkabau1_petsignin.Unit_Test';
	$Statement = $PDOconn->prepare($Query);
	$Statement->execute();
	$PDOconn = null;
}

function Create_Group(){
	global $PDOconn;
	$Email = stripslashes($_POST["Email"]);
	$Password = stripslashes($_POST["Password"]);
	$Group_ID = stripslashes($_POST["Group_ID"]);
	$Admin = stripslashes($_POST["Admin"]);
	$Activation = stripslashes($_POST["Activation"]);
	$Status = stripslashes($_POST["Status"]);
	
	$Query = 'CALL Create_Group (?,?,?,?,?,?)';
	$Statement = $PDOconn->prepare($Query);
	$Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
	$Statement->bindParam(2, $Password, PDO::PARAM_STR, 45);
	$Statement->bindParam(3, $Group_ID, PDO::PARAM_INT, 6);
	$Statement->bindParam(4, $Admin, PDO::PARAM_INT, 1);
	$Statement->bindParam(5, $Activation, PDO::PARAM_INT, 6);
	$Statement->bindParam(6, $Status, PDO::PARAM_INT, 1);
	if($Statement->execute()) {
		echo "Create_Group Success";
	};
	$PDOconn = null;
}

function Check_Email(){
	$PDOconn;
	$Group_ID = stripslashes($_POST["Group_ID"]);
	
	$Query = 'CALL Check_Email (?)';
	$Statement = $PDOconn->prepare($Query);
	$Statement->bindParam(3, $New_Group_ID, PDO::PARAM_INT, 6);
	$Statement->execute();
	$Response = $Statement->fetchAll();
	print $Response;
	echo json_encode($Response);
	$PDOconn = null;
}

function Check_Group_ID(){
	$PDOconn;
	$Group_ID = stripslashes($_POST["Group_ID"]);
	
	$Query = 'CALL Check_Group_ID (?)';
	$Statement = $PDOconn->prepare($Query);
	$Statement->bindParam(3, $New_Group_ID, PDO::PARAM_INT, 6);
	$Statement->execute();
	$Response = $Statement->fetchAll();
	print $Response;
	echo json_encode($Response);
	$PDOconn = null;
}

function Check_Activation_Number(){
	$PDOconn;
	$Group_ID = stripslashes($_POST["Group_ID"]);
	
	$Query = 'CALL Check_Activation_Number (?)';
	$Statement = $PDOconn->prepare($Query);
	$Statement->bindParam(3, $New_Activation_Number, PDO::PARAM_INT, 6);
	$Statement->execute();
	$Response = $Statement->fetchAll();
	print $Response;
	echo json_encode($Response);
	$PDOconn = null;
}

?>