$(document).ready(function() {
    console.log("ready!");
    $.ajaxSetup({
        url: 'db.php',
        type: 'post',
        cache: 'false',
		timeout: 5000,
        success: function(data) {
            console.log(data);
        },
        error: function() {
            alert('Ajax failed');
        }
    });
	Unit_Test();
});

function Unit_Test() {
	var Admin = "Unit Test";
	var Ajax_Data = {Admin: Admin};
	$.ajax({data: Ajax_Data});
}

function Create_Group_Or_Account() {
	if (document.getElementById('Group_Checked').checked) {
		Create_Group();
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

function Create_Group() {
    var Email = document.getElementById("Create_Email").value;
    var Password = document.getElementById("Create_Password").value;
	var Group_ID = Generate_Group_ID();
    var Admin = 1;
	var Activation = Generate_Activation();
	var Status = 0;
	var action = "Create_Group";
    var Ajax_Data = {
        Email: Email,
        Password: Password,
		Group_ID: Group_ID,
		Admin: Admin,
		Activation: Activation,
		Status: Status,
        action: action
    };
    Outgoing_Ajax(Ajax_Data);
    //var Response = jQuery.parseJSON(Incoming_Ajax_Data);
    //Check_Login_Response(Email, Response);
}

function Outgoing_Ajax(Ajax_Data) {
    Incoming_Ajax_Data = $.ajax({
        data: Ajax_Data
    }).ResponseText;
    return Incoming_Ajax_Data;
}

function Check_Login_Response(Email, Response) {
    alert(Response);
    if (Response !== "1") {
        localStorage.setItem("email", Email);
        window.location.href = 'dashboard.html';
    }
    else {
        alert('Incorrect login credentials');
    }
}

function Generate_Group_ID(){
	var New_Group_ID = Generator()
	var action = "Check_Group_ID";
	var Ajax_Data = {
		New_Group_ID: New_Group_ID,
	};
	Outgoing_Ajax(Ajax_Data);
	//Data = jQuery.parseJSON(Incoming_Ajax_Data);
    return New_Group_ID;
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

function Check_Response(Data) {
    alert(Data);
    if (Data !== "1") {
        alert('Incorrect login credentials');
    }
    else {
        alert('Incorrect login credentials');
    }
}