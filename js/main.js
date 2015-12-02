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
	var Admin = 1;
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
    var Admin = 1;
	var Status = 0;
	var action = "Create_Group";
    var Ajax_Data = {
        Email: Email,
        Password: Password,
		Admin: Admin,
		Status: Status,
        action: action
    };
    $.ajax({data: Ajax_Data});
    //var Response = jQuery.parseJSON(Incoming_Ajax_Data);
    //Check_Login_Response(Email, Response);
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