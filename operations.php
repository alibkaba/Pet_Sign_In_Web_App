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
        PHPOperation($Action);
    }
}

function PHPOperation($Action){
    switch($Action) {
        case "UnitTest": UnitTest();
            break;
        case "AddAccount": AddAccount($Action);
            break;
        case "SignIn": SignIn();
            break;
        case "SignInPet": SignInPet($Action);
            break;
        case "SignOut": SignOut($Action);
            break;
        case "FetchErrors": FetchErrors($Action);
            break;
        case "AddError": AddError($Action);
            break;
        case "FetchActivities": FetchActivities($Action);
            break;
        case "FetchSignInPet": FetchSignInPet($Action);
            break;
        case "FetchBreeds": FetchBreeds($Action);
            break;
        case "ValidateSession": ValidateSession($Action);
            break;
        case "ResetPassword": ResetPassword($Action);
            break;
        case "AddPet": AddPet($Action);
            break;
        case "AddBreed": AddBreed($Action);
            break;
        case "FetchUsers": FetchUsers($Action);
            break;
        case "FetchUserPets": FetchUserPets($Action);
            break;
        case "FetchUserStatus": FetchUserStatus($Action);
            break;
        case "FetchPetStatus": FetchPetStatus($Action);
            break;
        case "FetchPet": FetchPet($Action);
            break;
    }
}

function AddError($Action){
    $Email = ValidateSession($Action);
    if (!isset($Email)) {
        $Email = NULL;
    }
    $FailedAction = stripslashes($_POST["FailedAction"]);
    $ErrorMSG = stripslashes($_POST["ErrorMSG"]);
    global $PDOconn;
    $Query = 'CALL AddError (?, ?, ?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
    $Statement->bindParam(2, $FailedAction, PDO::PARAM_STR, 45);
    $Statement->bindParam(3, $ErrorMSG, PDO::PARAM_STR, 255);
    $Statement->execute();
    $PDOconn = null;
}

function AddActivity($Email,$ActivityMSG){
    global $PDOconn;
    $Query = 'CALL AddActivity (?, ?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
    $Statement->bindParam(2, $ActivityMSG, PDO::PARAM_STR, 255);
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
    $Query = 'CALL UTUpdate (?, ?)';
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
    $NewAttempt = $UserData['Attempt'];
    $NewAttempt++;
    global $PDOconn;
    $Query = 'CALL AddAttempt (?, ?)';
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
    $Email = stripslashes($_POST["D1"]);
    $Password = stripslashes($_POST["D2"]);
    $UserData = FetchUser($Email);
    if(!empty($UserData['Email'])){
        $HashedPassword = $UserData['Password'];
        $PasswordResponse = ValidatePassword($Password,$HashedPassword);
        if($Email == $UserData['Email'] && $PasswordResponse == 1){
            if($UserData['Attempt'] < 5){
                if($UserData['Disabled'] == 0) {
                    ResetAttempt($Email);
                    DeleteSession($Email);
                    $ActivityMSG = "You signed in.";
                    AddActivity($Email,$ActivityMSG);
                    AddSession($Email);
                    echo json_encode("refresh");
                    $PDOconn = null;
                }else{
                    AddAttempt($UserData,$Email);
                    $ActivityMSG = "You attempted to sign in but your account wasn't activated by an admin yet.";
                    AddActivity($Email,$ActivityMSG);
                    echo json_encode("notactive");
                    $PDOconn = null;
                }
            }else{
                $ActivityMSG = "Account was locked out due to multiple sign in attempts.";
                AddActivity($Email,$ActivityMSG);
                echo json_encode("locked");
                $PDOconn = null;
            }
        }else{
            if($UserData['Attempt'] < 5){
                AddAttempt($UserData,$Email);
                $ActivityMSG = "Account to be locked due to multipel sign in attempts.";
                AddActivity($Email,$ActivityMSG);
                echo json_encode("notlocked");
                $PDOconn = null;
            }else{
                $ActivityMSG = "Account was locked out due to multiple sign in attempts.";
                AddActivity($Email,$ActivityMSG);
                echo json_encode("locked");
                $PDOconn = null;
            }
        }
    }else{
        echo json_encode("none");
    }
}

function SignInPet($Action){
    $Email = ValidateSession($Action);
    $Name = stripslashes($_POST["D1"]);
    $ActivityMSG = "Your pet " . $Name . " has been signed in.";
    AddActivity($Email,$ActivityMSG);
    echo json_encode("refreshpet");
}

function DeleteSession($Email){
    global $PDOconn;
    $Query = 'CALL DeleteSession (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
    $Statement->execute();
}

