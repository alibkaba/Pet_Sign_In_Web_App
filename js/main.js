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

    $("#ViewActivitiesButton").click(function() {
        var Action = "FetchActivities";
        PrepareAjax(Action);
    });

    $("#ViewErrorsButton").click(function() {
        var Action = "FetchErrors";
        PrepareAjax(Action);
    });

    $("#Register").click(function() {
        document.getElementById("Email2").value = "";
        document.getElementById("Password2").value = "";
        document.getElementById("accounttncno").checked = true;
        document.getElementById("RegisterButton").disabled = true;
    });

    $('#ChangePasswordButton').click(function() {
        document.getElementById("OldPassword").value = "";
        document.getElementById("OldPassword1").value = "";
        document.getElementById("NewPassword").value = "";
        document.getElementById("UpdatePasswordButton").disabled = true;
    });

    $('#ResetAccount').click(function() {
        document.getElementById("Email3").value = "";
        document.getElementById("ResetPassword").disabled = true;
    });

    $('#OldPassword').change(function() {
        var Old = document.getElementById("OldPassword").value;
        var Old1 = document.getElementById("OldPassword1").value;
        var New = document.getElementById("NewPassword").value;
        if (Old != "" && Old1 != "" && New != "") {
            document.getElementById("UpdatePasswordButton").disabled = false;
        }else{
            document.getElementById("UpdatePasswordButton").disabled = true;
        }
    });

    $('#Email3').change(function() {
        var Email = document.getElementById("Email3").value;
        if (Email != "") {
            document.getElementById("ResetPassword").disabled = false;
        }else{
            document.getElementById("ResetPassword").disabled = true;
        }
    });

    $('input[type=radio][name=accounttnc]').change(function() {
        if (this.value == "yes") {
            document.getElementById("RegisterButton").disabled = false;
        }else if (this.value == "no") {
            document.getElementById("RegisterButton").disabled = true;
        }
    });

    $("#ViewSignInPet :input").change(function() {
        var Action = "SignInPet";
        var PetName = document.getElementById("SignInPet").value;
        PrepareAjax(Action,PetName);
    });

    $('input[type=radio][name=pettnc]').change(function() {
        if (this.value == "yes") {
            document.getElementById("AddPetButton").disabled = false;
        }else if (this.value == "no") {
            document.getElementById("AddPetButton").disabled = true;
        }
    });

    $("#ResetPassword").click(function() {
        var Email = document.getElementById("Email3").value;
        IsFieldFilled(Email);
        var Action = "ResetPassword";
        PrepareAjax(Action,Email);
    });

    //ViewBreedsModal
    $("#ViewBreeds1").change(function() {
        if (this.value == 0) {
            document.getElementById("ViewBreedName").disabled = true;
            document.getElementById("UpdateBreedButton").disabled = true;
            document.getElementById("ViewBreedName").value = "";
            document.getElementById("ViewBreedName").style.backgroundColor = "transparent";
        }else{
            document.getElementById("ViewBreedName").disabled = false;
            document.getElementById("UpdateBreedButton").disabled = true;
            document.getElementById("ViewBreedName").value = "";
            var SelectedBreed = document.getElementById("ViewBreeds1");
            var SelectedBreedName = SelectedBreed.options[SelectedBreed.selectedIndex].text;
            document.getElementById("ViewBreedName").style.backgroundColor = "transparent";
            document.getElementById("HiddenValue1").value =  SelectedBreed.value;
            document.getElementById("HiddenValue2").value = SelectedBreedName;
            document.getElementById("ViewBreedName").value = SelectedBreedName;
        }
    });

    //ViewAccountsModal
    $("#ViewBreed").change(function() {
        var DefaultValue = document.getElementById("HiddenValue3").value;
        var NewValue = document.getElementById("ViewBreed").value;
        if(DefaultValue == NewValue){
            document.getElementById("ViewBreed").style.backgroundColor = "transparent";
            document.getElementById("UpdateAccountButton").disabled = true;
        }else{
            document.getElementById("ViewBreed").style.backgroundColor = "lightgreen";
            document.getElementById("UpdateAccountButton").disabled = false;
        }
    });

    //ViewAccountsModal
    $("#ViewGender").change(function() {
        var DefaultValue = document.getElementById("HiddenValue4").value;
        var NewValue = document.getElementById("ViewGender").value;
        console.log(DefaultValue);
        console.log(NewValue);
        if (DefaultValue == NewValue) {
            document.getElementById("ViewGender").style.backgroundColor = "transparent";
            document.getElementById("UpdateAccountButton").disabled = true;
        }else{
            document.getElementById("ViewGender").style.backgroundColor = "lightgreen";
            document.getElementById("UpdateAccountButton").disabled = false;
        }
    });

    $("#ViewPetName").change(function() {
        var DefaultValue = document.getElementById("HiddenValue2").value;
        var NewValue = document.getElementById("ViewPetName").value;
        if(DefaultValue == NewValue){
            document.getElementById("ViewPetName").style.backgroundColor = "transparent";
            document.getElementById("UpdateAccountButton").disabled = true;
        }else{
            document.getElementById("ViewPetName").style.backgroundColor = "lightgreen";
            document.getElementById("UpdateAccountButton").disabled = false;
        }
    });

    //ViewBreedsModal
    $("#ViewBreedName").change(function() {
        var DefaultValue = document.getElementById("HiddenValue2").value;
        var NewValue = document.getElementById("ViewBreedName").value;
        if(DefaultValue == NewValue){
            document.getElementById("ViewBreedName").style.backgroundColor = "transparent";
            document.getElementById("UpdateBreedButton").disabled = true;
        }else{
            document.getElementById("ViewBreedName").style.backgroundColor = "lightgreen";
            document.getElementById("UpdateBreedButton").disabled = false;
        }
    });

    //ViewBreedsModal
    $("#AddNewBreed").change(function() {
        var NewValue = document.getElementById("AddNewBreed").value;
        if(NewValue == ""){
            document.getElementById("AddNewBreed").style.backgroundColor = "transparent";
            document.getElementById("AddBreedButton").disabled = true;
        }else{
            document.getElementById("AddNewBreed").style.backgroundColor = "lightgreen";
            document.getElementById("AddBreedButton").disabled = false;
        }
    });

    $("#UpdatePasswordButton").click(function() {
        var OldPassword = document.getElementById("OldPassword").value;
        var OldPassword1 = document.getElementById("OldPassword1").value;
        var NewPassword = document.getElementById("NewPassword").value;
        IsFieldFilled(Email);
        IsFieldFilled(OldPassword);
        IsFieldFilled(OldPassword1);
        IsFieldFilled(NewPassword);
        if(OldPassword == OldPassword1 && OldPassword1 != NewPassword){
            var Action = "ChangePassword";
            PrepareAjax(Action,NewPassword);
        }else{
            alert("An error occured because you either don't have match old passwords or your new password is the same as the old one.")
        }
    });

    $("#SignOut").click(function() {
        var Action = "SignOut";
        PrepareAjax(Action);
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

    $("#AddNewPetButton").click(function() {
        document.getElementById("PetName").value = "";
        document.getElementById("ViewBreeds").options.length = 1;
        document.getElementById("ViewGenders").selectedIndex  = 0;
        document.getElementById("pettncno").checked = true;
        document.getElementById("AddPetButton").disabled = true;
        var Action = "FetchBreeds";
        var ResponseData = Fetch(Action);
        ViewBreeds(ResponseData);
    });

    $("#AddPetButton").click(function() {
        var PetName = document.getElementById("PetName").value;
        var BreedID = document.getElementById("ViewBreeds").value;
        var Gender = document.getElementById("ViewGenders").value;
        IsFieldFilled(PetName);
        IsFieldFilled(BreedID);
        IsFieldFilled(Gender);
        var Action = "FetchPetNameCount";
        var ResponseData = Fetch(Action,PetName);
        if(ResponseData['Count'] == 0){
            var Action = "AddPet";
            PrepareAjax(Action,PetName,BreedID,Gender);
        }else{
            alert("You already have a pet name " + PetName + ".  Pick a different name.")
        }
    });

    //AddBreedButton
    $("#ViewBreedsButton").click(function() {
        document.getElementById("ViewBreedName").disabled = true;
        document.getElementById("ViewBreedName").disabled = true;
        document.getElementById("UpdateBreedButton").disabled = true;
        document.getElementById("AddBreedButton").disabled = true;
        document.getElementById("ViewBreeds1").options.length = 1;
        document.getElementById("ViewBreedName").value = "";
        document.getElementById("AddNewBreed").value = "";
        document.getElementById("ViewBreedName").style.backgroundColor = "transparent";
        document.getElementById("AddNewBreed").style.backgroundColor = "transparent";
        var Action = "FetchBreeds";
        var ResponseData = Fetch(Action);
        ViewBreeds1(ResponseData);
    });

    $("#ViewAccountsButton").click(function() {
        document.getElementById("AccountStatus").disabled = true;
        document.getElementById("ViewAllAccountsPets").disabled = true;
        document.getElementById("PetStatus").disabled = true;
        document.getElementById("ViewPetName").disabled = true;
        document.getElementById("ViewBreed").disabled = true;
        document.getElementById("ViewGender").disabled = true;
        document.getElementById("UpdateAccountButton").disabled = true;
        document.getElementById("AccountStatus").checked = false;
        document.getElementById("PetStatus").checked = false;
        document.getElementById("AccountStatusLabel").style.backgroundColor = "transparent";
        document.getElementById("PetStatusLabel").style.backgroundColor = "transparent";
        document.getElementById("ViewPetName").style.backgroundColor = "transparent";
        document.getElementById("ViewBreed").style.backgroundColor = "transparent";
        document.getElementById("ViewGender").style.backgroundColor = "transparent";
        document.getElementById("ViewAllAccounts").options.length = 1;
        document.getElementById("ViewAllAccountsPets").options.length = 1;
        document.getElementById("Document").value = "Pet Document";
        document.getElementById("ViewBreed").innerHTML = "";
        document.getElementById("ViewGender").innerHTML = "";
        document.getElementById("ViewPetName").value = "";
        var Action = "FetchUsers";
        PrepareAjax(Action);
    });

    //ViewAccountsModal
    $("#ViewAllAccounts").change(function() {
        if (this.value == 0) {
            document.getElementById("AccountStatus").disabled = true;
            document.getElementById("ViewAllAccountsPets").disabled = true;
            document.getElementById("PetStatus").disabled = true;
            document.getElementById("ViewPetName").disabled = true;
            document.getElementById("ViewBreed").disabled = true;
            document.getElementById("ViewGender").disabled = true;
            document.getElementById("UpdateAccountButton").disabled = true;
            document.getElementById("AccountStatus").checked = false;
            document.getElementById("PetStatus").checked = false;
            document.getElementById("AccountStatusLabel").style.backgroundColor = "transparent";
            document.getElementById("PetStatusLabel").style.backgroundColor = "transparent";
            document.getElementById("ViewPetName").style.backgroundColor = "transparent";
            document.getElementById("ViewBreed").style.backgroundColor = "transparent";
            document.getElementById("ViewGender").style.backgroundColor = "transparent";
            document.getElementById("ViewAllAccountsPets").options.length = 1;
            document.getElementById("Document").innerHTML = "Pet Document";
            document.getElementById("ViewBreed").innerHTML = "";
            document.getElementById("ViewGender").innerHTML = "";
            document.getElementById("ViewPetName").value = "";
        }else{
            document.getElementById("AccountStatusLabel").style.backgroundColor = "transparent";
            document.getElementById("PetStatusLabel").style.backgroundColor = "transparent";
            document.getElementById("ViewPetName").style.backgroundColor = "transparent";
            document.getElementById("ViewBreed").style.backgroundColor = "transparent";
            document.getElementById("ViewGender").style.backgroundColor = "transparent";
            document.getElementById("ViewAllAccountsPets").options.length = 1;
            document.getElementById("Document").innerHTML = "Pet Document";
            document.getElementById("ViewBreed").innerHTML = "";
            document.getElementById("ViewGender").innerHTML = "";
            document.getElementById("ViewPetName").value = "";
            document.getElementById("HiddenValue1").value = this.value;
            var Action = "FetchUserStatus";
            var Email = document.getElementById("ViewAllAccounts").value;
            PrepareAjax(Action,Email);
            Action = "FetchUserPets";
            PrepareAjax(Action, Email);
        }
    });

    //ViewAccountsModal
    $("#ViewAllAccountsPets").change(function() {
        if (this.value == 0) {
            document.getElementById("PetStatus").disabled = true;
            document.getElementById("ViewPetName").disabled = true;
            document.getElementById("ViewBreed").disabled = true;
            document.getElementById("ViewGender").disabled = true;
            document.getElementById("UpdateAccountButton").disabled = true;
            document.getElementById("AccountStatus").checked = false;
            document.getElementById("PetStatus").checked = false;
            document.getElementById("PetStatusLabel").style.backgroundColor = "transparent";
            document.getElementById("ViewPetName").style.backgroundColor = "transparent";
            document.getElementById("ViewBreed").style.backgroundColor = "transparent";
            document.getElementById("ViewGender").style.backgroundColor = "transparent";
            document.getElementById("Document").innerHTML = "Pet Document";
            document.getElementById("ViewBreed").innerHTML = "";
            document.getElementById("ViewGender").innerHTML = "";
            document.getElementById("ViewPetName").value = "";
        }else{
            document.getElementById("PetStatusLabel").style.backgroundColor = "transparent";
            document.getElementById("ViewPetName").style.backgroundColor = "transparent";
            document.getElementById("ViewBreed").style.backgroundColor = "transparent";
            document.getElementById("ViewGender").style.backgroundColor = "transparent";
            document.getElementById("Document").innerHTML = "Pet Document";
            document.getElementById("ViewBreed").innerHTML = "";
            document.getElementById("ViewGender").innerHTML = "";
            document.getElementById("ViewPetName").value = "";
            var PetID = this.value;
            document.getElementById("HiddenValue7").value = PetID;
            var Action = "FetchPetStatus";
            PrepareAjax(Action,PetID);
            var Action = "FetchPet";
            var PetData = Fetch(Action,PetID);
            var Action = "FetchBreeds";
            var Breeds = Fetch(Action);
            ViewPetData(PetData,Breeds);
        }
    });

    //ViewAccountsModal
    $("#AccountStatus").change(function() {
        var DefaultValue = document.getElementById("AccountStatus").value;
        if(this.checked){
            document.getElementById("HiddenValue9").value = 1;
        }else{
            document.getElementById("HiddenValue9").value = 0;
        }
        if(DefaultValue == 1 && this.checked || DefaultValue == 0 && !this.checked){
            document.getElementById("AccountStatusLabel").style.backgroundColor = "transparent";
            document.getElementById("UpdateAccountButton").disabled = true;
        }else{
            document.getElementById("AccountStatusLabel").style.backgroundColor = "lightgreen";
            document.getElementById("UpdateAccountButton").disabled = false;
        }
    });

    //ViewAccountsModal
    $("#PetStatus").change(function() {
        var DefaultValue = document.getElementById("PetStatus").value;
        if(this.checked){
            document.getElementById("HiddenValue8").value = 1;
        }else{
            document.getElementById("HiddenValue8").value = 0;
        }
        if(DefaultValue == 1 && this.checked || DefaultValue == 0 && !this.checked){
            document.getElementById("PetStatusLabel").style.backgroundColor = "transparent";
            document.getElementById("UpdateAccountButton").disabled = true;
        }else{
            document.getElementById("PetStatusLabel").style.backgroundColor = "lightgreen";
            document.getElementById("UpdateAccountButton").disabled = false;
        }
    });

    //AddNewPetModal
    $("#ViewPetName").change(function() {
        var DefaultValue = document.getElementById("HiddenValue2").value;
        var NewValue = document.getElementById("ViewPetName").value;
        if(DefaultValue == NewValue){
            document.getElementById("ViewPetName").style.backgroundColor = "transparent";
            document.getElementById("UpdateAccountButton").disabled = true;
        }else{
            document.getElementById("ViewPetName").style.backgroundColor = "lightgreen";
            document.getElementById("UpdateAccountButton").disabled = false;
        }
    });

    //AddNewPetModal
    $("#ViewGender").change(function() {
        var DefaultValue = document.getElementById("HiddenValue4").value;
        var NewValue = document.getElementById("ViewPetName").value;
        if(DefaultValue == NewValue){
            document.getElementById("ViewGender").style.backgroundColor = "transparent";
            document.getElementById("UpdateAccountButton").disabled = true;
        }else{
            document.getElementById("ViewGender").style.backgroundColor = "lightgreen";
            document.getElementById("UpdateAccountButton").disabled = false;
        }
    });

    //ViewAccountsModal
    $("#UpdateAccountButton").click(function() {
        var Email = document.getElementById("HiddenValue1").value;
        var OldAccountStatus = document.getElementById("AccountStatus").value;
        var OldPetStatus = document.getElementById("PetStatus").value;
        var OldName = document.getElementById("HiddenValue2").value;
        var OldBreedID = document.getElementById("HiddenValue3").value;
        var OldGender = document.getElementById("HiddenValue4").value;
        var PetID = document.getElementById("HiddenValue7").value;
        var AccountStatus = document.getElementById("HiddenValue9").value;
        var PetStatus = document.getElementById("HiddenValue8").value;
        var PetName = document.getElementById("ViewPetName").value;
        var SelectedBreed = document.getElementById("ViewBreed");
        var BreedID = SelectedBreed.options[SelectedBreed.selectedIndex].value;
        var Gender = document.getElementById("ViewGender").value;
        if(OldAccountStatus != AccountStatus){
            var Action = "UpdateAccountStatus";
            PrepareAjax(Action,AccountStatus,Email);
        }
        if(OldPetStatus != PetStatus && PetStatus != ""){
            var Action = "UpdatePetStatus";
            PrepareAjax(Action,PetStatus,PetName,PetID,Email);
        }
        if(OldName != PetName && PetName != ""){
            var Action = "UpdatePetName";
            PrepareAjax(Action,PetName,OldName,Email);
        }
        if(OldBreedID != BreedID && BreedID != ""){
            var Action = "UpdatePetBreed";
            PrepareAjax(Action,BreedID,PetName,Email);
        }
        if(OldGender != Gender && Gender != ""){
            var Action = "UpdatePetGender";
            PrepareAjax(Action,Gender,PetName,Email);
        }
    });

    //ViewBreedsModal
    $("#UpdateBreedButton").click(function() {
        var OldBreedName = document.getElementById("HiddenValue2").value;
        var NewBreedName = document.getElementById("ViewBreedName").value;
        var BreedID = document.getElementById("ViewBreeds1").value;
        if(OldBreedName != NewBreedName){
            var Action = "UpdateBreed";
            PrepareAjax(Action,NewBreedName,OldBreedName,BreedID);
        }
    });

    //ViewBreedsModal
    $("#AddBreedButton").click(function() {
        var NewBreedName = document.getElementById("AddNewBreed").value;
        var Action = "AddBreed";
        PrepareAjax(Action,NewBreedName);
    });
});

