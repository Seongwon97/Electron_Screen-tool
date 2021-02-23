var user_name = "유저"; // firebase에서 값 받아와서 저장

var comment=false;
var folder_list=true;

var count = 0; //annotation의 개수를 카운트
var folder_name;
var comment_list_div;


var count = 1;

var add_folder_isClicked = false;
var pressed = document.getElementById("OK_btn");

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

	// 새 파일 생성하는 팝업 창 열기
	function onClick() {
		console.log("clicked");
        document.querySelector('.modal_wrap').style.display ='block';
        document.querySelector('.black_bg').style.display ='block';

    }   
	// 새 파일 생성하는 팝업 창 닫기
    function offClick() {
        document.querySelector('.modal_wrap').style.display ='none';
        document.querySelector('.black_bg').style.display ='none';

    }
	
	// 새 파일 생성하기 버튼 클릭 -> 팝업 창 열림
	document.getElementById("new_file_btn").addEventListener("click", function(){   
		 console.log("1");
		 onClick();
		 console.log("2");
	 });

	// 새 파일 생성하는 팝업 창 내 창 닫기 버튼
    document.querySelector('.modal_close').addEventListener('click', offClick);
	
	// 팝업 창 내 업로드 버튼 클릭 -> 새 파일 생성, 팝업 창 닫힘
	document.getElementById("OK_btn").addEventListener("mousedown", function(){   
		count++; // 생성되는 파일 갯수 카운트
		add_folder(count); 
		offClick(); 
    });
	
	
	var pressed = document.getElementById("OK_btn");
	pressed.addEventListener(count, add_folder);
}

// 새 파일 생성
var add_folder  = function (count) {
	console.log("count is " + count);
	folder_name = document.getElementById('folder_name').value; // 팝업에서 입력한 파일 명을 받아옴
	console.log("folder_name is " + folder_name);
	
	var file = document.getElementById('new_project_filechoose_btn');
	//파일 경로.
	var filePath = file.value;
	//전체경로를 \ 나눔.
	var filePathSplit = filePath.split('\\'); 
	//전체경로를 \로 나눈 길이.
	var filePathLength = filePathSplit.length;
	//마지막 경로를 .으로 나눔.
	var fileNameSplit = filePathSplit[filePathLength-1].split('.');
	//파일명 : .으로 나눈 앞부분
	var fileName = fileNameSplit[0];
	//파일 확장자 : .으로 나눈 뒷부분
	var fileExt = fileNameSplit[1];
	//파일 크기
	var fileSize = file.files[0].size;

	console.log('파일 경로 : ' + filePath);
	console.log('파일명 : ' + fileName);
	console.log('파일 확장자 : ' + fileExt);
	console.log('파일 크기 : ' + fileSize);

	document.getElementById("folder_column").innerHTML +=
		'<td class="new_td" id="new_td"><div class="new_div" id="new_div"> <img src = "../image/folder.png" class="new_image"></div> <p class="new_p" id="new_p">' + folder_name + '</p></td>';
	
	console.log("new_file_list");
}


