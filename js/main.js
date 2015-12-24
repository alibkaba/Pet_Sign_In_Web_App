$(document).ready(function() {
    console.log("ready!");
    $.ajaxSetup({
        url: 'db.php',
        type: 'post',
        cache: 'false',
        async: false,
        success: function(Ajax_Data) {
            console.log('Ajax passed');
        },
        error: function() {
            console.log('Ajax failed');
        }
    });
    Start();
});

function Start(){
    Unit_Test();
    Register_Button();
    Console_Log();
}

function Console_Log(){
    if (typeof console  != "undefined")
        if (typeof console.log != 'undefined')
            console.olog = console.log;
        else
            console.olog = function() {};

    console.log = function(message) {
        console.olog(message);
        $('#Display_Log').append('<p>' + message + '</p>');
    };
    console.error = console.debug = console.info =  console.log
}

function Register_Button(){
    var Register_Button = document.getElementById("Register");
    Register_Button.onclick = function () {
        try{
            var Email = document.getElementById("Email2").value;
            var Password = document.getElementById("Password2").value;
            Empty(Email);
            Empty(Password);
            Validate_Email(Email);
            Check_Email(Email);
            Validate_Password(Password);
            var Admin = 0;
            var Active = 1;
            var action = "Register";
            var Ajax_Data = {
                Email: Email,
                Password: Password,
                Admin: Admin,
                Active: Active,
                action: action
            };
            Outgoing_Ajax(Ajax_Data);
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

function Outgoing_Ajax(Ajax_Data) {
    Incoming_Ajax_Data = $.ajax({
        data: Ajax_Data
    }).responseText;
    return Incoming_Ajax_Data;
}

function Check_Email(Email){
    var action = "Check_Email";
    var Ajax_Data = {
        Email: Email,
        action: action
    };
    Response_Operation(Outgoing_Ajax(Ajax_Data));
}

function Response_Operation(Ajax_Data){
    Ajax_Data = JSON.parse(Ajax_Data);
    var action = Ajax_Data.action;
    var status = Ajax_Data.status;
    console.log(status);
    switch(action) {
        case "Check_Email":
            if(status == 1){
                throw e = "That Email already exists, please use a different email or reset your password";
            }
            break;
    }
}

function GUI_Handler(){
    var Register_Handler = new Register_Manager();
    Register_Handler.Register_Listener();
}

function Unit_Test() {
    var action = "Unit_Test";
    var Ajax_Data = {
        action: action
    };
    var Ajax_Data = Outgoing_Ajax(Ajax_Data);
}

function Validate_Email(Email) {
    var atpos = Email.indexOf("@");
    var dotpos = Email.lastIndexOf(".");
    if (atpos<1 || dotpos<atpos+2 || dotpos+2>=Email.length) {
        throw e = "Not a valid e-mail address";
    }
}

function Validate_Password(Password){
    if(Password === 'undefined'){
        throw e = "empty password";
    }
}

// RECYCLE LIST RECYCLE LIST RECYCLE LIST RECYCLE LIST RECYCLE LIST RECYCLE LIST RECYCLE LIST

function Display_Admin(){
    document.getElementById("Select_Districts").style.visibility="visible";
    if (window.location.pathname.substring(window.location.pathname.lastIndexOf('/')+1) == 'admin.html') {
        document.getElementById("Update_State_Form_Button").style.visibility="visible";
        document.getElementById("Delete_State_Form_Button").style.visibility="visible";
        document.getElementById("Create_District_Form_Button").style.visibility="visible";
    }
}

function Display_Associated_User() {
}

function Display_User() {
}