function Fetch(Action,D1){
    var D1;
    try{
        var AjaxData = {
            Action: Action,
            D1: D1
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

function ViewAccountStatus (ResponseData){
    document.getElementById("AccountStatus").disabled = false;
    if(ResponseData.Disabled == 0){
        document.getElementById("AccountStatus").checked = false;
        document.getElementById("AccountStatus").value = 0;
        document.getElementById("HiddenValue9").value = 0;
    }else{
        document.getElementById("AccountStatus").checked = true;
        document.getElementById("AccountStatus").value = 1;
        document.getElementById("HiddenValue9").value = 1;
    }
}

function ViewPetStatus (ResponseData){
    document.getElementById("PetStatus").disabled = false;
    if(ResponseData.Disabled == 0){
        document.getElementById("PetStatus").checked = false;
        document.getElementById("PetStatus").value = 0;
        document.getElementById("HiddenValue8").value = 0;
    }else{
        document.getElementById("PetStatus").checked = true;
        document.getElementById("PetStatus").value = 1;
        document.getElementById("HiddenValue8").value = 1;
    }
}

//ViewAccountsModal
function ViewPetData(PetData,Breeds){
    document.getElementById("ViewPetName").disabled = false;
    document.getElementById("ViewBreed").disabled = false;
    document.getElementById("ViewGender").disabled = false;
    document.getElementById("HiddenValue2").value = PetData.Name;
    document.getElementById("HiddenValue3").value = PetData.BreedID;
    document.getElementById("HiddenValue4").value = PetData.Gender;
    var Document = PetData.Document;
    document.getElementById("ViewPetName").value  = PetData.Name;

    if(Document != "" && !Document){
        document.getElementById("Document").innerHTML = "Pet Document";
    }else{
        document.getElementById("Document").innerHTML = '<a href="https://alibkaba.com/petsignin/uploads/' + Document + '">Pet document</a>';
    }

    var select = document.getElementById("ViewBreed");
    var i;
    var PetIndex;
    for (i = 0; i < Breeds.length; i++) {
        select.options[select.options.length] = new Option(Breeds[i].Name, Breeds[i].BreedID);
        if(Breeds[i].BreedID == PetData.BreedID){
            PetIndex = i;
        }
    }
    document.getElementById("ViewBreed").selectedIndex = PetIndex;

    var select = document.getElementById("ViewGender");
    if(PetData.Gender == "Boy"){
        select.options[select.options.length] = new Option("Boy", "Boy");
        select.options[select.options.length] = new Option("Girl", "Girl");
        document.getElementById("ViewGender").selectedIndex  = 0;
    }else{
        select.options[select.options.length] = new Option("Boy", "Boy");
        select.options[select.options.length] = new Option("Girl", "Girl");
        document.getElementById("ViewGender").selectedIndex  = 1;
    }
}

//AddNewPetModal
function ViewBreeds(ResponseData){
    var select = document.getElementById("ViewBreeds");
    var i;
    for (i = 0; i < ResponseData.length; i++) {
        select.options[select.options.length] = new Option(ResponseData[i].Name, ResponseData[i].BreedID);
    }
}

function ViewBreeds1(ResponseData){
    var select = document.getElementById("ViewBreeds1");
    var i;
    for (i = 0; i < ResponseData.length; i++) {
        select.options[select.options.length] = new Option(ResponseData[i].Name, ResponseData[i].BreedID);
    }
}

//ViewAccountsModal
function ViewUserPets(ResponseData){
    document.getElementById("ViewAllAccountsPets").disabled = false;
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
        if (ResponseData[i].Disabled == 0){
            if (ResponseData[i].DiffDate == 0){
                ViewSignInPet += '<label class="btn btn-primary" disabled>';
            }else{
                ViewSignInPet += '<label class="btn btn-primary">';
            }
            ViewSignInPet += '<input type="radio" name="options" id="SignInPet" autocomplete="off" value="' + ResponseData[i].Name + '">' + ResponseData[i].Name + '</button>';

            ViewSignInPet += '</label>';
        }else{
            ViewSignInPet += '<label class="btn btn-danger" disabled><input type="radio" name="options" id="SignInPet" autocomplete="off" value="' + ResponseData[i].Name + '">' + ResponseData[i].Name + '</button></label>';
        }
    }
    document.getElementById("ViewSignInPet").innerHTML = ViewSignInPet;
}

//Multiple use
function IsFieldFilled(Field){
    if(Field == null || Field == ""){
        alert('Please fill all of the fields.');
        throw e = "Error: Please fill all of the fields.";
    }
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

function ViewUser(){
    FetchSignInPet();
    document.getElementById("SignOut").style.display="block";
    document.getElementById("SignOut").style.visibility="visible";
    document.getElementById("Account").style.display="block";
    document.getElementById("Account").style.visibility="visible";
    document.getElementById("ViewActivitiesButton").style.display="block";
    document.getElementById("ViewActivitiesButton").style.visibility="visible";
    document.getElementById("AddNewPetButton").style.display="block";
    document.getElementById("AddNewPetButton").style.visibility="visible";
    document.getElementById("ChangePasswordButton").style.display="block";
    document.getElementById("ChangePasswordButton").style.visibility="visible";
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
    document.getElementById("ViewBreedsButton").style.display="block";
    document.getElementById("ViewBreedsButton").style.visibility="visible";
    document.getElementById("ChangePasswordButton").style.display="block";
    document.getElementById("ChangePasswordButton").style.visibility="visible";
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
        ViewErrors += '<tr><td>' + ResponseData[i].Email +  '<td>' + ResponseData[i].Action + '<td>' + ResponseData[i].ErrorMSG + '</td><td>' + ResponseData[i].LogDate + '</td></tr>';
    }
    ViewErrors += '</tbody>';
    document.getElementById("ViewErrors").innerHTML = ViewErrors;
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
            alert('Error: Please enter a valid GMAIL e-mail address (your.name@gmail.com).');
            throw e = "Error: Please enter a valid GMAIL e-mail address (your.name@gmail.com).";
        }
    } else {
        alert('Error: Not a valid e-mail address');
        throw e = "Error: Not a valid e-mail address";
    }
}

