const { powerSaveBlocker } = require("electron");

//declare databse 
const database = firebase.database();
const rootRef = database.ref("users");

// //delcare user's info
// var companyName, name, email, password, uid;


function signUp() {    
    var email = document.getElementById("email").value;
    var password = document
        .getElementById("pw")
        .value;
    var verifyPw = document
        .getElementById("rePw")
        .value;

    var companyName = document.getElementById("companyName").value;
    var name = document.getElementById("name").value;

    if (password == verifyPw) {
        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then((user) => {
                // Signed in ...
                window.alert(
                    "파이어베이스 연동 성공Email: " + userEmail + "Password: " + password + "정보로 회원가입에 성공하였습니" +
                    "다."
                );
                location.href = "../html/login.html"
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorMessage == "userEmail is not defined") {
                    user = firebase.auth().currentUser;
                    uid = user.uid;
                    window.alert("회원가입 성공 E-mail: " + email + " Assigned UID is " + uid +"companyName = " + companyName + "name = " + name);
                    rootRef.child(uid).set({
                            UID: uid,
                            companyName: companyName,
                            name: name,
                            email: email
                        });
                    location.href = "../html/login.html";
                    } else 
                    window.alert("파베 연동 실패Error: " + errorMessage + "E-mail: " + email);
                }
            );
    } else {
        window.alert("비밀번호가 일치하지 않습니다.");
    }
}

// firebase
//     .auth()
//     .onAuthstateChanged(function (user) {
//         if (user) {
//             location.href = "../html/login.html"
//         }
//     });

// function test1(){     window.alert("function test1"); }