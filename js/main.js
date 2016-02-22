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

    $("#SignInButton").click(function() {
        var Email = document.getElementById("Email1").value;
        var Password = document.getElementById("Password1").value;
        IsFieldFilled(Email);
        IsFieldFilled(Password);
        ValidateEmailDomain(Email);
        ValidatePassword(Email,Password);
        var Action = "SignIn";
        PrepareAjax(Action,Email,Password);
    });

    $("#ActivitiesButton").click(function() {
        var Action = "FetchActivities";
        PrepareAjax(Action);
    });

    $("#ViewErrorsButton").click(function() {
        var Action = "FetchErrors";
        PrepareAjax(Action);
    });

    $("#Register").click(function() {
        $("#Email2").val("");
        $("#Password2").val("");
        $("#accounttncno").is(':checked');
        $("#RegisterButton").is(':disabled');
    });

    $('input[type=radio][name=accounttnc]').change(function() {
        if (this.value == "yes") {
            $("#RegisterButton").not(':disabled');
        }
        else if (this.value == "no") {
            $("#RegisterButton").is(':disabled');
        }
    });

    $('input[type=radio][name=pettnc]').change(function() {
        if (this.value == "yes") {
            $("#AddPetButton").not(':disabled');
        }
        else if (this.value == "no") {
            $("#AddPetButton").is(':disabled');
        }
    });

    $("#RegisterButton").click(function() {
        var Email = document.getElementById("Email2").value;
        var Password = document.getElementById("Password2").value;
        IsFieldFilled(Email);
        IsFieldFilled(Password);
        ValidateEmailDomain(Email);
        ValidatePassword(Email,Password);
        var Action = "AddAccount";
        PrepareAjax(Action,Email,Password);
    });

    $("#SignOut").click(function() {
        var Action = "SignOut";
        PrepareAjax(Action);
    });

    $("#AddNewPetButton").click(function() {
        $("#PetName").val("");
        $("#ViewGender").val("");
        $("#pettncno").is(':checked');
        $("#AddPetButton").is(':disabled');
        document.getElementById("ViewPetBreeds").options.length = "1";
        var Action = "FetchBreeds";
        PrepareAjax(Action);
        ViewPetBreeds(ResponseData);
    });

    $("#AddPetButton").click(function() {
        var Name = document.getElementById("PetName").value;
        var BreedID = document.getElementById("ViewPetBreeds").value;
        var Gender = document.getElementById("ViewGender").value;
        IsFieldFilled(Name);
        IsFieldFilled(BreedID);
        IsFieldFilled(Gender);
        var Action = "AddPet";
        PrepareAjax(Action,Name,BreedID,Gender);
    });

    $("#ViewPet :input").change(function() {
        var Action = "SignInPet";
        var Name = this.value;
        PrepareAjax(Action,Name);
    });

    $("#ViewAccountsButton").click(function() {
        document.getElementById("AccountDisabled").disabled = true;
        document.getElementById("ViewAllAccountsPets").disabled = true;
        document.getElementById("PetDisabled").disabled = true;
        document.getElementById("ViewName").disabled = true;
        document.getElementById("ViewBreed").disabled = true;
        document.getElementById("ViewGender").disabled = true;
        document.getElementById("ViewAllAccountsPets").disabled = true;
        document.getElementById("UpdateAccountButton").disabled = true;
        document.getElementById("ViewAllAccounts").options.length = "1";
        document.getElementById("ViewAllAccountsPets").options.length = "1";
        document.getElementById("ViewName").value = "";
        document.getElementById("ViewBreed").options.length = "1";
        document.getElementById("ViewGender").options.length = "1";
        var Action = "FetchUsers";
        PrepareAjax(Action);
    });

    $("#ViewAllAccounts").change(function() {
        if (this.value == "0") {
            document.getElementById("AccountDisabled").disabled = true;
            document.getElementById("AccountDisabled").checked = false;
            document.getElementById("ViewAllAccountsPets").disabled = true;
            document.getElementById("PetDisabled").disabled = true;
            document.getElementById("PetDisabled").checked = false;
            document.getElementById("ViewName").disabled = true;
            document.getElementById("ViewBreed").disabled = true;
            document.getElementById("ViewGender").disabled = true;
            document.getElementById("ViewAllAccountsPets").disabled = true;
            document.getElementById("UpdateAccountButton").disabled = true;
            document.getElementById("AccountDisabledLabel").style.backgroundColor = "transparent";
            document.getElementById("PetDisabledLabel").style.backgroundColor = "transparent";
            document.getElementById("ViewAllAccountsPets").options.length = "1";
            document.getElementById("ViewName").value = "";
            document.getElementById("ViewGender").text = "--";
            document.getElementById("ViewBreed").options.length = "1";
            document.getElementById("ViewGender").options.length = "1";
        }else{
            document.getElementById("ViewAllAccountsPets").options.length = "1";
            document.getElementById("ViewName").value = "";
            document.getElementById("ViewBreed").options.length = "1";
            document.getElementById("ViewGender").options.length = "1";
            var Action = "FetchUserStatus";
            var Email = this.value;
            PrepareAjax(Action,Email);
            Action = "FetchUserPets";
            PrepareAjax(Action);
        }
    });

    $("#ViewAllAccountsPets").change(function() {
        if (this.value == "0") {
            document.getElementById("PetDisabled").disabled = true;
            document.getElementById("PetDisabled").checked = false;
            document.getElementById("ViewName").disabled = true;
            document.getElementById("ViewBreed").disabled = true;
            document.getElementById("ViewGender").disabled = true;
            document.getElementById("UpdateAccountButton").disabled = true;
            document.getElementById("PetDisabledLabel").style.backgroundColor = "transparent";
            document.getElementById("ViewName").value = "";
            document.getElementById("ViewBreed").value = "1";
            document.getElementById("ViewGender").selectedIndex.text = "--";
            document.getElementById("ViewBreed").options.length = "1";
            document.getElementById("ViewGender").options.length = "1";
        }else{
            document.getElementById("ViewName").value = "";
            document.getElementById("ViewBreed").options.length = "1";
            document.getElementById("ViewGender").options.length = "1";
            var Action = "FetchPetStatus";
            var PetID = this.value;
            PrepareAjax(Action,PetID);
            PetData = FetchPet(PetID);
            var Breeds = FetchBreeds();
            ViewPetData(PetData,Breeds);
        }
    });

    $("#AccountDisabled").change(function() {
        var DefaultValue = document.getElementById("HiddenValue1").value;
        if(DefaultValue == 1 && this.checked || DefaultValue == 0 && !this.checked){
            document.getElementById("AccountDisabledLabel").style.backgroundColor = "transparent";
            document.getElementById("UpdateAccountButton").disabled = true;
        }else{
            document.getElementById("AccountDisabledLabel").style.backgroundColor = "lightgreen";
            document.getElementById("UpdateAccountButton").disabled = false;
        }
    });

    $("#PetDisabled").change(function() {
        var DefaultValue = document.getElementById("HiddenValue2").value;
        if(DefaultValue == 1 && this.checked || DefaultValue == 0 && !this.checked){
            document.getElementById("PetDisabledLabel").style.backgroundColor = "transparent";
            document.getElementById("UpdateAccountButton").disabled = true;
        }else{
            document.getElementById("PetDisabledLabel").style.backgroundColor = "lightgreen";
            document.getElementById("UpdateAccountButton").disabled = false;
        }
    });

    $("#ViewName").change(function() {
        var DefaultValue = document.getElementById("HiddenValue3").value;
        var NewValue = $(this).val();
        if(DefaultValue == NewValue){
            document.getElementById("ViewName").style.backgroundColor = "transparent";
            document.getElementById("UpdateAccountButton").disabled = true;
        }else{
            document.getElementById("ViewName").style.backgroundColor = "lightgreen";
            document.getElementById("UpdateAccountButton").disabled = false;
        }
        console.log("Prev value " + DefaultValue);
        console.log("New value " + NewValue);
    });

    $("#UpdateAccountButton").click(function() {
        var OldAccountDisabled = document.getElementById("HiddenValue1").value;
        var OldPetDisabled = document.getElementById("HiddenValue2").value;
        var OldName = document.getElementById("HiddenValue3").value;
        var OldBreedID = document.getElementById("HiddenValue4").value;
        var OldGender = document.getElementById("HiddenValue5").value;
        var AccountDisabled = $("#AccountDisabled").val();
        var PetDisabled = $("#PetDisabled").val();
        var Name = $("#ViewName").val();
        var BreedID = $("#ViewBreed").val();
        var Gender = $("#ViewGender").val();
        if(OldGender == Gender){
            var Action = "UpdateGender";
            UpdateAccountButton(Action,Gender);
            try{
                var AjaxData = {
                    Gender: Gender,
                    Action: Action
                };
                var ResponseData = JSON.parse(OutgoingAjax(AjaxData));
                console.log(ResponseData);
                return ResponseData;
            }catch(e){
                var ErrorMSG = e;
                var FailedAction = Action;
                AddError(FailedAction,ErrorMSG);
                alert('Oops, something broke.  Take note of the steps you took to get this error and email it to admin@company.com for help.');
            }
        }
    });
});

