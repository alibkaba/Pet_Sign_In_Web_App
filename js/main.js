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
    Register();
    SignIn();
    //$("#AlertModal").modal();
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
            console.log('back to js register');
        }catch(e){
            alert('Oops, something broke.  Take note of the steps you took to get this error and email it to admin@company.com for help.');
            var ErrorMSG = "R1: "+e;
            var Action = "JSDebug";
            var AjaxData = {
                Email: Email,
                ErrorMSG: ErrorMSG,
                Action: Action
            };
            OutgoingAjax(AjaxData);
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
            console.log('Error: '+e);
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
        console.log('Error: '+e);
    }
}

function ResponseOperation(AjaxData){
    AjaxData = JSON.parse(AjaxData);
    var Action = AjaxData.Action;
    var status = AjaxData.status;
    console.log(status);
    switch(Action) {
        // 0 means it failed at execute/fetch
        case "CheckEmail":
            if(status == 1){
                throw e = "That Email already exists, please use a different email or reset your password";
            }
            break;
        case "CheckActivationCode":
            if(status == 1){
                throw e = "You account is already activated";
            }
            break;
        case "SignIn":
            if(status == 1){
                throw e = "login works";
            }else{
                throw e = "login fails";
            }
            break;
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