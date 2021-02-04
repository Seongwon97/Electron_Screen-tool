var lastEvent;
var isMouseDown = false;
var line=false;
var square=false;
var circle=false;
var arrow=false;
var comment=false;

var sx, sy;                  // 드래그 시작점
var ex, ey;                  // 드래그 끝점

var rec_width;          //사각형을 그릴때 사용되는 width,height
var rec_height;

var cir_center_x;       //원의 중심점, 반지름
var cir_center_y;
var cir_radius;

var x, y, scale; //canvas에서 사진의 위치 및 크기 조정을 위한 변수

var line_color; //line의 색과 넓이를 담을 변수
var line_width = 5;

var annotation =[]; //firebase에서 annotation의 값을 받아와서 저장할 array
var count = 0; //annotation의 개수를 카운트
var comment_content = ""; //comment의 내용을 담을 변수
var user_name = "user"; // firebase에서 값 받아와서 저장
window.onload = function(){

    var canvas =  document.getElementById("canvas");
    var context = canvas.getContext("2d");
    
    var img = new Image();
    img.src = "../image/temp2.jpg";
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
		lastEvent = e;
        isMouseDown = true;	
        sx = canvasX(lastEvent.clientX);
        sy = canvasY(lastEvent.clientY);
	});

	canvas.addEventListener("mousemove", function(e){
        lastEvent = e;
        ex = canvasX(lastEvent.clientX);
        ey = canvasY(lastEvent.clientY);
        if(isMouseDown) {		
			if (line) // line 버튼 클릭 시
			{         
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(img, x, y, img.width * scale, img.height * scale);
                     
                line_color = document.getElementById("edit_btn_color").value;
                context.lineWidth = line_width;
				context.strokeStyle = line_color // 색깔 지정
                context.beginPath();
                context.moveTo(sx, sy);
                context.lineTo(ex, ey);
                context.stroke(); // 그리기 실행
                
            }
            else if (square) // square 버튼 클릭 시
			{    
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(img, x, y, img.width * scale, img.height * scale);
                
                line_color = document.getElementById("edit_btn_color").value;
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
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(img, x, y, img.width * scale, img.height * scale);
                
                line_color = document.getElementById("edit_btn_color").value;
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
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(img, x, y, img.width * scale, img.height * scale);
                
                line_color = document.getElementById("edit_btn_color").value;
                context.lineWidth = line_width;
                context.strokeStyle = line_color // 색깔 지정

                cir_center_x = (sx + ex)/2;
                cir_center_y = (sy + ey)/2;
                cir_radius = Math.sqrt(Math.pow((sx - ex),2) + Math.pow((sy - ey),2))/2;
                context.beginPath();
                context.arc(cir_center_x, cir_center_y, cir_radius, 0, 2*Math.PI);
                context.stroke(); // 그리기 실행
            }



//             else if (pencil) {
//                 console.log(document.getElementById("edit_btn_color").value);
// 				console.log("captureClicked function starts");
// 				context.beginPath();
// 				context.moveTo(lastEvent.offsetX,lastEvent.offsetY); // 마우스 시작점 좌표 부터 ~
// 				context.lineTo(e.offsetX,e.offsetY); // ~ 마우스 끝점 좌표 까지
// //				context.strokeStyle = color; // 색깔 지정
// 				context.strokeStyle = document.getElementById("edit_btn_color").value; // 색깔 지정

// 				context.stroke(); // 그리기 실행
// 				lastEvent = e; // 마우스 좌표 맞추기
// 				console.log("captureClicked function ends");
//             }
		}
	});

	canvas.addEventListener("mouseup", function(){
        isMouseDown = false;       
        if (line) {
            sx=(sx-x)/(img.width * scale);
            sy=(sy-y)/(img.height * scale);
            ex=(ex-x)/(img.width * scale);
            ey=(ey-y)/(img.height * scale);
            annotation.push({
                num : count,
                start_x: sx,
                start_y: sy,
                end_x: ex,
                end_y: ey,
                type: 1,
                color: line_color,
                lineWidth: line_width,
                remain: true,
                user: user_name,
                comment: comment_content,
                date: new Date()
            });          
        }
        else if(square) {
            sx=(sx-x)/(img.width * scale);
            sy=(sy-y)/(img.height * scale);
            ex = rec_width /(img.width * scale);
            ey = rec_height /(img.height * scale);
            
            annotation.push({
                num : count,
                start_x: sx,
                start_y: sy,
                end_x: ex,
                end_y: ey,
                type: 2,
                color: line_color,
                lineWidth: line_width,
                remain: true,
                user: user_name,
                comment: comment_content,
                date: new Date()
            });  
            //square에서 end_x, end_y는 rec_width, height로 사용     
        }
        else if(circle) {
            sx=(cir_center_x-x)/(img.width * scale);
            sy=(cir_center_y-y)/(img.height * scale);
            ex = cir_radius /(img.width * scale);
            annotation.push({
                num : count,
                start_x: sx,
                start_y: sy,
                end_x: ex,
                end_y: null,
                type: 3,
                color: line_color,
                lineWidth: line_width,
                remain: true,
                user: user_name,
                comment: comment_content,
                date: new Date()
            });
            //circle에서는 start_x,y가 원의 중심, end_x는 원의 반지름으로 사용
        }
        count++; 
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, x, y, img.width * scale, img.height * scale);
        for (var i = 0; i < count; i++) {
            console.log(annotation[i].date);
            if (annotation[i].remain) {
                context.lineWidth = annotation[i].lineWidth;
                context.strokeStyle = annotation[i].color;
                if (annotation[i].type==1) {
                    context.beginPath();
                    context.moveTo(annotation[i].start_x * img.width * scale + x, annotation[i].start_y * img.height * scale + y);
                    context.lineTo(annotation[i].end_x * img.width * scale + x, annotation[i].end_y * img.height * scale + y);
                    context.stroke();
                }
                else if (annotation[i].type==2) {
                    context.beginPath();
                    context.rect(annotation[i].start_x * img.width * scale + x, annotation[i].start_y * img.height * scale + y,
                         annotation[i].end_x * img.width * scale, annotation[i].end_y * img.height * scale);
                    context.stroke();
                }
                else if (annotation[i].type==3) {
                    context.beginPath();
                    context.arc(annotation[i].start_x * img.width * scale + x, annotation[i].start_y * img.height * scale + y,
                        annotation[i].end_x * img.width * scale, 0, 2*Math.PI);
                    context.stroke();
                }
            }
        }  
           
        
	});



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
    $(function() { 
        $("#thickness_btn img").hover(function(){ 
            $(this).attr({src: "../image/thickness2.png"}); 
        }, function(){ 
            $(this).attr({src: "../image/thickness.png"}); 
        }); 
    });
    document.getElementById("thickness_range").onchange = function(event) {
        line_width = event.target.value;
        console.log(line_width);
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
    /*
    var canvas = document.getElementById("canvas");
    if(canvas.getContext){
        var draw = canvas.getContext("2d");
        
        var img = new Image();
        img.src = "../image/temp.jpg";
        img.onload = function(){
            var scale = Math.min(canvas.width / img.width, canvas.height / img.height);
            // get the top left position of the image
            var x = (canvas.width / 2) - (img.width / 2) * scale;
            var y = (canvas.height / 2) - (img.height / 2) * scale;
            //이미지의 원하는 부분만 잘라서 그리기
            //drawImage(이미지객체, 
            //        이미지의 왼위 부분x, 이미지의 왼위 부분y, 이미지의 원하는 가로크기, 이미지의 원하는 세로크기,
            //        사각형 부분x, 사각형 부분y, 가로크기, 세로크기)
            //draw.drawImage(img, 100,100, 300,300, 50,50, 250,300);
            
            //전체 이미지 그리기
            //drawImage(이미지객체, 사각형 왼위 x, 사각형 왼위 y, 가로크기, 세로크기)
            draw.drawImage(img, x, y, img.width * scale, img.height * scale);
        }
    }*/
}
window.onresize = function(){
    var canvas =  document.querySelector("canvas");
    var context = canvas.getContext("2d");
    var img = new Image();
    img.src = "../image/temp2.jpg";
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    scale = Math.min(canvas.width / img.width, canvas.height / img.height);
        // get the top left position of the image
    x = (canvas.width / 2) - (img.width / 2) * scale;
    y = (canvas.height / 2) - (img.height / 2) * scale;

//        context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, x, y, img.width * scale, img.height * scale);
    for (var i = 0; i < count; i++) {
        if (annotation[i].remain) {
            context.lineWidth = annotation[i].lineWidth;
            context.strokeStyle = annotation[i].color;
            if (annotation[i].type==1) {
                context.beginPath();
                context.moveTo(annotation[i].start_x*img.width * scale + x, annotation[i].start_y*img.height * scale + y);
                context.lineTo(annotation[i].end_x*img.width * scale + x, annotation[i].end_y*img.height * scale + y);
                context.stroke();
            }
            else if (annotation[i].type==2) {
                context.beginPath();
                context.rect(annotation[i].start_x * img.width * scale + x, annotation[i].start_y * img.height * scale + y,
                    annotation[i].end_x * img.width * scale, annotation[i].end_y * img.height * scale);
                context.stroke();
            }
            else if (annotation[i].type==3) {
                context.beginPath();
                context.arc(annotation[i].start_x * img.width * scale + x, annotation[i].start_y * img.height * scale + y,
                    annotation[i].end_x * img.width * scale, 0, 2*Math.PI);
                context.stroke();
            }
        }
    }
}


