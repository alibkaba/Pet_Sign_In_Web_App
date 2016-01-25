$(document).ready(function() {
    console.log("ready!");
    $.ajaxSetup({
        url: 'operations.php',
        type: 'post',
        cache: 'false',
        async: false,
        success: function(AjaxData) {
            console.log('Ajax passed');
        },
        error: function(xhr, status, error) {
            console.log("Error: " + xhr.status);
        }
    });
    Start();
});

//Multiple use
function IsFieldFilled(Field){
    if(Field == null || Field == ""){
        alert('Please fill all required field.');
        throw e = "Error: Please fill all required field";
    }
}

function OutgoingAjax(AjaxData) {
    var IncomingAjaxData = $.ajax({
        data: AjaxData
    }).responseText;
    return IncomingAjaxData;
}

function InsertJSError(FailedAction, ErrorMSG){
    var Action = "InsertJSError";
    var AjaxData = {
        FailedAction: FailedAction,
        ErrorMSG: ErrorMSG,
        Action: Action
    };
    OutgoingAjax(AjaxData);
}

//Single use
function Start(){
    UnitTest();
    CheckSession();
    if (window.location.pathname.substring(window.location.pathname.lastIndexOf('/')+1) == '' || window.location.pathname.substring(window.location.pathname.lastIndexOf('/')+1) == 'index.html') {
        Register();
        SignIn();
    }

    if (window.location.pathname.substring(window.location.pathname.lastIndexOf('/')+1) == 'dashboard.html') {
        Activity();
        FetchPet();
    }
}

function SignInPet(){
    alert('pet signed in.');
}

function CheckSession(){
    if (window.location.pathname.substring(window.location.pathname.lastIndexOf('/')+1) == 'dashboard.html'){
        var Page = "dashboard";
    }else{
        var Page = "index";
    }
    var Action = "CheckSession";
    var Refresh = "0";
    try{
        var AjaxData = {
            Page: Page,
            Refresh: Refresh,
            Action: Action
        };
        var Response_Data = JSON.parse(OutgoingAjax(AjaxData));
        console.log(Response_Data);
        if (Response_Data == "0") {
            alert("Your session either expired or you signed in somewhere else.  Please sign in again.");
            window.location = "/petsignin/";
        }else if(Response_Data == "1"){
            alert("You need to have an account to access this page.  Please sign in again.");
            window.location = "/petsignin/";
        }else if(Response_Data == "2"){
            window.location = "/petsignin/dashboard.html";
        }else{}
    }catch(e){
        var ErrorMSG = e;
        var FailedAction = Action;
        InsertJSError(FailedAction,ErrorMSG);
        alert('Oops, something broke.  Take note of the steps you took to get this error and email it to admin@company.com for help.');
    }
}

function FetchPet(){
    var Action = "FetchPet";
    try{
        var AjaxData = {
            Action: Action
        };
        var Response_Data = JSON.parse(OutgoingAjax(AjaxData));
        if (Response_Data !== "") {
            DisplayPet(Response_Data);
        }
    }catch(e){
        var ErrorMSG = e;
        var FailedAction = Action;
        InsertJSError(FailedAction,ErrorMSG);
        alert('Oops, something broke.  Take note of the steps you took to get this error and email it to admin@company.com for help.');
    }
}

function DisplayPet(Response_Data){
    var DisplayPet = "";
    for (var i = 0; i < Response_Data.length; i++) {
        DisplayPet += '<button type="button" class="btn btn-primary btn-sm" value="' + Response_Data[i].Name + '" onclick="SignInPet()">' + Response_Data[i].Name + '</button><br>';
    }
    document.getElementById("DisplayPet").innerHTML = DisplayPet;
}

function Activity(){
    var ActivityButton = document.getElementById("ActivityButton");
    ActivityButton.onclick = function () {
        var Action = "FetchActivity";
        try{
            var AjaxData = {
                Action: Action
            };
            console.log(OutgoingAjax(AjaxData));
            //var Response_Data = JSON.parse(OutgoingAjax(AjaxData));
            //DisplayActivity(Response_Data);
        }catch(e){
            var ErrorMSG = e;
            var FailedAction = Action;
            InsertJSError(FailedAction,ErrorMSG);
            alert('Oops, something broke.  Take note of the steps you took to get this error and email it to admin@company.com for help.');
        }
    };
}

function DisplayActivity(Response_Data){
    var DisplayActivity = '<thead><tr><th>Activity</th><th>Date</th></tr></thead><tbody>';
    for (var i = 0; i < Response_Data.length; i++) {
        DisplayActivity += '<tr><td>' + Response_Data[i].ActivityMSG + '</td><td>' + Response_Data[i].LogDate + '</td></tr>';
    }
    DisplayActivity += '</tbody>';
    document.getElementById("DisplayActivity").innerHTML = DisplayActivity;
}

function Error(){
    var ErrorButton = document.getElementById("ErrorButton");
    ErrorButton.onclick = function () {
        var Action = "FetchError";
        try{
            var AjaxData = {
                Action: Action
            };
            var Response_Data = JSON.parse(OutgoingAjax(AjaxData));
            DisplayError(Response_Data);
        }catch(e){
            var ErrorMSG = e;
            var FailedAction = Action;
            InsertJSError(FailedAction,ErrorMSG);
            alert('Oops, something broke.  Take note of the steps you took to get this error and email it to admin@company.com for help.');
        }
    };
}

