<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

if(isset($_POST['submit'])) {
    require_once('db.php');
    require_once('operations.php');

    $Email = stripslashes($_POST["Email"]);
    $Name = stripslashes($_POST["Name"]);
    global $PDOconn;
    $Query = 'FetchPetNameCount (?,?)';
    $Statement = $PDOconn->prepare($Query);
    $Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
    $Statement->bindParam(1, $Name, PDO::PARAM_STR, 45);
    $Response = $Statement->fetch(PDO::FETCH_ASSOC);
    if($Response['Count'] == 1){
        $target_dir = "uploads/";
        $target_file = $target_dir . "uploads" . basename($_FILES["fileToUpload"]["name"]);
        $uploadOk = 1;
        $FileType = pathinfo($target_file,PATHINFO_EXTENSION);
        // Check if image file is a actual image or fake image
        if(isset($_POST["submit"])) {
            $check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
            if($check !== false) {
                echo nl2br("File is an image - " . $check["mime"] . ".");
                $uploadOk = 1;
            } else {
                echo nl2br("File is not an image.");
                $uploadOk = 0;
            }
        }
        // Check if file already exists
        if (file_exists($target_file)) {
            echo nl2br("\r\nSorry, file already exists.  Ask an admin to remove it before uploading a new file.");
            $uploadOk = 0;
        }
        // Check file size
        if ($_FILES["fileToUpload"]["size"] > 500000) {
            echo nl2br("\r\nSorry, your file is too large.");
            $uploadOk = 0;
        }
        // Allow certain file formats
        if($FileType != "pdf") {
            echo nl2br("\r\nSorry, only PDF files are allowed.");
            $uploadOk = 0;
        }
        // Check if $uploadOk is set to 0 by an error
        if ($uploadOk == 0) {
            echo nl2br("\r\nSorry, your file was not uploaded.");
        // if everything is ok, try to upload file
        } else {
            if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
                echo nl2br("\r\nThe file ". basename( $_FILES["fileToUpload"]["name"]). " has been uploaded.");
            } else {
                echo nl2br("\r\nSorry, there was an error uploading your file.");
            }
        }

    }else{
        echo nl2br("\r\nSorry, you don't have a pet named " . $Name . ".");
    }
    $ActivityMSG = "You uploaded " . $Name . "'s document.";
    AddActivity($Email,$ActivityMSG);
    $AdminAccounts = FetchAdmins($Action);
    foreach ($AdminAccounts as $AdminEmail) {
        mail($AdminEmail['Email'],"Pet document uploaded","The following email: " . $Email . " has uploaded pet documentation for " . $Name . ".  Pet is awaiting your approval.");
    }
    echo json_encode("refresh");
    $PDOconn = null;

}