$(document).ready(function() {
    console.log("ready!");
    $.ajaxSetup({
        url: 'operations.php',
        type: 'post',
        cache: 'false',
        async: false,
        success: function(AjaxData) {
            console.log('Ajax passed');
        },
        error: function(xhr, status, error) {
            console.log("Error: " + xhr.status);
        }
    });
    Start();
    $( "#SignInButton" ).click(function() {
        var Email = document.getElementById("Email1").value;
        var Password = document.getElementById("Password1").value;
        IsFieldFilled(Email);
        IsFieldFilled(Password);
        ValidateEmailDomain(Email);
        var Action = "SignIn";
        try{
            var AjaxData = {
                Email: Email,
                Password: Password,
                Action: Action
            };
            var Response_Data = JSON.parse(OutgoingAjax(AjaxData));
            if(Response_Data == "0"){
                alert("This account has been locked.  Contact the administrator.");
            }else if (Response_Data == "1") {
                alert("Invalid user name and/or password.  If you forgot your password, reset it.");
            }else if(Response_Data == "2"){
                window.location = "/petsignin/";
            }else if(Response_Data == "3"){
                alert("Please check your email to activate your account.");
            }else{
                alert("Please create an account.");
            }
        }catch(e){
            var ErrorMSG = e;
            var FailedAction = Action;
            InsertJSError(FailedAction,ErrorMSG);
            alert('Oops, something broke.  Take note of the steps you took to get this error and email it to admin@company.com for help.');
        }
    });

    $( "#ActivityButton" ).click(function() {
        var Action = "FetchActivity";
        try{
            var AjaxData = {
                Action: Action
            };
            var Response_Data = JSON.parse(OutgoingAjax(AjaxData));
            console.log(Response_Data);
            if (Response_Data == "0") {
                alert("Your session either expired or you signed in somewhere else.  Please sign in again.");
            }else{
                DisplayActivity(Response_Data);
            }
        }catch(e){
            var ErrorMSG = e;
            var FailedAction = Action;
            InsertJSError(FailedAction,ErrorMSG);
            alert('Oops, something broke.  Take note of the steps you took to get this error and email it to admin@company.com for help.');
        }
    });

    $( "#ErrorButton" ).click(function() {
        var Action = "FetchError";
        try{
            var AjaxData = {
                Action: Action
            };
            var Response_Data = JSON.parse(OutgoingAjax(AjaxData));
            DisplayError(Response_Data);
        }catch(e){
            var ErrorMSG = e;
            var FailedAction = Action;
            InsertJSError(FailedAction,ErrorMSG);
            alert('Oops, something broke.  Take note of the steps you took to get this error and email it to admin@company.com for help.');
        }
    });

    $( "#RegisterButton" ).click(function() {
        var Email = document.getElementById("Email2").value;
        var Password = document.getElementById("Password2").value;
        IsFieldFilled(Email);
        IsFieldFilled(Password);
        ValidateEmailDomain(Email);
        ValidatePassword(Email,Password);
        var Action = "Register";
        try{
            var AjaxData = {
                Email: Email,
                Password: Password,
                Action: Action
            };
            var Response_Data = JSON.parse(OutgoingAjax(AjaxData));
            if(Response_Data == "0"){
                alert("This account has been locked.  Contact the administrator.");
            }else if (Response_Data == "1"){
                alert("This account already exists, please sign in instead.");
            }else if(Response_Data == "2"){
                alert("Go to your email to activate your account.");
                window.location = "/petsignin/";
            }else{
                alert("Please check your email to activate your account");
            }
        }catch(e){
            var ErrorMSG = e;
            var FailedAction = Action;
            InsertJSError(FailedAction,ErrorMSG);
            alert('Oops, something broke.  Take note of the steps you took to get this error and email it to admin@company.com for help.');
        }
    });

    $( "#SignOut" ).click(function() {
        var Action = "SignOut";
        try{
            var AjaxData = {
                Action: Action
            };
            OutgoingAjax(AjaxData);
            window.location = "/petsignin/";
        }catch(e){
            var ErrorMSG = e;
            var FailedAction = Action;
            InsertJSError(FailedAction,ErrorMSG);
            alert('Oops, something broke.  Take note of the steps you took to get this error and email it to admin@company.com for help.');
        }
    });

    $( "#AddNewPetButton" ).click(function() {
        //FetchPetDOBStart();
        var Action = "FetchPetBreeds";
        try{
            var AjaxData = {
                Action: Action
            };
            var Response_Data = JSON.parse(OutgoingAjax(AjaxData));
            console.log(Response_Data);
            DisplayPetBreeds(Response_Data);
        }catch(e){
            var ErrorMSG = e;
            var FailedAction = Action;
            InsertJSError(FailedAction,ErrorMSG);
            alert('Oops, something broke.  Take note of the steps you took to get this error and email it to admin@company.com for help.');
        }
        FetchPetDOBStart();
    });

});

