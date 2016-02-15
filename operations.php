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
        case "UnitTest": UnitTest();
            break;
        case "AddAccount": AddAccount();
            break;
        case "SignIn": SignIn();
            break;
        case "SignInPet": SignInPet($Action);
            break;
        case "SignOut": SignOut($Action);
            break;
        case "FetchError": FetchError($Action);
            break;
        case "AddJSError": AddJSError($Action);
            break;
        case "FetchActivity": FetchActivity($Action);
            break;
        case "FetchPet": FetchPet($Action);
            break;
        case "FetchBreeds": FetchBreeds($Action);
            break;
        case "ValidateSession": ValidateSession($Action);
            break;
        case "ResetActivationCode": ResetActivationCode($Action);
            break;
        case "ResetPassword": ResetPassword($Action);
            break;
        case "AddPet": AddPet($Action);
            break;
        case "AddBreed": AddBreed($Action);
            break;
    }
}

function ResetActivationCode(){
    $Email = stripslashes($_POST["Email"]);
    $ActivationCode = hash('sha256', uniqid(rand(), true));
    global $PDOconn;
    $Query = 'UPDATE djkabau1_petsignin.Accounts set ActivationCode = (?) where Email = (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $ActivationCode, PDO::PARAM_INT, 64);
    $Statement->bindParam(2, $Email, PDO::PARAM_STR, 45);
    mail($Email,"Activate account","Please verify your account by clicking on this link: https://petsignin.alibkaba.com/petsignin/activate.php?confirm=$ActivationCode");
    echo json_encode("0");
    $PDOconn = null;
}

function ResetPassword(){
    $Email = stripslashes($_POST["Email"]);
    $ActivationCode = hash('sha256', uniqid(rand(), true));
    global $PDOconn;
    $Query = 'UPDATE djkabau1_petsignin.Accounts set ActivationCode = (?) where Email = (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $ActivationCode, PDO::PARAM_INT, 64);
    $Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
    mail($Email,"Activate account","Please verify your account by clicking on this link: https://petsignin.alibkaba.com/petsignin/activate.php?confirm=$ActivationCode");
    echo json_encode("0");
    $PDOconn = null;
}

function FetchPet($Action){
    $Email = ValidateSession($Action);
    global $PDOconn;
    $Query = 'CALL FetchPet (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
    $Statement->execute();
    $Response = $Statement->fetchAll();
    echo json_encode($Response);
    $PDOconn = null;
}

function FetchError($Action){
    $Email = ValidateSession($Action);
    global $PDOconn;
    $Query = 'CALL FetchError (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
    $Statement->execute();
    $Response = $Statement->fetchAll();
    echo json_encode($Response);
    $PDOconn = null;
}

function AddError($Action,$ErrorMSG,$Email){
    if (!isset($Email)) {
        $Email = NULL;
    }
    global $PDOconn;
    $Query = 'INSERT INTO djkabau1_petsignin.Errors (Email, Action, ErrorMSG) VALUES (?,?,?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
    $Statement->bindParam(2, $Action, PDO::PARAM_STR, 45);
    $Statement->bindParam(3, $ErrorMSG, PDO::PARAM_STR, 100);
    $Statement->execute();
    $PDOconn = null;
}

function AddJSError(){
    $FailedAction = stripslashes($_POST["FailedAction"]);
    $ErrorMSG = stripslashes($_POST["ErrorMSG"]);
    global $PDOconn;
    $Query = 'CALL AddJSError (?,?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $FailedAction, PDO::PARAM_STR, 45);
    $Statement->bindParam(2, $ErrorMSG, PDO::PARAM_STR, 100);
    $Statement->execute();
    $PDOconn = null;
}

function AddActivity($Email,$ActivityMSG){
    global $PDOconn;
    $Query = 'CALL AddActivity (?,?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
    $Statement->bindParam(2, $ActivityMSG, PDO::PARAM_STR, 45);
    $Statement->execute();
}

function HashIt($Password){
    $HashedPassword = password_hash($Password, PASSWORD_DEFAULT);
    return $HashedPassword;
}

