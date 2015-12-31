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
        $Action = $_POST["action"];
        DBOperation($Action);
    }
}

function DBOperation($Action){
    switch($Action) {
        case "UnitTest": UnitTest($Action);
            break;
        case "Register": Register($Action);
            break;
        case "CreatePet": CreatePet($Action);
            break;
        case "SignIn": SignIn($Action);
            break;
        case "StartSession": StartSession($Action);
            break;
    }
}

function Execute($Action,$Statement){
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

function Fetch($Action,$Statement){
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

function UnitTest($Action){
    global $PDOconn;
    $Query = 'DROP TABLE IF EXISTS djkabau1_petsignin.UnitTest ;
	CREATE TABLE IF NOT EXISTS djkabau1_petsignin.UnitTest (
	TestColumn INT NOT NULL,
	PRIMARY KEY (TestColumn))
	ENGINE = InnoDB;
	USE djkabau1_petsignin';
    $Statement = $PDOconn->prepare($Query);
    Execute($Action,$Statement);

    $NewValue = "1";
    $Query = 'INSERT INTO djkabau1_petsignin.UnitTest (TestColumn) VALUES (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $NewValue, PDO::PARAM_INT);
    Execute($Action,$Statement);

    $UpdatedValue = "2";
    $Query = 'UPDATE djkabau1_petsignin.UnitTest set TestColumn = (?) where TestColumn = (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $UpdatedValue, PDO::PARAM_INT);
    $Statement->bindParam(2, $NewValue, PDO::PARAM_INT);
    Execute($Action,$Statement);

    $Query = 'DELETE FROM djkabau1_petsignin.UnitTest WHERE TestColumn = (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $UpdatedValue, PDO::PARAM_INT);
    Execute($Action,$Statement);

    $Query = 'DROP TABLE IF EXISTS djkabau1_petsignin.UnitTest';
    $Statement = $PDOconn->prepare($Query);
    Execute($Action,$Statement);
    $PDOconn = null;
}

function Debugging($Action,$ErrorMSG){
    global $PDOconn;
    $Email = 'a@a.com';

    $Query = 'INSERT INTO djkabau1_petsignin.Debugging (Email, Action, ErrorMSG) VALUES (?,?,?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
    $Statement->bindParam(2, $Action, PDO::PARAM_STR, 45);
    $Statement->bindParam(3, $ErrorMSG, PDO::PARAM_STR, 100);
    $Statement->execute();
    $PDOconn = null;
}

function Audit($Action,$Email,$AuditMSG){
    global $PDOconn;
    $Email = 'a@a.com';

    $Query = 'INSERT INTO djkabau1_petsignin.Audit (Email, $AuditMSG) VALUES (?,?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
    $Statement->bindParam(2, $AuditMSG, PDO::PARAM_STR, 45);
    Execute($Action,$Statement);
    $PDOconn = null;
}

function HashIt($Password){
    $HashedPassword = password_hash($Password, PASSWORD_DEFAULT);
    return $HashedPassword;
}

function CheckAttemps($Email){
    global $PDOconn;
    $Query = 'SELECT Locked FROM Users where Email = (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
    Execute($Statement);
    Fetch($Statement);
}
function Register($Action){
    global $PDOconn;
    $Email = stripslashes($_POST["Email"]);
    CheckEmail($Email);
    $Password = stripslashes($_POST["Password"]);
    $HashedPassword = HashIt($Password);
    $Admin = 0;
    $Active = stripslashes($_POST["Active"]);

    $Query = 'INSERT INTO djkabau1_petsignin.Users (Email, Password, Admin, Active) VALUES (?,?,?,?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
    $Statement->bindParam(2, $HashedPassword, PDO::PARAM_STR, 255);
    $Statement->bindParam(3, $Admin, PDO::PARAM_INT, 1);
    $Statement->bindParam(4, $Active, PDO::PARAM_INT, 1);
    Execute($Action,$Statement);
    $PDOconn = null;
}

function SignIn($Action){
    global $PDOconn;
    $Email = stripslashes($_POST["Email"]);
    $Password = stripslashes($_POST["Password"]);
    $HashedPassword = HashIt($Password);

    $Query = 'SELECT count(*) FROM Users where Email = (?) and Password = (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
    $Statement->bindParam(2, $HashedPassword, PDO::PARAM_STR, 255);
    Execute($Action,$Statement);
    Fetch($Action,$Statement);
    $PDOconn = null;
}

function CheckEmail($Email){
    global $PDOconn;
    $Query = 'SELECT Email FROM Users WHERE Email = (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
    $Statement->execute();
    Fetch($Action,$Statement);
    $PDOconn = null;
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

function StartSession($Action){
    global $PDOconn;
    session_set_cookie_params(1800,"/");
    session_start();
    $SessionIP=$_SERVER['REMOTE_ADDR'];
    $Time = $_SERVER["REQUEST_TIME"];
    $ua=GetBrowser();
    $SessionBrowser = $ua['name'];
    $SessionPlatform = $ua['platform'];

    $SessionID = md5(uniqid(rand(), true));
    $_SESSION["Session_ID"] = $SessionID;
    echo "Session ID = $SessionID";
    //echo " Email Address = $Email";
    echo " IP address = $SessionIP";
    echo " Browser = $SessionBrowser";
    echo " Platform = $Time";
    echo " Session ID is " . $_SESSION["Session_ID"] . "<br>";

    $Query = 'SELECT count(*) FROM Users where Email = (?) and Password = (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
    $Statement->bindParam(2, $HashedPassword, PDO::PARAM_STR, 255);
    Execute($Action,$Statement);
    Fetch($Action,$Statement);
    $PDOconn = null;

    function GetBrowser()
    {
        $u_agent = $_SERVER['HTTP_USER_AGENT'];
        $bname = 'Unknown';
        $platform = 'Unknown';

        //First get the platform?
        if (preg_match('/linux/i', $u_agent)) {
            $platform = 'Linux';
        }
        elseif (preg_match('/macintosh|mac os x/i', $u_agent)) {
            $platform = 'Mac';
        }
        elseif (preg_match('/windows|win32/i', $u_agent)) {
            $platform = 'Windows';
        }

        // Next get the name of the useragent yes seperately and for good reason
        if(preg_match('/MSIE/i',$u_agent) && !preg_match('/Opera/i',$u_agent))
        {
            $bname = 'Internet Explorer';
            $ub = "MSIE";
        }
        elseif(preg_match('/Firefox/i',$u_agent))
        {
            $bname = 'Mozilla Firefox';
            $ub = "Firefox";
        }
        elseif(preg_match('/Chrome/i',$u_agent))
        {
            $bname = 'Google Chrome';
            $ub = "Chrome";
        }
        elseif(preg_match('/Safari/i',$u_agent))
        {
            $bname = 'Apple Safari';
            $ub = "Safari";
        }
        elseif(preg_match('/Opera/i',$u_agent))
        {
            $bname = 'Opera';
            $ub = "Opera";
        }
        elseif(preg_match('/Netscape/i',$u_agent))
        {
            $bname = 'Netscape';
            $ub = "Netscape";
        }

        return array(
            'name'      => $bname,
            'platform'  => $platform
        );
    }
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