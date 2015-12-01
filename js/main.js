$(document).ready(function() {
    console.log("ready!");
    $.ajaxSetup({
        url: 'db.php',
        type: 'post',
        cache: 'false',
        success: function(data) {
            console.log(data);
        },
        error: function() {
            alert('Ajax failed');
        }
    });
});

function Create_Group_Or_Account() {
	if (document.getElementById('Group_Checked').checked) {
		Create_Group();
	}
	else {
		Create_Account();
	}
}

function Create_Account() {
    var Email = document.getElementById("inputEmail").value;
    var Password = document.getElementById("inputPassword").value;
}

function Sign_In() {
    var Email = document.getElementById("inputEmail").value;
    var Password = document.getElementById("inputPassword").value;
}

function Create_Group() {
    var Email = document.getElementById("inputEmail").value;
    var Password = document.getElementById("inputPassword").value;
	alert(Email);
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
    Outgoing_Ajax(Ajax_Data);
    //var Response = jQuery.parseJSON(Incoming_Ajax_Data);
    //Check_Login_Response(Email, Response);
}

function Outgoing_Ajax(Ajax_Data) {
    $.ajax({data: Ajax_Data});
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