function FetchPet(PetID){
    var Action = "FetchPet";
    PrepareAjax(Action);
    try{
        var AjaxData = {
            PetID: PetID,
            Action: Action
        };
        var ResponseData = JSON.parse(OutgoingAjax(AjaxData));
        console.log(ResponseData);
        if (ResponseData == "0") {
            alert("Your session either expired or you signed in somewhere else.  Please sign in again.");
            window.location = "/petsignin/";
        }else{
            return ResponseData;
        }
    }catch(e){
        var ErrorMSG = e;
        var FailedAction = Action;
        AddError(FailedAction,ErrorMSG);
        alert('Oops, something broke.  Take note of the steps you took to get this error and email it to admin@company.com for help.');
    }
}

function ViewAccountDisabled (ResponseData){
    document.getElementById("AccountDisabled").disabled = false;
    if(ResponseData.Disabled == 0){
        document.getElementById("AccountDisabled").checked = false;
        document.getElementById("HiddenValue1").value = 0;
    }else{
        document.getElementById("AccountDisabled").checked = true;
        document.getElementById("HiddenValue1").value = 1;
    }
}

function ViewPetDisabled (ResponseData){
    document.getElementById("PetDisabled").disabled = false;
    if(ResponseData.Disabled == 0){
        document.getElementById("PetDisabled").checked = false;
        document.getElementById("HiddenValue2").value = 0;
    }else{
        document.getElementById("PetDisabled").checked = true;
        document.getElementById("HiddenValue2").value = 1;
    }
}