function ResetAttempt($Email){
    global $PDOconn;
    $Query = 'CALL ResetAttempt (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
    $Statement->execute();
}

function AddAccount($Action){
    $Email = stripslashes($_POST["D1"]);
    $UserData = FetchUser($Email);
    if($Email == $UserData['Email']){
        if($UserData['Attempt'] < 5){
            AddAttempt($UserData,$Email);
            $ActivityMSG = "Account to be locked due to multiple registration attempts.";
            AddActivity($Email,$ActivityMSG);
            echo json_encode("notlocked");
            exit;
        }else{
            $ActivityMSG = "Account was locked out due to multiple registration attempts.";
            AddActivity($Email,$ActivityMSG);
            echo json_encode("locked");
            exit;
        }
    }

    $Password = stripslashes($_POST["D2"]);
    $HashedPassword = HashIt($Password);
    $Disabled = 1;
    $Attempt = 0;
    $AdminCode = 1;
    global $PDOconn;
    $Query = 'CALL AddAccount (?, ?, ?, ?, ?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
    $Statement->bindParam(2, $HashedPassword, PDO::PARAM_STR, 60);
    $Statement->bindParam(3, $Disabled, PDO::PARAM_INT, 1);
    $Statement->bindParam(4, $Attempt, PDO::PARAM_INT, 1);
    $Statement->bindParam(5, $AdminCode, PDO::PARAM_INT, 1);
    $Statement->execute();
    $ActivityMSG = "Your account was created.";
    AddActivity($Email,$ActivityMSG);
    $AdminAccounts = FetchAdmins($Action);
    foreach ($AdminAccounts as $AdminEmail) {
        mail($AdminEmail['Email'],"New account created","The following email: " . $Email . " been created.  Account was awaiting your approval.");
    }
    echo json_encode("refresh");
    $PDOconn = null;
}

function FetchAdmins($Action){
    global $PDOconn;
    $Query = 'CALL FetchAdmins';
    $Statement = $PDOconn->prepare($Query);
    $Statement->execute();
    $Response = $Statement->fetchAll();
    return $Response;
}

function AddPet($Action){
    $Email = ValidateSession($Action);
    $Name = stripslashes($_POST["D1"]);
    $BreedID = stripslashes($_POST["D2"]);
    $Gender = stripslashes($_POST["D3"]);
    $Disabled = 0;
    global $PDOconn;
    $Query = 'CALL AddPet (?, ?, ?, ?, ?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
    $Statement->bindParam(2, $Name, PDO::PARAM_STR, 45);
    $Statement->bindParam(3, $BreedID, PDO::PARAM_INT);
    $Statement->bindParam(4, $Gender, PDO::PARAM_STR, 4);
    $Statement->bindParam(5, $Disabled, PDO::PARAM_INT, 1);
    $Statement->execute();
    $ActivityMSG = "Your new pet " . $Name . " has been added.";
    AddActivity($Email,$ActivityMSG);
    echo json_encode("refresh");
    $PDOconn = null;
}

function AddBreed($Action){
    $Email = ValidateSession($Action);
    CheckAdminRole($Email);
    $Name = stripslashes($_POST["D1"]);
    global $PDOconn;
    $Query = 'CALL AddBreed (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Name, PDO::PARAM_STR, 45);
    $Statement->execute();
    $ActivityMSG = "Your added " . $Name . " as a new Breed.";
    AddActivity($Email,$ActivityMSG);
    echo json_encode("refresh");
    $PDOconn = null;
}

function CheckAdminRole($Email){
    if(!FetchAccountRole($Email) == 2){
        echo json_encode("expired");
        exit;
    }
}

function FetchActivities($Action){
    $Email = ValidateSession($Action);
    CheckAdminRole($Email);
    global $PDOconn;
    $Query = 'CALL FetchActivities (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
    $Statement->execute();
    $Response = $Statement->fetchAll();
    echo json_encode($Response);
    $PDOconn = null;
}

function FetchErrors($Action){
    $Email = ValidateSession($Action);
    CheckAdminRole($Email);
    global $PDOconn;
    $Query = 'CALL FetchErrors';
    $Statement = $PDOconn->prepare($Query);
    $Statement->execute();
    $Response = $Statement->fetchAll();
    echo json_encode($Response);
    $PDOconn = null;
}

function FetchUser($Email){
    global $PDOconn;
    $Query = 'CALL FetchUser (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
    $Statement->execute();
    $Response = $Statement->fetch(PDO::FETCH_ASSOC);
    return $Response;
}

