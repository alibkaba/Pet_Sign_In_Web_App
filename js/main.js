$(document).ready(function() {
    console.log("ready!");
    $.ajaxSetup({
        url: 'db.php',
        type: 'post',
        cache: 'false',
        timeout: 5000,
        async: true,
        success: function(Ajax_Data) {
            //console.log(Ajax_Data);
            Validate_Ajax_Data(Ajax_Data);
        },
        error: function() {
            console.log('Ajax Failed');
        }
    });
    Start();
});

function Start(){
    Unit_Test();
    Register_Button();
    Console_Log();
}

function Validate_Ajax_Data(Ajax_Data){
    if (Ajax_Data instanceof Object) {
        console.log('object');
    }else{
        console.log('not object');
    }

}

function Response_Operation(){

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
    Register_Button['onclick'] = function () {
        try{
            var Email = document.getElementById("Email2").value;
            Validate_Email(Email);
            Check_Email(Email);
            console.log('test');
            var Password = document.getElementById("Password2").value;
            //validate password function 8-25 characters long
            var Admin = 0;
            //var Company_ID = Company_ID();  -> validate function or generate function and validate function via php
            var Company_ID = 1;
            var Status = 0;
            var action = "Register";
            console.log('test');
            var Ajax_Data = {
                Email: Email,
                Password: Password,
                Company_ID: Company_ID,
                Admin: Admin,
                Status: Status,
                action: action
            };
            Outgoing_Ajax(Ajax_Data);
        }catch(e){}
    };
}

function Outgoing_Ajax(Ajax_Data) {
    $.ajax({
        data: Ajax_Data
    });
}

function Check_Email(Email){
    var action = "Check_Email";
    var Ajax_Data = {
        Email: Email,
        action: action
    };

    Outgoing_Ajax(Ajax_Data);
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

function Generate_Company_ID(){
    var New_Company_ID = Generator();
    var action = "Check_Company_ID";
    var Ajax_Data = {
        New_Company_ID: New_Company_ID
    };
    Outgoing_Ajax(Ajax_Data);
    return New_Company_ID;
}

function Generator(){
    return Math.floor(100000 + Math.random() * 900000);
}

function Validate_Email(Email) {
    var atpos = Email.indexOf("@");
    var dotpos = Email.lastIndexOf(".");
    if (atpos<1 || dotpos<atpos+2 || dotpos+2>=Email.length) {
        console.log('Not a valid e-mail address');
        throw new Error();
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