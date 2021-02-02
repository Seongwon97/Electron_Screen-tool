var lastEvent;
var isMouseDown = false;
var pencil=false;
var square=false;
var circle=false;
var arrow=false;
var comment=false;
var color = document.getElementById("edit_btn_color").value;
window.onload = function(){

    var canvas =  document.querySelector("canvas");
    var context = canvas.getContext("2d");
    //var img = document.getElementById('img'); 
    
    var img = new Image();
    img.src = "../image/temp2.jpg";
    img.onload = function(){

        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        var scale = Math.min(canvas.width / img.width, canvas.height / img.height);
        // get the top left position of the image
        var x = (canvas.width / 2) - (img.width / 2) * scale;
        var y = (canvas.height / 2) - (img.height / 2) * scale;
        context.drawImage(img, x, y, img.width * scale, img.height * scale);
        console.log(canvas.width, canvas.height, img.width, img.height, scale);
    }
    
    /* image on canvas 

    */

    canvas.addEventListener("mousedown", function(e){
		lastEvent = e;
		isMouseDown = true;	
	});

	canvas.addEventListener("mousemove", function(e){
		if(isMouseDown) {		
			if (pencil==true) // pencil 버튼 클릭 시
			{
				console.log(document.getElementById("edit_btn_color").value);
				console.log("captureClicked function starts");
				context.beginPath();
				context.moveTo(lastEvent.offsetX,lastEvent.offsetY); // 마우스 시작점 좌표 부터 ~
				context.lineTo(e.offsetX,e.offsetY); // ~ 마우스 끝점 좌표 까지
//				context.strokeStyle = color; // 색깔 지정
				context.strokeStyle = document.getElementById("edit_btn_color").value; // 색깔 지정

				context.stroke(); // 그리기 실행
				lastEvent = e; // 마우스 좌표 맞추기
				console.log("captureClicked function ends");
			}
		}
	});

	canvas.addEventListener("mouseup", function(){
		isMouseDown = false;
	});



    document.getElementById("capture_btn").onclick = function() {
        document.getElementById("pencil_btn").style.backgroundColor='#393E46';
        document.getElementById("pencil_btn").style.color='#ACACAC';
        
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

    document.getElementById("pencil_btn").onclick = function() {
        if (pencil==false){
            pencil=true;
            square=false;
            circle=false;
            arrow=false;
            comment=false;
            document.getElementById("pencil_btn").style.backgroundColor='white';
            document.getElementById("pencil_btn").style.color='#393E46';
            
            document.getElementById("square_btn").style.backgroundColor='#393E46';
            document.getElementById("square_btn").style.color='#ACACAC';

            document.getElementById("circle_btn").style.backgroundColor='#393E46';
            document.getElementById("circle_btn").style.color='#ACACAC';

            document.getElementById("arrow_btn").style.backgroundColor='#393E46';
            document.getElementById("arrow_btn").style.color='#ACACAC';

            document.getElementById("comment_btn").style.backgroundColor='#393E46';
            document.getElementById("comment_btn").style.color='#ACACAC';
        }
        else if (pencil==true) {
            pencil=false;
            square=false;
            circle=false;
            arrow=false;
            comment=false;
            document.getElementById("pencil_btn").style.backgroundColor='#393E46';
            document.getElementById("pencil_btn").style.color='#ACACAC';
        }
    }
    document.getElementById("pencil_btn").onmouseover = function() {
        document.getElementById("pencil_btn").style.backgroundColor='white';
        document.getElementById("pencil_btn").style.color='#393E46';
    }
    document.getElementById("pencil_btn").onmouseout = function() {
        if (pencil == false) {
            document.getElementById("pencil_btn").style.backgroundColor='#393E46';
            document.getElementById("pencil_btn").style.color='#ACACAC';
        }
    }

    document.getElementById("square_btn").onclick = function() {
        if (square==false){
            pencil=false;
            square=true;
            circle=false;
            arrow=false;
            comment=false;
            document.getElementById("square_btn").style.backgroundColor='white';
            document.getElementById("square_btn").style.color='#393E46';

            document.getElementById("pencil_btn").style.backgroundColor='#393E46';
            document.getElementById("pencil_btn").style.color='#ACACAC';	

            document.getElementById("circle_btn").style.backgroundColor='#393E46';
            document.getElementById("circle_btn").style.color='#ACACAC';

            document.getElementById("arrow_btn").style.backgroundColor='#393E46';
            document.getElementById("arrow_btn").style.color='#ACACAC';

            document.getElementById("comment_btn").style.backgroundColor='#393E46';
            document.getElementById("comment_btn").style.color='#ACACAC';
        }
        else if (square==true) {
            pencil=false;
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
            pencil=false;
            square=false;
            circle=true;
            arrow=false;
            comment=false;
            document.getElementById("circle_btn").style.backgroundColor='white';
            document.getElementById("circle_btn").style.color='#393E46';

            document.getElementById("pencil_btn").style.backgroundColor='#393E46';
            document.getElementById("pencil_btn").style.color='#ACACAC';	

            document.getElementById("square_btn").style.backgroundColor='#393E46';
            document.getElementById("square_btn").style.color='#ACACAC';

            document.getElementById("arrow_btn").style.backgroundColor='#393E46';
            document.getElementById("arrow_btn").style.color='#ACACAC';

            document.getElementById("comment_btn").style.backgroundColor='#393E46';
            document.getElementById("comment_btn").style.color='#ACACAC';
        }
        else if (circle==true) {
            pencil=false;
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
            pencil=false;
            square=false;
            circle=false;
            arrow=true;
            comment=false;
            document.getElementById("arrow_btn").style.backgroundColor='white';
            document.getElementById("arrow_btn").style.color='#393E46';

            document.getElementById("pencil_btn").style.backgroundColor='#393E46';
            document.getElementById("pencil_btn").style.color='#ACACAC';	

            document.getElementById("square_btn").style.backgroundColor='#393E46';
            document.getElementById("square_btn").style.color='#ACACAC';

            document.getElementById("circle_btn").style.backgroundColor='#393E46';
            document.getElementById("circle_btn").style.color='#ACACAC';

            document.getElementById("comment_btn").style.backgroundColor='#393E46';
            document.getElementById("comment_btn").style.color='#ACACAC';
        }
        else if (arrow==true) {
            pencil=false;
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
            pencil=false;
            square=false;
            circle=false;
            arrow=false;
            comment=true;
            document.getElementById("comment_btn").style.backgroundColor='white';
            document.getElementById("comment_btn").style.color='#393E46';

            document.getElementById("pencil_btn").style.backgroundColor='#393E46';
            document.getElementById("pencil_btn").style.color='#ACACAC';	

            document.getElementById("square_btn").style.backgroundColor='#393E46';
            document.getElementById("square_btn").style.color='#ACACAC';

            document.getElementById("circle_btn").style.backgroundColor='#393E46';
            document.getElementById("circle_btn").style.color='#ACACAC';

            document.getElementById("arrow_btn").style.backgroundColor='#393E46';
            document.getElementById("arrow_btn").style.color='#ACACAC';
        }
        else if (comment==true) {
            pencil=false;
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