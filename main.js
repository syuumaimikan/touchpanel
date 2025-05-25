// Electronの主要モジュールをインポート
const { app, BrowserWindow, screen } = require("electron");
// カメラ・マイクのアクセス許可ダイアログを自動で許可する（テスト用）
app.commandLine.appendSwitch("use-fake-ui-for-media-stream");

// メインウィンドウ生成関数
const createWindow = () => {
  // ディスプレイの作業領域サイズを取得
  const { width, height } = screen.getPrimaryDisplay().workAreaSize; // 画面サイズ取得
  const mainWindow = new BrowserWindow({
    width: width, // 画面幅いっぱい
    height: height, // 画面高さいっぱい
    title: "touch_panel", // ウィンドウタイトル
    fullscreen: true, // フルスクリーン表示
    autoHideMenuBar: true, // メニューバー非表示
    frame: false, // 枠なしウィンドウ
    alwaysOnTop: true, // 常に最前面
  });
  mainWindow.setVisibleOnAllWorkspaces(true); // 仮想デスクトップ間でも常に表示
  mainWindow.loadFile("index.html"); // メインHTMLを読み込み
};

// アプリ起動時にウィンドウ生成
app.once("ready", () => {
  createWindow();
});

// 全ウィンドウが閉じられたらアプリ終了
app.once("window-all-closed", () => app.quit());
