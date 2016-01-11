<?php
require_once('db.php');
error_reporting(E_ALL);
ini_set('display_errors', 1);

StartSession();

function StartSession(){
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

    $Query = 'SELECT count(*) as Count FROM Users where Email = (?) and Password = (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
    $Statement->bindParam(2, $HashedPassword, PDO::PARAM_STR, 255);
    $Statement->execute();
    $Response = $Statement->fetch(PDO::FETCH_ASSOC);
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