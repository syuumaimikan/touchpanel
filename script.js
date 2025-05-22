let selectedName = null;
let selectedTodo = null;
let isBusy = false;
let isCameraOn = false;
let currentStream = null;
let cameraTimeout = null;

const names = document.querySelectorAll(".names li");
const todo = document.querySelectorAll(".todo li");
const buzzer = document.getElementById("buzzer");
const call = document.getElementById("call");
const cancel = document.getElementById("cancel");
const audio_sorce = document.getElementById("audio_sorce");
const cameraWidth = 1280;
const cameraHeight = 720;
const name_color = "#797979";
const todo_color = "#797979";
const call_cancel_color = "#797979";
const selected_color = "#14004b";

const mp3s = [
  "buzzer01.mp3",
  "buzzer02.mp3",
  "buzzer03.mp3",
  "buzzer04.mp3",
  "buzzer05.mp3",
];

const stopCamera = () => {
  if (currentStream) {
    currentStream.getTracks().forEach((track) => track.stop());
    document.getElementById("camera").srcObject = null;
    currentStream = null;
  }
  isCameraOn = false;
  if (cameraTimeout) {
    clearTimeout(cameraTimeout);
    cameraTimeout = null;
  }
};

const cameraInit = () => {
  if (isCameraOn || currentStream) {
    stopCamera();
  }

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
      currentStream = mediaStream;
      isCameraOn = true;
    })
    .catch((err) => {
      console.log(err.toString());
      isCameraOn = false;
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
  });
});

function check(nameElem, todoElem) {
  isBusy = true;
  console.log(`Name: ${nameElem.textContent}, Todo: ${todoElem.textContent}`);
  const randomIndex = Math.floor(Math.random() * mp3s.length);
  const selectedFile = "./assets/buzzer/" + mp3s[randomIndex];
  audio_sorce.src = selectedFile;
  buzzer.load();
  buzzer.play();
  cameraInit();

  /*
  // 解除とリセット処理
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

call.addEventListener("click", () => {
  if (selectedName && selectedTodo) {
    call.style.backgroundColor = selected_color;
    check(selectedName, selectedTodo);
  }
});

cancel.addEventListener("click", () => {
  if (isBusy) {
    cancel.style.backgroundColor = selected_color;
    buzzer.pause();
    buzzer.currentTime = 0;
    stopCamera();
    console.log(currentStream);
    if (currentStream) {
      currentStream.getTracks().forEach((track) => track.stop());
      document.getElementById("camera").srcObject = null;
      currentStream = null;
      console.log(currentStream);
    }
    if (selectedName) selectedName.style.backgroundColor = name_color;
    if (selectedTodo) selectedTodo.style.backgroundColor = todo_color;
    call.style.backgroundColor = call_cancel_color;
    selectedName = null;
    selectedTodo = null;
    isBusy = false;
    setTimeout(() => {
      cancel.style.backgroundColor = call_cancel_color;
    }, 250);
  }
});

function showClock() {
  const weeks = ["日", "月", "火", "水", "木", "金", "土"];
  const date = new Date();
  const str_data = `${date.getFullYear()}年${String(
    date.getMonth() + 1
  ).padStart(2, "0")}月${String(date.getDate()).padStart(2, "0")}日(${
    weeks[date.getDay()]
  }) ${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes()
  ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
  document.getElementById("realtime").innerHTML = str_data;
}
setInterval(showClock, 1000);
