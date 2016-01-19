<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <!--<link rel="stylesheet" type="text/css" href="css/main.css">-->
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
                <li><a data-target="#AccountModal" data-toggle="modal" href="#" id="Account"><span class="glyphicon glyphicon-user"></span>Account</a></li>
                <li> <a href="#" id="SignOut"><span class="glyphicon glyphicon-log-out"></span>Logout</a></li>
            </ul>
        </div>
    </div>
</nav>
<div id="Alert">Alert/important messages will be displayed here. they can be closed. e.g. new update, new policy, etc.  I may need to create a disabled field (disabled functions). disabled if you don't read policy. active is only touched one. maybe change from active to verified.</div>
Need to find a way to sign in pet in 1 or 2 steps.

<button type="button" onclick="">Pets</button><br>
Pet Name (Pet info (pet table)), Pet activity (sign ins, edits to pet info in great detail), delete pet (5 days delay or right away by HR)<br>

<div class="modal fade" id="AccountModal" role="dialog">
    <div class="modal-dialog modal-sm">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">Account</h4>
            </div>
            <div class="modal-body">
                <button type="button" class="btn btn-primary" data-dismiss="modal" data-target="#PersonalInfoModal" data-toggle="modal" id="PersonalInfoButton">Personal Info</button>
                <br>
                <button type="button" class="btn btn-primary" data-dismiss="modal" data-target="#AccountActivityModal" data-toggle="modal" id="AccountActivityButton">Account Activity</button>
                <br>
                <button type="button" class="btn btn-primary" data-dismiss="modal" data-target="#ErrorLoggingModal" data-toggle="modal" id="ErrorLoggingButton">Error Logging</button>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="PersonalInfoModal" role="dialog">
    <div class="modal-dialog modal-sm">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">Account</h4>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <input type="text" id="Email">
                </div>
                <div class="form-group">
                    <input type="text" id="Email">
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary btn-sm" id="Register">Register</button>
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="AccountActivityModal" role="dialog">
    <div class="modal-dialog modal-sm">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">Account</h4>
            </div>
            <div class="modal-body">
                <table class="table table-bordered" id="DisplayAccountActivity">
                    <thead>
                    <tr>
                        <th>Activity</th>
                        <th>Date</th>
                    </tr>
                    </thead>
                </table>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal" data-target="#AccountModal" data-toggle="modal">Back</button>
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="ErrorLoggingModal" role="dialog">
    <div class="modal-dialog modal-sm">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">Account</h4>
            </div>
            <div class="modal-body">
                <table class="table table-bordered" id="DisplayErrorLogging">
                    <thead>
                    <tr>
                        <th>Debug Message</th>
                        <th>Date</th>
                    </tr>
                    </thead>
                </table>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal" data-target="#AccountModal" data-toggle="modal">Back</button>
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>

</body>
</html>