function FetchSignInPet($Action){
    $Email = ValidateSession($Action);
    CheckAdminRole($Email);
    $Email = stripslashes($_POST["D1"]);
    global $PDOconn;
    $Query = 'CALL FetchSignInPet (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
    $Statement->execute();
    $Response = $Statement->fetchAll();
    echo json_encode($Response);
    $PDOconn = null;
}

function FetchUserStatus($Action){
    $Email = ValidateSession($Action);
    CheckAdminRole($Email);
    $Email = stripslashes($_POST["D1"]);
    global $PDOconn;
    $Query = 'CALL FetchUserStatus (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
    $Statement->execute();
    $Response = $Statement->fetch(PDO::FETCH_ASSOC);
    echo json_encode($Response);
    $PDOconn = null;
}

function FetchPetStatus($Action){
    $Email = ValidateSession($Action);
    CheckAdminRole($Email);
    $PetID = stripslashes($_POST["D1"]);
    global $PDOconn;
    $Query = 'CALL FetchPetStatus (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $PetID, PDO::PARAM_STR, 45);
    $Statement->execute();
    $Response = $Statement->fetch(PDO::FETCH_ASSOC);
    echo json_encode($Response);
    $PDOconn = null;
}

function FetchPet($Action){
    $Email = ValidateSession($Action);
    CheckAdminRole($Email);
    $PetID = stripslashes($_POST["D1"]);
    global $PDOconn;
    $Query = 'CALL FetchPet (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $PetID, PDO::PARAM_STR, 45);
    $Statement->execute();
    $Response = $Statement->fetch(PDO::FETCH_ASSOC);
    echo json_encode($Response);
    $PDOconn = null;
}

function FetchUserPets($Action){
    $Email = ValidateSession($Action);
    CheckAdminRole($Email);
    $AccountEmail = stripslashes($_POST["D1"]);
    global $PDOconn;
    $Query = 'CALL FetchUserPets (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $AccountEmail, PDO::PARAM_STR, 45);
    $Statement->execute();
    $Response = $Statement->fetchAll();
    echo json_encode($Response);
    $PDOconn = null;
}

function FetchUsers($Action){
    $Email = ValidateSession($Action);
    CheckAdminRole($Email);
    global $PDOconn;
    $Query = 'CALL FetchUsers';
    $Statement = $PDOconn->prepare($Query);
    $Statement->execute();
    $Response = $Statement->fetchAll();
    echo json_encode($Response);
    $PDOconn = null;
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

function SignOut($Action){
    $Email = ValidateSession($Action);
    DeleteSession($Email);
    $ActivityMSG = "You signed out.";
    AddActivity($Email,$ActivityMSG);
    session_unset();
    session_destroy();
    echo json_encode("refresh");
}

function ValidateSession($Action){
    StartSession();
    if(isset($_SESSION['Session_ID'])){
        $SessionID = $_SESSION["Session_ID"];
        $SessionData = FetchSession($SessionID);
        $Email = $SessionData['Email'];
        $BrowserData = GetBrowserData();
        $AccountRole = FetchAccountRole($Email);
        if($SessionData['IP'] == $BrowserData['IP'] && $SessionData['Browser'] == $BrowserData['Browser'] && $SessionData['Platform'] == $BrowserData['Platform']){
            if($Action == "ValidateSession"){
                echo json_encode($AccountRole);
            }else{
                return $Email;
            }
        }else{
            session_unset();
            session_destroy();
            echo json_encode("expired");
            $PDOconn = null;
        }
    }else{
        if($Action == "ValidateSession"){
            echo json_encode(0);
        }else{
            echo json_encode("expired");
            exit;
        }
    }
}

function FetchAccountRole($Email){
    global $PDOconn;
    $Query = 'CALL FetchAccountRole (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
    $Statement->execute();
    $Response = $Statement->fetch(PDO::FETCH_ASSOC);
    if($Response['Disabled'] == 0 && $Response['Attempt'] == 0){
        if($Response['AdminCode'] == 2){
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

function FetchSession($SessionID){
    global $PDOconn;
    $Query = 'CALL FetchSession (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $SessionID, PDO::PARAM_STR, 64);
    $Statement->execute();
    $Response = $Statement->fetch(PDO::FETCH_ASSOC);
    return $Response;
}

function AddSession($Email){
    StartSession();
    $BrowserData = GetBrowserData();
    $SessionID = hash('sha256', uniqid(rand(), true));
    $_SESSION["Session_ID"] = $SessionID;
    $SessionIP = $BrowserData['IP'];
    $SessionBrowser = $BrowserData['Browser'];
    $SessionPlatform = $BrowserData['Platform'];

    global $PDOconn;
    $Query = 'CALL AddSession (?, ?, ?, ?, ?)';
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

    // Next get the name of the useragent yes seperately and for refresh reason
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