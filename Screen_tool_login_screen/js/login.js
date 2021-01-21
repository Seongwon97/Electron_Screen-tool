console.log('From index.js');
function login(){
    //var email=document.getElementById("userEmail").value();
    //const email="abcdef"
    alert("email");
    location.href="../html/main.html"
}
$('body').on('click', '#messages-view a', (event) => {
    event.preventDefault();
    let link = event.target.href;
    require("electron").shell.openExternal(link);
  });