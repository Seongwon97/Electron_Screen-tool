console.log('From index.js');


const BrowserWindow = require('electron').remote.BrowserWindow;
const path = require('path')
const url = require('url')

const newWindowBtn = document.getElementById('newWindowBtn');
newWindowBtn.addEventListener('click', function(event){
    let newWin = new BrowserWindow;

    newWin.loadURL(url.format({
        pathname: path.join(__dirname, '../html/second.html'),
        protocol: 'file:',
        slashes: true
      }));
})