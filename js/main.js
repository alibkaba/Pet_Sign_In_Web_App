$(document).ready(function() {
    console.log("ready!");
    $.ajaxSetup({
        url: 'db.php',
        type: 'post',
        cache: 'false',
		timeout: 5000,
        success: function(data) {
            console.log('Success');
        },
        error: function() {
            console.log('Failed');
        }
    });
	Unit_Test();
});

function Unit_Test() {
	var action = "Unit_Test";
	var Ajax_Data = {
        action: action
    };
	Outgoing_Ajax(Ajax_Data);
}

function Register() {
    var Email = document.getElementById("Email2").value;
    if (Check_Email(Email)){
        console.log('Email already exists');
    }
    var Password = document.getElementById("Password2").value;
    if (document.getElementById("Create").checked = true){
        var Company_ID = Generate_Company_ID();
    }else{
        var Company_ID = document.getElementById("Company_ID").value;
    }
    var Admin = 0;
    var Status = 0;
    var action = "Register";
    var Ajax_Data = {
        Email: Email,
        Password: Password,
        Company_ID: Company_ID,
        Admin: Admin,
        Status: Status,
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

function Outgoing_Ajax(Ajax_Data) {
    var Incoming_Ajax_Data = $.ajax({
        data: Ajax_Data
    }).responseText;
    console.log(JSON.stringify(Incoming_Ajax_Data))
    console.dir(Incoming_Ajax_Data);
}

function Check_Email(Email){
	var Ajax_Data = {
        Email: Email,
		action: Check_Email,
	};
	Outgoing_Ajax(Ajax_Data);
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