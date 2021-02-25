var user_name = "유저"; // firebase에서 값 받아와서 저장
var team_name = "team";
var first_read = true;  //데이터를 처음 읽어오는지

var comment=false;
var folder_list=true;

// var count = 0; //annotation의 개수를 카운트
var folder_name;
var comment_list_div;
var count = 0;
var add_folder_isClicked = false;
var pressed = document.getElementById("OK_btn");

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
        if(first_read) {
            setTimeout(() => { 
                if(data.val().teamName == team_name) {
                    var li = document.createElement("li");
                    li.onclick = function() {
                        alert(data.val().projectName);
                    }
                    var a = document.createElement("a");
                    a.setAttribute("href","####");
                    a.innerHTML = data.val().projectName;
                    document.getElementById("group-2").nextSibling.nextSibling.nextSibling.nextSibling.appendChild(li);
                    li.appendChild(a);
                } }, 500);
        }
        else {
            if(data.val().teamName == team_name) {
                var li = document.createElement("li");
                li.onclick = function() {
                    alert(data.val().projectName);
                }
                var a = document.createElement("a");
                a.setAttribute("href","####");
                a.innerHTML = data.val().projectName;
                document.getElementById("group-2").nextSibling.nextSibling.nextSibling.nextSibling.appendChild(li);
                li.appendChild(a);
            }
        }

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
        window.alert("프로젝트", projectName, "가 생성 되었습니다.");

        var projectRef = firebase.database().ref("Project/");
        
        projectRef.child(projectName).set({
            HostName: user_name,
            projectName: projectName,
            teamName: team_name,
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
		 console.log("1");
		 onClick();
		 console.log("2");
	 });

	// 새 파일 생성하는 팝업 창 내 창 닫기 버튼
    document.querySelector('.modal_close').addEventListener('click', offClick);
	
	// 팝업 창 내 업로드 버튼 클릭 -> 새 파일 생성, 팝업 창 닫힘
	document.getElementById("OK_btn").addEventListener("mousedown", function(){   
		count++; // 생성되는 파일 갯수 카운트
        upload();
        setTimeout(()=>{
            add_folder(count); 
		add_folder(count); 
            add_folder(count); 
        },3000);
		offClick(); 
    });
	
    var file = document.getElementById('new_file'); // 팝업에서 입력한 파일 값을 받아옴 - 파베 저장
    file.addEventListener('change', e => {
        selectedFile = e.target.files[0];
        fullFileName = selectedFile.name;
        console.log("파싱전: " + fullFileName);
        var fileNameSplit = fullFileName.split('.');
        fileName = fileNameSplit[0];
        fileExt = fileNameSplit[1];
        console.log("file name is : " + fileName +", file Extension is : " + fileExt); 
    });
	
	var pressed = document.getElementById("OK_btn");
	pressed.addEventListener(count, add_folder);
}


// 새 파일 생성 함수
var add_folder  = function (count) {
	console.log("count is " + count);
	folder_name = document.getElementById('folder_name').value; // 팝업에서 입력한 파일 명을 받아옴 - 파베 저장
	console.log("folder_name is " + folder_name);

	// //파일 경로.
	// var filePath = file.value;
	// //전체경로를 \ 나눔.
	// var filePathSplit = filePath.split('\\'); 
	// //전체경로를 \로 나눈 길이.
	// var filePathLength = filePathSplit.length;
	// //마지막 경로를 .으로 나눔.
	// var fileNameSplit = filePathSplit[filePathLength-1].split('.');
	// //파일명 : .으로 나눈 앞부분
	// var fileName = fileNameSplit[0];
	// //파일 확장자 : .으로 나눈 뒷부분
	// var fileExt = fileNameSplit[1];
	// //파일 크기
	// var fileSize = file.files[0].size;

	// console.log('파일 경로 : ' + filePath);
	// console.log('파일명 : ' + fileName);
	// console.log('파일 확장자 : ' + fileExt);
	// console.log('파일 크기 : ' + fileSize);

	// 새 파일 동적 생성
	
	var new_td = document.createElement('td');
	new_td.classList.add("new_td");
	document.getElementById('folder_column').appendChild(new_td);
	
	var new_div = document.createElement('div');
	new_div.classList.add("new_div");
	new_td.appendChild(new_div);


	// 이미지 생성(thumbnail)
    console.log("--------------이미지 불러오기-------------")
    var new_image = document.createElement('img');
    new_image.classList.add("new_image");
    storageRef.child(image_storage_address + fileName).getDownloadURL().then((url)=>{
        console.log("download url is: "+url );
        new_image.setAttribute('src',url);
    });

	//new_image.setAttribute('src', '../image/folder.png');
	new_div.appendChild(new_image);
	
	var new_p = document.createElement('p');
	new_p.classList.add("new_p");
	new_p.innerHTML = folder_name;
	new_td.appendChild(new_p);
	
	
	
	console.log("new_file_list");
}

function upload() {
    image_storage_address = "Image/".concat(projectName + "/");

    storageRef  
        .child(image_storage_address + fileName)
        .put(selectedFile)
        .on('state_changed', snapshot => {
            console.log(snapshot)
        }, error => {
            console.log(error);
        }, () => {
            console.log('파일 업로드 성공: 파이어베이스-스토리지');
            //firebase realtime databse 내 프로젝트 > 파일명() or key 값으로 저장하는 코드 작성. (key -->push) 
            var path = projectName + "/Images/" + fileName;
            console.log(path);
            projectRef
                .child(path)
                .set({
                    Date: "date",
                    Status: "needs review",
                    User: "UID",
                    FileName: fileName,
                    FileExt: fileExt,
                    Annotations: "annotation 1",
                    Link: "link~!@!"
                });
        });
}
