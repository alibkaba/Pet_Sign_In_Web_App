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
    RegisterButton();
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

function RegisterButton(){
    var RegisterButton = document.getElementById("Register");
    RegisterButton.onclick = function () {
        try{
            var Email = document.getElementById("Email2").value;
            var Password = document.getElementById("Password2").value;
            Empty(Email);
            Empty(Password);
            ValidateEmail(Email);
            CheckEmail(Email);
            ValidatePassword(Password);
            var Admin = 0;
            var Active = 1;
            var Action = "Register";
            var AjaxData = {
                Email: Email,
                Password: Password,
                Admin: Admin,
                Active: Active,
                Action: Action
            };
            OutgoingAjax(AjaxData);
            console.log('Your account was created, you will now be signed in.');
            //sign in
        }catch(e){
            console.log('Error: '+e);
        }
    };
}

function Empty(Field){
    if(Field == null || Field == ""){
        throw e = "Please Fill All Required Field";
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

function ValidatePassword(Password){
    if(Password === 'undefined'){
        throw e = "empty password";
    }
}