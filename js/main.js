$(document).ready(function() {
    console.log("ready!");
    $.ajaxSetup({
        url: 'db.php',
        type: 'post',
        cache: 'false',
		timeout: 5000,
        success: function(data) {
            console.log('Ajax Success');
        },
        error: function() {
            console.log('Ajax failed');
        }
    });
	Unit_Test();
});

function Unit_Test() {
	var action = "Unit_Test";
	var Ajax_Data = {action: action};
	Outgoing_Ajax(Ajax_Data);
}

function Create_Company_Or_Account() {
	if (document.getElementById('Company_Checked').checked) {
		Create_Company();
	}
	else {
		Create_Account();
	}
}

function Create_Account() {
    var Email = document.getElementById("Create_Email").value;
    var Password = document.getElementById("Create_Password").value;
}

function Sign_In() {
    var Email = document.getElementById("Sign_In_Email").value;
    var Password = document.getElementById("Sign_In_Password").value;
}

function Create_Company() {
    var Email = document.getElementById("Create_Email").value;
	if (Check_Email){
		console.log('Email already exists');
	}
    var Password = document.getElementById("Create_Password").value;
	var Company_ID = 1;
    var Admin = 1;
	var Activation = Generate_Activation();
	var Status = 0;
	var action = "Create_Company";
    var Ajax_Data = {
        Email: Email,
        Password: Password,
		Company_ID: Company_ID,
		Admin: Admin,
		Activation: Activation,
		Status: Status,
        action: action
    };
	Outgoing_Ajax(Ajax_Data);
}

function Outgoing_Ajax(Ajax_Data) {
    Incoming_Ajax_Data = $.ajax({
        data: Ajax_Data
    }).responseText;
    return Incoming_Ajax_Data;
}

function Check_Email(Email){
	var Ajax_Data = {
		New_Email: New_Email,
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

function Generate_Activation(){
	var New_Activation_Number = Generator()
	var action = "Check_Activation_Number";
	var Ajax_Data = {
		New_Activation_Number: New_Activation_Number,
	};
	Outgoing_Ajax(Ajax_Data);
	//Data = jQuery.parseJSON(Incoming_Ajax_Data);
    return New_Activation_Number;
} 

function Generator(){
	return Math.floor(100000 + Math.random() * 900000);
	
}