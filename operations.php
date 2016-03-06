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
        case "UnitTest": UnitTest($Action);
            break;
        case "AddAccount": AddAccount($Action);
            break;
        case "SignIn": SignIn($Action);
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
        case "UpdatePassword": UpdatePassword($Action);
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
        case "UpdateAccountStatus": UpdateAccountStatus($Action);
            break;
        case "UpdatePetStatus": UpdatePetStatus($Action);
            break;
        case "UpdatePetName": UpdatePetName($Action);
            break;
        case "UpdatePetBreed": UpdatePetBreed($Action);
            break;
        case "UpdatePetGender": UpdatePetGender($Action);
            break;
        case "UpdateBreed": UpdateBreed($Action);
            break;
        case "FetchPetNameCount": FetchPetNameCount($Action);
            break;
        case "FetchUserEmail": FetchUserEmail($Action);
            break;
    }
}

function Execute($Action,$Statement){
    try {
        $Statement->execute();
    } catch (PDOException $e) {
        $ErrorMSG = 'Error 0: ' . $e->getMessage() . "\n";
        $PHP = 1;
        AddError($Action,$ErrorMSG,$PHP);
    }
}

function AdminRole($Action,$Email){
    $Role = FetchAccountRole($Action,$Email);
    if($Role != 2){
        echo json_encode("expired");
        exit;
    }
}

function UserRole($Action,$Email){
    $Role = FetchAccountRole($Action,$Email);
    if($Role != 1){
        echo json_encode("expired");
        exit;
    }
}

function AddActivity($Action,$Email,$ActivityMSG){
    global $PDOconn;
    $Query = 'CALL AddActivity (?, ?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
    $Statement->bindParam(2, $ActivityMSG, PDO::PARAM_STR, 255);
    Execute($Action,$Statement);
}

function HashIt($Password){
    $HashedPassword = password_hash($Password, PASSWORD_DEFAULT);
    return $HashedPassword;
}

function FetchUser($Action,$Email){
    global $PDOconn;
    $Query = 'CALL FetchUser (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
    Execute($Action,$Statement);
    $Response = $Statement->fetch(PDO::FETCH_ASSOC);
    return $Response;
}

function FetchAdmins($Action){
    global $PDOconn;
    $Query = 'CALL FetchAdmins';
    $Statement = $PDOconn->prepare($Query);
    Execute($Action,$Statement);
    $Response = $Statement->fetchAll();
    return $Response;
}

function ValidatePassword($Password,$HashedPassword){
    if (password_verify($Password, $HashedPassword)) {
        return 1;
    } else {
        return 0;
    }
}

