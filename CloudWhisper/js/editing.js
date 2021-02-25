const storageRef = firebase.storage().ref();
var lastEvent;
var isMouseDown = false;
var line=false;
var square=false;
var circle=false;
var arrow=false;
var comment=false;

var file_list=false;        //오른쪽에 file list를 보일지 comment _list를 보일지 알려주는 변수
var comment_list=true;

var sx, sy;                  // 드래그 시작점, 드래그 끝점(캔버스 좌표)
var ex, ey;                  
var screen_sx, screen_sy;      // 드래그 시작점, 드래그 끝점(전체 화면의 좌표)
var screen_ex, screen_ey;

var rec_width;          //사각형을 그릴때 사용되는 width,height
var rec_height;

var cir_center_x;       //원의 중심점, 반지름
var cir_center_y;
var cir_radius;

var x, y, scale; //canvas에서 사진의 위치 및 크기 조정을 위한 변수

var line_color; //line의 색과 넓이를 담을 변수
var line_width = 5;

var page_load = true; //데이터를 읽어올때 페이지를 처음 로드했는지 아닌지 구분
var first_read = true;  //데이터를 처음 읽어오는지
var annotation =[]; //firebase에서 annotation의 값을 받아와서 저장할 array
var count = 0; //annotation의 개수를 카운트
var del_count = 0; //삭제된 annotation의 개수
var comment_content = ""; //comment의 내용을 담을 변수
var user_name = "유저"; // firebase에서 값 받아와서 저장
var project_name;
var image_name;
var annoRef; //파이어베이스에 저장될 주소가 저장되는 변수
var key = []; //annotation key를 저장하는 변수

var windowHeight = 0;
var img;
var context;
var isClicked = -1; //click된 annotation이 있는지, 없으면 -1, 있으면 해당 annotaion의 번호
var possible = true; //annotation을 그리고 코멘트 컨펌을 했는지 안했는지~
                    //컨펌이 안됐다면 다음 그림 그리기 불가.
