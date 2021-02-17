function signUp() {    
    var email = document.getElementById("email").value;
    var password = document.getElementById("pw").value;
    var verifyPw = document.getElementById("rePw").value;
    var companyName = document.getElementById("companyName").value;
    var name = document.getElementById("name").value;
    
    var check = document.getElementsByName('agree');
    var isChecked = false;
    for(var i = 0; i < check.length; i++) {
        if(check[i].checked) {
            isChecked = true;
        }
        else {
            isChecked = false;
        }
    }


    if ((email.length > 1) && (password.length > 1) && (verifyPw.length > 1) && (companyName.length > 1) && 
        (name.length > 1) && (password == verifyPw) && isChecked) {
        firebase.auth().createUserWithEmailAndPassword(email, password).then(function() {
                // Signed in ...
            var rootRef = firebase.database().ref('User/');
            rootRef.push({
                name: name,
                email: email,
                password: password,
                companyName: companyName     
            });
            alert("회원가입에 성공하였습니다.");
            setTimeout(function(){
                firebase.auth().signOut();
                window.location.href = '../html/login.html';},500);
        }).catch(function(error){
            if(password.toString().length <=5){
                alert("비밀번호를 6자리 이상 입력해주세요.");
            }
            else {
                alert("이미 가입된 이메일입니다.");
            }
            });
    } 
    else{
        if(password!=verifyPw){
            alert("비밀번호를 다시 입력해주세요.");
        }
        else if (!isChecked) {
            alert("모든 약관에 동의해 주세요.");
        }
        else{
            alert("정보를 정확하게 입력해주세요.");
        }
      }
    
}
