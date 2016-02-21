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
        ValidatePassword(Email,Password)
        var Action = "SignIn";
        try{
            var AjaxData = {
                Email: Email,
                Password: Password,
                Action: Action
            };
            var ResponseData = JSON.parse(OutgoingAjax(AjaxData));
            console.log(ResponseData);
            if(ResponseData == "0"){
                alert("This account has been locked.  Reset your account or contact the administrator..");
            }else if (ResponseData == "1") {
                alert("Invalid user name and/or password.  If you forgot your password, reset it.");
            }else if(ResponseData == "2"){
                window.location = "/petsignin/";
            }else if(ResponseData == "3"){
                alert("Please wait for an admin to activate your account or contact them @ ADMIN EMAIL.");
            }else{
                alert("This account doesn't exist.  Please click on \"Register for a new account\"");
            }
        }catch(e){
            var ErrorMSG = e;
            var FailedAction = Action;
            AddError(FailedAction,ErrorMSG);
            alert('Oops, something broke.  Take note of the steps you took to get this error and email it to admin@company.com for help.');
        }
    });

    $( "#ActivitiesButton" ).click(function() {
        var Action = "FetchActivities";
        try{
            var AjaxData = {
                Action: Action
            };
            var ResponseData = JSON.parse(OutgoingAjax(AjaxData));
            console.log(ResponseData);
            if (ResponseData == "0") {
                alert("Your session either expired or you signed in somewhere else.  Please sign in again.");
                window.location = "/petsignin/";
            }else{
                DisplayActivities(ResponseData);
            }
        }catch(e){
            var ErrorMSG = e;
            var FailedAction = Action;
            AddError(FailedAction,ErrorMSG);
            alert('Oops, something broke.  Take note of the steps you took to get this error and email it to admin@company.com for help.');
        }
    });

    $( "#ErrorButton" ).click(function() {
        var Action = "FetchErrors";
        try{
            var AjaxData = {
                Action: Action
            };
            var ResponseData = JSON.parse(OutgoingAjax(AjaxData));
            console.log(ResponseData);
            if(ResponseData == "0"){
                alert("Your session either expired or you signed in somewhere else.  Please sign in again.");
                window.location = "/petsignin/";
            }else{
                DisplayErrors(ResponseData);
            }
        }catch(e){
            var ErrorMSG = e;
            var FailedAction = Action;
            AddError(FailedAction,ErrorMSG);
            alert('Oops, something broke.  Take note of the steps you took to get this error and email it to admin@company.com for help.');
        }
    });

    $( "#Register" ).click(function() {
        document.getElementById("Email2").value = "";
        document.getElementById("Password2").value = "";
        document.getElementById("accounttncno").checked = true;
        document.getElementById("RegisterButton").disabled = true;
    });

    $('input[type=radio][name=accounttnc]').change(function() {
        if (this.value == "yes") {
            document.getElementById("RegisterButton").disabled = false;
        }
        else if (this.value == "no") {
            document.getElementById("RegisterButton").disabled = true;
        }
    });

    $( "#RegisterButton" ).click(function() {
        var Email = document.getElementById("Email2").value;
        var Password = document.getElementById("Password2").value;
        IsFieldFilled(Email);
        IsFieldFilled(Password);
        ValidateEmailDomain(Email);
        ValidatePassword(Email,Password);
        var Action = "AddAccount";
        try{
            var AjaxData = {
                Email: Email,
                Password: Password,
                Action: Action
            };
            var ResponseData = JSON.parse(OutgoingAjax(AjaxData));
            console.log(ResponseData);
            if(ResponseData == "0"){
                alert("This account has been locked.  Reset your account or contact the administrator.");
            }else if (ResponseData == "1"){
                alert("This account already exists, please sign in instead.");
            }else if(ResponseData == "2"){
                alert("Please wait 1-2 business days for account approval.");
                window.location = "/petsignin/";
            }else{
                alert("Please check your email to activate your account");
            }
        }catch(e){
            var ErrorMSG = e;
            var FailedAction = Action;
            AddError(FailedAction,ErrorMSG);
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
            AddError(FailedAction,ErrorMSG);
            alert('Oops, something broke.  Take note of the steps you took to get this error and email it to admin@company.com for help.');
        }
    });

    $( "#AddNewPetButton" ).click(function() {
        document.getElementById("PetName").value = "";
        document.getElementById("DisplayPetBreeds").options.length = "1";
        document.getElementById("DisplayGender").value = "";
        document.getElementById("pettncno").checked = true;
        document.getElementById("AddPetButton").disabled = true;
        ResponseData = FetchBreeds();
        DisplayPetBreeds(ResponseData);
    });

    $( "#AddPetButton" ).click(function() {
        var Name = document.getElementById("PetName").value;
        var BreedID = document.getElementById("DisplayPetBreeds").value;
        var Gender = document.getElementById("DisplayGender").value;
        IsFieldFilled(Name);
        IsFieldFilled(BreedID);
        IsFieldFilled(Gender);
        var Action = "AddPet";
        try{
            var AjaxData = {
                Name: Name,
                BreedID: BreedID,
                Gender: Gender,
                Action: Action
            };
            var ResponseData = JSON.parse(OutgoingAjax(AjaxData));
            console.log(ResponseData);
            if(ResponseData == "0"){
                alert("This account has been locked.  Reset your account or contact the administrator.");
            }else{
                alert( Name + " was added.");
                window.location = "/petsignin/";
            }
        }catch(e){
            var ErrorMSG = e;
            var FailedAction = Action;
            AddError(FailedAction,ErrorMSG);
            alert('Oops, something broke.  Take note of the steps you took to get this error and email it to admin@company.com for help.');
        }
    });

    $('input[type=radio][name=pettnc]').change(function() {
        if (this.value == "yes") {
            document.getElementById("AddPetButton").disabled = false;
        }
        else if (this.value == "no") {
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
            var ResponseData = JSON.parse(OutgoingAjax(AjaxData));
            if(ResponseData == "0"){
                alert("Invalid email, try again.");
            }else{
                alert("Please check your email to activate your account");
            }
        }catch(e){
            var ErrorMSG = e;
            var FailedAction = Action;
            AddError(FailedAction,ErrorMSG);
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
            var ResponseData = JSON.parse(OutgoingAjax(AjaxData));
            if(ResponseData == "0"){
                alert("Invalid email, try again.");
            }else{
                alert("Please check your email to activate your account");
            }
        }catch(e){
            var ErrorMSG = e;
            var FailedAction = Action;
            AddError(FailedAction,ErrorMSG);
            alert('Oops, something broke.  Take note of the steps you took to get this error and email it to admin@company.com for help.');
        }
    });

    $( "#DisplayPet :input" ).change(function() {
        var Name = this.value;
        var Action = "SignInPet";
        try{
            var AjaxData = {
                Name: Name,
                Action: Action
            };
            var ResponseData = JSON.parse(OutgoingAjax(AjaxData));
            console.log(ResponseData);
            if (ResponseData == "0") {
                alert("Your session either expired or you signed in somewhere else.  Please sign in again.");
                window.location = "/petsignin/";
            }else{
                alert('Your pet was signed in.');
                window.location = "/petsignin/";
            }
        }catch(e){
            var ErrorMSG = e;
            var FailedAction = Action;
            AddError(FailedAction,ErrorMSG);
            alert('Oops, something broke.  Take note of the steps you took to get this error and email it to admin@company.com for help.');
        }
    });

    $( "#ManageAccountsButton" ).click(function() {
        document.getElementById("AccountDisabled").disabled = true;
        document.getElementById("DisplayAllAccountsPets").disabled = true;
        document.getElementById("PetDisabled").disabled = true;
        document.getElementById("DisplayPetName").disabled = true;
        document.getElementById("DisplayPetBreed").disabled = true;
        document.getElementById("DisplayGender").disabled = true;
        document.getElementById("DisplayAllAccountsPets").disabled = true;
        document.getElementById("UpdateAccountButton").disabled = true;
        document.getElementById("DisplayAllAccounts").options.length = "1";
        document.getElementById("DisplayAllAccountsPets").options.length = "1";
        document.getElementById("DisplayPetName").value = "";
        document.getElementById("DisplayPetBreed").options.length = "1";
        document.getElementById("DisplayGender").options.length = "1";
        var Action = "FetchUsers";
        try{
            var AjaxData = {
                Action: Action
            };
            var ResponseData = JSON.parse(OutgoingAjax(AjaxData));
            console.log(ResponseData);
            if (ResponseData == "0") {
                alert("Your session either expired or you signed in somewhere else.  Please sign in again.");
                window.location = "/petsignin/";
            }else{
                DisplayAllAccounts(ResponseData);
            }
        }catch(e){
            var ErrorMSG = e;
            var FailedAction = Action;
            AddError(FailedAction,ErrorMSG);
            alert('Oops, something broke.  Take note of the steps you took to get this error and email it to admin@company.com for help.');
        }
    });

    $( "#DisplayAllAccounts" ).change(function() {
        if (this.value == "0") {
            document.getElementById("AccountDisabled").disabled = true;
            document.getElementById("AccountDisabled").checked = false;
            document.getElementById("DisplayAllAccountsPets").disabled = true;
            document.getElementById("PetDisabled").disabled = true;
            document.getElementById("PetDisabled").checked = false;
            document.getElementById("DisplayPetName").disabled = true;
            document.getElementById("DisplayPetBreed").disabled = true;
            document.getElementById("DisplayGender").disabled = true;
            document.getElementById("DisplayAllAccountsPets").disabled = true;
            document.getElementById("UpdateAccountButton").disabled = true;
            document.getElementById("AccountDisabledLabel").style.backgroundColor = "transparent";
            document.getElementById("PetDisabledLabel").style.backgroundColor = "transparent";
            document.getElementById("DisplayAllAccountsPets").options.length = "1";
            document.getElementById("DisplayPetName").value = "";
            document.getElementById("DisplayGender").text = "--";
            document.getElementById("DisplayPetBreed").options.length = "1";
            document.getElementById("DisplayGender").options.length = "1";
        }else{
            document.getElementById("DisplayAllAccountsPets").options.length = "1";
            document.getElementById("DisplayPetName").value = "";
            document.getElementById("DisplayPetBreed").options.length = "1";
            document.getElementById("DisplayGender").options.length = "1";
            var Email = this.value;
            var Action = "FetchUserStatus";
            try{
                var AjaxData = {
                    Email: Email,
                    Action: Action
                };
                var ResponseData = JSON.parse(OutgoingAjax(AjaxData));
                console.log(ResponseData);
                if (ResponseData == "0") {
                    alert("Your session either expired or you signed in somewhere else.  Please sign in again.");
                    window.location = "/petsignin/";
                }else{
                    DisplayAccountDisabled(ResponseData);
                    FetchUserPets(Email);
                }
            }catch(e){
                var ErrorMSG = e;
                var FailedAction = Action;
                AddError(FailedAction,ErrorMSG);
                alert('Oops, something broke.  Take note of the steps you took to get this error and email it to admin@company.com for help.');
            }
        }
    });

    $( "#DisplayAllAccountsPets" ).change(function() {
        if (this.value == "0") {
            document.getElementById("PetDisabled").disabled = true;
            document.getElementById("PetDisabled").checked = false;
            document.getElementById("DisplayPetName").disabled = true;
            document.getElementById("DisplayPetBreed").disabled = true;
            document.getElementById("DisplayGender").disabled = true;
            document.getElementById("UpdateAccountButton").disabled = true;
            document.getElementById("PetDisabledLabel").style.backgroundColor = "transparent";
            document.getElementById("DisplayPetName").value = "";
            document.getElementById("DisplayPetBreed").value = "1";
            document.getElementById("DisplayGender").selectedIndex.text = "--";
            document.getElementById("DisplayPetBreed").options.length = "1";
            document.getElementById("DisplayGender").options.length = "1";
        }else{
            document.getElementById("DisplayPetName").value = "";
            document.getElementById("DisplayPetBreed").options.length = "1";
            document.getElementById("DisplayGender").options.length = "1";
            var PetID = this.value;
            var Action = "FetchPetStatus";
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
                    DisplayPetDisabled(ResponseData);
                    var PetData = FetchPet(PetID);
                    var Breeds = FetchBreeds();
                    DisplayPetData(PetData,Breeds);
                }
            }catch(e){
                var ErrorMSG = e;
                var FailedAction = Action;
                AddError(FailedAction,ErrorMSG);
                alert('Oops, something broke.  Take note of the steps you took to get this error and email it to admin@company.com for help.');
            }
        }
    });

    $( "#AccountDisabled" ).change(function() {
        var DefaultValue = document.getElementById("HiddenValue1").value;
        if(DefaultValue == 1 && this.checked || DefaultValue == 0 && !this.checked){
            document.getElementById("AccountDisabledLabel").style.backgroundColor = "transparent";
            document.getElementById("UpdateAccountButton").disabled = true;
        }else{
            document.getElementById("AccountDisabledLabel").style.backgroundColor = "lightgreen";
            document.getElementById("UpdateAccountButton").disabled = false;
        }
    });

    $( "#PetDisabled" ).change(function() {
        var DefaultValue = document.getElementById("HiddenValue2").value;
        if(DefaultValue == 1 && this.checked || DefaultValue == 0 && !this.checked){
            document.getElementById("PetDisabledLabel").style.backgroundColor = "transparent";
            document.getElementById("UpdateAccountButton").disabled = true;
        }else{
            document.getElementById("PetDisabledLabel").style.backgroundColor = "lightgreen";
            document.getElementById("UpdateAccountButton").disabled = false;
        }
    });

    $( "#DisplayPetName" ).change(function() {
        var DefaultValue = document.getElementById("HiddenValue3").value;
        var NewValue = $(this).val();
        if(DefaultValue == NewValue){
            document.getElementById("DisplayPetName").style.backgroundColor = "transparent";
            document.getElementById("UpdateAccountButton").disabled = true;
        }else{
            document.getElementById("DisplayPetName").style.backgroundColor = "lightgreen";
            document.getElementById("UpdateAccountButton").disabled = false;
        }
        console.log("Prev value " + DefaultValue);
        console.log("New value " + NewValue);
    });

    $( "#UpdateAccountButton" ).click(function() {
        var AccountEmail = document.getElementById("HiddenValue1").value;
        var OldPetDisabled = document.getElementById("HiddenValue2").value;
        var OldName = document.getElementById("HiddenValue3").value;
        var OldBreedID = document.getElementById("HiddenValue4").value;
        var OldGender = document.getElementById("HiddenValue5").value;
        var NewPetDisabled = document.getElementById("HiddenValue2").value;
        var NewName = document.getElementById("HiddenValue3").value;
        var NewBreedID = document.getElementById("HiddenValue4").value;
        var NewGender = document.getElementById("HiddenValue5").value;
        try{

            var AjaxData = {
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
    });
});