function ValidatePassword(Email,Password){
    if(Password.length < 6) {
        alert("Error: Password must contain at least six characters.");
        throw e = "Error: Password must contain at least six characters.";
    }
    if(Password == Email) {
        alert("Error: Password must be different from your email.");
        throw e = "Error: Password must be different from your email.";
    }
    re = /[0-9]/;
    if(!re.test(Password)) {
        alert("Error: password must contain at least one number (0-9).");
        throw e = "Error: password must contain at least one number (0-9).";
    }
    re = /[a-z]/;
    if(!re.test(Password)) {
        alert("Error: password must contain at least one lowercase letter (a-z).");
        throw e = "Error: password must contain at least one lowercase letter (a-z).";
    }
    re = /[A-Z]/;
    if(!re.test(Password)) {
        alert("Error: password must contain at least one uppercase letter (A-Z).");
        throw e = "Error: password must contain at least one uppercase letter (A-Z).";
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
            alert("Your account will be locked out soon.");
            break;
        case "invalid":
            alert("Invalid email and/or password.  If you forgot your password, reset it.");
            break;
        case "notactive":
            alert("Your account is not activate.  Wait or contact an Admin.");
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
            ViewUser();
            break;
        case 0:
            Visitor();
            break;
        case "expired":
            alert("Your session expired, please sign in again.");
            window.location = "/petsignin/";
            break;
        case "breedexist":
            alert("The breed already exist.");
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
            ViewAccountStatus(ResponseData);
            break;
        case "FetchPetStatus":
            ViewPetStatus(ResponseData);
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