//Single use
function UnitTest(){
    global $PDOconn;
    $Query = 'CALL UTCreate';
    $Statement = $PDOconn->prepare($Query);
    $Statement->execute();

    $UTValue = "1";
    $Query = 'CALL UTInsert (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $UTValue, PDO::PARAM_INT);
    $Statement->execute();

    $UpdatedUTValue = "2";
    $Query = 'CALL UTUpdate (?,?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $UpdatedUTValue, PDO::PARAM_INT);
    $Statement->bindParam(2, $UTValue, PDO::PARAM_INT);
    $Statement->execute();

    $Query = 'CALL UTDelete (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $UpdatedValue, PDO::PARAM_INT);
    $Statement->execute();

    $Query = 'CALL UTDrop';
    $Statement = $PDOconn->prepare($Query);
    $Statement->execute();
    echo json_encode("Unit Test successful");//do I need try and catch for unit test? do I need to fetch?
    $PDOconn = null;
}

function AddAttempt($UserData,$Email){
    $NewAttempt = $UserData['Attempts'];
    $NewAttempt++;
    global $PDOconn;
    $Query = 'CALL AddAttempt (?,?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $NewAttempt, PDO::PARAM_INT, 1);
    $Statement->bindParam(2, $Email, PDO::PARAM_STR, 45);
    $Statement->execute();
}

function ValidatePassword($Password,$HashedPassword){
    if (password_verify($Password, $HashedPassword)) {
        return 1;
    } else {
        return 0;
    }
}

function SignIn(){
    $Email = stripslashes($_POST["Email"]);
    $Password = stripslashes($_POST["Password"]);
    $UserData = FetchUserData($Email);
    if(!empty($UserData['Email'])){
        $HashedPassword = $UserData['Password'];
        $PasswordResponse = ValidatePassword($Password,$HashedPassword);
        if($Email == $UserData['Email'] && $PasswordResponse == 1){
            if($UserData['Attempts'] < 5){
                if($UserData['ValidateEmail'] == 1) {
                    ResetAttempts($Email);
                    DeleteSession($Email);
                    $ActivityMSG = "You signed in.";
                    AddActivity($Email,$ActivityMSG);
                    SaveSession($Email);
                    echo json_encode("2");
                    $PDOconn = null;
                }else{
                    AddAttempt($UserData,$Email);
                    $ActivityMSG = "You attempted to sign in but your account wasn't activated.";
                    AddActivity($Email,$ActivityMSG);
                    echo json_encode("3");
                    $PDOconn = null;
                }
            }else{
                $ActivityMSG = "Your account is locked out because someone attempted to sign in with your email 5 times in a row.";
                AddActivity($Email,$ActivityMSG);
                echo json_encode("0");
                $PDOconn = null;
            }
        }else{
            if($UserData['Attempts'] < 5){
                AddAttempt($UserData,$Email);
                $ActivityMSG = "Your account will be locked out if you fail to sign in 5 times in a row.";
                AddActivity($Email,$ActivityMSG);
                echo json_encode("1");
                $PDOconn = null;
            }else{
                $ActivityMSG = "Your account is locked out because someone attempted to sign in with your email 5 times in a row.";
                AddActivity($Email,$ActivityMSG);
                echo json_encode("0");
                $PDOconn = null;
            }
        }
    }else{
        echo json_encode("4");
    }
}

function SignInPet($Action){
    $Email = ValidateSession($Action);
    $Name = stripslashes($_POST["Name"]);
    $ActivityMSG = "Your pet " . $Name . " has been signed in.";
    AddActivity($Email,$ActivityMSG);
    echo json_encode("1");
}

function DeleteSession($Email){
    global $PDOconn;
    $Query = 'CALL DeleteSession (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
    $Statement->execute();
}

function ResetAttempts($Email){
    global $PDOconn;
    $Query = 'CALL ResetAttempts (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
    $Statement->execute();
}