var toDelete = false; //화면 위에 comment들을 클릭후 클릭을 없애고 삭제할때 오류를 방지
window.onload = function(){

	// main.js에서 보낸 project_name, image_name 값 받기
	temp = location.href.split("?");
    data=temp[1].split("/");
    project_name = data[0];
    image_name = data[1];
    console.log("From main.js - project_name: " + project_name + ", image_name: " + image_name);
	
    //유저 데이터 정보 받아오는 부분
    firebase.auth().onAuthStateChanged(function(user){
        if(user){
        var ref = firebase.database().ref("User/");
        ref.on("value", function (snapshot) {
            snapshot.forEach(function (data) {
                if(data.val().email == firebase.auth().currentUser.email) {
                    user_name = data.val().name;
                    document.getElementById("setting_user_name").innerHTML = data.val().name;
                    document.getElementById("email").innerHTML = data.val().email;
                    document.getElementById("company_name").innerHTML = data.val().companyName;
                    if (data.val().name.length >= 2) {
                        document.getElementById("user_icon").innerHTML = data.val().name.substring(1, 3);
                        //이름이 3글자일 경우만 생각했다. 영어 이름이나 4글자부터는 다시 지정해야함.
                    }
                    else {
                        document.getElementById("user_icon").innerHTML = data.val().name;
                    }
                }
            });
        });
        }
    });
    document.getElementById("logout_btn").onclick = function() {
        logout();
    }

    //전 페이지에서 선택된 projcet의 이름을 받아오기
    //저장은 project_name변수에

    document.getElementById('project_name').innerHTML = project_name;
    



    var project_data_address = "Project/".concat(project_name+"/Images/"+image_name+"/annotation/");
    annoRef = firebase.database().ref(project_data_address);

    annoRef.on('child_added', function(data) {
        key.push(data.key);
        if(page_load) {
            if(first_read) {
                setTimeout(() => { 
                    annotation.push(data.val());
                    add_comment_canvas(count);
                    add_comment_list(count);
                    add_annotation_info(count);
                    count++;
                    draw_annotation(); }, 1300);
            }
            else {
                annotation.push(data.val());
                add_comment_canvas(count);
                add_comment_list(count);
                add_annotation_info(count);
                count++;
                draw_annotation();
            } 
        }
    })


    //window load시 오른쪽에 위치한 context 높이 조정
    windowHeight = window.innerHeight;
    var right_aside_content = document.getElementById("editing_content");
    right_aside_content.style.height = windowHeight -153;

    //window load시 오른쪽에 위치한 comment가 클릭된 상태로 보이게 변경
    //초기에 보이는 화면을 file이 아닌 comment로 설정한 것.
    document.getElementById("editing_comment_list").style.height="57px";
    document.getElementById("editing_comment_list").style.paddingBottom="18px"


    var canvas =  document.getElementById("canvas");
    context = canvas.getContext("2d");
	
    //firebase strorage에서 이미지 파일을 읽어와 출력하는 부분

    img = new Image();
    var image_storage_address;
    var image_data_address = "Project/".concat(project_name+"/Images/"+image_name);

    firebase.database().ref(image_data_address).once('value').then((snapshot) => {
        var revise_time_text = "최근 수정일: ".concat(snapshot.val().Date);
        document.getElementById('revise_time').innerHTML = revise_time_text;
        image_storage_address = "Image/".concat(project_name + "/" + snapshot.val().FileName);
        storageRef.child(image_storage_address).getDownloadURL().then((url)=>{
            img.setAttribute('src',url);
        });
        
    });

    var image_data_address2 = "Project/".concat(project_name+"/Images/");
    imageRef = firebase.database().ref(image_data_address2);
    
    
    img.onload = function(){

        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        scale = Math.min(canvas.width / img.width, canvas.height / img.height);
        // get the top left position of the image
        x = (canvas.width / 2) - (img.width / 2) * scale;
        y = (canvas.height / 2) - (img.height / 2) * scale;
        context.drawImage(img, x, y, img.width * scale, img.height * scale);
    }

   function canvasX(clientX) {
        var bound = canvas.getBoundingClientRect();
        var bw = 5;
        return (clientX - bound.left - bw) * (canvas.width / (bound.width - bw * 2));
    }

    function canvasY(clientY) {
        var bound = canvas.getBoundingClientRect();
        var bw = 5;
        return (clientY - bound.top - bw) * (canvas.height / (bound.height - bw * 2));
    }

    canvas.addEventListener("mousedown", function(e){
        //모든 annotation이 컨펌되어서 그릴수 있는 상태면 측정 시작
        page_load = false;
        if (possible) {
            lastEvent = e;
            isMouseDown = true;
            sx = canvasX(lastEvent.clientX);
            sy = canvasY(lastEvent.clientY);
            screen_sx = lastEvent.clientX;
            screen_sy = lastEvent.clientY;
            line_color = document.getElementById("edit_btn_color").value;
        }

        //클릭된 annotation이 있으면 선택 풀어주기
        if(isClicked != -1) {
            if (isClicked != count) {
                var clicked_canvas_id = "#annotation_canvas".concat(isClicked);
                var clicked_list_id = "annotation_list".concat(isClicked);
                $(clicked_canvas_id).hide();
                document.getElementById(clicked_list_id).style.border = "none";
                annotation[isClicked].clicked = false;
                isClicked=-1;
            }
        }
	});

	canvas.addEventListener("mousemove", function(e){
        if (possible) {
            lastEvent = e;
            ex = canvasX(lastEvent.clientX);
            ey = canvasY(lastEvent.clientY);
            screen_ex = lastEvent.clientX;
            screen_ey = lastEvent.clientY;
            //console.log(screen_ex, screen_ey);
            if(isMouseDown) {
                if (line) // line 버튼 클릭 시
                {
                    draw_annotation();
                    context.lineWidth = line_width;
                    context.strokeStyle = line_color // 색깔 지정
                    context.beginPath();
                    context.moveTo(sx, sy);
                    context.lineTo(ex, ey);
                    context.stroke(); // 그리기 실행
                }
                else if (square) // square 버튼 클릭 시
                {
                    draw_annotation();
    
                    context.lineWidth = line_width;
                    context.strokeStyle = line_color // 색깔 지정
    
                    rec_width = ex-sx;
                    rec_height = ey-sy;
                    context.beginPath();
                    context.rect(sx, sy, rec_width, rec_height);
                    context.stroke(); // 그리기 실행
                }
                else if (circle) // circle 버튼 클릭 시
                {
                    draw_annotation();
    
                    context.lineWidth = line_width;
                    context.strokeStyle = line_color // 색깔 지정
    
                    cir_center_x = (sx + ex)/2;
                    cir_center_y = (sy + ey)/2;
                    cir_radius = Math.sqrt(Math.pow((sx - ex),2) + Math.pow((sy - ey),2))/2;
                    context.beginPath();
                    context.arc(cir_center_x, cir_center_y, cir_radius, 0, 2*Math.PI);
                    context.stroke(); // 그리기 실행
                }
                else if (arrow) // arrow 버튼 클릭 시
                {
                    draw_annotation();
                    context.lineWidth = line_width;
                    context.strokeStyle = line_color // 색깔 지정
                    context.beginPath();
                    canvas_arrow(sx, sy, ex, ey);
                     // 그리기 실행
                }
            }
        }

	});


    //마우스를 놓으면 해당하는 도형에 맞게 annotation array에 데이터가 저장되고
    //그 후 캔버스를 초기화하고 이전의 annotation을 다시 출력
	canvas.addEventListener("mouseup", function(){
        if (possible) {
            isMouseDown = false;
            screen_sx=(screen_sx-159-x)/(img.width * scale);
            screen_sy=(screen_sy-168-y)/(img.height * scale);
            screen_ex=(screen_ex-159-x)/(img.width * scale);
            screen_ey=(screen_ey-168-y)/(img.height * scale);

            if (line) {
                if (!((Math.abs(sx-ex)<10)&&(Math.abs(sy-ey)<10))) {
                    sx=(sx-x)/(img.width * scale);
                    sy=(sy-y)/(img.height * scale);
                    ex=(ex-x)/(img.width * scale);
                    ey=(ey-y)/(img.height * scale);
    
                    annotation.push({
                        project: project_name,
                        image: image_name,
                        user: user_name,
                        type: 'line',
                        comment: comment_content,
                        date: new Date().toLocaleString(),
                        start_x: sx,
                        start_y: sy,
                        end_x: ex,
                        end_y: ey,
                        color: line_color,
                        lineWidth: line_width,
                        remain: true,
                        clicked: false,
                        screen_sx: screen_sx,
                        screen_sy: screen_sy,
                        screen_ex: screen_ex,
                        screen_ey: screen_ey,
                        new:true 
                    });
                    add_comment_canvas(count);
                    add_annotation_info(count);

                    count++;
                }
            }
            else if(square) {
                if ((Math.abs(sx-ex)>10)&&(Math.abs(sy-ey)>10)) {
                    sx=(sx-x)/(img.width * scale);
                    sy=(sy-y)/(img.height * scale);
                    ex = rec_width /(img.width * scale);
                    ey = rec_height /(img.height * scale);
    
                    annotation.push({
                        project: project_name,
                        image: image_name,
                        user: user_name,
                        type: 'square',
                        comment: comment_content,
                        date: new Date().toLocaleString(),
                        start_x: sx,
                        start_y: sy,
                        end_x: ex,
                        end_y: ey,
                        color: line_color,
                        lineWidth: line_width,
                        remain: true,
                        clicked: false,
                        screen_sx: screen_sx,
                        screen_sy: screen_sy,
                        screen_ex: screen_ex,
                        screen_ey: screen_ey,
                        new:true 
                    });
                    //square에서 end_x, end_y는 rec_width, height로 사용
                    add_comment_canvas(count);
                    add_annotation_info(count);
                    count++;
                }
            }
            else if(circle) {
                if ((Math.abs(sx-ex)>10)&&(Math.abs(sy-ey)>10)) {
                    sx=(cir_center_x-x)/(img.width * scale);
                    sy=(cir_center_y-y)/(img.height * scale);
                    ex = cir_radius /(img.width * scale);
                    annotation.push({
                        project: project_name,
                        image: image_name,
                        user: user_name,
                        type: 'circle',
                        comment: comment_content,
                        date: new Date().toLocaleString(),
                        start_x: sx,
                        start_y: sy,
                        end_x: ex,
                        end_y: null,
                        color: line_color,
                        lineWidth: line_width,
                        remain: true,
                        clicked: false,
                        screen_sx: screen_sx,
                        screen_sy: screen_sy,
                        screen_ex: screen_ex,
                        screen_ey: screen_ey,
                        new:true 
                    });
                    //circle에서는 start_x,y가 원의 중심, end_x는 원의 반지름으로 사용
                    add_comment_canvas(count);
                    add_annotation_info(count);
                    count++;
                }
            }
            else if(arrow) {
                if (!((Math.abs(sx-ex)<10)&&(Math.abs(sy-ey)<10))) {
                    sx=(sx-x)/(img.width * scale);
                    sy=(sy-y)/(img.height * scale);
                    ex=(ex-x)/(img.width * scale);
                    ey=(ey-y)/(img.height * scale);
                    annotation.push({
                        project: project_name,
                        image: image_name,
                        user: user_name,
                        type: 'arrow',
                        comment: comment_content,
                        date: new Date().toLocaleString(),
                        start_x: sx,
                        start_y: sy,
                        end_x: ex,
                        end_y: ey,
                        color: line_color,
                        lineWidth: line_width,
                        remain: true,
                        clicked: false,
                        screen_sx: screen_sx,
                        screen_sy: screen_sy,
                        screen_ex: screen_ex,
                        screen_ey: screen_ey,
                        new:true 
                    });
                    add_comment_canvas(count);
                    add_annotation_info(count);
                    count++;
                }
            }
            else if(comment) {
                sx=(sx-x)/(img.width * scale);
                sy=(sy-y)/(img.height * scale);
                annotation.push({
                    project: project_name,
                    image: image_name,
                    user: user_name,
                    type: 'comment',
                    comment: comment_content,
                    date: new Date().toLocaleString(),
                    start_x: sx,
                    start_y: sy,
                    end_x: null,
                    end_y: null,
                    color: line_color,
                    lineWidth: line_width,
                    remain: true,
                    clicked: false,
                    screen_sx: screen_sx,
                    screen_sy: screen_sy,
                    screen_ex: screen_sx,
                    screen_ey: screen_sy,
                    new:true 
                    //screen_ex,ey 변경할것++
                });
                add_comment_canvas(count);
                add_annotation_info(count);
                count++;
            }
            draw_annotation();
        }

	});


    $(function() {
        $("#capture_btn img").hover(function(){
            $(this).attr({src: "../image/capture_hover.png"});
        }, function(){
            $(this).attr({src: "../image/capture.png"});
        });
    });

    document.getElementById("project_name").onclick = function() {
        location.href="../html/main.html";
    }
    document.getElementById("capture_btn").onclick = function() {
        document.getElementById("line_btn").style.backgroundColor='#393E46';
        document.getElementById("line_btn").style.color='#ACACAC';

        document.getElementById("square_btn").style.backgroundColor='#393E46';
        document.getElementById("square_btn").style.color='#ACACAC';

        document.getElementById("circle_btn").style.backgroundColor='#393E46';
        document.getElementById("circle_btn").style.color='#ACACAC';

        document.getElementById("arrow_btn").style.backgroundColor='#393E46';
        document.getElementById("arrow_btn").style.color='#ACACAC';

        document.getElementById("comment_btn").style.backgroundColor='#393E46';
        document.getElementById("comment_btn").style.color='#ACACAC';
        alert("capture");
    }


    document.getElementById("capture_btn").onmouseover = function() {
        document.getElementById("capture_btn").style.backgroundColor='white';
        document.getElementById("capture_btn").style.color='#393E46';
    }


    document.getElementById("capture_btn").onmouseout = function() {
            document.getElementById("capture_btn").style.backgroundColor='#393E46';
            document.getElementById("capture_btn").style.color='#ACACAC';
    }


    document.getElementById("line_btn").onclick = function() {
        if (line==false){
            line=true;
            square=false;
            circle=false;
            arrow=false;
            comment=false;
            document.getElementById("line_btn").style.backgroundColor='white';
            document.getElementById("line_btn").style.color='#393E46';

            document.getElementById("square_btn").style.backgroundColor='#393E46';
            document.getElementById("square_btn").style.color='#ACACAC';

            document.getElementById("circle_btn").style.backgroundColor='#393E46';
            document.getElementById("circle_btn").style.color='#ACACAC';

            document.getElementById("arrow_btn").style.backgroundColor='#393E46';
            document.getElementById("arrow_btn").style.color='#ACACAC';

            document.getElementById("comment_btn").style.backgroundColor='#393E46';
            document.getElementById("comment_btn").style.color='#ACACAC';
        }
        else if (line==true) {
            line=false;
            square=false;
            circle=false;
            arrow=false;
            comment=false;
            document.getElementById("line_btn").style.backgroundColor='#393E46';
            document.getElementById("line_btn").style.color='#ACACAC';
        }
    }


    document.getElementById("line_btn").onmouseover = function() {
        document.getElementById("line_btn").style.backgroundColor='white';
        document.getElementById("line_btn").style.color='#393E46';
    }


    document.getElementById("line_btn").onmouseout = function() {
        if (line == false) {
            document.getElementById("line_btn").style.backgroundColor='#393E46';
            document.getElementById("line_btn").style.color='#ACACAC';
        }
    }


    document.getElementById("square_btn").onclick = function() {
        if (square==false){
            line=false;
            square=true;
            circle=false;
            arrow=false;
            comment=false;
            document.getElementById("square_btn").style.backgroundColor='white';
            document.getElementById("square_btn").style.color='#393E46';

            document.getElementById("line_btn").style.backgroundColor='#393E46';
            document.getElementById("line_btn").style.color='#ACACAC';

            document.getElementById("circle_btn").style.backgroundColor='#393E46';
            document.getElementById("circle_btn").style.color='#ACACAC';

            document.getElementById("arrow_btn").style.backgroundColor='#393E46';
            document.getElementById("arrow_btn").style.color='#ACACAC';

            document.getElementById("comment_btn").style.backgroundColor='#393E46';
            document.getElementById("comment_btn").style.color='#ACACAC';
        }
        else if (square==true) {
            line=false;
            square=false;
            circle=false;
            arrow=false;
            comment=false;
            document.getElementById("square_btn").style.backgroundColor='#393E46';
            document.getElementById("square_btn").style.color='#ACACAC';
        }
    }


    document.getElementById("square_btn").onmouseover = function() {
        document.getElementById("square_btn").style.backgroundColor='white';
        document.getElementById("square_btn").style.color='#393E46';
    }


    document.getElementById("square_btn").onmouseout = function() {
        if (square == false) {
            document.getElementById("square_btn").style.backgroundColor='#393E46';
            document.getElementById("square_btn").style.color='#ACACAC';
        }
    }


    document.getElementById("circle_btn").onclick = function() {
        if (circle==false){
            line=false;
            square=false;
            circle=true;
            arrow=false;
            comment=false;
            document.getElementById("circle_btn").style.backgroundColor='white';
            document.getElementById("circle_btn").style.color='#393E46';

            document.getElementById("line_btn").style.backgroundColor='#393E46';
            document.getElementById("line_btn").style.color='#ACACAC';

            document.getElementById("square_btn").style.backgroundColor='#393E46';
            document.getElementById("square_btn").style.color='#ACACAC';

            document.getElementById("arrow_btn").style.backgroundColor='#393E46';
            document.getElementById("arrow_btn").style.color='#ACACAC';

            document.getElementById("comment_btn").style.backgroundColor='#393E46';
            document.getElementById("comment_btn").style.color='#ACACAC';
        }
        else if (circle==true) {
            line=false;
            square=false;
            circle=false;
            arrow=false;
            comment=false;
            document.getElementById("circle_btn").style.backgroundColor='#393E46';
            document.getElementById("circle_btn").style.color='#ACACAC';
        }
    }

    
    document.getElementById("circle_btn").onmouseover = function() {
        document.getElementById("circle_btn").style.backgroundColor='white';
        document.getElementById("circle_btn").style.color='#393E46';
    }


    document.getElementById("circle_btn").onmouseout = function() {
        if (circle == false) {
            document.getElementById("circle_btn").style.backgroundColor='#393E46';
            document.getElementById("circle_btn").style.color='#ACACAC';
        }
    }


    document.getElementById("arrow_btn").onclick = function() {
        if (arrow==false){
            line=false;
            square=false;
            circle=false;
            arrow=true;
            comment=false;
            document.getElementById("arrow_btn").style.backgroundColor='white';
            document.getElementById("arrow_btn").style.color='#393E46';

            document.getElementById("line_btn").style.backgroundColor='#393E46';
            document.getElementById("line_btn").style.color='#ACACAC';

            document.getElementById("square_btn").style.backgroundColor='#393E46';
            document.getElementById("square_btn").style.color='#ACACAC';

            document.getElementById("circle_btn").style.backgroundColor='#393E46';
            document.getElementById("circle_btn").style.color='#ACACAC';

            document.getElementById("comment_btn").style.backgroundColor='#393E46';
            document.getElementById("comment_btn").style.color='#ACACAC';
        }
        else if (arrow==true) {
            line=false;
            square=false;
            circle=false;
            arrow=false;
            comment=false;
            document.getElementById("arrow_btn").style.backgroundColor='#393E46';
            document.getElementById("arrow_btn").style.color='#ACACAC';
        }
    }


    document.getElementById("arrow_btn").onmouseover = function() {
        document.getElementById("arrow_btn").style.backgroundColor='white';
        document.getElementById("arrow_btn").style.color='#393E46';
    }


    document.getElementById("arrow_btn").onmouseout = function() {
        if (arrow == false) {
            document.getElementById("arrow_btn").style.backgroundColor='#393E46';
            document.getElementById("arrow_btn").style.color='#ACACAC';
        }
    }


    document.getElementById("comment_btn").onclick = function() {
        if (comment==false){
            line=false;
            square=false;
            circle=false;
            arrow=false;
            comment=true;
            document.getElementById("comment_btn").style.backgroundColor='white';
            document.getElementById("comment_btn").style.color='#393E46';

            document.getElementById("line_btn").style.backgroundColor='#393E46';
            document.getElementById("line_btn").style.color='#ACACAC';	

            document.getElementById("square_btn").style.backgroundColor='#393E46';
            document.getElementById("square_btn").style.color='#ACACAC';

            document.getElementById("circle_btn").style.backgroundColor='#393E46';
            document.getElementById("circle_btn").style.color='#ACACAC';

            document.getElementById("arrow_btn").style.backgroundColor='#393E46';
            document.getElementById("arrow_btn").style.color='#ACACAC';
        }
        else if (comment==true) {
            line=false;
            square=false;
            circle=false;
            arrow=false;
            comment=false;
            document.getElementById("comment_btn").style.backgroundColor='#393E46';
            document.getElementById("comment_btn").style.color='#ACACAC';
        }
    }


    document.getElementById("comment_btn").onmouseover = function() {
        document.getElementById("comment_btn").style.backgroundColor='white';
        document.getElementById("comment_btn").style.color='#393E46';
		
    }
	
    document.getElementById("comment_btn").onmouseout = function() {
        if (comment == false) {
            document.getElementById("comment_btn").style.backgroundColor='#393E46';
            document.getElementById("comment_btn").style.color='#ACACAC';
        }
    }


    document.getElementById("thickness_btn").onclick = function() {
        if($('#line_thickness').css('display') == 'none'){
            $('#line_thickness').show();
          }else{
            $('#line_thickness').hide();
          }
    }

    document.getElementById("user_icon").onclick = function() {
        if($('#setting').css('display') == 'none'){
            $('#setting').show();
          }else{
            $('#setting').hide();
          }
    }

    $(function() {
        $("#thickness_btn img").hover(function(){
            $(this).attr({src: "../image/thickness2.png"});
        }, function(){
            $(this).attr({src: "../image/thickness.png"});
        });
    });


    document.getElementById("thickness_range").onchange = function(event) {
        line_width = event.target.value;
        line_width = Number(line_width);
    }


    document.getElementById("editing_file_list").onclick = function() {
        if (!file_list) {
            file_list=true;
            comment_list=false;
            $("#editing_content").empty();
            document.getElementById("editing_file_list").style.height="58px";
            document.getElementById("editing_file_list").style.paddingBottom="18px"

            document.getElementById("editing_comment_list").style.height="40px";
            document.getElementById("editing_comment_list").style.padding="0 18px"
        }
    }


    document.getElementById("editing_comment_list").onclick = function() {
        if (!comment_list) {
            comment_list=true;
            file_list=false;
            for (var i = 0; i < count; i++) {
                if (annotation[i].remain) {
                    add_comment_list(i);
                }
            }
            document.getElementById("editing_comment_list").style.height="57px";
            document.getElementById("editing_comment_list").style.paddingBottom="18px"

            document.getElementById("editing_file_list").style.height="40px";
            document.getElementById("editing_file_list").style.padding="0 18px"
        }

    }


    document.getElementById("zoom_in_btn").onclick = function() {
        alert("zoom in");
    }

    document.getElementById("zoom_out_btn").onclick = function() {
        alert("zoom out");
    }

    document.getElementById("zoom_out_btn").onclick = function() {
        alert("zoom out");
    }

    document.getElementById("header_alarm").onclick = function() {
        alert("alarm..");
    }
    document.getElementById("saveImage").onclick =function() {
        alert("!");
        var downloadLink = document.createElement("a");
        downloadLink.href = canvas.toDataURL();
        downloadLink.download = "image.png";
        downloadLink.target = "_blank";
        downloadLink.click();
        //추후 수정
    }


    //project의 critical 값에 따른 색상 설정
    var critical_div = document.getElementById("critical_div");
    var project_critical = "critical";
    if (project_critical == "critical"){
        critical_div.style.backgroundColor="red";
    }
    else if (project_critical == "major"){

        critical_div.style.backgroundColor="#FF7F27";
    }
    else if (project_critical == "normal"){
        critical_div.style.backgroundColor="#99D9EA";
    }
    else if (project_critical == "minor"){
        critical_div.style.backgroundColor="#3F48CC";
    }

    //critical 값이 변경됐을 때 생상 변경
    var critical = document.getElementById("critical");
    critical.onchange = function() {
        if (critical.value == "critical"){
            critical_div.style.backgroundColor="red";
        }
        else if (critical.value == "major"){

            critical_div.style.backgroundColor="#FF7F27";
        }
        else if (critical.value == "normal"){
            critical_div.style.backgroundColor="#99D9EA";
        }
        else if (critical.value == "minor"){
            critical_div.style.backgroundColor="#3F48CC";
        }

    }




}
window.onresize = function(){

    //window resize시 오른쪽에 위치한 context 높이 조정
    windowHeight = window.innerHeight;
    var right_aside_content = document.getElementById("editing_content");
    right_aside_content.style.height = windowHeight -153;

    //window resize시 canvas의 크기 재조정 후 그에 맞게 그림 다시 그리기
    var canvas =  document.querySelector("canvas");
    context = canvas.getContext("2d");
    img = new Image();
    img.src = "../image/temp2.jpg";
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    scale = Math.min(canvas.width / img.width, canvas.height / img.height);
        // get the top left position of the image
    x = (canvas.width / 2) - (img.width / 2) * scale;
    y = (canvas.height / 2) - (img.height / 2) * scale;

    for (var i = 0; i < count; i++) {
        var annotation_canvas_id = "annotation_canvas".concat(i);
        var annotation_info_id = "annotation_info".concat(i);
        if (annotation[i].remain){
            var comment_div = document.getElementById(annotation_canvas_id);
            var parent = comment_div.parentElement;
            parent.removeChild(comment_div);
            add_comment_canvas(i);

            var info_div = document.getElementById(annotation_info_id);
            parent.removeChild(info_div);
            add_annotation_info(i);
        }
        
    }
    
    draw_annotation();
}


