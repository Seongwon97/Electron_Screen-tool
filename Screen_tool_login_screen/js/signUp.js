const { powerSaveBlocker } = require("electron");
var database = firebase.database().ref('users');

const auth = firebase.auth();

function signUp(){
    var companyName=document.getElementById("companyName").value;
    var domain=document.getElementById("domain").value;
    var email=document.getElementById("email").value;
    var password=document.getElementById("pwd").value;
    var retype_password=document.getElementById("rePwd").value;
    
    
    var userinfo=database.push();
    userinfo.set({
        companyName:companyName,
        domain:domain,
        email:email,
        password:password
    });
    
    
    /*
    const promise = auth.createUserWithEmailAndPassword(email,password);
    promise.catch(e => alert(e.message));


    firebase.database().ref('users/' + email).set({
        companyName:companyName,
        domain:domain,
        email:email,
        password:password
    });*/
    alert("signed in");    
} 