function AddAccount(){
    $Email = stripslashes($_POST["Email"]);
    $UserData = FetchUserData($Email);
    if($Email == $UserData['Email']){
        if($UserData['Attempts'] < 5){
            AddAttempt($UserData,$Email);
            $ActivityMSG = "Your account will be locked out when someone attempts to register with you account 5 times in a row.";
            AddActivity($Email,$ActivityMSG);
            echo json_encode("1");
            exit;
        }else{
            $ActivityMSG = "Your account is locked out because someone attempted to register an account using your email 5 times in a row.";
            AddActivity($Email,$ActivityMSG);
            echo json_encode("0");
            exit;
        }
    }
    $Password = stripslashes($_POST["Password"]);
    $HashedPassword = HashIt($Password);
    $ValidateEmail = 0;
    $Disabled = 0;
    $Attempts = 0;
    $AdminCode = 1;
    $ActivationCode = hash('sha256', uniqid(rand(), true));
    global $PDOconn;
    $Query = 'CALL AddAccount (?,?,?,?,?,?,?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
    $Statement->bindParam(2, $HashedPassword, PDO::PARAM_STR, 255);
    $Statement->bindParam(3, $ValidateEmail, PDO::PARAM_INT, 1);
    $Statement->bindParam(4, $Disabled, PDO::PARAM_INT, 1);
    $Statement->bindParam(5, $Attempts, PDO::PARAM_INT, 1);
    $Statement->bindParam(6, $AdminCode, PDO::PARAM_INT, 1);
    $Statement->bindParam(7, $ActivationCode, PDO::PARAM_STR, 64);
    $Statement->execute();
    mail($Email,"Activate account","Please verify your account by clicking on this link: https://petsignin.alibkaba.com/petsignin/activate.php?confirm=$ActivationCode");
    echo json_encode("2");
    $PDOconn = null;
}

function AddPet($Action){
    $Email = ValidateSession($Action);
    $Name = stripslashes($_POST["Name"]);
    $BreedID = stripslashes($_POST["BreedID"]);
    $Gender = stripslashes($_POST["Gender"]);
    $Disabled = 0;
    global $PDOconn;
    $Query = 'CALL AddPet (?,?,?,?,?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
    $Statement->bindParam(2, $Name, PDO::PARAM_STR, 45);
    $Statement->bindParam(3, $BreedID, PDO::PARAM_INT);
    $Statement->bindParam(4, $Gender, PDO::PARAM_STR, 4);
    $Statement->bindParam(5, $Disabled, PDO::PARAM_INT, 1);
    $Statement->execute();
    $ActivityMSG = "Your new pet " . $Name . " has been added.";
    AddActivity($Email,$ActivityMSG);
    echo json_encode("2");
    $PDOconn = null;
}

function AddBreed($Action){
    $Email = ValidateSession($Action);
    if(!CheckAccountRole($Email) == 2){
        echo json_encode("0");//this function is for admins only
        exit;
    }
    $Name = stripslashes($_POST["Name"]);
    global $PDOconn;
    $Query = 'CALL AddBreed (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Name, PDO::PARAM_STR, 45);
    $Statement->execute();
    $ActivityMSG = "Your added " . $Name . " as a new Breed.";
    AddActivity($Email,$ActivityMSG);
    echo json_encode("1");
    $PDOconn = null;
}

function FetchUserData($Email){
    global $PDOconn;
    $Query = 'CALL FetchUserData (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
    $Statement->execute();
    $Response = $Statement->fetch(PDO::FETCH_ASSOC);
    return $Response;
}

function MailOut($Email, $Subject, $EmailMSG){ //fix this later, from and reply not working
    $Headers = 'From: alibkaba@alibkaba.com' . " " .
        'Reply-To: alibkaba@gmail.com' . " " .
        'X-Mailer: PHP/' . phpversion();
    mail($Email,$Subject,$EmailMSG,$Headers);
}

function FetchBreeds(){
    global $PDOconn;
    $Query = 'CALL FetchBreeds';
    $Statement = $PDOconn->prepare($Query);
    $Statement->execute();
    $Response = $Statement->fetchAll();
    echo json_encode($Response);
    $PDOconn = null;
}

function FetchActivity($Action){
    $Email = ValidateSession($Action);
    global $PDOconn;
    $Query = 'CALL FetchActivity (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
    $Statement->execute();
    $Response = $Statement->fetchAll();
    echo json_encode($Response);
    $PDOconn = null;
}

function SignOut($Action){
    $Email = ValidateSession($Action);
    DeleteSession($Email);
    $ActivityMSG = "You signed out.";
    AddActivity($Email,$ActivityMSG);
    session_unset();
    session_destroy();
}

