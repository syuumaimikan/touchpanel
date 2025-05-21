let selectedName = null;
let selectedTodo = null;
let isBusy = false;
let isCameraOn = false;

const names = document.querySelectorAll(".names li");
const todo = document.querySelectorAll(".todo li");
const buzzer = document.getElementById("buzzer");
const cameraWidth = 1280;
const cameraHeight = 720;
const name_color = "#e6f2ff";
const todo_color = "#ffe6e6";
const selected_color = "lightblue";

const showCameraStatus = (show) => {
  const statusEl = document.getElementById("camera-status");
  statusEl.style.display = show ? "block" : "none";
};

const cameraInit = () => {
  if (isCameraOn) return;

  const video = document.getElementById("camera");
  const cameraSetting = {
    audio: false,
    video: {
      width: cameraWidth,
      height: cameraHeight,
      facingMode: "environment",
    },
  };

  navigator.mediaDevices
    .getUserMedia(cameraSetting)
    .then((mediaStream) => {
      video.srcObject = mediaStream;
      isCameraOn = true;
      showCameraStatus(true);

      setTimeout(() => {
        mediaStream.getTracks().forEach((track) => track.stop());
        video.srcObject = null;
        isCameraOn = false;
        showCameraStatus(false);
      }, 15000);
    })
    .catch((err) => {
      console.log(err.toString());
      isCameraOn = false;
      showCameraStatus(false);
    });
};

names.forEach((item) => {
  item.style.backgroundColor = name_color;
  item.addEventListener("click", function () {
    if (isBusy) return;

    if (selectedName === this) {
      this.style.backgroundColor = name_color;
      selectedName = null;
    } else {
      if (selectedName) selectedName.style.backgroundColor = name_color;
      this.style.backgroundColor = selected_color;
      selectedName = this;
    }
    check();
  });
});

todo.forEach((item) => {
  item.style.backgroundColor = todo_color;
  item.addEventListener("click", function () {
    if (isBusy) return;

    if (selectedTodo === this) {
      this.style.backgroundColor = todo_color;
      selectedTodo = null;
    } else {
      if (selectedTodo) selectedTodo.style.backgroundColor = todo_color;
      this.style.backgroundColor = selected_color;
      selectedTodo = this;
    }
    check();
  });
});

function check() {
  if (selectedName && selectedTodo) {
    isBusy = true;
    console.log(
      `Name: ${selectedName.textContent}, Todo: ${selectedTodo.textContent}`
    );
    buzzer.play();
    cameraInit();

    const nameElem = selectedName;
    const todoElem = selectedTodo;

    selectedName = null;
    selectedTodo = null;

    // ブザーの再生が終わった後に背景をリセットし、再操作を許可
    buzzer.onended = () => {
      nameElem.style.backgroundColor = name_color;
      todoElem.style.backgroundColor = todo_color;
      isBusy = false;
    };
  }
}

function showClock() {
  let nowTime = new Date();
  let nowHour = nowTime.getHours();
  let nowMin = nowTime.getMinutes();
  let nowSec = nowTime.getSeconds();
  let msg = "現在時刻：" + nowHour + ":" + nowMin + ":" + nowSec;
  document.getElementById("realtime").innerHTML = msg;
}
setInterval("showClock()", 1000);
