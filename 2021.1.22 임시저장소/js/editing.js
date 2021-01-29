window.onload = function(){
    var pencil=false;
    var square=false;
    var circle=false;
    var arrow=false;
    var comment=false;
    document.getElementById("capture_btn").onclick = function() {
        alert("capture");
    }

    document.getElementById("pencil_btn").onclick = function() {
        if (pencil==false){
            pencil=true;
            square=false;
            circle=false;
            arrow=false;
            comment=false;
        }
        else if (pencil==true) {
            pencil=false;
            square=false;
            circle=false;
            arrow=false;
            comment=false;
        }
        alert(pencil);
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
        alert(square);
    }

    document.getElementById("circle_btn").onclick = function() {
        if (circle==false){
            pencil=false;
            square=false;
            circle=true;
            arrow=false;
            comment=false;
        }
        else if (circle==true) {
            pencil=false;
            square=false;
            circle=false;
            arrow=false;
            comment=false;
        }
        alert(pencil);
    }

    document.getElementById("arrow_btn").onclick = function() {
        if (arrow==false){
            pencil=false;
            square=false;
            circle=false;
            arrow=true;
            comment=false;
        }
        else if (arrow==true) {
            pencil=false;
            square=false;
            circle=false;
            arrow=false;
            comment=false;
        }
        alert(pencil);
    }

    document.getElementById("comment_btn").onclick = function() {
        if (comment==false){
            pencil=false;
            square=false;
            circle=false;
            arrow=false;
            comment=true;
        }
        else if (comment==true) {
            pencil=false;
            square=false;
            circle=false;
            arrow=false;
            comment=false;
        }
        alert(pencil);
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
}



function handleImageView(files){		
    canvas=document.getElementById("canvas")
    var file = files[0];
    if(!file.type.match(/image.*/)){
        alert("not image file!");
    }			
    var reader = new FileReader();	
    reader.onload = function(e){
        var img = new Image();
        img.onload = function(){
            var ctx = document.getElementById("canvas").getContext("2d");
            ctx.drawImage(img,0,0, canvas.width, canvas.height);
        }
        img.src = e.target.result;
    }

    reader.readAsDataURL(file);
}
