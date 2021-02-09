console.log('From index.js');

function login() {

    var userEmail = document.getElementById("userEmail").value;
    var userPass = document.getElementById("userPW").value;

    firebase
        .auth()
        .signInWithEmailAndPassword(userEmail, userPass)
        .then((user) => {
            // Signed in ...
            window.alert("login success \n" +"E-mail: " + userEmail + " / Password: " + userPass);
            location.href="../html/main.html"
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;

            window.alert("Error : " + errorMessage);
        });

}

$('body').on('click', '#messages-view a', (event) => {
    event.preventDefault();
    let link = event.target.href;
    require("electron").shell.openExternal(link);
  });