function ViewPetData(PetData,Breeds){
    document.getElementById("ViewAllAccountsPets").disabled = false;
    document.getElementById("ViewPetBreed").disabled = false;
    document.getElementById("ViewName").disabled = false;
    document.getElementById("ViewGender").disabled = false;
    document.getElementById("HiddenValue3").value = PetData.Name;
    document.getElementById("HiddenValue4").value = PetData.BreedID;
    document.getElementById("HiddenValue5").value = PetData.Gender;
    document.getElementById("ViewName").value  = PetData.Name;
    var select = document.getElementById("ViewPetBreed");
    var i;
    for (i = 0; i < Breeds.length; i++) {
        if(Breeds[i].BreedID == PetData.BreedID){
            select.options[select.options.selectedIndex] = new Option(Breeds[i].Name, Breeds[i].BreedID);
        }else{
            select.options[select.options.length] = new Option(Breeds[i].Name, Breeds[i].BreedID);
        }
    }
    var select = document.getElementById("ViewGender");
    if(PetData.Gender == "Boy"){
        select.options[select.options.selectedIndex] = new Option("Boy", "Boy");
        select.options[select.options] = new Option("Girl", "Girl");
    }else{
        select.options[select.options.selectedIndex] = new Option("Girl", "Girl");
        select.options[select.options] = new Option("Boy", "Boy");
    }
}

