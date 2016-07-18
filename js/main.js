const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

let score = 0;
let lives = 3;

// Glass sound fx
let glassShattering = document.getElementById("glassShattering");
console.log(glassShattering);

function soundGlass() {
  glassShattering.play();
}

// Baseball
let ballX = canvas.width / 2;
let ballY = canvas.height - 50;
let ballRadius = 15;
let ballColor = "#fdfdfd";

let dX = 2;
let dY = -2;

function drawBall() {
  context.beginPath();
  context.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  context.fillStyle = ballColor;
  context.fill();
  context.closePath();
}

// Baseball bat
let batWidth = 150;
let batHeight = 15;
let batColor = "#b66a24";

let batX = (canvas.width - batWidth) / 2;

function drawBat() {
  context.beginPath();
  context.rect(batX, canvas.height - batHeight, batWidth, batHeight);
  context.fillStyle = batColor;
  context.fill();
  context.closePath();
}

// House
function drawHouse() {
  context.beginPath();
  context.rect(30, 0, 840, 450);
  context.fillStyle = `#983131`;
  context.fill();
  context.closePath();

  context.beginPath();
  context.rect(400, 390, 100, 60);
  context.fillStyle = `#6b4123`;
  context.fill();
  context.closePath();
}

// Windows
let windowRowCount = 3;
let windowColumnCount = 9;
let windowWidth = 50;
let windowHeight = 65;
let windowPaddingLeftRight = 30;
let windowPaddingTopBottom = 15;
let windowOffsetTop = 50;
let windowOffsetLeft = 105;
let windowColor = "#b5e1f6";
let totalWindows = windowRowCount * windowColumnCount;

let windows = [];
for(let col = 0; col < windowColumnCount; col++) {
    windows[col] = [];
    for(let row = 0; row < windowRowCount; row++) {
      windows[col][row] = { x: 0, y: 0, status: 1 };
    }
}

function drawWindows() {
  for(let col = 0; col < windowColumnCount; col++) {
    for(let row = 0; row < windowRowCount; row++) {
      if (windows[col][row].status === 1){
        let windowX = (col * (windowWidth + windowPaddingLeftRight)) + windowOffsetLeft;
        let windowY = (row * (windowHeight + windowPaddingTopBottom)) + windowOffsetTop;
        windows[col][row].x = windowX;
        windows[col][row].y = windowY;
        context.beginPath();
        context.rect(windowX, windowY, windowWidth, windowHeight);
        // context.fillStyle = "rgba(#68c7f5, 0.66)";
        context.fillStyle = windowColor;
        context.fill();
        context.closePath();
      }
    }
  }
}

let keyRight = false;
let keyLeft = false;

function render() {
  swal({   title: "Sweet!",   text: "Here's a custom image.",   imageUrl: "images/thumbs-up.jpg" });
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawHouse();
  drawWindows();
  drawBall();
  drawBat();
  drawScore();
  drawLives();
  collisionFlash();
  collisionDetection();


  if(ballX + dX > canvas.width-ballRadius || ballX + dX < ballRadius) {
    dX = -dX;
  }
  if(ballY + dY < ballRadius) {
    dY = -dY;
  } else if (ballY + dY > canvas.height - ballRadius - batHeight) {
    if (ballX > batX && ballX < batX + batWidth) {
      dY = -dY;
    } else {
      lives--;
      if(!lives) {
        alert("Game Over, breh");
        document.location.reload();
      }
      else {
        ballX = canvas.width / 2;
        ballY = canvas.height - 30;
        dX = 2;
        dY = -2;
        batX = (canvas.width - batWidth) / 2;
      }
    }
  }

  ballX += dX;
  ballY += dY;

  if (keyRight && batX < canvas.width - batWidth) {
    batX += 8;
  } else if (keyLeft && batX > 0) {
    batX -= 8;
  }
}

document.addEventListener("keydown", handleKeyDown, false);
document.addEventListener("keyup", handleKeyUp, false);
document.addEventListener("mousemove", handleMouseMove, false);

function handleKeyDown(e) {
  if (e.keyCode === 39) {
    keyRight = true;
  } else if (e.keyCode === 37) {
    keyLeft = true;
  }
}

function handleKeyUp(e) {
  if (e.keyCode === 39) {
    keyRight = false;
  } else if (e.keyCode === 37) {
    keyLeft = false;
  }
}

function handleMouseMove(e) {
  let relX = e.clientX - canvas.offsetLeft;
  if (relX > 0 && relX < canvas.width) {
    batX = relX - (batWidth / 2);
  }
}

function collisionDetection() {
  for(let col = 0; col < windowColumnCount; col++) {
    for(let row = 0; row < windowRowCount; row++) {
      let w = windows[col][row];
      if (w.status === 1) {
        if(ballX > w.x && ballX < (w.x + windowWidth) && ballY > w.y && ballY < (w.y + windowHeight)) {
          dY = -dY;
          w.status = 0;
          score++;
          soundGlass();
          flashFrames = 5;
          if (score === totalWindows) {
            alert("You successfully smashed all the windows! ...But they've called the cops on you. Run!");
            document.location.reload();
          }
        }
      }
    }
  }
}

let bgRed = 204;
let bgColor = `rgba(${bgRed}, 242, 180, 1)`;
canvas.style.backgroundColor = bgColor;
let colorSliderdx = 10;
let flashFrames = 1;

function collisionFlash() {
  if (flashFrames == 5) {
    canvas.style.backgroundColor = `white`;
    windowColor = `yellow`;
    ballRadius = 15;
    ballColor = `purple`;
    flashFrames -= 1;
  } else if (flashFrames < 5 && flashFrames > 1) {
    flashFrames -= 1;
  } else if (flashFrames == 1){
    windowColor = "#b5e1f6";
    bgRed -= 15;
    canvas.style.backgroundColor = `tan`;
    flashFrames -= 1;
    ballRadius = 15;
    ballColor = "#fdfdfd";
  }
}

function drawScore() {
  context.fillStyle = "#666";
  context.font = "24px Montserrat";
  context.fillText("Score: " + score, 20, canvas.height - 30);
}

function drawLives() {
  context.fillStyle = "#666";
  context.fillText("Lives: " + lives, canvas.width - 100, canvas.height - 30);
}

setInterval(render, 10);