function DisplayError(Response_Data){
    var DisplayError = '<thead><tr><th>Account</th><th>Action</th><th>Error Message</th><th>Date</th></tr></thead><tbody>';
    for (var i = 0; i < Response_Data.length; i++) {
        DisplayError += '<tr><td>' + Response_Data[i].Email +  '<tr><td>' + Response_Data[i].Action + '<tr><td>' + Response_Data[i].ErrorMSG + '</td><td>' + Response_Data[i].LogDate + '</td></tr>';
    }
    DisplayError += '</tbody>';
    document.getElementById("DisplayError").innerHTML = DisplayError;
}

function UnitTest() {
    var Action = "UnitTest";
    var AjaxData = {
        Action: Action
    };
    var AjaxData = OutgoingAjax(AjaxData);
}

function Register(){
    var RegisterButton = document.getElementById("Register");
    RegisterButton.onclick = function () {
        var Email = document.getElementById("Email2").value;
        var Password = document.getElementById("Password2").value;
        IsFieldFilled(Email);
        IsFieldFilled(Password);
        ValidateEmailDomain(Email);
        ValidatePassword(Email,Password);
        var Action = "Register";
        try{
            var AjaxData = {
                Email: Email,
                Password: Password,
                Action: Action
            };
            var Response_Data = JSON.parse(OutgoingAjax(AjaxData));
            if(Response_Data == "0"){
                alert("This account has been locked.  Contact the administrator.");
            }else if (Response_Data == "1"){
                alert("This account will be locked soon.  Reset your password or contact the administrator.");
            }else if(Response_Data == "2"){
                alert("Go to your email to activate your account.");
                window.location = "/petsignin/";
            }else{
                alert("Please check your email to activate your account");
            }
        }catch(e){
            var ErrorMSG = e;
            var FailedAction = Action;
            InsertJSError(FailedAction,ErrorMSG);
            alert('Oops, something broke.  Take note of the steps you took to get this error and email it to admin@company.com for help.');
        }
    };
}

function SignIn(){
    var SignInButton = document.getElementById("SignIn");
    SignInButton.onclick = function () {
        var Email = document.getElementById("Email1").value;
        var Password = document.getElementById("Password1").value;
        IsFieldFilled(Email);
        IsFieldFilled(Password);
        ValidateEmailDomain(Email);
        var Action = "SignIn";
        try{
            var AjaxData = {
                Email: Email,
                Password: Password,
                Action: Action
            };
            var Response_Data = JSON.parse(OutgoingAjax(AjaxData));
            if(Response_Data == "0"){
                alert("This account has been locked.  Contact the administrator.");
            }else if (Response_Data == "1") {
                alert("This account will be locked soon.  Reset your password or contact the administrator.");
            }else if(Response_Data == "2"){
                window.location = "/petsignin/dashboard.html";
            }else{
                alert("Please check your email to activate your account");
            }
        }catch(e){
            var ErrorMSG = e;
            var FailedAction = Action;
            InsertJSError(FailedAction,ErrorMSG);
            alert('Oops, something broke.  Take note of the steps you took to get this error and email it to admin@company.com for help.');
        }
    };
}

function Activate(ActivationCode){
    var Action = "Activate";
    try{
        var AjaxData = {
            Activation: ActivationCode,
            Action: Action
        };
        OutgoingAjax(AjaxData);
    }catch(e){
        var ErrorMSG = e;
        var FailedAction = Action;
        InsertJSError(FailedAction,ErrorMSG);
        alert('Oops, something broke.  Take note of the steps you took to get this error and email it to admin@company.com for help.');
    }
}

function ValidateEmailDomain(Email) {
    var re = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
    if (re.test(Email)) {
        if (Email.indexOf('@gmail.com', Email.length - '@gmail.com'.length) == -1) {
            alert('Email must be a GMAIL e-mail address (your.name@gmail.com)');
            throw e = "Email must be a GMAIL e-mail address (your.name@gmail.com)";
        }
    } else {
        alert('Not a valid e-mail address');
        throw e = "Not a valid e-mail address";
    }
}

function ValidatePassword(Email,Password){
    if(Password.length < 6) {
        alert("Error: Password must contain at least six characters!");
        throw e = "Error: Password must contain at least six characters!";
    }
    if(Password == Email) {
        alert("Error: Password must be different from your email!");
        throw e = "Error: Password must be different from your email!";
    }
    re = /[0-9]/;
    if(!re.test(Password)) {
        alert("Error: password must contain at least one number (0-9)!");
        throw e = "Error: password must contain at least one number (0-9)!";
    }
    re = /[a-z]/;
    if(!re.test(Password)) {
        alert("Error: password must contain at least one lowercase letter (a-z)!");
        throw e = "Error: password must contain at least one lowercase letter (a-z)!";
    }
    re = /[A-Z]/;
    if(!re.test(Password)) {
        alert("Error: password must contain at least one uppercase letter (A-Z)!");
        throw e = "Error: password must contain at least one uppercase letter (A-Z)!";
    }
}