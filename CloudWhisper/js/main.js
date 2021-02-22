var user_name = "유저"; // firebase에서 값 받아와서 저장
window.onload = function () {
    firebase.auth().onAuthStateChanged(function(user){
        if(user){
        var ref = firebase.database().ref("User/");
        ref.on("value", function (snapshot) {
            snapshot.forEach(function (data) {
                if(data.val().email == firebase.auth().currentUser.email){
                    document.getElementById("setting_user_name").innerHTML = data.val().name;
                    document.getElementById("email").innerHTML = data.val().email;
                    document.getElementById("company_name").innerHTML = data.val().companyName;
                    if (data.val().name.length >= 2) {
                        document.getElementById("user_icon").innerHTML = data.val().name.substring(1, 3);
                        //이름이 3글자일 경우만 생각했다. 영어 이름이나 4글자부터는 다시 지정해야함.
                    }
                    else {
                        document.getElementById("user_icon").innerHTML = data.val().name
                    }
                }
            });
        });
        }
    });
    document.getElementById("logout_btn").onclick = function() {
        logout();
    }
    document.getElementById("user_icon").onclick = function() {
        if($('#setting').css('display') == 'none'){
            $('#setting').show();
          } else{
            $('#setting').hide();
          }
    }

    


    //add project & reviewer

    var ico_add_project = document.getElementById("ico_add_project");
    var btn_add_pj = document.getElementById("btn_add_pj");
    var ico_add_reviewer = document.getElementById("ico_add_reviewer");
    var btn_add_rv = document.getElementById("btn_add_rv");


    // button hovering effect
    btn_add_pj.onmouseover = function () {
        console.log("mouseover detected");
        ico_add_project.setAttribute("src", "../image/add_2.png");
    }
    btn_add_pj.onmouseout = function () {
        console.log("mouseout detected");
        ico_add_project.setAttribute("src", "../image/add.png");
    }
    btn_add_rv.onmouseover = function(){
        console.log("mouseover detected");
        ico_add_reviewer.setAttribute("src", "../image/add_2.png");
    }
    btn_add_rv.onmouseout = function () {
        console.log("mouseout detected");
        ico_add_reviewer.setAttribute("src", "../image/add.png");
    }

    /*
      ###################################################################
      ################ Modal_make new project & reviewer ################
      ###################################################################
    */

    //modal 창 열기 _ make new project
    const modal_pj = document.getElementById("modal_project");
    const overlay_pj = modal_pj.querySelector(".modal_overlay");
    const submitBtn = modal_pj.querySelector("#btn_create_project");

    const openNewProject = () =>{
        modal_pj.classList.remove("hidden");
    }
    btn_add_pj.addEventListener("click", openNewProject);
    
    //close modal
    function closeModal() {
        modal_pj.classList.add("hidden");
        modal_rv.classList.add("hidden");
    }
    
    const createProject = () =>{
        // #TBU : firebase 프로젝트 객체 생성
        var project_name = document.getElementById("project_name");
        var projectName = project_name.value;
        window.alert("project가 생성 되었습니다." + projectName);

        var li = document.createElement("li");
        var a = document.createElement("a");
        a.setAttribute("href","####");
        a.innerHTML = projectName;

        document.getElementById("group-2").nextSibling.nextSibling.nextSibling.nextSibling.appendChild(li);
        li.appendChild(a);

        // console.log(temp);


        project_name.value=null;
        closeModal();
    }
    overlay_pj.addEventListener("click", closeModal);

    submitBtn.addEventListener("click", createProject);

    
    //modal 창 열기 _ make new reviewer

    const modal_rv = document.getElementById("modal_invite");
    if(modal_rv != null){
        console.log("success: get Element of modal_rv");    
    }
    const overlay_rv = modal_rv.querySelector(".modal_overlay");
    const sendBtn = modal_rv.querySelector("#btn_send");
 
    const openInvitation = () =>{    
        modal_rv.classList.remove("hidden");
    }

    btn_add_rv.addEventListener("click", openInvitation);

    //close modal 
    overlay_rv.addEventListener("click", closeModal);
    sendBtn.addEventListener("click", closeModal);
}

