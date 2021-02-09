window.onload = function () {

    //add project & reviewer

    var ico_add_project = document.getElementById("ico_add_project");
    var btn_add_pj = document.getElementById("btn_add_pj");
    var ico_add_reviewer = document.getElementById("ico_add_reviewer");
    var btn_add_rv = document.getElementById("btn_add_rv");

    btn_add_pj.onmouseover = function () {
        console.log("mouseover detected");
        ico_add_project.setAttribute("src", "../image/add_2.png");
    }
    btn_add_pj.onmouseout = function () {
        console.log("mouseout detected");
        ico_add_project.setAttribute("src", "../image/add.png");
    }
    //modal 창 열기 _ make new project
    const modal_pj = document.querySelector(".modal");
    const overlay = modal_pj.querySelector(".modal_overlay");
    const submitBtn = modal_pj.querySelector("#btn_create_project");
    
    // invite new reviewer
    const modal_rv = document.querySelector("#invite");
    const sendBtn = modal_rv.querySelector("#btn_send");
    
    // Pop up modal for creating 'New project' 
    const openNewProject = () =>{
        modal_pj.classList.remove("hidden");
    }

    //Create a new Project
    const submitModal =() =>{
        modal_pj.classList.add("hidden");
        modal_pj.style.zIndex=2;
        modal_rv.style.zIndex=1;
    }
    
    btn_add_pj.addEventListener("click", openNewProject);
    overlay.addEventListener("click", submitModal);
    submitBtn.addEventListener("click", submitModal);

    btn_add_rv.onmouseover = function () {
        console.log("mouseover detected");
        ico_add_reviewer.setAttribute("src", "../image/add_2.png");
    }
    btn_add_rv.onmouseout = function () {
        console.log("mouseout detected");
        ico_add_reviewer.setAttribute("src", "../image/add.png");
    }



    const openInvitation = () =>{
        modal_rv.classList.remove("hidden");
    }

    btn_add_rv.addEventListener("click", openInvitation);


    const closeModal =() =>{
        modal_rv.classList.add("hidden");
    }
    
    //close modal 
    overlay.addEventListener("click", closeModal);
    sendBtn.addEventListener("click", closeModal);
}