function FetchPetDOBStart(){
        var AjaxData = {
            Action: Action
        };
        var Response_Data = JSON.parse(OutgoingAjax(AjaxData));
        console.log(Response_Data);
        DisplayPetDOBStart(Response_Data);

}

function DisplayPet(Response_Data){
    var DisplayPet = "";
    for (var i = 0; i < Response_Data.length; i++) {
        DisplayPet += '<button type="button" class="btn btn-primary btn-sm" value="' + Response_Data[i].Name + '" onclick="SignInPet()">' + Response_Data[i].Name + '</button><br>';
    }
    document.getElementById("DisplayPet").innerHTML = DisplayPet;
}

function DisplayPetDOBStart(Response_Data){
    alert(Response_Data);
}

function DisplayPetBreeds(Response_Data){
    var select = document.getElementById("DisplayPetBreeds");
    var i;
    for (i = 0; i < Response_Data.length; i++) {
        select.options[select.options.length] = new Option(Response_Data[i].Name, Response_Data[i].BreedID);
    }
}

//Multiple use
function IsFieldFilled(Field){
    if(Field == null || Field == ""){
        alert('Please fill all required field.');
        throw e = "Error: Please fill all required field";
    }
}

function OutgoingAjax(AjaxData) {
    var IncomingAjaxData = $.ajax({
        data: AjaxData
    }).responseText;
    return IncomingAjaxData;
}

function InsertJSError(FailedAction, ErrorMSG){
    var Action = "InsertJSError";
    var AjaxData = {
        FailedAction: FailedAction,
        ErrorMSG: ErrorMSG,
        Action: Action
    };
    OutgoingAjax(AjaxData);
}

//Single use
function Start(){
    UnitTest();
    ValidateSession();
}

function DisplayUser(){
    document.getElementById("SignInAndRegister").style.display="block";
    document.getElementById("SignInAndRegister").style.visibility="visible";
}

function DisplayRUser(){
    document.getElementById("SignOut").style.display="block";
    document.getElementById("SignOut").style.visibility="visible";
    document.getElementById("Account").style.display="block";
    document.getElementById("Account").style.visibility="visible";
    document.getElementById("ActivityButton").style.display="block";
    document.getElementById("ActivityButton").style.visibility="visible";
    document.getElementById("AddNewPetButton").style.display="block";
    document.getElementById("AddNewPetButton").style.visibility="visible";
}

function DisplayAdmin(){
    document.getElementById("SignOut").style.display="block";
    document.getElementById("SignOut").style.visibility="visible";
    document.getElementById("Account").style.display="block";
    document.getElementById("Account").style.visibility="visible";
    document.getElementById("ActivityButton").style.display="block";
    document.getElementById("ActivityButton").style.visibility="visible";
    document.getElementById("ErrorButton").style.display="block";
    document.getElementById("ErrorButton").style.visibility="visible";
    document.getElementById("AddPetButton").style.display="block";
    document.getElementById("AddPetButton").style.visibility="visible";
}

function DisplaySAdmin(){
    document.getElementById("SignOut").style.display="block";
    document.getElementById("SignOut").style.visibility="visible";
    document.getElementById("Account").style.display="block";
    document.getElementById("Account").style.visibility="visible";
    document.getElementById("ActivityButton").style.display="block";
    document.getElementById("ActivityButton").style.visibility="visible";
    document.getElementById("ErrorButton").style.display="block";
    document.getElementById("ErrorButton").style.visibility="visible";
}

function HideAll(){
    document.getElementById("SignOut").style.display="none";
    document.getElementById("SignOut").style.visibility="hidden";
    document.getElementById("Account").style.display="none";
    document.getElementById("Account").style.visibility="hidden";
    document.getElementById("ActivityButton").style.display="none";
    document.getElementById("ActivityButton").style.visibility="hidden";
    document.getElementById("ErrorButton").style.display="none";
    document.getElementById("ErrorButton").style.visibility="hidden";
    document.getElementById("AddPetButton").style.display="none";
    document.getElementById("AddPetButton").style.visibility="hidden";
}

function SignInPet(){
    alert('pet signed in.');
}

function ValidateSession(){
    var Action = "ValidateSession";
    try{
        var AjaxData = {
            Action: Action
        };
        var Response_Data = JSON.parse(OutgoingAjax(AjaxData));
        console.log(Response_Data);
        if (Response_Data == "3") {
            DisplaySAdmin();
        }else if(Response_Data == "2"){
            DisplayAdmin();
        }else if(Response_Data == "1"){
            DisplayRUser();
        }else{
            DisplayUser();
        }
    }catch(e){
        var ErrorMSG = e;
        var FailedAction = Action;
        InsertJSError(FailedAction,ErrorMSG);
        alert('Oops, something broke.  Take note of the steps you took to get this error and email it to admin@company.com for help.');
    }
}

