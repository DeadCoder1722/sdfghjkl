const   btnCreateAccount = document.getElementById('createAccount');
const   createEmail = document.getElementById('createEmail');
const   createPassword = document.getElementById('createPassword');
const   confirmPassword = document.getElementById('confirmPassword')
const   btnLogin = document.getElementById('btnLogin');
const   loginEmail = document.getElementById('loginEmail');
const   loginPassword = document.getElementById('loginPassword');
let     userID;

function loginToggle(){
    $('#access').addClass('hidden');
    $('#account').addClass('hidden');
    $('#login').removeClass('hidden');
}

function createToggle(){
    $('#access').addClass('hidden');
    $('#account').removeClass('hidden');
    $('#login').addClass('hidden');
}

function giveAccess(){
    $('#accessWall').removeClass('hidden');
    $('#verified').removeClass('hidden');
    $('#verification').addClass('hidden');
}

function logout(){
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
    }).catch(function(error) {
        // An error happened.
    });
}

btnCreateAccount.addEventListener('click', e => {
    let     email = createEmail.value;
    if (createPassword.value === confirmPassword.value){
        firebase.auth().createUserWithEmailAndPassword(email, createPassword.value).then(function(e){
            console.log(e);
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
        });
    }
});

btnLogin.addEventListener('click', e => {
    let email = loginEmail.value;
    let password = loginPassword.value;

    
    firebase.auth().signInWithEmailAndPassword(email, password).then(function(e){
        giveAccess();
    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        console.log(errorCode+' '+errorMessage);
    });
      
});

firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser){
        userID = firebaseUser.uid;
        giveAccess();
    } else {
        $('#accessWall').addClass('hidden');
    }
});

