var lastEvent;
var isMouseDown = false;
var line=false;
var square=false;
var circle=false;
var arrow=false;
var comment=false;

var file=false;
var comment=true;

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
                draw_annotation(img, context);
                     
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
                draw_annotation(img, context);

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
                draw_annotation(img, context);
                
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
                draw_annotation(img, context);
                
                line_color = document.getElementById("edit_btn_color").value;
                context.lineWidth = line_width;
                context.strokeStyle = line_color // 색깔 지정
                context.beginPath();
                canvas_arrow(context, sx, sy, ex, ey);
                 // 그리기 실행
            }
		}
	});


    //마우스를 놓으면 해당하는 도형에 맞게 annotation array에 데이터가 저장되고
    //그 후 캔버스를 초기화하고 이전의 annotation을 다시 출력
	canvas.addEventListener("mouseup", function(){
        isMouseDown = false;
        if (line) {
            if (!((Math.abs(sx-ex)<10)&&(Math.abs(sy-ey)<10))) {
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
                add_comment('line', count);
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
                add_comment('square', count); 
                count++; 
            }   
        }
        else if(circle) {
            if ((Math.abs(sx-ex)>10)&&(Math.abs(sy-ey)>10)) {
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
                add_comment('circle', count);
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
                    num : count,
                    start_x: sx,
                    start_y: sy,
                    end_x: ex,
                    end_y: ey,
                    type: 4,
                    color: line_color,
                    lineWidth: line_width,
                    remain: true,
                    user: user_name,
                    comment: comment_content,
                    date: new Date()
                });
                add_comment('arrow', count);
                count++;        
            }
        }
        console.log("Number of annotation: ", count);
        draw_annotation(img, context);     
	});


    $(function() { 
        $("#capture_btn img").hover(function(){ 
            $(this).attr({src: "../image/capture_hover.png"}); 
        }, function(){ 
            $(this).attr({src: "../image/capture.png"}); 
        }); 
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
    }

    document.getElementById("editing_file_list").onclick = function() {
        file=true;
        comment=false;
        document.getElementById("editing_file_list").style.height="58px";
        document.getElementById("editing_file_list").style.paddingBottom="18px"

        document.getElementById("editing_comment_list").style.height="40px";
        document.getElementById("editing_comment_list").style.padding="0 18px"

    }
    document.getElementById("editing_comment_list").onclick = function() {
        comment=true;
        file=false;
        document.getElementById("editing_comment_list").style.height="57px";
        document.getElementById("editing_comment_list").style.paddingBottom="18px"

        document.getElementById("editing_file_list").style.height="40px";
        document.getElementById("editing_file_list").style.padding="0 18px"

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

    draw_annotation(img, context);
}


function canvas_arrow(context, sx, sy, ex, ey) {
    var headlen = 20; // length of head in pixels
    var dx = ex - sx;
    var dy = ey - sy;
    var angle = Math.atan2(dy, dx);
    context.moveTo(sx, sy);
    context.lineTo(ex, ey);
    context.lineTo(ex - headlen * Math.cos(angle - Math.PI / 6), ey - headlen * Math.sin(angle - Math.PI / 6));
    context.moveTo(ex, ey);
    context.lineTo(ex - headlen * Math.cos(angle + Math.PI / 6), ey - headlen * Math.sin(angle + Math.PI / 6));
    context.stroke();
  }

function draw_annotation(img, context){
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, x, y, img.width * scale, img.height * scale);
        for (var i = 0; i < count; i++) {
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
                else if (annotation[i].type==4) {
                    context.beginPath();
                    canvas_arrow(context, annotation[i].start_x * img.width * scale + x, annotation[i].start_y * img.height * scale + y, 
                        annotation[i].end_x * img.width * scale + x, annotation[i].end_y * img.height * scale + y);
                }
            }
        }  
}

function add_comment(type) {
    var div = document.createElement('div');
    div.innerHTML = "Num: " + annotation[count].num +"<br/>User name: " + annotation[count].user_name + "<br/>type: " + type + "<br/>Date: "+ annotation[count].date;
    div.style.marginTop="15px";
    div.style.background="#F1F1F1";
    div.style.borderRadius="10px";
    div.style.padding="15px";
    document.getElementById('editing_content').appendChild(div);
}
