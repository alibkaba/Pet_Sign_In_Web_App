<?php
require_once('db.php');
error_reporting(E_ALL);
ini_set('display_errors', 1);

ValidateAjaxRequest();

function ValidateAjaxRequest() {
    if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest'){
        ValidateAction();
    }
}

function ValidateAction(){
    if (isset($_POST["Action"]) && !empty($_POST["Action"])) {
        $Action = $_POST["Action"];
        DBOperation($Action);
    }
}

function DBOperation($Action){
    switch($Action) {
        case "UnitTest": UnitTest($Action);
            break;
        case "Register": Register($Action);
            break;
        case "Activate": Activate($Action);
            break;
        case "SignIn": SignIn($Action);
            break;
        case "StartSession": StartSession($Action);
            break;
    }
}

function Execute($Action,$Statement){
    try {
        //Ali, don't touch this anymore
        //this if statement is to let the main.js know which action execute failed so I can figure out what to say
        //otherwise I can remove the if and just put $Statement->execute()
        if(!$Statement->execute()) {
            $Response = array('action' => $Action, 'status' => "0");
            echo json_encode($Response);
        }
    } catch (PDOException $e) {
        //echo 'Connection failed: ' . $e->getMessage() . "\n";
        $ErrorMSG = 'Execute statement failed: ' . $e->getMessage() . "\n";
        Debugging($ErrorMSG);
    }
}

function Activate($Action){
    $ActivationCode = stripslashes($_POST["Activation"]);
    CheckActivationCode($ActivationCode);
    global $PDOconn;
    $Query = 'UPDATE djkabau1_petsignin.UnitTest set Active = (?) where ActivationCode = (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Active, PDO::PARAM_STR, 64);
    $Statement->bindParam(2, $ActivationCode, PDO::PARAM_STR, 64);
    Execute($Action,$Statement);
    $PDOconn = null;
}

function CheckActivationCode($ActivationCode){
    $Action1 = "CheckActivationNumber";
    $CanExit = 1;
    global $PDOconn;
    $Query = 'SELECT count(*) FROM djkabau1_petsignin.Users WHERE Activation NOT IN (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $ActivationCode, PDO::PARAM_STR, 64);
    Execute($Action1,$Statement);
    Fetch($CanExit,$Action1,$Statement);
    $PDOconn = null;
}

function Fetch($CanExit,$Action,$Statement){
    try {
        //same here except I may need to return data in the else portion
        if(!$Response = $Statement->fetch(PDO::FETCH_ASSOC)) {
            $Response = array('action' => $Action, 'status' => "0");
            echo json_encode($Response);
        }else{
            if($CanExit == 1){
                $Response = array('action' => $Action, 'status' => "1", $Response);
                echo json_encode($Response);
            }
        }
    } catch (PDOException $e) {
        //echo 'Connection failed: ' . $e->getMessage() . "\n";
        $ErrorMSG = 'Fetch statement failed: ' . $e->getMessage() . "\n";
        Debugging($ErrorMSG);
    }
}

function CheckEmail($Email){
    $Action1 = "CheckEmail";
    $CanExit = 1;
    global $PDOconn;
    $Query = 'SELECT count(*) FROM Users where Email = (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
    Execute($Action1,$Statement);
    Fetch($CanExit,$Action1,$Statement);
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
    echo json_encode("Unit Test successful");
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

function Register($Action){
    $Email = stripslashes($_POST["Email"]);
    CheckEmail($Action,$Email);
    $Password = stripslashes($_POST["Password"]);
    $HashedPassword = HashIt($Password);
    $Admin = 0;
    $Active = 0;
    $Locked = 0;
    $Activation = hash('sha256', uniqid(rand(), true));
    global $PDOconn;
    $Query = 'INSERT INTO djkabau1_petsignin.Users (Email, Password, Admin, Active, Locked, Activation) VALUES (?,?,?,?,?,?)';
    echo $Query;
    $Statement = $PDOconn->prepare($Query); //handle this
    $Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
    $Statement->bindParam(2, $HashedPassword, PDO::PARAM_STR, 255);
    $Statement->bindParam(3, $Admin, PDO::PARAM_INT, 1);
    $Statement->bindParam(4, $Active, PDO::PARAM_INT, 1);
    $Statement->bindParam(5, $Locked, PDO::PARAM_INT, 1);
    $Statement->bindParam(6, $Activation, PDO::PARAM_STR, 64);
    Execute($Action,$Statement);
    mail($Email,"Activate account","Please verify your account by clicking on this link: https://petsignin.alibkaba.com/activate.php?confirm=$Activation");
    $PDOconn = null;
}

function MailOut($Email, $Subject, $EmailMSG){ //fix this later, from and reply not working
    $Headers = 'From: alibkaba@alibkaba.com' . " " .
        'Reply-To: alibkaba@gmail.com' . " " .
        'X-Mailer: PHP/' . phpversion();
    mail($Email,$Subject,$EmailMSG,$Headers);
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

function CheckAttempts($Email){
    global $PDOconn;
    $Query = 'SELECT Locked FROM Users where Email = (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
    Execute($Statement);
    Fetch($Statement);
}

function FailedAttempt($Email){

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

    $SessionID = hash('sha256', uniqid(rand(), true));
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