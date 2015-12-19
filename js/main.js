$(document).ready(function() {
    var Incoming_Ajax_Data;
    console.log("ready!");
    $.ajaxSetup({
        url: 'db.php',
        type: 'post',
        cache: 'false',
		timeout: 5000,
        async: true,
        success: function(data) {
            console.log(data, Incoming_Ajax_Data);
        },
        error: function() {
            console.log('Ajax Failed');
        }
    });
    GUI_Handler();
	Unit_Test();
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
});

function GUI_Handler(){
    var Register_Handler = new Register_Manager();
    Register_Handler.Create_Listener();
}

function Register_Manager(){
    this.Create_Listener = function(){
        var Register_Button = document.getElementById("Email2");
        Register_Button.addEventListener("click", function () {
            var Email = document.getElementById("Email2").value;
            var Attribute = ["Email"];
            var Value = [Email];
            if (Validate_Text_Fields(Attribute, Value) != false) {
                //this.Check_Email();
            }
        });

        var Register = document.getElementById("Register");
    };
    this.Check_Email = function(){
        var Email = document.getElementById("Email2").value;
        var Ajax_Data = {
            Email: Email,
            action: Check_Email
        };
        Outgoing_Ajax(Ajax_Data);
    };
}

function Validate_Text_Fields(Attribute, Value) {
    var i;
    for (i = 0; i < Value.length; i++) {
        if (Value[i] == null || Value[i] == "") {
            alert("Invalid " + Attribute[i]);
            return false;
        }
    }
}

function Outgoing_Ajax(Ajax_Data) {
    $.ajax({
        data: Ajax_Data
    });
}

function Unit_Test() {
	var action = "Unit_Test";
	var Ajax_Data = {
        action: action
    };
	Outgoing_Ajax(Ajax_Data);
}

function Sign_In() {
    var Email = document.getElementById("Email1").value;
    if (Check_Email(Email)){
        console.log('Email already exists');
    }
    var Password = document.getElementById("Password1").value;
}

function Generate_Company_ID(){
	var New_Company_ID = Generator()
	var action = "Check_Company_ID";
	var Ajax_Data = {
		New_Company_ID: New_Company_ID,
	};
	Outgoing_Ajax(Ajax_Data);
	//Data = jQuery.parseJSON(Incoming_Ajax_Data);
    return New_Company_ID;
}

function Generator(){
	return Math.floor(100000 + Math.random() * 900000);
}

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