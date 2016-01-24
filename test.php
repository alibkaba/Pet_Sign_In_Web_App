<?php
$BrowserData = GetBrowserData();
echo $BrowserData['IP'];
echo $BrowserData['Browser'];
echo $BrowserData['Platform'];

function GetBrowserData(){
    $SessionIP = $_SERVER['REMOTE_ADDR'];
    $u_agent = $_SERVER['HTTP_USER_AGENT'];
    $BrowserName = 'Unknown';
    $Platform = 'Unknown';

    //First get the platform?
    if (preg_match('/linux/i', $u_agent)) {
        $Platform = 'Linux';
    }
    elseif (preg_match('/macintosh|mac os x/i', $u_agent)) {
        $Platform = 'Mac';
    }
    elseif (preg_match('/windows|win32/i', $u_agent)) {
        $Platform = 'Windows';
    }

    // Next get the name of the useragent yes seperately and for good reason
    if(preg_match('/MSIE/i',$u_agent) && !preg_match('/Opera/i',$u_agent))
    {
        $BrowserName = 'Internet Explorer';
        $ub = "MSIE";
    }
    elseif(preg_match('/Firefox/i',$u_agent))
    {
        $BrowserName = 'Mozilla Firefox';
        $ub = "Firefox";
    }
    elseif(preg_match('/Chrome/i',$u_agent))
    {
        $BrowserName = 'Google Chrome';
        $ub = "Chrome";
    }
    elseif(preg_match('/Safari/i',$u_agent))
    {
        $BrowserName = 'Apple Safari';
        $ub = "Safari";
    }
    elseif(preg_match('/Opera/i',$u_agent))
    {
        $BrowserName = 'Opera';
        $ub = "Opera";
    }
    elseif(preg_match('/Netscape/i',$u_agent))
    {
        $BrowserName = 'Netscape';
        $ub = "Netscape";
    }

    return array(
        'IP' => $SessionIP,
        'Browser' => $BrowserName,
        'Platform' => $Platform
    );
}