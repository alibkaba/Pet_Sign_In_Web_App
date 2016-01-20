$(document).ready(function() {
    console.log("ready!");
    $.ajaxSetup({
        url: 'operations.php',
        type: 'post',
        cache: 'false',
        async: false,
        success: function(AjaxData) {
            console.log('Ajax passed');
            console.log(AjaxData);
        },
        error: function() {
            console.log('Ajax failed');
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

//Single use
function Start(){
    UnitTest();
    if (window.location.pathname.substring(window.location.pathname.lastIndexOf('/')+1) == '' || window.location.pathname.substring(window.location.pathname.lastIndexOf('/')+1) == 'index.php') {
        Register();
        SignIn();
    }

    if (window.location.pathname.substring(window.location.pathname.lastIndexOf('/')+1) == 'dashboard.php') {
        Activity();
    }
}

function Activity(){
    var ActivityButton = document.getElementById("ActivityButton");
    ActivityButton.onclick = function () {
        try{
            var Action = "FetchActivity";
            var AjaxData = {
                Action: Action
            };
            //OutgoingAjax(AjaxData);
            var Response_Data = JSON.parse(OutgoingAjax(AjaxData));
            DisplayActivity(Response_Data);
        }catch(e){
            alert('Oops, something broke.  Take note of the steps you took to get this error and email it to admin@company.com for help.');
            var ErrorMSG = "FetchActivity: "+e;
            var Action = "InsertJSError";
            var AjaxData = {
                ErrorMSG: ErrorMSG,
                Action: Action
            };
        }
    };
    //document.getElementById("Update_District_Name").value = District_Data[0].DISTRICT_NAME;
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
        try{
            var Action = "FetchError";
            var AjaxData = {
                Action: Action
            };
            //OutgoingAjax(AjaxData);
            var Response_Data = JSON.parse(OutgoingAjax(AjaxData));
            DisplayAccountAudit(Response_Data);
        }catch(e){
            alert('Oops, something broke.  Take note of the steps you took to get this error and email it to admin@company.com for help.');
            var ErrorMSG = "FetchError: "+e;
            var Action = "InsertJSError";
            var AjaxData = {
                ErrorMSG: ErrorMSG,
                Action: Action
            };
        }
    };
    //document.getElementById("Update_District_Name").value = District_Data[0].DISTRICT_NAME;
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
        try{
            var Action = "Register";
            var AjaxData = {
                Email: Email,
                Password: Password,
                Action: Action
            };
            OutgoingAjax(AjaxData);
            console.log('Account was registered, need to activate activate account.');
        }catch(e){
            alert('Oops, something broke.  Take note of the steps you took to get this error and email it to admin@company.com for help.');
            var ErrorMSG = "Register: "+e;
            var Action = "InsertJSError";
            var AjaxData = {
                Email: Email,
                ErrorMSG: ErrorMSG,
                Action: Action
            };
        }
    };
}

function SignIn(){
    var SignInButton = document.getElementById("SignIn");
    SignInButton.onclick = function () {
        try{
            var Email = document.getElementById("Email1").value;
            var Password = document.getElementById("Password1").value;
            IsFieldFilled(Email);
            IsFieldFilled(Password);
            ValidateEmailDomain(Email);
            var Action = "SignIn";
            var AjaxData = {
                Email: Email,
                Password: Password,
                Action: Action
            };
            OutgoingAjax(AjaxData);
            console.log('Signed in etc etc');
        }catch(e){
            alert('Oops, something broke.  Take note of the steps you took to get this error and email it to admin@company.com for help.');
            var ErrorMSG = "SignIn: "+e;
            var Action = "InsertJSError";
            var AjaxData = {
                Email: Email,
                ErrorMSG: ErrorMSG,
                Action: Action
            };
        }
    };
}

function Activate(ActivationCode){
    try{
        var Action = "Activate";
        var AjaxData = {
            Activation: Activation,
            Action: Action
        };
        OutgoingAjax(AjaxData);
    }catch(e){
        alert('Oops, something broke.  Take note of the steps you took to get this error and email it to admin@company.com for help.');
        var ErrorMSG = "Activate: "+e;
        var Action = "InsertJSError";
        var AjaxData = {
            Email: Email,
            ErrorMSG: ErrorMSG,
            Action: Action
        };
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