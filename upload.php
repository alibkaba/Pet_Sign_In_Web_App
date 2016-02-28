<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

if(isset($_POST['submit'])) {
    require_once('db.php');
    require_once('operations.php');

    $Email = stripslashes($_POST["Email"]);
    $Name = stripslashes($_POST["Name"]);
    if (!empty($Email) && !empty($Name)) {
        global $PDOconn;
        $Query = 'CALL FetchPetNameCount (?,?)';
        $Statement = $PDOconn->prepare($Query);
        $Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
        $Statement->bindParam(2, $Name, PDO::PARAM_STR, 45);
        $Statement->execute();
        $Response = $Statement->fetch(PDO::FETCH_ASSOC);
        $Statement->closeCursor();
        if($Response['Count'] == 1){
            $target_dir = "uploads/";
            $filename = $Email . "_" . $Name . "_" . basename($_FILES["fileToUpload"]["name"]);
            $target_file = $target_dir . $filename;
            $uploadOk = 1;
            $FileType = pathinfo($target_file,PATHINFO_EXTENSION);
            // Check if file already exists
            if (file_exists($target_file)) {
                echo nl2br("\r\n Error 60: Sorry, file already exists.  Ask an admin to remove it before uploading a new file.");
                $uploadOk = 0;
            }
            // Check file size
            if ($_FILES["fileToUpload"]["size"] > 500000) {
                echo nl2br("\r\n Error 61: Sorry, your file is too large.");
                $uploadOk = 0;
            }
            // Allow certain file formats
            if($FileType != "pdf") {
                echo nl2br("\r\n Error 62: Sorry, only PDF files are allowed.");
                $uploadOk = 0;
            }
            // Check if $uploadOk is set to 0 by an error
            if ($uploadOk == 0) {
                echo nl2br("\r\n Error 64: Sorry, your file was not uploaded.");
                echo nl2br("\r\nYou will be redirected to the upload page in 5 seconds.");
                header('refresh: 5; url=upload.html');

                // if everything is ok, try to upload file
            } else {
                if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
                    echo nl2br("\r\nThe file ". basename( $_FILES["fileToUpload"]["name"]). " has been uploaded.");
                    $Query = 'CALL UpdateDocument (?, ?, ?)';
                    $Statement = $PDOconn->prepare($Query);
                    $Statement->bindParam(1, $filename, PDO::PARAM_STR, 255);
                    $Statement->bindParam(2, $Email, PDO::PARAM_STR, 45);
                    $Statement->bindParam(3, $Name, PDO::PARAM_STR, 45);
                    $Statement->execute();
                    $ActivityMSG = "You uploaded " . $Name . "'s document.";
                    AddActivity($Email,$ActivityMSG);
                    $Action = "Upload";
                    $AdminAccounts = FetchAdmins($Action);
                    foreach ($AdminAccounts as $AdminEmail) {
                        mail($AdminEmail['Email'],"Pet document uploaded","The following account: " . $Email . " has uploaded the pet documentation for " . $Name . ".  Pet is awaiting your approval.");
                    }
                    echo nl2br("\r\nYou will be redirected to the homepage in 5 seconds.");
                    header('refresh: 5; url=index.html');
                } else {
                    echo nl2br("\r\n Error 65: Sorry, there was an error uploading your file.");
                    echo nl2br("\r\nYou will be redirected to the upload page in 5 seconds.");
                    header('refresh: 5; url=upload.html');
                }
            }

        }else{
            echo nl2br("\r\n Error 63: Sorry, you don't have a pet named " . $Name . ".");
            echo nl2br("\r\nYou will be redirected to the upload page in 5 seconds.");
            header('refresh: 5; url=upload.html');
        }
        $PDOconn = null;
    }

}