var user_name = "유저"; // firebase에서 값 받아와서 저장
window.onload = function () {

    windowHeight = window.innerHeight;
    var right_aside_content = document.getElementById("member_content");
    right_aside_content.style.height = windowHeight -158;


    firebase.auth().onAuthStateChanged(function(user){
        if(user){
        var ref = firebase.database().ref("User/");
        ref.on("value", function (snapshot) {
            snapshot.forEach(function (data) {
                if(data.val().email == firebase.auth().currentUser.email) {
                    user_name = data.val().name;
                    document.getElementById("setting_user_name").innerHTML = user_name;
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
                else {
                    var member_list_div = document.createElement('div');
                    member_list_div.classList.add("comment_list");
                    document.getElementById('member_content').appendChild(member_list_div);

                    //member name
                    var member_icon_name = document.createElement('div');
                    member_icon_name.style.display = 'inline-block';
                    member_list_div.appendChild(member_icon_name);

                    var member_icon = document.createElement('img');
                    member_icon.classList.add("member_icon");
                    member_icon.setAttribute('src', '../image/icon_temp.png');
                    member_icon_name.appendChild(member_icon);

                    var member_name = document.createElement('div');
                    member_name.innerHTML = data.val().name;
                    member_name.classList.add("member_name");
                    member_icon_name.appendChild(member_name);

                    //email
                    var member_email_div = document.createElement('div');
                    member_email_div.classList.add("member_email_phone_div");
                    member_list_div.appendChild(member_email_div);

                    var member_email_icon = document.createElement('img');
                    member_email_icon.classList.add("member_email_phone_icon");
                    member_email_icon.setAttribute('src', '../image/email.png');
                    member_email_div.appendChild(member_email_icon);

                    var member_email = document.createElement('div');
                    member_email.classList.add("member_email_phone_text");
                    member_email.innerHTML = data.val().email;
                    member_email_div.appendChild(member_email);
                    
                    //phone
                    var member_tel_div = document.createElement('div');
                    member_tel_div.classList.add("member_email_phone_div");
                    member_list_div.appendChild(member_tel_div);

                    var member_tel_icon = document.createElement('img');
                    member_tel_icon.classList.add("member_email_phone_icon");
                    member_tel_icon.setAttribute('src', '../image/phone.png');
                    member_tel_div.appendChild(member_tel_icon);

                    var member_tel = document.createElement('div');
                    member_tel.classList.add("member_email_phone_text");
                    member_tel.innerHTML = "010-0000-0000";
                    member_tel_div.appendChild(member_tel);
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




    //add project & member

    var ico_add_project = document.getElementById("ico_add_project");
    var btn_add_pj = document.getElementById("btn_add_pj");
    var ico_add_member = document.getElementById("ico_add_member");
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
        ico_add_member.setAttribute("src", "../image/add_2.png");
    }
    btn_add_rv.onmouseout = function () {
        console.log("mouseout detected");
        ico_add_member.setAttribute("src", "../image/add.png");
    }


    //make new project
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
        var project_name = document.getElementById("project_name");
        var projectName = project_name.value;
        window.alert("project가 생성 되었습니다." + projectName);
        
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.setAttribute("href","####");
        a.innerHTML = projectName;
        
        document.getElementById("group-2").nextSibling.nextSibling.nextSibling.nextSibling.appendChild(li);
        li.appendChild(a);
        
        //firebase 프로젝트 객체 생성
        var projectRef = firebase.database().ref("Project/");
        
        projectRef.child(projectName).set({
            HostName: user_name,
            projectName: projectName,
            Images: "images",
            Members: "members"
        });


        project_name.value=null;
        closeModal();
    }
    overlay_pj.addEventListener("click", closeModal);
    submitBtn.addEventListener("click", createProject);
    $('.X').click(closeModal);

    
    //make new member
    const modal_rv = document.getElementById("modal_invite");
    if(modal_rv != null){
        console.log("success: get Element of modal_rv");    
    }
    const overlay_rv = modal_rv.querySelector(".modal_overlay");
    const sendBtn = modal_rv.querySelector("#btn_send");
    const member_email = document.getElementById("member_email");
    const invitation_comment=document.getElementById("invitation_comment");

    const openInvitation = () =>{    
        modal_rv.classList.remove("hidden");
    }
    btn_add_rv.addEventListener("click", openInvitation);

    //close modal 
    overlay_rv.addEventListener("click", closeModal);
    sendBtn.addEventListener("click", function(){
        member_email.value=null;
        invitation_comment.value=null;
        closeModal();
    });

    $('.btn_dropdown').click(function(event){
        console.log("detected");
        event.stopPropagation();
        $(this).next().slideToggle();
    });

    $(document).click(function(){
        $('.ul_dropdown').hide();
    });

    var filter_menu = new Array(4);
    for(var i=0; i<filter_menu.length; i++){
        filter_menu[i] = $('#filter').children().eq(i);
        console.log(filter_menu[i]);
    }

}

