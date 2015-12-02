<?php
ini_set('display_errors', 1); 
error_reporting(E_ALL);
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

$db2dsn = "jdbc:db2://75.126.155.153:50000/SQLDB";
$db2u = "user11307";
$db2p = "WVudohpLuJg0";
$DB2conn = db2_connect($db2dsn, $db2u, $db2p);
$DB2close = db2_close($DB2conn);
if ($DB2conn) {
    echo "Connection succeeded.";
    $DB2close;
}
else {
    echo "Connection failed.";
}

function Create_Group(){
	$DB2conn;

	$Query = 'CREATE TABLE MYTABLE (  COL1 INT,  COL2 VARCHAR(5) )';
	$Result = db2_exec($DB2conn, $Query);
	$Result = $Statement->fetchAll();
	if ($Result) {
    print "Successfully created the table.\n";
	}
	$DB2close;
}

?>