function canvas_arrow(sx, sy, ex, ey) {
    var headlen = 20; // length of head in pixels
    var dx = ex - sx;
    var dy = ey - sy;
    var angle = Math.atan2(dy, dx);
    context.beginPath();
    context.moveTo(sx, sy);
    context.lineTo(ex, ey);
    context.lineTo(ex - headlen * Math.cos(angle - Math.PI / 6), ey - headlen * Math.sin(angle - Math.PI / 6));
    context.moveTo(ex, ey);
    context.lineTo(ex - headlen * Math.cos(angle + Math.PI / 6), ey - headlen * Math.sin(angle + Math.PI / 6));
    context.stroke();
  }

function draw_annotation(){
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, x, y, img.width * scale, img.height * scale);
        var clicked_annotation;
        for (var i = 0; i < count; i++) {
            if (annotation[i].remain) {
                if(annotation[i].clicked) {
                    clicked_annotation = annotation[i];
                }
                else {
                    if (annotation[i].type=='line') {
                        context.lineWidth = annotation[i].lineWidth;
                        context.strokeStyle = annotation[i].color;
                        context.beginPath();
                        context.moveTo(annotation[i].start_x * img.width * scale + x, annotation[i].start_y * img.height * scale + y);
                        context.lineTo(annotation[i].end_x * img.width * scale + x, annotation[i].end_y * img.height * scale + y);
                        context.stroke();

                    }
                    else if (annotation[i].type=='square') {
                        context.lineWidth = annotation[i].lineWidth;
                        context.strokeStyle = annotation[i].color;
                        context.beginPath();
                        context.rect(annotation[i].start_x * img.width * scale + x, annotation[i].start_y * img.height * scale + y,
                             annotation[i].end_x * img.width * scale, annotation[i].end_y * img.height * scale);
                        context.stroke();
                    }
                    else if (annotation[i].type=='circle') {
                        context.lineWidth = annotation[i].lineWidth;
                        context.strokeStyle = annotation[i].color;
                        context.beginPath();
                        context.arc(annotation[i].start_x * img.width * scale + x, annotation[i].start_y * img.height * scale + y,
                            annotation[i].end_x * img.width * scale, 0, 2*Math.PI);
                        context.stroke();
                    }
                    else if (annotation[i].type=='arrow') {
                        context.lineWidth = annotation[i].lineWidth;
                        context.strokeStyle = annotation[i].color;
                        context.beginPath();
                        canvas_arrow(annotation[i].start_x * img.width * scale + x, annotation[i].start_y * img.height * scale + y,
                            annotation[i].end_x * img.width * scale + x, annotation[i].end_y * img.height * scale + y);
                    }
                }

            }
        }
        if(isClicked != (-1)){
            if (clicked_annotation.type=='line') {
                context.lineWidth = clicked_annotation.lineWidth + 3;
                context.strokeStyle = "#FFFFFF";
                context.beginPath();
                context.moveTo(clicked_annotation.start_x * img.width * scale + x, clicked_annotation.start_y * img.height * scale + y);
                context.lineTo(clicked_annotation.end_x * img.width * scale + x, clicked_annotation.end_y * img.height * scale + y);
                context.stroke();
                context.lineWidth = clicked_annotation.lineWidth;
                context.strokeStyle = clicked_annotation.color;
                context.beginPath();
                context.moveTo(clicked_annotation.start_x * img.width * scale + x, clicked_annotation.start_y * img.height * scale + y);
                context.lineTo(clicked_annotation.end_x * img.width * scale + x, clicked_annotation.end_y * img.height * scale + y);
                context.stroke();

            }
            else if (clicked_annotation.type=='square') {
                context.lineWidth = clicked_annotation.lineWidth + 2;
                context.strokeStyle = "#FFFFFF";
                context.beginPath();
                context.rect(clicked_annotation.start_x * img.width * scale + x, clicked_annotation.start_y * img.height * scale + y,
                    clicked_annotation.end_x * img.width * scale, clicked_annotation.end_y * img.height * scale);
                context.stroke();

                context.lineWidth = clicked_annotation.lineWidth;
                context.strokeStyle = clicked_annotation.color;
                context.beginPath();
                context.rect(clicked_annotation.start_x * img.width * scale + x, clicked_annotation.start_y * img.height * scale + y,
                     clicked_annotation.end_x * img.width * scale, clicked_annotation.end_y * img.height * scale);
                context.stroke();
            }
            else if (clicked_annotation.type=='circle') {
                context.lineWidth = clicked_annotation.lineWidth + 3;
                context.strokeStyle = "#FFFFFF";
                context.beginPath();
                context.arc(clicked_annotation.start_x * img.width * scale + x, clicked_annotation.start_y * img.height * scale + y,
                    clicked_annotation.end_x * img.width * scale, 0, 2*Math.PI);
                context.stroke();

                context.lineWidth = clicked_annotation.lineWidth;
                context.strokeStyle = clicked_annotation.color;
                context.beginPath();
                context.arc(clicked_annotation.start_x * img.width * scale + x, clicked_annotation.start_y * img.height * scale + y,
                    clicked_annotation.end_x * img.width * scale, 0, 2*Math.PI);
                context.stroke();
            }
            else if (clicked_annotation.type=='arrow') {
                context.lineWidth = clicked_annotation.lineWidth + 3;
                context.strokeStyle = "#FFFFFF";
                canvas_arrow(clicked_annotation.start_x * img.width * scale + x, clicked_annotation.start_y * img.height * scale + y,
                    clicked_annotation.end_x * img.width * scale + x, clicked_annotation.end_y * img.height * scale + y);
                context.lineWidth = clicked_annotation.lineWidth;
                context.strokeStyle = clicked_annotation.color;
                context.beginPath();
                canvas_arrow(clicked_annotation.start_x * img.width * scale + x, clicked_annotation.start_y * img.height * scale + y,
                    clicked_annotation.end_x * img.width * scale + x, clicked_annotation.end_y * img.height * scale + y);
            }
        }
}