function FetchBreeds(){
    var Action = "FetchBreeds";
    try{
        var AjaxData = {
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

function FetchPet(PetID){
    var Action = "FetchPet";
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

function DisplayAccountDisabled (ResponseData){
    document.getElementById("AccountDisabled").disabled = false;
    if(ResponseData.Disabled == 0){
        document.getElementById("AccountDisabled").checked = false;
        document.getElementById("HiddenValue1").value = 0;
    }else{
        document.getElementById("AccountDisabled").checked = true;
        document.getElementById("HiddenValue1").value = 1;
    }
}

function DisplayPetDisabled (ResponseData){
    document.getElementById("PetDisabled").disabled = false;
    if(ResponseData.Disabled == 0){
        document.getElementById("PetDisabled").checked = false;
        document.getElementById("HiddenValue2").value = 0;
    }else{
        document.getElementById("PetDisabled").checked = true;
        document.getElementById("HiddenValue2").value = 1;
    }
}

function DisplayPetData(PetData,Breeds){
    document.getElementById("DisplayAllAccountsPets").disabled = false;
    document.getElementById("DisplayPetBreed").disabled = false;
    document.getElementById("DisplayPetName").disabled = false;
    document.getElementById("DisplayGender").disabled = false;
    document.getElementById("HiddenValue3").value = PetData.Name;
    document.getElementById("HiddenValue4").value = PetData.BreedID;
    document.getElementById("HiddenValue5").value = PetData.Gender;
    document.getElementById("DisplayPetName").value  = PetData.Name;
    var select = document.getElementById("DisplayPetBreed");
    var i;
    for (i = 0; i < Breeds.length; i++) {
        if(Breeds[i].BreedID == PetData.BreedID){
            select.options[select.options.selectedIndex] = new Option(Breeds[i].Name, Breeds[i].BreedID);
        }else{
            select.options[select.options.length] = new Option(Breeds[i].Name, Breeds[i].BreedID);
        }
    }
    var select = document.getElementById("DisplayGender");
    if(PetData.Gender == "Boy"){
        select.options[select.options.selectedIndex] = new Option("Boy", "Boy");
        select.options[select.options] = new Option("Girl", "Girl");
    }else{
        select.options[select.options.selectedIndex] = new Option("Girl", "Girl");
        select.options[select.options] = new Option("Boy", "Boy");
    }
}

function DisplayPetBreeds(ResponseData){
    var select = document.getElementById("DisplayPetBreeds");
    var i;
    for (i = 0; i < ResponseData.length; i++) {
        select.options[select.options.length] = new Option(ResponseData[i].Name, ResponseData[i].BreedID);
    }
}

function FetchUserPets(Email){
    document.getElementById("DisplayAllAccountsPets").disabled = false;
    var AccountEmail = Email;
    var Action = "FetchUserPets";
    try{
        var AjaxData = {
            AccountEmail: AccountEmail,
            Action: Action
        };
        var ResponseData = JSON.parse(OutgoingAjax(AjaxData));
        console.log(ResponseData);
        if (ResponseData == "0") {
            alert("Your session either expired or you signed in somewhere else.  Please sign in again.");
            window.location = "/petsignin/";
        }else{
            DisplayUserPets(ResponseData);
        }
    }catch(e){
        var ErrorMSG = e;
        var FailedAction = Action;
        AddError(FailedAction,ErrorMSG);
        alert('Oops, something broke.  Take note of the steps you took to get this error and email it to admin@company.com for help.');
    }
}

function DisplayUserPets(ResponseData){
    var select = document.getElementById("DisplayAllAccountsPets");
    var i;
    for (i = 0; i < ResponseData.length; i++) {
        select.options[select.options.length] = new Option(ResponseData[i].Name, ResponseData[i].PetID);
    }
}

function DisplayAllAccounts(ResponseData){
    var select = document.getElementById("DisplayAllAccounts");
    var i;
    for (i = 0; i < ResponseData.length; i++) {
        select.options[select.options.length] = new Option(ResponseData[i].Email, ResponseData[i].Email);
    }
}

function DisplaySignInPet(ResponseData){
    var DisplaySignInPet = "";
    for (var i = 0; i < ResponseData.length; i++) {
        if (ResponseData[i].DiffDate == "0"){
            DisplaySignInPet += '<label class="btn btn-primary" disabled>';
        }else{
            DisplaySignInPet += '<label class="btn btn-primary">';
        }
        DisplaySignInPet += '<input type="radio" name="options" id="option1" autocomplete="off" value="' + ResponseData[i].Name + '">' + ResponseData[i].Name + '</button>';

        DisplaySignInPet += '</label>';
    }
    document.getElementById("DisplaySignInPet").innerHTML = DisplaySignInPet;
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

function AddError(FailedAction, ErrorMSG){
    var Action = "AddError";
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
    FetchUserPetsStatus();
    document.getElementById("SignOut").style.display="block";
    document.getElementById("SignOut").style.visibility="visible";
    document.getElementById("Account").style.display="block";
    document.getElementById("Account").style.visibility="visible";
    document.getElementById("ActivitiesButton").style.display="block";
    document.getElementById("ActivitiesButton").style.visibility="visible";
    document.getElementById("AddNewPetButton").style.display="block";
    document.getElementById("AddNewPetButton").style.visibility="visible";
}

function DisplayAdmin(){
    document.getElementById("SignOut").style.display="block";
    document.getElementById("SignOut").style.visibility="visible";
    document.getElementById("Account").style.display="block";
    document.getElementById("Account").style.visibility="visible";
    document.getElementById("ActivitiesButton").style.display="block";
    document.getElementById("ActivitiesButton").style.visibility="visible";
    document.getElementById("ErrorButton").style.display="block";
    document.getElementById("ErrorButton").style.visibility="visible";
    document.getElementById("AddPetButton").style.display="block";
    document.getElementById("AddPetButton").style.visibility="visible";
    document.getElementById("ManageAccountsButton").style.display="block";
    document.getElementById("ManageAccountsButton").style.visibility="visible";
}

function HideAll(){
    document.getElementById("SignOut").style.display="none";
    document.getElementById("SignOut").style.visibility="hidden";
    document.getElementById("Account").style.display="none";
    document.getElementById("Account").style.visibility="hidden";
    document.getElementById("ActivitiesButton").style.display="none";
    document.getElementById("ActivitiesButton").style.visibility="hidden";
    document.getElementById("ErrorButton").style.display="none";
    document.getElementById("ErrorButton").style.visibility="hidden";
    document.getElementById("AddPetButton").style.display="none";
    document.getElementById("AddPetButton").style.visibility="hidden";
    document.getElementById("ManageAccountsButton").style.display="none";
    document.getElementById("ManageAccountsButton").style.visibility="hidden";
}

function ValidateSession(){
    var Action = "ValidateSession";
    try{
        var AjaxData = {
            Action: Action
        };
        var ResponseData = JSON.parse(OutgoingAjax(AjaxData));
        console.log(ResponseData);
        if(ResponseData == "2"){
            DisplayAdmin();
        }else if(ResponseData == "1"){
            DisplayRUser();
        }else{
            DisplayUser();
        }
    }catch(e){
        var ErrorMSG = e;
        var FailedAction = Action;
        AddError(FailedAction,ErrorMSG);
        alert('Oops, something broke.  Take note of the steps you took to get this error and email it to admin@company.com for help.');
    }
}

function FetchSignInPet(){
    var Action = "FetchSignInPet";
    try{
        var AjaxData = {
            Action: Action
        };
        var ResponseData = JSON.parse(OutgoingAjax(AjaxData));
        if (ResponseData !== "") {
            DisplaySignInPet(ResponseData);
        }
    }catch(e){
        var ErrorMSG = e;
        var FailedAction = Action;
        AddError(FailedAction,ErrorMSG);
        alert('Oops, something broke.  Take note of the steps you took to get this error and email it to admin@company.com for help.');
    }
}

function DisplayActivities(ResponseData){
    var DisplayActivities = '<thead><tr><th>Activities</th><th>Date</th></tr></thead><tbody>';
    for (var i = 0; i < ResponseData.length; i++) {
        DisplayActivities += '<tr><td>' + ResponseData[i].ActivityMSG + '</td><td>' + ResponseData[i].LogDate + '</td></tr>';
    }
    DisplayActivities += '</tbody>';
    document.getElementById("DisplayActivities").innerHTML = DisplayActivities;
}

function DisplayErrors(ResponseData){
    var DisplayErrors = '<thead><tr><th>Account</th><th>Action</th><th>Error Message</th><th>Date</th></tr></thead><tbody>';
    for (var i = 0; i < ResponseData.length; i++) {
        DisplayErrors += '<tr><td>' + ResponseData[i].Email +  '<tr><td>' + ResponseData[i].Action + '<tr><td>' + ResponseData[i].ErrorMSG + '</td><td>' + ResponseData[i].LogDate + '</td></tr>';
    }
    DisplayErrors += '</tbody>';
    document.getElementById("DisplayError").innerHTML = DisplayErrors;
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