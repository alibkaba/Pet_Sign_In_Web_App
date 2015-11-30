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
    var Encrypted_Password = document.getElementById("inputPassword").value;
	alert(Email);
    //Get_Login(Email, Encrypted_Password);
}