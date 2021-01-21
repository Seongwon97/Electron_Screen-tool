user = { 
    companyName: '',
    domain: '',
    email: '',
    pw:'',
    rePw:''
}

function signUp(){
    // 유저 객체에 회원가입 정보 저장
    user.companyName = document.getElementById("companyName");
    user.domain = document.getElementById("domain");
    user.email = document.getElementById("email");
    user.pw = document.getElementById("pw");
    
    var email = document.getElementById("email").value;
    var password = document.getElementById("pw").value;
    
    
    // [START auth_signup_password]
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((user) => {
        // Signed in 
        // ...

        window.alert("파이어베이스 연동 성공"+"Email: " + userEmail + "Password: " + password +"정보로 회원가입에 성공하였습니다.");
        location.href="../html/login.html"

      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorMessage == "userEmail is not defined"){
          window.alert("회원가입 성공" +  " E-mail: "+ email );
          location.href="../html/login.html"
        }
        else 
        window.alert("파베 연동 실패" + "Error: " + errorMessage+ "E-mail: "+ email );
             // ..
      });
    // [END auth_signup_password]
}

firebase.auth().onAuthstateChanged(function (user){
    if(user){
        location.href="../html/login.html"
    }
})

// function test1(){
//     window.alert("function test1");
// }