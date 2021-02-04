var lastEvent;
var isMouseDown = false;
var line=false;
var square=false;
var circle=false;
var arrow=false;
var comment=false;
var color = document.getElementById("edit_btn_color").value;
var sx, sy;                  // 드래그 시작점
var ex, ey;                  // 드래그 끝점
var backup;
var rec_width;          //사각형을 그릴때 사용되는 width,height
var rec_height;
var cir_center_x;       //원의 중심점, 반지름
var cir_center_y;
var cir_radius;
window.onload = function(){

    var canvas =  document.getElementById("canvas");
    var context = canvas.getContext("2d");
    //var img = document.getElementById('img'); 
    
    var img = new Image();
    img.src = "../image/temp.jpg";
    img.onload = function(){

        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        var scale = Math.min(canvas.width / img.width, canvas.height / img.height);
        // get the top left position of the image
        var x = (canvas.width / 2) - (img.width / 2) * scale;
        var y = (canvas.height / 2) - (img.height / 2) * scale;
        //context.drawImage(img, x, y, img.width * scale, img.height * scale);
        console.log(canvas.width, canvas.height, img.width, img.height, scale);
    }
    
    /* image on canvas 

    */

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
        backup = context.getImageData(0, 0, canvas.width, canvas.height);
        console.log(lastEvent);
        console.log("sy,sx", sx, sy);
	});

	canvas.addEventListener("mousemove", function(e){
        lastEvent = e;
        ex = canvasX(lastEvent.clientX);
        ey = canvasY(lastEvent.clientY);
        if(isMouseDown) {		
			if (line) // line 버튼 클릭 시
			{            
                context.lineWidth = 3;
				context.strokeStyle = document.getElementById("edit_btn_color").value; // 색깔 지정
                context.putImageData(backup, 0, 0);
                context.beginPath();
                context.moveTo(sx, sy);
                context.lineTo(ex, ey);
                context.stroke(); // 그리기 실행
                
            }
            else if (square) // square 버튼 클릭 시
			{      
                rec_width = ex-sx;
                rec_height = ey-sy;
                context.lineWidth = 3;
				context.strokeStyle = document.getElementById("edit_btn_color").value; // 색깔 지정
                context.putImageData(backup, 0, 0);
                context.beginPath();
                context.rect(sx, sy, rec_width, rec_height);
                context.stroke(); // 그리기 실행
            }
            else if (circle) // circle 버튼 클릭 시
			{   
                cir_center_x = (sx + ex)/2;
                cir_center_y = (sy + ey)/2;
                cir_radius = Math.sqrt(Math.pow((sx - ex),2) + Math.pow((sy - ey),2))/2;
                context.lineWidth = 3;
				context.strokeStyle = document.getElementById("edit_btn_color").value; // 색깔 지정
                context.putImageData(backup, 0, 0);
                context.beginPath();
                context.arc(cir_center_x, cir_center_y, cir_radius, 0, 2*Math.PI);
                context.stroke(); // 그리기 실행
            }
            else if (arrow) // arrow 버튼 클릭 시
			{   
                cir_center_x = (sx + ex)/2;
                cir_center_y = (sy + ey)/2;
                cir_radius = Math.sqrt(Math.pow((sx - ex),2) + Math.pow((sy - ey),2))/2;
                context.lineWidth = 3;
				context.strokeStyle = document.getElementById("edit_btn_color").value; // 색깔 지정
                context.putImageData(backup, 0, 0);
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
        console.log("all", sx, sy, ex, sy);
        //이곳에서 그림 그린 것의 데이터를 firebase로 전송
		isMouseDown = false;
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
    img.src = "../image/temp.jpg";
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    var scale = Math.min(canvas.width / img.width, canvas.height / img.height);
        // get the top left position of the image
        var x = (canvas.width / 2) - (img.width / 2) * scale;
        var y = (canvas.height / 2) - (img.height / 2) * scale;
        context.drawImage(img, x, y, img.width * scale, img.height * scale);
}