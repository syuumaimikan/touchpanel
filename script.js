// 名前リスト、ToDoリスト、状態管理用の変数
let selectedName = null; // 選択中の名前リスト要素
let selectedTodo = null; // 選択中のToDoリスト要素
let isBusy = false; // 呼び出し中かどうかのフラグ
let isCameraOn = false; // カメラが起動中かどうかのフラグ
let currentStream = null; // 現在のカメラストリーム
let cameraTimeout = null; // カメラ自動停止用タイマー

// DOM要素の取得
const names = document.querySelectorAll(".names li"); // 名前リストのli要素
const todo = document.querySelectorAll(".todo li"); // ToDoリストのli要素
const buzzer = document.getElementById("buzzer"); // ブザー音再生用audio要素
const call = document.getElementById("call"); // 呼び出しボタン
const cancel = document.getElementById("cancel"); // キャンセルボタン
const audio_sorce = document.getElementById("audio_sorce"); // audioのsource要素
const cameraWidth = 1280; // カメラ映像の幅
const cameraHeight = 720; // カメラ映像の高さ
const name_color = "#797979"; // 名前リストの通常色
const todo_color = "#797979"; // ToDoリストの通常色
const call_cancel_color = "#797979"; // ボタンの通常色
const selected_color = "#14004b"; // 選択時の色

// ブザー音ファイルのリスト（ランダム再生用）
const mp3s = [
  "buzzer01.mp3",
  "buzzer02.mp3",
  "buzzer03.mp3",
  "buzzer04.mp3",
  "buzzer05.mp3",
];

// カメラ停止処理
// 現在のカメラストリームを停止し、srcObjectを解除、タイマーもクリア
const stopCamera = () => {
  if (currentStream) {
    currentStream.getTracks().forEach((track) => track.stop()); // 全トラック停止
    document.getElementById("camera").srcObject = null; // 映像解除
    currentStream = null;
  }
  isCameraOn = false;
  if (cameraTimeout) {
    clearTimeout(cameraTimeout); // タイマー解除
    cameraTimeout = null;
  }
};

// カメラ初期化処理
// 既存ストリームがあれば停止し、カメラ映像を取得してvideo要素に表示
const cameraInit = () => {
  if (isCameraOn || currentStream) {
    stopCamera();
  }

  const video = document.getElementById("camera");
  const cameraSetting = {
    audio: false, // 音声は不要
    video: {
      width: cameraWidth, // 指定サイズ
      height: cameraHeight,
      facingMode: "environment", // 背面カメラ優先
    },
  };

  navigator.mediaDevices
    .getUserMedia(cameraSetting)
    .then((mediaStream) => {
      video.srcObject = mediaStream; // 映像をvideoにセット
      currentStream = mediaStream;
      isCameraOn = true;
    })
    .catch((err) => {
      console.log(err.toString()); // エラー時はログ出力
      isCameraOn = false;
    });
};

// 名前リストのクリックイベント登録
// クリックで選択状態を切り替え、色を変更
names.forEach((item) => {
  item.style.backgroundColor = name_color;
  item.addEventListener("click", function () {
    if (isBusy) return; // 呼び出し中は操作不可
    if (selectedName === this) {
      this.style.backgroundColor = name_color; // 選択解除
      selectedName = null;
    } else {
      if (selectedName) selectedName.style.backgroundColor = name_color; // 前の選択を戻す
      this.style.backgroundColor = selected_color; // 新しい選択
      selectedName = this;
    }
  });
});

// ToDoリストのクリックイベント登録
// クリックで選択状態を切り替え、色を変更
todo.forEach((item) => {
  item.style.backgroundColor = todo_color;
  item.addEventListener("click", function () {
    if (isBusy) return; // 呼び出し中は操作不可
    if (selectedTodo === this) {
      this.style.backgroundColor = todo_color; // 選択解除
      selectedTodo = null;
    } else {
      if (selectedTodo) selectedTodo.style.backgroundColor = todo_color; // 前の選択を戻す
      this.style.backgroundColor = selected_color; // 新しい選択
      selectedTodo = this;
    }
  });
});

// 呼び出し処理
// 選択中の名前・ToDoで呼び出しを実行し、ブザー音再生・カメラ起動
function check(nameElem, todoElem) {
  isBusy = true; // 呼び出し中フラグON
  console.log(`Name: ${nameElem.textContent}, Todo: ${todoElem.textContent}`); // 選択内容をログ
  const randomIndex = Math.floor(Math.random() * mp3s.length); // ランダムで音選択
  const selectedFile = "./assets/buzzer/" + mp3s[randomIndex];
  audio_sorce.src = selectedFile; // 音源セット
  buzzer.load();
  buzzer.play(); // 再生開始
  cameraInit(); // カメラ起動

  /*
  // 解除とリセット処理（未使用）
  buzzer.onended = () => {
    nameElem.style.backgroundColor = name_color;
    todoElem.style.backgroundColor = todo_color;
    call.style.backgroundColor = todo_color;
    isBusy = false;
    selectedName = null;
    selectedTodo = null;
  };
  */
}

// 呼び出しボタンのクリックイベント
// 名前・ToDo両方選択時のみ呼び出し処理を実行
call.addEventListener("click", () => {
  if (selectedName && selectedTodo) {
    call.style.backgroundColor = selected_color; // ボタン色変更
    check(selectedName, selectedTodo);
  }
});

// キャンセルボタンのクリックイベント
// 呼び出し中のみ、音・カメラ停止、状態リセット
cancel.addEventListener("click", () => {
  if (isBusy) {
    cancel.style.backgroundColor = selected_color; // ボタン色変更
    buzzer.pause(); // 音停止
    buzzer.currentTime = 0; // 再生位置リセット
    stopCamera(); // カメラ停止
    console.log(currentStream); // デバッグ用
    if (currentStream) {
      currentStream.getTracks().forEach((track) => track.stop());
      document.getElementById("camera").srcObject = null;
      currentStream = null;
      console.log(currentStream);
    }
    if (selectedName) selectedName.style.backgroundColor = name_color; // 選択色リセット
    if (selectedTodo) selectedTodo.style.backgroundColor = todo_color;
    call.style.backgroundColor = call_cancel_color; // ボタン色リセット
    selectedName = null;
    selectedTodo = null;
    isBusy = false;
    setTimeout(() => {
      cancel.style.backgroundColor = call_cancel_color; // ボタン色を元に戻す
    }, 250);
  }
});

// 時計表示処理
// 現在時刻を「YYYY年MM月DD日(曜) HH:MM:SS」形式で表示
function showClock() {
  const weeks = ["日", "月", "火", "水", "木", "金", "土"]; // 曜日配列
  const date = new Date(); // 現在日時取得
  const str_data = `${date.getFullYear()}年${String(
    date.getMonth() + 1
  ).padStart(2, "0")}月${String(date.getDate()).padStart(2, "0")}日(${
    weeks[date.getDay()]
  }) ${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes()
  ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`; // フォーマット
  document.getElementById("realtime").innerHTML = str_data; // 画面に反映
}
setInterval(showClock, 1000); // 1秒ごとに時計更新
