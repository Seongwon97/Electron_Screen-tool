var user_name = "유저"; // firebase에서 값 받아와서 저장
var team_name = "team";
var comment=false;
var folder_list=true;
var current_project_name;
var first_print = true;

var count = 0; 
var folder_name;
var comment_list_div;



var add_folder_isClicked = false;
var pressed = document.getElementById("OK_btn");
var newDiv;
var send_data;

// josh 0225
let selectedFile;
var fullFileName;
var fileName;
var fileExt;
var projectName;
var fileLink;
var image_storage_address;


const storageRef = firebase.storage().ref();
const databaseRef = firebase.database().ref();
const projectRef = firebase.database().ref("Project/");



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
                    team_name = data.val().companyName;
                    document.getElementById("company_name").innerHTML = team_name;
                    if (data.val().name.length >= 2) {
                        document.getElementById("user_icon").innerHTML = data.val().name.substring(1, 3);
                        //이름이 3글자일 경우만 생각했다. 영어 이름이나 4글자부터는 다시 지정해야함.
                    }
                    else {
                        document.getElementById("user_icon").innerHTML = data.val().name
                    }
                }
            });
            snapshot.forEach(function (data) {
                if(data.val().email != firebase.auth().currentUser.email) {
                    if (data.val().companyName == team_name) {
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

    project_list_ref = firebase.database().ref("Project/");

    project_list_ref.on('child_added', function(data) {
        setTimeout(() => { 
            if(data.val().teamName == team_name) {

                var li = document.createElement("li");
                li.onclick = function() {
                    first_print = true;
                    current_project_name = data.val().projectName;
                    print_project_image();
                    document.getElementById("projectName").innerHTML = current_project_name;
                }
                

                var a = document.createElement("a");
                a.setAttribute("href","####");
                a.innerHTML = data.val().projectName;
                document.getElementById("group-2").nextSibling.nextSibling.nextSibling.nextSibling.appendChild(li);
                li.appendChild(a);
            } }, 500);
    })

    //add project & member

    var ico_add_project = document.getElementById("ico_add_project");
    var btn_add_pj = document.getElementById("btn_add_pj");
    var ico_add_member = document.getElementById("ico_add_member");
    var btn_add_rv = document.getElementById("btn_add_rv");


    // button hovering effect
    btn_add_pj.onmouseover = function () {
        ico_add_project.setAttribute("src", "../image/add_2.png");
    }
    btn_add_pj.onmouseout = function () {
        ico_add_project.setAttribute("src", "../image/add.png");
    }
    btn_add_rv.onmouseover = function(){
        ico_add_member.setAttribute("src", "../image/add_2.png");
    }
    btn_add_rv.onmouseout = function () {
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
        projectName = project_name.value;
        window.alert("프로젝트"+ projectName+ "가 생성 되었습니다.");
        
        var projectRef = firebase.database().ref("Project/");
        
        projectRef.child(projectName).set({
            HostName: user_name,
            projectName: projectName,
            teamName: team_name,
        });


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
        event.stopPropagation();
        $(this).next().slideToggle();
    });

    $(document).click(function(){
        $('.ul_dropdown').hide();
    });


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

    //  영억 외 선택 시 팝업 창 닫기
    document.querySelector('.black_bg').addEventListener("click", offClick);
	
	// 새 파일 생성하기 버튼 클릭 -> 팝업 창 열림
	document.getElementById("new_file_btn").addEventListener("click", function(){   
		 onClick();
	 });

	// 새 파일 생성하는 팝업 창 내 창 닫기 버튼
    document.querySelector('.modal_close').addEventListener('click', offClick);
	
	// 팝업 창 내 업로드 버튼 클릭 -> 새 파일 생성, 팝업 창 닫힘
	document.getElementById("OK_btn").addEventListener("mousedown", function(){   
		first_print = false;   
        upload();
		offClick(); 
    });
	
    var file = document.getElementById('new_file'); // 팝업에서 입력한 파일 값을 받아옴 - 파베 저장
    file.addEventListener('change', e => {
        selectedFile = e.target.files[0];
        fullFileName = selectedFile.name;
        var fileNameSplit = fullFileName.split('.');
        fileName = fileNameSplit[0];
        fileExt = fileNameSplit[1];
    });

	
	// send_data = function (newDiv) { 
	// 	newDiv.addEventListener("click", function(){ 
	// 	folderName = folder_name;
	// 	location.href="editing.html?" + projectName + "/" + folderName;
	//   });
	// }
	

}

// newDiv = new_div;

// 	if (newDiv){
// 		console.log("new_div exists");
// 		send_data(newDiv);
// 	}


function upload() {
    image_storage_address = "Image/".concat(current_project_name + "/");

    storageRef.child(image_storage_address + fileName).put(selectedFile).on('state_changed', snapshot => {
            console.log(snapshot)
        }, error => {
            console.log(error);
        }, () => {
            console.log('파일 업로드 성공: 파이어베이스-스토리지');
            //firebase realtime databse 내 프로젝트 > 파일명() or key 값으로 저장하는 코드 작성. (key -->push) 
            var path = current_project_name + "/Images/" + fileName;
            console.log(path);
            image_name = document.getElementById('folder_name').value;
            projectRef.child(path).set({
                    Date: new Date().toLocaleString(),
                    Status: "needs review",
                    Author: user_name,
                    FileName: fileName,
                    FileExt: fileExt,
                    imageName: image_name,
                    Link: "link~!@!"
                });
                //file name은 파일의 진짜 이름, image name은 출력용 이름
        });
}

function print_project_image() {
    for (var i = 0; i < count; i++) {
        var image_div = document.getElementById("image_list" + i);
        document.getElementById('folder_column').removeChild(image_div);
    }
    count = 0;

    ref = firebase.database().ref("Project/" + current_project_name + "/Images/");
    ref.on('child_added', function(data) {
            var new_td = document.createElement('td');
            new_td.id = "image_list" + count;
            count++;
            new_td.classList.add("new_td");
            document.getElementById('folder_column').appendChild(new_td);
            
            var new_div = document.createElement('div');
            new_div.classList.add("new_div");
            new_td.appendChild(new_div);

            new_div.onclick = function() {
		        location.href="editing.html?" + current_project_name + "/" + data.val().FileName;
            }


            // 이미지 생성(thumbnail)
            var new_image = document.createElement('img');
            new_image.classList.add("new_image");

            image_storage_address = "Image/".concat(current_project_name + "/");
            storageRef.child(image_storage_address + data.val().FileName).getDownloadURL().then((url)=>{
                new_image.setAttribute('src',url);
            });

            new_div.appendChild(new_image);
            
            var new_p = document.createElement('p');
            new_p.classList.add("new_p");
            new_p.innerHTML = data.val().imageName;
            new_td.appendChild(new_p);
    })

}