//right_aside_content에 comment를 추가해주는 함수
function add_comment_list(order) {
    var comment_list_div = document.createElement('div');
    var list_date_id = "annotation_list_date".concat(order);
    var list_comment_id = "annotation_list_comment".concat(order);
    var comment_list_div_id = "annotation_list".concat(order);
    comment_list_div.id = comment_list_div_id;
    if (annotation[order].clicked) {
        comment_list_div.style.border = "2px solid red";
    }
    comment_list_div.classList.add("comment_list");
    comment_list_div.onclick= function() {
        annotation_click_event(order);
    }
    document.getElementById('editing_content').appendChild(comment_list_div);

    var user_info = document.createElement('div');
    user_info.innerHTML = annotation[order].user;
    user_info.style.fontSize="16px";
    user_info.style.marginBottom="7px";
    user_info.style.fontWeight="bold";
    comment_list_div.appendChild(user_info);


    var date_info = document.createElement("div");
    date_info.id = list_date_id;
    date_info.innerHTML = annotation[order].date;
    date_info.style.fontSize="13px";
    comment_list_div.appendChild(date_info);

    var comment = document.createElement("div");
    comment.id = list_comment_id;
    comment.innerHTML=annotation[order].comment;
    comment.classList.add("comment_list_comment_div");
    comment_list_div.appendChild(comment);


    var delete_btn = document.createElement('button');
    delete_btn.innerHTML = "Delete";
    //delete버튼을 클릭했을때 이벤트,
    delete_btn.onclick = function() {
        if (confirm("정말 삭제하시겠습니까?") == true){
            isClicked = -1;
            //var comment_div = document.getElementById(div_id);
            var parent = comment_list_div.parentElement;
            parent.removeChild(comment_list_div);

            var div_id_canvas = "annotation_canvas".concat(order);
            var comment_canvas_div = document.getElementById(div_id_canvas);
            var parent = comment_canvas_div.parentElement;
            parent.removeChild(comment_canvas_div);

            annotation[order].remain=false;
            annoRef.child(key[order]).remove();

            toDelete = true;
            del_count++;
            console.log("Deleted the", order, "th annotation (",annotation[order].type,")");
            console.log("Number of annotation: ", count-del_count);
            //이곳에 firebase에서의 데이터 삭제 내용도 추가할 것.
            delete_annotation_info (order)
            draw_annotation();
            
        }else{
            toDelete = true;
            return;
        }
        possible = true;

    };
    delete_btn.classList.add("comment_list_delete_btn");
    comment_list_div.appendChild(delete_btn);
}



