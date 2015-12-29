<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" type="text/css" href="css/main.css">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" integrity="sha512-dTfge/zgoMYpP7QbHy4gWMEGsbsdZeCXz7irItjcC3sPUFtf0kuFbDz/ixG7ArTxmDjLXDmezHubeNikyKGVyQ==" crossorigin="anonymous">
        <!--<link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jquerymobile/1.4.5/jquery.mobile.min.css">-->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jquerymobile/1.4.5/jquery.mobile.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js" integrity="sha512-K1qjQ+NcF2TYO/eI3M6v8EiNYZfA95pQumfvcVrTHtwQVDG+aHRqLi/ETn2uB+1JqwYqVG3LIvdm9lj6imS/pQ==" crossorigin="anonymous"></script>
        <script src="js/main.js" type="text/javascript"></script>
        <title>Pet Sign In</title>
    </head>
<body>
<?php
include('db.php');
include('operations.php');
//if session exists
//  CheckSession function and etc
// else redirect
session_set_cookie_params(1800,"/");
session_start();
$Session_IP=$_SERVER['REMOTE_ADDR'];

$ua=GetBrowser();
$Session_Browser = $ua['name'];
$Session_Platform = $ua['platform'];

$Session_ID = md5(uniqid(rand(), true));
$_SESSION["Session_ID"] = $Session_ID;
echo "Session ID = $Session_ID";
echo " Email Address = $Email";
echo " IP address = $Session_IP";
echo " Browser = $Session_Browser";
echo " Platform = $Session_Platform";
echo " Session ID is " . $_SESSION["Session_ID"] . "<br>";

function CheckSession(){


    // outdated session?
    //$Time = $_SERVER["REQUEST_TIME"];
    //$Timeout_Duration = 1800;
    //if (isset($LastDate) && ($Time - $LastDate) > $Timeout_Duration) {
        //session_unset();
        //session_destroy();
        //session_start();
    //}
}

function GetBrowser()
{
    $u_agent = $_SERVER['HTTP_USER_AGENT'];
    $bname = 'Unknown';
    $platform = 'Unknown';
    $version= "";

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
?>
<nav class="navbar navbar-default">
    <div class="container-fluid">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="#">Pet Sign In</a>
        </div>
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul class="nav navbar-nav navbar-right">
                <li><a href="#">About</a></li>
                <li><a data-target="#Account_Modal" data-toggle="modal" href="#" id="Account"><span class="glyphicon glyphicon-user"></span>Account</a></li>
                <li> <a href="#" id="Sign_Out"><span class="glyphicon glyphicon-log-out"></span>Logout</a></li>
            </ul>
        </div>
    </div>
</nav>

<button type="button" onclick="">Sign In Pet</button><br>
Pet Name (Pet info (pet table)), Pet activity (sign ins, edits to pet info in great detail), delete pet (5 days delay or right away by HR)<br>
<button type="button" onclick="">Account</button><br>
Personal info (email, password), Activity (logins, edits to personal account and if a pet was edited), close account, delete account (5 days delay or right away by HR)<br>


</body>
</html>