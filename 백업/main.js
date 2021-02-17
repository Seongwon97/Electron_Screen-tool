window.onload = function () {

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
    const closeModal =() =>{
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