function add_comment_canvas(order) {
    var comment_div = document.createElement('div');
    var comment_div_id = "annotation_canvas".concat(order);
    var canvas_text_id = "annotation_canvas_textarea".concat(order);
    var canvas_date_id = "annotation_canvas_date".concat(order);
    var canvas_comment_id = "annotation_canvas_comment".concat(order);
    var canvas_confirm_id = "annotation_canvas_confirm".concat(order);
    var canvas_revise_id = "annotation_canvas_revise".concat(order);
    comment_div.id = comment_div_id;

    screen_ex = annotation[order].screen_ex * scale * img.width + x;
    screen_ey = annotation[order].screen_ey * scale * img.height + y;

    comment_div.classList.add("comment_input");
    comment_div.style.top = screen_ey.toString().concat("px");
    comment_div.style.left = screen_ex.toString().concat("px");
    document.getElementById('editing_canvas').appendChild(comment_div);


    var user_info = document.createElement('div');
    user_info.innerHTML = annotation[order].user;
    user_info.style.fontSize="16px";
    user_info.style.marginBottom="7px";
    user_info.style.fontWeight="bold";
    comment_div.appendChild(user_info);


    var date_info = document.createElement("div");
    date_info.id = canvas_date_id;
    date_info.style.fontSize="13px";
    

    var comment_textarea = document.createElement("textarea");
    comment_textarea.id = canvas_text_id;
    comment_textarea.classList.add("comment_list_comment_textarea_div_canvas");


    var delete_btn = document.createElement('button');
    delete_btn.innerHTML = "Delete";
    //delete버튼을 클릭했을때 이벤트
    delete_btn.onclick = function() {
        if (annotation[order].new) {
            delete_annotation_info(order);
            var parent = comment_div.parentElement;
            parent.removeChild(comment_div);
            annotation.pop();
            count--;
            draw_annotation();
            console.log("Cancel adding annotation");
        }
        else {
            if (confirm("정말 삭제하시겠습니까?") == true){
                isClicked = -1;
                var parent = comment_div.parentElement;
                parent.removeChild(comment_div);
    
                var div_id_list = "annotation_list".concat(order);
                var comment_list_div = document.getElementById(div_id_list);
                var parent = comment_list_div.parentElement;
                parent.removeChild(comment_list_div);
                                
                annotation[order].remain=false;
                annoRef.child(key[order]).remove();
                
                toDelete = true;
                del_count++;
                console.log("Deleted the", order, "th annotation (",annotation[order].type,")");
                console.log("Number of annotation: ", count-del_count);
                //이곳에 firebase에서의 데이터 삭제 내용도 추가할 것.
                delete_annotation_info (order);
                draw_annotation(order);
            }else{
                toDelete = true;
                return;
            }
        }
        possible = true;
    };
    delete_btn.classList.add("comment_list_btn_canvas");
    delete_btn.style.right = "10px";



    var confirm_btn = document.createElement('button');
    confirm_btn.id = canvas_confirm_id;
    confirm_btn.innerHTML = "Confirm";
    confirm_btn.classList.add("comment_list_btn_canvas");
    confirm_btn.style.right = "75px";

    var revise_btn = document.createElement('button');
    revise_btn.id = canvas_revise_id;
    revise_btn.innerHTML = "Revise";
    revise_btn.classList.add("comment_list_btn_canvas");
    revise_btn.style.right = "75px";

    var comment = document.createElement("div");
    comment.id = canvas_comment_id;
    comment.classList.add("comment_list_comment_div_canvas");


    //confirm버튼을 클릭했을때 이벤트, textarea를 삭제하고 comment출력
    confirm_btn.onclick = function() {
        //현재 클릭된 상태의 object를 풀어주기
        if(isClicked != -1) {
            if (isClicked != order) {
                var clicked_canvas_id = "#annotation_canvas".concat(isClicked);
                var clicked_list_id = "annotation_list".concat(isClicked);
                $(clicked_canvas_id).hide();
                document.getElementById(clicked_list_id).style.border = "none";
                annotation[isClicked].clicked = false;
            }
        }

        isClicked = order;

        annotation[order].date = new Date().toLocaleString()
        date_info.innerHTML = annotation[order].date;
        comment_div.appendChild(date_info);

        var textarea_div = document.getElementById(canvas_text_id);
        comment_div.removeChild(textarea_div);
        annotation[order].comment = textarea_div.value;
        comment.innerHTML=textarea_div.value;
        comment_div.appendChild(comment);
        if(annotation[order].new) {
            annotation[order].new = false;
            annoRef.push(annotation[order]);

            if(comment_list){
                annotation[order].clicked = true;
                add_comment_list(order);
            }
        
            console.log("Number of annotation: ", count-del_count);
        }
        else {
            var list_date_id = "annotation_list_date".concat(order);
            var list_comment_id = "annotation_list_comment".concat(order);
            document.getElementById(list_date_id).innerHTML = annotation[order].date;
            document.getElementById(list_comment_id).innerHTML = annotation[order].comment;
            revise_firebase(order);
        }
        
        possible = true;
        comment_div.removeChild(confirm_btn);
        comment_div.appendChild(revise_btn);
        update_file_recent_time();
        draw_annotation();
    };

    revise_btn.onclick = function() {
        if (confirm("수정하시겠습니까?") == true){
            comment_div.removeChild(comment);

            comment_textarea.innerHTML = annotation[order].comment;
            comment_div.appendChild(comment_textarea);

            comment_div.removeChild(revise_btn);
            comment_div.appendChild(confirm_btn);

            possible = false;

        }else{
            return;
        }
    }


    if (!annotation[order].new) {
        if (order != isClicked) {
            $("#".concat(comment_div_id)).hide();
        }
    }
    

    
    //annotation을 생성한 유저의 이름과 접속한 유저의 이름이 같을 경우
    //confirm과 delete버튼 및 아래의 작업을 실행
    if (user_name == annotation[order].user) {
        //새로 생성된 것이면 텍스트박스 생성, 기존에 있던 것이면 comment출력
        if (annotation[order].new) {
            possible = false;
            comment_div.appendChild(comment_textarea);
            comment_div.appendChild(confirm_btn);
        }
        else {
            var comment = document.createElement("div");
            comment.innerHTML=annotation[order].comment;
            comment.classList.add("comment_list_comment_div_canvas");
            comment_div.appendChild(comment);
            comment_div.appendChild(revise_btn);
        }

        comment_div.appendChild(delete_btn);
    }
    
    //annoataion을 생성한 유저가 아닌 경우 comment내용만 출력해서 보여준다.
    else {
        var comment = document.createElement("div");
        comment.innerHTML=annotation[order].comment;
        comment.classList.add("comment_list_comment_div");
        date_info.innerHTML = annotation[order].date;
        comment_div.appendChild(date_info);
        comment_div.appendChild(comment);
    }
    
}

