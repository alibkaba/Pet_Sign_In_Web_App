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
        error: function() {
            console.log('Ajax failed');
        }
    });
    Start();
});

function Start(){
    UnitTest();
    Register();
    SignIn();
    ConsoleLog();
}

function ConsoleLog(){
    if (typeof console  != "undefined")
        if (typeof console.log != 'undefined')
            console.olog = console.log;
        else
            console.olog = function() {};

    console.log = function(message) {
        console.olog(message);
        $('#DisplayLog').append('<p>' + message + '</p>');
    };
    console.error = console.debug = console.info =  console.log
}

function Register(){
    var RegisterButton = document.getElementById("Register");
    RegisterButton.onclick = function () {
        try{
            var Email = document.getElementById("Email2").value;
            var Password = document.getElementById("Password2").value;
            ValidateField(Email);
            ValidateField(Password);
            ValidateEmail(Email);
            CheckEmail(Email);
            var Active = 1;
            var Action = "Register";
            var AjaxData = {
                Email: Email,
                Password: Password,
                Active: Active,
                Action: Action
            };
            OutgoingAjax(AjaxData);
            console.log('Your account was created, you will now be signed in.');
        }catch(e){
            console.log('Error: '+e);
        }
    };
}

function SignIn(){
    var SignInButton = document.getElementById("SignIn");
    SignInButton.onclick = function () {
        try{
            var Email = document.getElementById("Email1").value;
            var Password = document.getElementById("Password1").value;
            ValidateField(Email);
            ValidateField(Password);
            ValidateEmail(Email);
            //CheckEmail(Email); do this in PHP
            var Action = "SignIn";
            var AjaxData = {
                Email: Email,
                Password: Password,
                Action: Action
            };
            OutgoingAjax(AjaxData);
            console.log('Your account was created, you will now be signed in.');
        }catch(e){
            console.log('Error: '+e);
        }
    };
}

function ValidateField(Field){
    if(Field == null || Field == ""){
        throw e = "Please fill all required field";
    }
}

function OutgoingAjax(AjaxData) {
    IncomingAjaxData = $.ajax({
        data: AjaxData
    }).responseText;
    return IncomingAjaxData;
}

function CheckEmail(Email){
    var Action = "CheckEmail";
    var AjaxData = {
        Email: Email,
        Action: Action
    };
    ResponseOperation(OutgoingAjax(AjaxData));
}

function ResponseOperation(AjaxData){
    AjaxData = JSON.parse(AjaxData);
    var Action = AjaxData.Action;
    var status = AjaxData.status;
    console.log(status);
    switch(Action) {
        case "CheckEmail":
            if(status == 1){
                throw e = "That Email already exists, please use a different email or reset your password";
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

function UnitTest() {
    var Action = "UnitTest";
    var AjaxData = {
        Action: Action
    };
    var AjaxData = OutgoingAjax(AjaxData);
}

function ValidateEmail(Email) {
    var atpos = Email.indexOf("@");
    var dotpos = Email.lastIndexOf(".");
    if (atpos<1 || dotpos<atpos+2 || dotpos+2>=Email.length) {
        throw e = "Not a valid e-mail address";
    }
}