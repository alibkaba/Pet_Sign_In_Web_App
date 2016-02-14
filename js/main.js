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
        var Action = "SignIn";
        try{
            var AjaxData = {
                Email: Email,
                Password: Password,
                Action: Action
            };
            var Response_Data = JSON.parse(OutgoingAjax(AjaxData));
            if(Response_Data == "0"){
                alert("This account has been locked.  Reset your account or contact the administrator..");
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
            AddJSError(FailedAction,ErrorMSG);
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
                window.location = "/petsignin/";
            }else{
                DisplayActivity(Response_Data);
            }
        }catch(e){
            var ErrorMSG = e;
            var FailedAction = Action;
            AddJSError(FailedAction,ErrorMSG);
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
            AddJSError(FailedAction,ErrorMSG);
            alert('Oops, something broke.  Take note of the steps you took to get this error and email it to admin@company.com for help.');
        }
    });

    $( "#Register" ).click(function() {
        var FirstName = document.getElementById("FirstName").value = "";
        var LastName = document.getElementById("LastName").value = "";
        var Email = document.getElementById("Email2").value = "";
        var Password = document.getElementById("Password2").value = "";
    });

    $( "#RegisterButton" ).click(function() {
        var FirstName = document.getElementById("FirstName").value;
        var LastName = document.getElementById("LastName").value;
        var Email = document.getElementById("Email2").value;
        var Password = document.getElementById("Password2").value;
        IsFieldFilled(Email);
        IsFieldFilled(Password);
        IsFieldFilled(FirstName);
        IsFieldFilled(LastName);
        var Action = "Register";
        try{
            var AjaxData = {
                FirstName: FirstName,
                LastName: LastName,
                Email: Email,
                Password: Password,
                Action: Action
            };
            var Response_Data = JSON.parse(OutgoingAjax(AjaxData));
            console.log(Response_Data);
            if(Response_Data == "0"){
                alert("This account has been locked.  Reset your account or contact the administrator..");
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
            AddJSError(FailedAction,ErrorMSG);
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
            AddJSError(FailedAction,ErrorMSG);
            alert('Oops, something broke.  Take note of the steps you took to get this error and email it to admin@company.com for help.');
        }
    });

    $( "#AddNewPetButton" ).click(function() {
        var Name = document.getElementById("PetName").value = "";
        var Breed = document.getElementById("DisplayPetBreeds").options.length = "1";
        var Gender = document.getElementById("Gender").value = "";
        var VetEmail = document.getElementById("VetEmail").value = "";
        var VetPhoneNumber = document.getElementById("VetPhoneNumber").value = "";
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
            AddJSError(FailedAction,ErrorMSG);
            alert('Oops, something broke.  Take note of the steps you took to get this error and email it to admin@company.com for help.');
        }
    });

    $( "#AddPetButton" ).click(function() {
        var Name = document.getElementById("PetName").value;
        var Breed = document.getElementById("DisplayPetBreeds").value;
        var Gender = document.getElementById("Gender").value;
        var VetEmail = document.getElementById("VetEmail").value;
        var VetPhoneNumber = document.getElementById("VetPhoneNumber").value;
        IsFieldFilled(Name);
        IsFieldFilled(Breed);
        IsFieldFilled(Gender);
        IsFieldFilled(VetEmail);
        IsFieldFilled(VetPhoneNumber);
        var Action = "AddPet";
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
            AddJSError(FailedAction,ErrorMSG);
            alert('Oops, something broke.  Take note of the steps you took to get this error and email it to admin@company.com for help.');
        }
    });

    $('input[type=radio][name=tnc]').change(function() {
        if (this.value == 'yes') {
            document.getElementById("AddPetButton").disabled = false;
        }
        else if (this.value == 'no') {
            document.getElementById("AddPetButton").disabled = true;
        }
    });

    $( "#ResetAccountButton" ).click(function() {
        var Email = document.getElementById("Email3").value;
        IsFieldFilled(Email);
        var Action = "ResetAccountButton";
        try{
            var AjaxData = {
                Email: Email,
                Action: Action
            };
            var Response_Data = JSON.parse(OutgoingAjax(AjaxData));
            if(Response_Data == "0"){
                alert("Invalid email, try again.");
            }else{
                alert("Please check your email to activate your account");
            }
        }catch(e){
            var ErrorMSG = e;
            var FailedAction = Action;
            AddJSError(FailedAction,ErrorMSG);
            alert('Oops, something broke.  Take note of the steps you took to get this error and email it to admin@company.com for help.');
        }
    });

    $( "#ChangePasswordButton" ).click(function() {
        var OldPassword = document.getElementById("OldPassword").value;
        var OldPassword1 = document.getElementById("OldPassword1").value;
        var NewPassword = document.getElementById("NewPassword").value;
        IsFieldFilled(Email);
        IsFieldFilled(OldPassword);
        IsFieldFilled(OldPassword1);
        IsFieldFilled(NewPassword);
        var Action = "ResetAccountButton";
        try{
            var AjaxData = {
                Email: Email,
                Action: Action
            };
            var Response_Data = JSON.parse(OutgoingAjax(AjaxData));
            if(Response_Data == "0"){
                alert("Invalid email, try again.");
            }else{
                alert("Please check your email to activate your account");
            }
        }catch(e){
            var ErrorMSG = e;
            var FailedAction = Action;
            AddJSError(FailedAction,ErrorMSG);
            alert('Oops, something broke.  Take note of the steps you took to get this error and email it to admin@company.com for help.');
        }
    });
});

function DisplayPet(Response_Data){
    var DisplayPet = "";
    for (var i = 0; i < Response_Data.length; i++) {
        DisplayPet += '<button type="button" class="btn btn-primary btn-sm" value="' + Response_Data[i].Name + '" onclick="SignInPet()">' + Response_Data[i].Name + '</button><br>';
    }
    document.getElementById("DisplayPet").innerHTML = DisplayPet;
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

function AddJSError(FailedAction, ErrorMSG){
    var Action = "AddJSError";
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
        AddJSError(FailedAction,ErrorMSG);
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
        AddJSError(FailedAction,ErrorMSG);
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
        AddJSError(FailedAction,ErrorMSG);
        alert('Oops, something broke.  Take note of the steps you took to get this error and email it to admin@company.com for help.');
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