function FetchAccountRole($Action,$Email){
    global $PDOconn;
    $Query = 'CALL FetchAccountRole (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
    Execute($Action,$Statement);
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

function FetchSession($Action,$AliID){
    global $PDOconn;
    $Query = 'CALL FetchSession (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $AliID, PDO::PARAM_STR, 64);
    Execute($Action,$Statement);
    $Response = $Statement->fetch(PDO::FETCH_ASSOC);
    return $Response;
}

function PasswordGenerator(){
    //https://www.catchstudio.com/labs/password-generator/
    //$Password = hash('sha256', uniqid(rand(), true));
    // Characters to use for the password
    $Strings = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.-+=_,!@$#*%<>[]{}";

    // Desired length of the password
    $PasswordLength = 12;

    // Length of the string to take characters from
    $StringLength = strlen($Strings);

    // RANDOM.ORG - We are pulling our list of random numbers as a
    // single request, instead of iterating over each character individually
    $uri = "http://www.random.org/integers/?";
    $Random = file_get_contents(
        $uri ."num=$PasswordLength&min=0&max=".($StringLength-1)."&col=1&base=10&format=plain&rnd=new"
    );
    $Indexes = explode("\n", $Random);
    array_pop($Indexes);

    // We now have an array of random indexes which we will use to build our password
    $Password = '';
    foreach ($Indexes as $int){
        $Password .= substr($Strings, $int, 1);
    }

    return $Password;
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

//Single use
function UnitTest($Action){
    global $PDOconn;
    $Query = 'CALL UTCreate';
    $Statement = $PDOconn->prepare($Query);
    Execute($Action,$Statement);

    $UTValue = "1";
    $Query = 'CALL UTInsert (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $UTValue, PDO::PARAM_INT);
    Execute($Action,$Statement);

    $UpdatedUTValue = "2";
    $Query = 'CALL UTUpdate (?, ?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $UpdatedUTValue, PDO::PARAM_INT);
    $Statement->bindParam(2, $UTValue, PDO::PARAM_INT);
    Execute($Action,$Statement);

    $Query = 'CALL UTDelete (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $UpdatedValue, PDO::PARAM_INT);
    Execute($Action,$Statement);

    $Query = 'CALL UTDrop';
    $Statement = $PDOconn->prepare($Query);
    Execute($Action,$Statement);
    echo json_encode("Unit Test successful");//do I need try and catch for unit test? do I need to fetch?
    $PDOconn = null;
}

function AddError($Action,$ErrorMSG,$PHP){
    $Email = ValidateSession($Action);
    if (!isset($Email)) {
        $Email = NULL;
    }
    if (!isset($PHP)) {
        $FailedAction = stripslashes($_POST["FailedAction"]);
        $ErrorMSG = stripslashes($_POST["ErrorMSG"]);
    }else{
        $FailedAction = $Action;
    }
    global $PDOconn;
    $Query = 'CALL AddError (?, ?, ?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
    $Statement->bindParam(2, $FailedAction, PDO::PARAM_STR, 45);
    $Statement->bindParam(3, $ErrorMSG, PDO::PARAM_STR, 255);
    $Statement->execute();
    $PDOconn = null;
}

function UpdateAccountStatus($Action){
    $AdminEmail = ValidateSession($Action);
    AdminRole($Action,$AdminEmail);
    $Disabled = stripslashes($_POST["D1"]);
    $Email = stripslashes($_POST["D2"]);
    global $PDOconn;
    $Query = 'CALL UpdateAccountStatus (?, ?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Disabled, PDO::PARAM_INT, 1);
    $Statement->bindParam(2, $Email, PDO::PARAM_STR, 45);
    Execute($Action,$Statement);
    if($Disabled == 0){
        $ActivityMSG = "Your account was activated by an Admin.";
        AddActivity($Action,$Email,$ActivityMSG);
        mail($Email,"Account activated","Your account was activated by an Admin.");
        $ActivityMSG = "You activated " . $Email . "'s account.";
        AddActivity($Action,$AdminEmail,$ActivityMSG);
    }else{
        $ActivityMSG = "Your account was dis-activated by an Admin.";
        AddActivity($Action,$Email,$ActivityMSG);
        mail($Email,"Account dis-activated","Your account was dis-activated by an Admin.");
        $ActivityMSG = "You dis-activated " . $Email . "'s account";
        AddActivity($Action,$AdminEmail,$ActivityMSG);
    }
    echo json_encode("refresh");
    $PDOconn = null;
}

function UpdatePetStatus($Action){
    $AdminEmail = ValidateSession($Action);
    AdminRole($Action,$AdminEmail);
    $Disabled = stripslashes($_POST["D1"]);
    $PetName = stripslashes($_POST["D2"]);
    $PetID = stripslashes($_POST["D3"]);
    $Email = stripslashes($_POST["D4"]);
    global $PDOconn;
    $Query = 'CALL UpdatePetStatus (?, ?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Disabled, PDO::PARAM_INT, 1);
    $Statement->bindParam(2, $PetID, PDO::PARAM_INT);
    Execute($Action,$Statement);
    if($Disabled == 0){
        $ActivityMSG = $PetName . " has been activated by an Admin.";
        AddActivity($Action,$Email,$ActivityMSG);
        mail($Email,"Pet activated","Your pet " . $PetName . " has been activated by an Admin.");
        $ActivityMSG = "You activated " . $Email . "'s pet " . $PetName . ".";
        AddActivity($Action,$AdminEmail,$ActivityMSG);
    }else{
        $ActivityMSG = $PetName . " has been dis-activated by an Admin.";
        AddActivity($Action,$Email,$ActivityMSG);
        mail($Email,"Pet dis-activated","Your pet " . $PetName . " has been dis-activated by an Admin.");
        $ActivityMSG = "You dis-activated " . $Email . "'s pet " . $PetName . ".";
        AddActivity($Action,$AdminEmail,$ActivityMSG);
    }
    echo json_encode("refresh");
    $PDOconn = null;
}

function UpdatePetName($Action){
    $AdminEmail = ValidateSession($Action);
    AdminRole($Action,$AdminEmail);
    $PetName = stripslashes($_POST["D1"]);
    $OldPetName = stripslashes($_POST["D2"]);
    $Email = stripslashes($_POST["D3"]);
    global $PDOconn;
    $Query = 'CALL UpdatePetName (?, ?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $PetName, PDO::PARAM_STR, 45);
    $Statement->bindParam(2, $Email, PDO::PARAM_STR, 45);
    Execute($Action,$Statement);
    $ActivityMSG = $OldPetName . "'s name was changed to " . $PetName . " by an Admin.";
    AddActivity($Action,$Email,$ActivityMSG);
    mail($Email,"Pet name change","Your pet " . $OldPetName . "'s name was changed to " . $PetName . " by an Admin.");
    $ActivityMSG = "You changed " . $Email . "'s pet name to " . $PetName . " from " . $OldPetName . ".";
    AddActivity($Action,$AdminEmail,$ActivityMSG);
    echo json_encode("refresh");
    $PDOconn = null;
}

function UpdatePetBreed($Action){
    $AdminEmail = ValidateSession($Action);
    AdminRole($Action,$AdminEmail);
    $BreedID = stripslashes($_POST["D1"]);
    $PetName = stripslashes($_POST["D2"]);
    $Email = stripslashes($_POST["D3"]);
    global $PDOconn;
    $Query = 'CALL UpdatePetBreed (?, ?, ?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $BreedID, PDO::PARAM_INT);
    $Statement->bindParam(2, $PetName, PDO::PARAM_STR, 45);
    $Statement->bindParam(3, $Email, PDO::PARAM_STR, 45);
    Execute($Action,$Statement);
    $ActivityMSG = $PetName . "'s breed was changed by an Admin.";
    AddActivity($Action,$Email,$ActivityMSG);
    mail($Email,"Pet breed change", $PetName . "'s breed was changed by an Admin.");
    $ActivityMSG = "You've changed the breed of " . $Email . "'s pet name " . $PetName . ".";
    AddActivity($Action,$AdminEmail,$ActivityMSG);
    echo json_encode("refresh");
    $PDOconn = null;
}

function UpdatePetGender($Action){
    $AdminEmail = ValidateSession($Action);
    AdminRole($Action,$AdminEmail);
    $Gender = stripslashes($_POST["D1"]);
    $PetName = stripslashes($_POST["D2"]);
    $Email = stripslashes($_POST["D3"]);
    global $PDOconn;
    $Query = 'CALL UpdatePetGender (?, ?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Gender, PDO::PARAM_STR, 4);
    $Statement->bindParam(2, $Email, PDO::PARAM_STR, 45);
    Execute($Action,$Statement);
    $ActivityMSG = $PetName . "'s gender was changed to a " . $Gender . " by an Admin.";
    AddActivity($Action,$Email,$ActivityMSG);
    mail($Email,"Pet gender change","Your pet " . $PetName . "'s gender was changed to " . $Gender . " by an Admin.");
    $ActivityMSG = "You changed the gender of " . $Email . "'s pet name " . $PetName . ".";
    AddActivity($Action,$AdminEmail,$ActivityMSG);
    echo json_encode("refresh");
    $PDOconn = null;
}

function UpdateBreed($Action){
    $Email = ValidateSession($Action);
    AdminRole($Action,$Email);
    $BreedName = stripslashes($_POST["D1"]);
    $OldBreedName = stripslashes($_POST["D2"]);
    $BreedID = stripslashes($_POST["D3"]);
    global $PDOconn;
    $Query = 'CALL UpdateBreed (?, ?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $BreedName, PDO::PARAM_INT);
    $Statement->bindParam(2, $BreedID, PDO::PARAM_STR, 45);
    Execute($Action,$Statement);
    $ActivityMSG = "Breed changed to " . $BreedName . " from " . $OldBreedName . " by an Admin.";
    AddActivity($Action,$Email,$ActivityMSG);
    echo json_encode("refresh");
    $PDOconn = null;
}

function AddBreed($Action){
    $Email = ValidateSession($Action);
    AdminRole($Action,$Email);
    $Name = stripslashes($_POST["D1"]);
    global $PDOconn;
    $Query = 'CALL FetchBreedNameCount (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Name, PDO::PARAM_STR, 45);
    Execute($Action,$Statement);
    $Response = $Statement->fetch(PDO::FETCH_ASSOC);
    $Statement->closeCursor();
    if($Response['Count'] == 0){
        $Query = 'CALL AddBreed (?)';
        $Statement = $PDOconn->prepare($Query);
        $Statement->bindParam(1, $Name, PDO::PARAM_STR, 45);
        Execute($Action,$Statement);
        $ActivityMSG = "You added " . $Name . " as a new breed.";
        AddActivity($Action,$Email,$ActivityMSG);
        echo json_encode("refresh");
        exit;
    }else{
        echo json_encode("breedexist");
        exit;
    }
}

function AddAttempt($Action,$UserData,$Email){
    $NewAttempt = $UserData['Attempt'];
    $NewAttempt++;
    global $PDOconn;
    $Query = 'CALL AddAttempt (?, ?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $NewAttempt, PDO::PARAM_INT, 1);
    $Statement->bindParam(2, $Email, PDO::PARAM_STR, 45);
    Execute($Action,$Statement);
}

function SignIn($Action){
    $Email = stripslashes($_POST["D1"]);
    $Password = stripslashes($_POST["D2"]);
    $UserData = FetchUser($Action,$Email);
    if(!empty($UserData['Email'])){
        $HashedPassword = $UserData['Password'];
        $PasswordResponse = ValidatePassword($Password,$HashedPassword);
        if($Email == $UserData['Email'] && $PasswordResponse == 1){
            if($UserData['Attempt'] < 5){
                if($UserData['Disabled'] == 0) {
                    ResetAttempt($Action,$Email);
                    DeleteSession($Action,$Email);
                    $ActivityMSG = "You signed in.";
                    AddActivity($Action,$Email,$ActivityMSG);
                    AddSession($Action,$Email);
                    echo json_encode("refresh");
                    $PDOconn = null;
                }else{
                    AddAttempt($Action,$UserData,$Email);
                    $ActivityMSG = "You attempted to sign in but your account wasn't activated by an admin yet.";
                    AddActivity($Action,$Email,$ActivityMSG);
                    echo json_encode("notactive");
                    $PDOconn = null;
                }
            }else{
                $ActivityMSG = "Account was locked out due to multiple sign in attempts.";
                AddActivity($Action,$Email,$ActivityMSG);
                echo json_encode("locked");
                $PDOconn = null;
            }
        }else{
            if($UserData['Attempt'] < 5){
                AddAttempt($Action,$UserData,$Email);
                $ActivityMSG = "Account to be locked due to multipel sign in attempts.";
                AddActivity($Action,$Email,$ActivityMSG);
                echo json_encode("notlocked");
                $PDOconn = null;
            }else{
                $ActivityMSG = "Account was locked out due to multiple sign in attempts.";
                AddActivity($Action,$Email,$ActivityMSG);
                echo json_encode("locked");
                $PDOconn = null;
            }
        }
    }else{
        echo json_encode("none");
        $PDOconn = null;
    }
}

function UpdatePassword($Action){
    $Email = ValidateSession($Action);
    $OldPassword = stripslashes($_POST["D1"]);
    $NewPassword = stripslashes($_POST["D2"]);
    $UserData = FetchUser($Action,$Email);
    $HashedPassword = $UserData['Password'];
    $PasswordResponse = ValidatePassword($OldPassword,$HashedPassword);
    if($Email == $UserData['Email'] && $PasswordResponse == 1){
        $NewHashedPassword = HashIt($NewPassword);
        $PasswordResponse = ValidatePassword($NewHashedPassword,$HashedPassword);
        if($PasswordResponse == 0) {
            global $PDOconn;
            $Query = 'CALL UpdatePassword (?, ?)';
            $Statement = $PDOconn->prepare($Query);
            $Statement->bindParam(1, $NewHashedPassword, PDO::PARAM_STR, 64);
            $Statement->bindParam(2, $Email, PDO::PARAM_STR, 45);
            Execute($Action, $Statement);
            mail($Email, "Password was changed", "Your password was changed.");
            $ActivityMSG = "Your password was changed.";
            AddActivity($Action, $Email, $ActivityMSG);
            echo json_encode("pupdated");
            $PDOconn = null;
        }else{
            echo json_encode("xupdated");
        }
    }else{
        echo json_encode("xupdated");
    }
}

function ResetPassword($Action){
    $Email = stripslashes($_POST["D1"]);
    $UserData = FetchUser($Action,$Email);
    if(!empty($UserData['Email'])){
        $Password = PasswordGenerator();
        $HashedPassword = HashIt($Password);
        global $PDOconn;
        $Query = 'CALL UpdatePassword (?, ?)';
        $Statement = $PDOconn->prepare($Query);
        $Statement->bindParam(1, $HashedPassword, PDO::PARAM_STR, 64);
        $Statement->bindParam(2, $Email, PDO::PARAM_STR, 45);
        Execute($Action, $Statement);
        mail($Email, "Password was reset", "Your password was reset to " . $Password . ".");
        $ActivityMSG = "Your password was changed.";
        AddActivity($Action, $Email, $ActivityMSG);
        echo json_encode("refresh");
        $PDOconn = null;
    }else{
        echo json_encode("none");
    }
}

function SignInPet($Action){
    $Email = ValidateSession($Action);
    $Name = stripslashes($_POST["D1"]);
    $ActivityMSG = "Your pet " . $Name . " has been signed in.";
    AddActivity($Action,$Email,$ActivityMSG);
    echo json_encode("refresh");
}

function DeleteSession($Action,$Email){
    global $PDOconn;
    $Query = 'CALL DeleteSession (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
    Execute($Action,$Statement);
}

function ResetAttempt($Action,$Email){
    global $PDOconn;
    $Query = 'CALL ResetAttempt (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
    Execute($Action,$Statement);
}

function AddAccount($Action){
    $Email = stripslashes($_POST["D1"]);
    $UserData = FetchUser($Action,$Email);
    if($Email == $UserData['Email']){
        if($UserData['Attempt'] < 5){
            AddAttempt($Action,$UserData,$Email);
            $ActivityMSG = "Account to be locked due to multiple registration attempts.";
            AddActivity($Action,$Email,$ActivityMSG);
            echo json_encode("notlocked");
            exit;
        }else{
            $ActivityMSG = "Account was locked out due to multiple registration attempts.";
            AddActivity($Action,$Email,$ActivityMSG);
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
    $Statement->bindParam(2, $HashedPassword, PDO::PARAM_STR, 64);
    $Statement->bindParam(3, $Disabled, PDO::PARAM_INT, 1);
    $Statement->bindParam(4, $Attempt, PDO::PARAM_INT, 1);
    $Statement->bindParam(5, $AdminCode, PDO::PARAM_INT, 1);
    Execute($Action,$Statement);
    $ActivityMSG = "Your account was created.";
    AddActivity($Action,$Email,$ActivityMSG);
    mail($Email,"Your account was created","The following email: " . $Email . " has been created.  The account will be activated by an Admin.  In the meantime, familiarize yourself with the pet policy. https://petsignin.alibkaba.com/petsignin/petpolicy.pdf");
    $AdminAccounts = FetchAdmins($Action);
    foreach ($AdminAccounts as $AdminEmail) {
        mail($AdminEmail['Email'],"New account created","The following email: " . $Email . " has been created.  Account is awaiting your approval.");
    }
    echo json_encode("refresh");
    $PDOconn = null;
}

function AddPet($Action){
    $Email = ValidateSession($Action);
    $Name = stripslashes($_POST["D1"]);
    $BreedID = stripslashes($_POST["D2"]);
    $Gender = stripslashes($_POST["D3"]);
    $Disabled = 1;
    global $PDOconn;
    $Query = 'CALL AddPet (?, ?, ?, ?, ?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
    $Statement->bindParam(2, $Name, PDO::PARAM_STR, 45);
    $Statement->bindParam(3, $BreedID, PDO::PARAM_INT);
    $Statement->bindParam(4, $Gender, PDO::PARAM_STR, 4);
    $Statement->bindParam(5, $Disabled, PDO::PARAM_INT, 1);
    Execute($Action,$Statement);
    $ActivityMSG = "Your new pet " . $Name . " has been added.";
    AddActivity($Action,$Email,$ActivityMSG);
    mail($Email,"Your pet was added","The following pet: " . $Name . " has been added.  Please go to this link (https://petsignin.alibkaba.com/petsignin/upload.html) URL to upload the necessary documentation of your pet requested from the pet policy: Pet Policy https://petsignin.alibkaba.com/petsignin/petpolicy.pdf");
    echo json_encode("refresh");
    $PDOconn = null;
}

function FetchActivities($Action){
    $Email = ValidateSession($Action);
    global $PDOconn;
    $Query = 'CALL FetchActivities (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
    Execute($Action,$Statement);
    $Response = $Statement->fetchAll();
    echo json_encode($Response);
    $PDOconn = null;
}

function FetchErrors($Action){
    $Email = ValidateSession($Action);
    AdminRole($Action,$Email);
    global $PDOconn;
    $Query = 'CALL FetchErrors';
    $Statement = $PDOconn->prepare($Query);
    Execute($Action,$Statement);
    $Response = $Statement->fetchAll();
    echo json_encode($Response);
    $PDOconn = null;
}

function FetchSignInPet($Action){
    $Email = ValidateSession($Action);
    UserRole($Action,$Email);
    global $PDOconn;
    $Query = 'CALL FetchSignInPet (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
    Execute($Action,$Statement);
    $Response = $Statement->fetchAll();
    echo json_encode($Response);
    $PDOconn = null;
}

function FetchUserStatus($Action){
    $Email = ValidateSession($Action);
    AdminRole($Action,$Email);
    $Email = stripslashes($_POST["D1"]);
    global $PDOconn;
    $Query = 'CALL FetchUserStatus (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
    Execute($Action,$Statement);
    $Response = $Statement->fetch(PDO::FETCH_ASSOC);
    echo json_encode($Response);
    $PDOconn = null;
}

function FetchPetStatus($Action){
    $Email = ValidateSession($Action);
    AdminRole($Action,$Email);
    $PetID = stripslashes($_POST["D1"]);
    global $PDOconn;
    $Query = 'CALL FetchPetStatus (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $PetID, PDO::PARAM_STR, 45);
    Execute($Action,$Statement);
    $Response = $Statement->fetch(PDO::FETCH_ASSOC);
    echo json_encode($Response);
    $PDOconn = null;
}

function FetchPet($Action){
    $Email = ValidateSession($Action);
    AdminRole($Action,$Email);
    $PetID = stripslashes($_POST["D1"]);
    global $PDOconn;
    $Query = 'CALL FetchPet (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $PetID, PDO::PARAM_STR, 45);
    Execute($Action,$Statement);
    $Response = $Statement->fetch(PDO::FETCH_ASSOC);
    echo json_encode($Response);
    $PDOconn = null;
}

function FetchUserPets($Action){
    $Email = ValidateSession($Action);
    AdminRole($Action,$Email);
    $AccountEmail = stripslashes($_POST["D1"]);
    global $PDOconn;
    $Query = 'CALL FetchUserPets (?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $AccountEmail, PDO::PARAM_STR, 45);
    Execute($Action,$Statement);
    $Response = $Statement->fetchAll();
    echo json_encode($Response);
    $PDOconn = null;
}

function FetchPetNameCount($Action){
    $Email = ValidateSession($Action);
    $Name = stripslashes($_POST["D1"]);
    global $PDOconn;
    $Query = 'CALL FetchPetNameCount (?, ?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
    $Statement->bindParam(2, $Name, PDO::PARAM_STR, 45);
    Execute($Action,$Statement);
    $Response = $Statement->fetch(PDO::FETCH_ASSOC);
    $Statement->closeCursor();
    echo json_encode($Response);
    $PDOconn = null;
}

function FetchUsers($Action){
    $Email = ValidateSession($Action);
    AdminRole($Action,$Email);
    global $PDOconn;
    $Query = 'CALL FetchUsers';
    $Statement = $PDOconn->prepare($Query);
    Execute($Action,$Statement);
    $Response = $Statement->fetchAll();
    echo json_encode($Response);
    $PDOconn = null;
}

function FetchBreeds($Action){
    global $PDOconn;
    $Query = 'CALL FetchBreeds';
    $Statement = $PDOconn->prepare($Query);
    Execute($Action,$Statement);
    $Response = $Statement->fetchAll();
    echo json_encode($Response);
    $PDOconn = null;
}

function SignOut($Action){
    $Email = ValidateSession($Action);
    DeleteSession($Action,$Email);
    $ActivityMSG = "You signed out.";
    AddActivity($Action,$Email,$ActivityMSG);
    session_unset();
    session_destroy();
    echo json_encode("refresh");
}

function ValidateSession($Action){
    StartSession();
    if(isset($_SESSION['AliID'])){
        $AliID = $_SESSION["AliID"];
        $SessionData = FetchSession($Action,$AliID);
        $Email = $SessionData['Email'];
        $BrowserData = GetBrowserData();
        $AccountRole = FetchAccountRole($Action,$Email);
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

function FetchUserEmail($Action){
    $Email = ValidateSession($Action);
    echo json_encode($Email);
}

function AddSession($Action,$Email){
    StartSession();
    $BrowserData = GetBrowserData();
    $AliID = hash('sha256', uniqid(rand(), true));
    $_SESSION["AliID"] = $AliID;
    $SessionIP = $BrowserData['IP'];
    $SessionBrowser = $BrowserData['Browser'];
    $SessionPlatform = $BrowserData['Platform'];

    global $PDOconn;
    $Query = 'CALL AddSession (?, ?, ?, ?, ?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $AliID, PDO::PARAM_STR, 64);
    $Statement->bindParam(2, $Email, PDO::PARAM_STR, 45);
    $Statement->bindParam(3, $SessionIP, PDO::PARAM_STR, 45);
    $Statement->bindParam(4, $SessionBrowser, PDO::PARAM_STR, 45);
    $Statement->bindParam(5, $SessionPlatform, PDO::PARAM_STR, 45);
    Execute($Action,$Statement);
}

function StartSession(){
    ini_set('session.cookie_lifetime', 1800);
    ini_set('session.gc_maxlifetime', 1800);
    session_start();
}