const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
//const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')


let win;

function createWindow () {

  win = new BrowserWindow({width: 1200, height: 800, resizable: false})
  
  win.removeMenu()
  win.loadURL(url.format({
    pathname: path.join(__dirname, '/html/login.html'),
    protocol: 'file:',
    slashes: true
  })); // 'index.html' 파일을 이용하여 browser window생성


  //win.webContents.openDevTools();
    //사용자 툴이 나오도록 하는 코드


  win.on('closed', () => {
    win = null
  }); //사용자가 윈도우를 닫을 수 있도록 설정
}

app.on('ready', createWindow);
//initialize 작업이 완료되면 createWindow를 실행.

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});