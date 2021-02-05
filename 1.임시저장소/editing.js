var lastEvent;
var isMouseDown = false;
var pencil=false;
var square=false;
var circle=false;
var arrow=false;
var comment=false;
var color = document.getElementById("edit_btn_color").value;

const browseBtn = document.querySelector('.browse-btn'); // 화면에 보여질 업로드 버튼
const realInput = document.querySelector('#real-input'); // 실제로는 button이 아닌 input을 통해 업로드를 하는 것

var saveImageButton = document.getElementById("download");

window.onload = function(){
	
    var canvas =  document.querySelector("canvas");
    var context = canvas.getContext("2d");

	// Upload image on cavas
	function readInputFile(e) {
	  var file = e.target.files; // 이미지 파일 객체
		  var reader = new FileReader(); // 경로 오류가 안뜨기 위해 전역객체인 FileReader 사용
	  reader.onload = function (e) {
		var img = new Image();
		img.onload = function () {
			canvas.width = canvas.offsetWidth;
			canvas.height = canvas.offsetHeight;
			var scale = Math.min(canvas.width / img.width, canvas.height / img.height);
			// get the top left position of the image
			var x = (canvas.width / 2) - (img.width / 2) * scale;
			var y = (canvas.height / 2) - (img.height / 2) * scale;
			context.drawImage(img, x, y, img.width * scale, img.height * scale);
			console.log(canvas.width, canvas.height, img.width, img.height, scale);
		};
		img.src = e.target.result;
	  };
	  reader.readAsDataURL(file[0]); // 첫번째 사진을 읽어옴
	}

	realInput.addEventListener('change', readInputFile);

	// 업로드 버튼을 클릭하면 input이 실행되며 사진 파일 고르기 가능
	browseBtn.addEventListener('click',()=>{
		realInput.click();
	});
	// End - Upload image on cavas
	
	
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
		
//		context.font = "15px Helvetica";
//		var text = 'hello test test';
//
//		function drawBubble(context, x, y, w, h, radius, text)
//		{
//		   var r = x + w;
//		   var b = y + h;
//
//		   context.beginPath();
//		   context.fillStyle = "red";
//		   context.fill();
//		   context.strokeStyle = "black";
//		   context.lineWidth = "2";
//		   context.moveTo(x + radius, y);
//
//		   context.lineTo(r - radius, y);
//		   context.quadraticCurveTo(r, y, r, y + radius);
//		   context.lineTo(r, y + h-radius);
//		   context.quadraticCurveTo(r, b, r - radius, b);
//		   context.lineTo(x + radius, b);
//		   context.quadraticCurveTo(x, b, x, b - radius);
//		   context.lineTo(x, y + radius);
//		   context.quadraticCurveTo(x, y, x + radius, y);
//		   context.stroke();
//		   context.fillText(text, x + 20, y + 30);
//		}
//
//		drawBubble(context, 10, 60, context.measureText(text).width + 40, 50, 20, text);
		
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
		
		  // Add comment function
		  var font = '17px sans-serif';
		  var hasInput = false;

		  var arrowH = 20; // 말풍선 화살표(삼각형) 높이
		  var arrowW = 20; // 말풍선 화살표(삼각형) 너비
		
		  canvas.onclick = function(e) {
			if (hasInput) return;
			addInput(e.clientX, e.clientY);
		  }

		  function addInput(x, y) {
			var input = document.createElement('input');

			input.type = 'text'; // HTML <input type="text">
			input.style.position = 'fixed';
//			input.style.left = (x - 4) + 'px';
//			input.style.top = (y - 4) + 'px';
			input.style.left = x;
			input.style.top = y;

			input.onkeydown = handleEnter; // 엔터 키 동작

			document.body.appendChild(input);

			input.focus();

			hasInput = true;
		  }

		// 엔터 키 눌림 
		  function handleEnter(e) {
			var keyCode = e.keyCode;
			if (keyCode === 13) {
//			  drawBubble(ctx, 10, 60, ctx.measureText(text).width + 40, 50, 20, text);
//							  x   y                 w                   h  radius 
			  drawBubble(context, arrowW, arrowH, 50, 8, this.value);
							     //x  //y //w										 //h //radius //text		
			  
			  drawText(this.value, parseInt(this.style.left, 10), parseInt(this.style.top, 10)); // 캔버스에 문자 입력 
			  document.body.removeChild(this);
			  hasInput = false;
			}
		  }
		
		// 캔버스에 문자 입력
		  function drawText(txt, x, y) {
			context.textBaseline = 'top';
			context.textAlign = 'left';
			context.font = font;
//			context.fillText(txt, x - 4, y - 4);
			context.fillStyle = "rgba(0,0,0,1)"
			context.fillText(txt, lastEvent.offsetX - arrowW/2, lastEvent.offsetY - arrowH - 35); // text 위치
		  }
		
		function drawBubble(context, arrowH, arrowW, h, radius, text)
		{
		   var arrowH = 20; // 말풍선 화살표(삼각형) 높이
		   var arrowW = 20; // 말풍선 화살표(삼각형) 너비
		   var r = lastEvent.offsetX - arrowW/2 + context.measureText(text).width + radius + 40; // 말풍선 사각형 오른쪽 x좌표
		   var b = lastEvent.offsetY - arrowH - h - radius*2; // 말풍선 사각형 위 y좌표
		   var x = lastEvent.offsetX - arrowW/2 - radius; // 말풍선 사각형 왼쪽 x좌표
		   var y = lastEvent.offsetY - arrowH; // 말풍선 사각형 아래 y좌표
			
		   context.beginPath();
		   context.fillStyle = "rgba(252,252,252,1)";
		   context.strokeStyle = "rgba(149,155,165,1)"; 
		   context.lineWidth = "3";

		   context.moveTo(lastEvent.offsetX, lastEvent.offsetY); // 시작점

		   context.lineTo(lastEvent.offsetX + arrowW/2, lastEvent.offsetY - arrowH); // arrow - right side

		   context.lineTo(r - radius, y); //L1 
		   context.quadraticCurveTo(r, y, r, y - radius); //Q1

			
		   context.lineTo(r, y - h); //L2
		   context.quadraticCurveTo(r, b, r - radius, b); //Q2

		   context.lineTo(x + radius, b); //L3
		   context.quadraticCurveTo(x, b, x, b + radius); //Q3
			
		   context.lineTo(x, y - radius); //L4
		   context.quadraticCurveTo(x, y, x + radius, y); //Q4
			
		   context.lineTo(lastEvent.offsetX, lastEvent.offsetY); //L5
			
		   context.fill(); // 채우기
		   context.stroke(); // 선
		}
	   	  // End - Add comment function
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
	
	
	saveImageButton.addEventListener("click", function(){
		var downloadLink = document.createElement("a");
		downloadLink.href = canvas.toDataURL();
		downloadLink.download = "image.png";
		downloadLink.target = "_blank";
		downloadLink.click();
	});
}

window.onresize = function(){
    var canvas =  document.querySelector("canvas");
    var context = canvas.getContext("2d");
    var img = new Image();
    img.src = "../image/test.png";
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    var scale = Math.min(canvas.width / img.width, canvas.height / img.height);
        // get the top left position of the image
        var x = (canvas.width / 2) - (img.width / 2) * scale;
        var y = (canvas.height / 2) - (img.height / 2) * scale;
        context.drawImage(img, x, y, img.width * scale, img.height * scale);
}