function add_annotation_info (order) {
    screen_sx = annotation[order].screen_sx * scale * img.width + x;
    screen_sy = annotation[order].screen_sy * scale * img.height + y - 16;

    var annotation_info = document.createElement('div');
    annotation_info.id = "annotation_info".concat(order);

    annotation_info.classList.add("annotation_info");
    annotation_info.style.top = screen_sy.toString().concat("px");
    annotation_info.style.left = screen_sx.toString().concat("px");
    annotation_info.style.backgroundColor = annotation[order].color;
    if (annotation[order].user.length >= 2) {
        annotation_info.innerHTML = annotation[order].user.substring(1, 3);
    }
    else {
        annotation_info.innerHTML = annotation[order].user;
    }
    
    document.getElementById('editing_canvas').appendChild(annotation_info);

    annotation_info.onclick = function() {
        annotation_click_event(order);
    }
}

function delete_annotation_info (order) {
    var annotation_info_id = "annotation_info".concat(order);
    var annotation_info_div = document.getElementById(annotation_info_id);
    document.getElementById('editing_canvas').removeChild(annotation_info_div);
}
// var textarea_div = document.getElementById(canvas_text_id);
//         var parent = textarea_div.parentElement;
//         parent.removeChild(textarea_div);

function annotation_click_event(order) {
    var canvas_comment_id = "#annotation_canvas".concat(order);
    var comment_list_div_id = "annotation_list".concat(order);
    if (isClicked == (-1)) {
        //클릭되지 않은 상태에서 annotation 클릭된 상태
        if (toDelete) {
            toDelete = false;
        }
        else {
            isClicked = order;
            annotation[order].clicked = true;
            document.getElementById(comment_list_div_id).style.border = "2px solid red";
            $(canvas_comment_id).show();
        }    
    }
    else {
        //클릭한 버튼을 다시 클릭한 상태
        if (isClicked == order) {
            if (toDelete) {
                toDelete = false;
            }
            else {
                isClicked = -1;
                annotation[order].clicked = false;
                document.getElementById(comment_list_div_id).style.border = "none";
                $(canvas_comment_id).hide();
            }
        }
        else {
            //다른게 클릭되어 있던 상태
            var clicked_canvas_id = "#annotation_canvas".concat(isClicked);
            var clicked_list_id = "annotation_list".concat(isClicked);
            document.getElementById(clicked_list_id).style.border = "none";
            annotation[isClicked].clicked = false;
            $(clicked_canvas_id).hide();
            $(canvas_comment_id).show();
            isClicked = order;
            annotation[order].clicked = true;
            document.getElementById(comment_list_div_id).style.border = "2px solid red";
        }
        
    }
    draw_annotation();
}


function revise_firebase(order) {
    annoRef.child(key[order]).update({
        date: annotation[order].date,
        comment: annotation[order].comment
    });
}

function update_file_recent_time() {
    imageRef.child(image_name).update({
        Date: new Date().toLocaleString()
    });
}