function FetchPet(){
    var Action = "FetchPet";
    try{
        var AjaxData = {
            Action: Action
        };
        var Response_Data = JSON.parse(OutgoingAjax(AjaxData));
        if (Response_Data !== "") {
            DisplayPet(Response_Data);
        }
    }catch(e){
        var ErrorMSG = e;
        var FailedAction = Action;
        InsertJSError(FailedAction,ErrorMSG);
        alert('Oops, something broke.  Take note of the steps you took to get this error and email it to admin@company.com for help.');
    }
}

function DisplayActivity(Response_Data){
    var DisplayActivity = '<thead><tr><th>Activity</th><th>Date</th></tr></thead><tbody>';
    for (var i = 0; i < Response_Data.length; i++) {
        DisplayActivity += '<tr><td>' + Response_Data[i].ActivityMSG + '</td><td>' + Response_Data[i].LogDate + '</td></tr>';
    }
    DisplayActivity += '</tbody>';
    document.getElementById("DisplayActivity").innerHTML = DisplayActivity;
}

function DisplayError(Response_Data){
    var DisplayError = '<thead><tr><th>Account</th><th>Action</th><th>Error Message</th><th>Date</th></tr></thead><tbody>';
    for (var i = 0; i < Response_Data.length; i++) {
        DisplayError += '<tr><td>' + Response_Data[i].Email +  '<tr><td>' + Response_Data[i].Action + '<tr><td>' + Response_Data[i].ErrorMSG + '</td><td>' + Response_Data[i].LogDate + '</td></tr>';
    }
    DisplayError += '</tbody>';
    document.getElementById("DisplayError").innerHTML = DisplayError;
}

function UnitTest() {
    var Action = "UnitTest";
    var AjaxData = {
        Action: Action
    };
    var AjaxData = OutgoingAjax(AjaxData);
}

$( "RegisterButton" ).click(function() {
    var Email = document.getElementById("Email2").value;
    var Password = document.getElementById("Password2").value;
    IsFieldFilled(Email);
    IsFieldFilled(Password);
    ValidateEmailDomain(Email);
    ValidatePassword(Email,Password);
    var Action = "Register";
    try{
        var AjaxData = {
            Email: Email,
            Password: Password,
            Action: Action
        };
        var Response_Data = JSON.parse(OutgoingAjax(AjaxData));
        if(Response_Data == "0"){
            alert("This account has been locked.  Contact the administrator.");
        }else if (Response_Data == "1"){
            alert("This account will be locked soon.  Reset your password or contact the administrator.");
        }else if(Response_Data == "2"){
            alert("Go to your email to activate your account.");
            window.location = "/petsignin/";
        }else{
            alert("Please check your email to activate your account");
        }
    }catch(e){
        var ErrorMSG = e;
        var FailedAction = Action;
        InsertJSError(FailedAction,ErrorMSG);
        alert('Oops, something broke.  Take note of the steps you took to get this error and email it to admin@company.com for help.');
    }
});

function Activate(ActivationCode){
    var Action = "Activate";
    try{
        var AjaxData = {
            Activation: ActivationCode,
            Action: Action
        };
        OutgoingAjax(AjaxData);
    }catch(e){
        var ErrorMSG = e;
        var FailedAction = Action;
        InsertJSError(FailedAction,ErrorMSG);
        alert('Oops, something broke.  Take note of the steps you took to get this error and email it to admin@company.com for help.');
    }
}

function ValidateEmailDomain(Email) {
    var re = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
    if (re.test(Email)) {
        if (Email.indexOf('@gmail.com', Email.length - '@gmail.com'.length) == -1) {
            alert('Email must be a GMAIL e-mail address (your.name@gmail.com)');
            throw e = "Email must be a GMAIL e-mail address (your.name@gmail.com)";
        }
    } else {
        alert('Not a valid e-mail address');
        throw e = "Not a valid e-mail address";
    }
}

function ValidatePassword(Email,Password){
    if(Password.length < 6) {
        alert("Error: Password must contain at least six characters!");
        throw e = "Error: Password must contain at least six characters!";
    }
    if(Password == Email) {
        alert("Error: Password must be different from your email!");
        throw e = "Error: Password must be different from your email!";
    }
    re = /[0-9]/;
    if(!re.test(Password)) {
        alert("Error: password must contain at least one number (0-9)!");
        throw e = "Error: password must contain at least one number (0-9)!";
    }
    re = /[a-z]/;
    if(!re.test(Password)) {
        alert("Error: password must contain at least one lowercase letter (a-z)!");
        throw e = "Error: password must contain at least one lowercase letter (a-z)!";
    }
    re = /[A-Z]/;
    if(!re.test(Password)) {
        alert("Error: password must contain at least one uppercase letter (A-Z)!");
        throw e = "Error: password must contain at least one uppercase letter (A-Z)!";
    }
}