function FetchSessionData($SessionID){
    global $PDOconn;
    $Query = 'CALL FetchSessionData (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $SessionID, PDO::PARAM_STR, 64);
    $Statement->execute();
    $Response = $Statement->fetch(PDO::FETCH_ASSOC);
    return $Response;
}

function ValidateSession($Action){
    StartSession();
    if(isset($_SESSION['Session_ID'])){
        $SessionID = $_SESSION["Session_ID"];
        $SessionData = FetchDBSessionData($SessionID);
        $Email = $SessionData['Email'];
        $BrowserData = GetBrowserData();
        $AccountRole = CheckAccountRole($Email);
        if($SessionData['IP'] == $BrowserData['IP'] && $SessionData['Browser'] == $BrowserData['Browser'] && $SessionData['Platform'] == $BrowserData['Platform']){
            if($Action == "ValidateSession"){
                echo json_encode($AccountRole);
            }else{
                return $Email;
            }
        }else{
            session_unset();
            session_destroy();
            echo json_encode("0");
            $PDOconn = null;
        }
    }else{
        if($Action == "ValidateSession"){
            echo json_encode("0");
        }else{
            echo json_encode("0");
            exit;
        }
    }
}

function CheckAccountRole($Email){
    global $PDOconn;
    $Query = 'CALL CheckAccountRole (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
    $Statement->execute();
    $Response = $Statement->fetch(PDO::FETCH_ASSOC);
    if($Response['ValidateEmail'] == 1 && $Response['Disabled'] == 0 && $Response['Attempts'] == 0){
        if($Response['AdminCode'] == 3){
            $AccountRole = 3;//super admin
        }elseif($Response['AdminCode'] == 2){
            $AccountRole = 2;//admin
        }else{
            $AccountRole = 1;//registered user
        }
    }else{
        session_unset();
        session_destroy();
        $AccountRole = 0;//user
    }
    return $AccountRole;
}

function FetchDBSessionData($SessionID){
    global $PDOconn;
    $Query = 'CALL FetchDBSessionData (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $SessionID, PDO::PARAM_STR, 64);
    $Statement->execute();
    $Response = $Statement->fetch(PDO::FETCH_ASSOC);
    return $Response;
}

function SaveSession($Email){
    StartSession();
    $BrowserData = GetBrowserData();
    $SessionID = hash('sha256', uniqid(rand(), true));
    $_SESSION["Session_ID"] = $SessionID;
    $SessionIP = $BrowserData['IP'];
    $SessionBrowser = $BrowserData['Browser'];
    $SessionPlatform = $BrowserData['Platform'];

    global $PDOconn;
    $Query = 'CALL SaveSession (?,?,?,?,?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $SessionID, PDO::PARAM_STR, 64);
    $Statement->bindParam(2, $Email, PDO::PARAM_STR, 45);
    $Statement->bindParam(3, $SessionIP, PDO::PARAM_STR, 45);
    $Statement->bindParam(4, $SessionBrowser, PDO::PARAM_STR, 45);
    $Statement->bindParam(5, $SessionPlatform, PDO::PARAM_STR, 45);
    $Statement->execute();
}

function StartSession(){
    ini_set('session.cookie_lifetime', 1800);
    ini_set('session.gc_maxlifetime', 1800);
    session_start();
}

function GetBrowserData(){
    $SessionIP = $_SERVER['REMOTE_ADDR'];
    $u_agent = $_SERVER['HTTP_USER_AGENT'];
    $BrowserName = 'Unknown';
    $Platform = 'Unknown';

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
    }
    elseif(preg_match('/Firefox/i',$u_agent))
    {
        $BrowserName = 'Mozilla Firefox';
    }
    elseif(preg_match('/Chrome/i',$u_agent))
    {
        $BrowserName = 'Google Chrome';
    }
    elseif(preg_match('/Safari/i',$u_agent))
    {
        $BrowserName = 'Apple Safari';
    }
    elseif(preg_match('/Opera/i',$u_agent))
    {
        $BrowserName = 'Opera';
    }
    elseif(preg_match('/Netscape/i',$u_agent))
    {
        $BrowserName = 'Netscape';
    }

    return array(
        'IP' => $SessionIP,
        'Browser' => $BrowserName,
        'Platform' => $Platform
    );
}