function ViewPetBreeds(ResponseData){
    var select = document.getElementById("ViewPetBreeds");
    var i;
    for (i = 0; i < ResponseData.length; i++) {
        select.options[select.options.length] = new Option(ResponseData[i].Name, ResponseData[i].BreedID);
    }
}

function FetchUserPets(Email){
    document.getElementById("ViewAllAccountsPets").disabled = false;
    var AccountEmail = Email;
    var Action = "FetchUserPets";
    PrepareAjax(Action, AccountEmail);
}

function ViewUserPets(ResponseData){
    var select = document.getElementById("ViewAllAccountsPets");
    var i;
    for (i = 0; i < ResponseData.length; i++) {
        select.options[select.options.length] = new Option(ResponseData[i].Name, ResponseData[i].PetID);
    }
}

function ViewAllAccounts(ResponseData){
    var select = document.getElementById("ViewAllAccounts");
    var i;
    for (i = 0; i < ResponseData.length; i++) {
        select.options[select.options.length] = new Option(ResponseData[i].Email, ResponseData[i].Email);
    }
}

function ViewSignInPet(ResponseData){
    var ViewSignInPet = "";
    for (var i = 0; i < ResponseData.length; i++) {
        if (ResponseData[i].DiffDate == "0"){
            ViewSignInPet += '<label class="btn btn-primary" disabled>';
        }else{
            ViewSignInPet += '<label class="btn btn-primary">';
        }
        ViewSignInPet += '<input type="radio" name="options" id="option1" autocomplete="off" value="' + ResponseData[i].Name + '">' + ResponseData[i].Name + '</button>';

        ViewSignInPet += '</label>';
    }
    document.getElementById("ViewSignInPet").innerHTML = ViewSignInPet;
}

//Multiple use
function IsFieldFilled(Field){
    if(Field == null || Field == ""){
        alert('Please fill all required field.');
        throw e = "Error: Please fill all required field";
    }
}

function PrepareAjax(Action,D1,D2,D3,D4,D5,D6,D7,D8,D9){
    var D1;
    var D2;
    var D3;
    var D4;
    var D5;
    var D6;
    var D7;
    var D8;
    var D9;
    try{
        var AjaxData = {
            Action: Action,
            D1: D1,
            D2: D2,
            D3: D3,
            D4: D4,
            D5: D5,
            D6: D6,
            D7: D7,
            D8: D8,
            D9: D9
        };
        var ResponseData = JSON.parse(OutgoingAjax(AjaxData));
        JSOperation(Action, ResponseData);
    }catch(e){
        var ErrorMSG = e;
        var FailedAction = Action;
        AddError(FailedAction,ErrorMSG);
        alert('Oops, something broke.  Take note of the steps you took to get this error and email it to admin@company.com for help.');

    }
}

function AddError(FailedAction, ErrorMSG) {
    var Action = "AddError";
    var AjaxData = {
        Action: Action,
        FailedAction: FailedAction,
        ErrorMSG: ErrorMSG
    }
    OutgoingAjax(AjaxData);
}

function JSOperation(Action, ResponseData){
    console.log(ResponseData);
    switch(ResponseData) {
        case "locked":
            alert("This account has been locked.  Reset your account or contact the administrator.");
            break;
        case "notlocked":
            alert("Your account will be locked out if you fail to sign in 5 times in a row.");
            break;
        case "invalid":
            alert("Invalid email and/or password.  If you forgot your password, reset it.");
            break;
        case "notactive":
            alert("Please wait for an admin to activate your account or contact them @ ADMIN EMAIL.");
            break;
        case "none":
            alert("This account doesn't exist.  Please click on \"Register for a new account\"");
            break;
        case "refresh":
            window.location = "/petsignin/";
            break;
        case 2:
            ViewAdmin();
            break;
        case 1:
            ViewRUser();
            break;
        case 0:
            Visitor();
            break;
        case "expired":
            alert("Your session expired, please sign in again.");
            window.location = "/petsignin/";
            break;
        default:
            JSOperation2(Action,ResponseData);
    }
}

