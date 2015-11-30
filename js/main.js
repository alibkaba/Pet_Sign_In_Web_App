$(document).ready(function() {
    console.log("ready!");
    $.ajaxSetup({
        url: 'db.php',
        type: 'post',
        cache: 'false',
        async: false,
        success: function(data) {
            console.log(data);
        },
        error: function() {
            alert('Ajax failed');
        }
    });
});

function Sign_In() {
    var Email = document.getElementById("inputEmail").value;
    var Password = document.getElementById("inputPassword").value;
}

function Create_Group() {
    var Email = document.getElementById("inputEmail").value;
    var Password = document.getElementById("inputPassword").value;
	var Group_ID = Generate_Group(Group_ID);
    var Admin = 1;
	var Activation = Generate_Activation(Activation_Number)
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
    var Response = jQuery.parseJSON(Incoming_Ajax_Data);
    Check_Login_Response(Email, Response);
}

function Outgoing_Ajax(Ajax_Data) {
    Incoming_Ajax_Data = $.ajax({
        data: Ajax_Data
    }).responseText;
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

function Generate_Group_ID(Group_ID){

    return Group_ID;
}

function Generate_Activation(Activation_Number){

    return Activation_Number;
}