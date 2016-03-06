<html>
<body>
<p>Create Admin</p>
<form action="#" method='post'>
    Email: <input type="text" name="Email"><br>
    Password: <input type="password" name="Password"><br>
    <input type="submit" name="add" value="Submit" data-theme="b"/>
    <?php
    require_once('../db.php');
    require_once('../operations.php');
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    if(isset($_POST['add'])){
        $Action = "admin.php";
        $Email = $_POST['Email'];
        $Password = $_POST['Password'];
        $HashedPassword = HashIt($Password);
        $Disabled = 0;
        $Attempt = 0;
        $AdminCode = 2;
        global $PDOconn;
        $Query = 'CALL AddAdminAccount (?,?,?,?,?)';
        $Statement = $PDOconn->prepare($Query);
        $Statement->bindParam(1, $Email, PDO::PARAM_STR, 45);
        $Statement->bindParam(2, $HashedPassword, PDO::PARAM_STR, 255);
        $Statement->bindParam(3, $Disabled, PDO::PARAM_INT, 1);
        $Statement->bindParam(4, $Attempt, PDO::PARAM_INT, 1);
        $Statement->bindParam(5, $AdminCode, PDO::PARAM_INT, 1);
        $Statement->execute();
        $ActivityMSG = "Your account was created by an admin.";
        AddActivity($Action,$Email,$ActivityMSG);
        $MSG = "Super Admin created.";
        $PDOconn = null;
        echo "<script type='text/javascript'>alert('$MSG'); window.location = \"/petsignin/sa/admin.php\";</script>";
    }
    ?>
</form>
</body>
</html>