function JSOperation2(Action,ResponseData){
    console.log(ResponseData);
    switch(Action) {
        case "FetchActivities":
            ViewActivities(ResponseData);
            break;
        case "FetchErrors":
            ViewErrors(ResponseData);
            break;
        case "FetchBreeds":
            ViewPetBreeds(ResponseData);
            break;
        case "FetchSignInPet":
            ViewSignInPet(ResponseData);
            break;
        case "FetchUserPets":
            ViewUserPets(ResponseData);
            break;
        case "FetchUsers":
            ViewAllAccounts(ResponseData);
            break;
        case "FetchUserStatus":
            ViewAccountDisabled(ResponseData);
            break;
        case "FetchPetStatus":
            ViewPetDisabled(ResponseData);
            break;
        default:
            alert("nothing!");
    }
}

function OutgoingAjax(AjaxData) {
    var IncomingAjaxData = $.ajax({
        data: AjaxData
    }).responseText;
    return IncomingAjaxData;
}

//Single use
function Start(){
    UnitTest();
    ValidateSession();
}

function Visitor(){
    document.getElementById("Visitor").style.display="block";
    document.getElementById("Visitor").style.visibility="visible";
}

function ViewRUser(){
    FetchUserPetsStatus();
    document.getElementById("SignOut").style.display="block";
    document.getElementById("SignOut").style.visibility="visible";
    document.getElementById("Account").style.display="block";
    document.getElementById("Account").style.visibility="visible";
    document.getElementById("ViewActivitiesButton").style.display="block";
    document.getElementById("ViewActivitiesButton").style.visibility="visible";
    document.getElementById("AddNewPetButton").style.display="block";
    document.getElementById("AddNewPetButton").style.visibility="visible";
}

function ViewAdmin(){
    document.getElementById("SignOut").style.display="block";
    document.getElementById("SignOut").style.visibility="visible";
    document.getElementById("Account").style.display="block";
    document.getElementById("Account").style.visibility="visible";
    document.getElementById("ViewActivitiesButton").style.display="block";
    document.getElementById("ViewActivitiesButton").style.visibility="visible";
    document.getElementById("ViewErrorsButton").style.display="block";
    document.getElementById("ViewErrorsButton").style.visibility="visible";
    document.getElementById("AddPetButton").style.display="block";
    document.getElementById("AddPetButton").style.visibility="visible";
    document.getElementById("ViewAccountsButton").style.display="block";
    document.getElementById("ViewAccountsButton").style.visibility="visible";
}

function ValidateSession(){
    var Action = "ValidateSession";
    PrepareAjax(Action);
}

function FetchSignInPet(){
    var Action = "FetchSignInPet";
    PrepareAjax(Action);
}

function ViewActivities(ResponseData){
    var ViewActivities = '<thead><tr><th>Activities</th><th>Date</th></tr></thead><tbody>';
    for (var i = 0; i < ResponseData.length; i++) {
        ViewActivities += '<tr><td>' + ResponseData[i].ActivityMSG + '</td><td>' + ResponseData[i].LogDate + '</td></tr>';
    }
    ViewActivities += '</tbody>';
    document.getElementById("ViewActivities").innerHTML = ViewActivities;
}

function ViewErrors(ResponseData){
    var ViewErrors = '<thead><tr><th>Account</th><th>Action</th><th>Error Message</th><th>Date</th></tr></thead><tbody>';
    for (var i = 0; i < ResponseData.length; i++) {
        ViewErrors += '<tr><td>' + ResponseData[i].Email +  '<tr><td>' + ResponseData[i].Action + '<tr><td>' + ResponseData[i].ErrorMSG + '</td><td>' + ResponseData[i].LogDate + '</td></tr>';
    }
    ViewErrors += '</tbody>';
    document.getElementById("ViewError").innerHTML = ViewErrors;
}

function UnitTest() {
    var Action = "UnitTest";
    var AjaxData = {
        Action: Action
    };
    var AjaxData = OutgoingAjax(AjaxData);
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