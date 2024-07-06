const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
// getContext() method會回傳一個canvas的drawing context
// drawing context 可以用在canvas內畫圖
const unit = 20;
const row = canvas.height / unit;
const column = canvas.width / unit;
let bombCounter = 0; //Set the timer to count when to change location

let snake = []; //array中的每個元素,都是一個物件
// 物件工作是, 儲存身體的x, y座標
function createSnake() {
  snake[0] = {
    x: 0,
    y: 100,
  };
  snake[1] = {
    x: 0,
    y: 80,
  };
  snake[2] = {
    x: 0,
    y: 60,
  };
  snake[3] = {
    x: 0,
    y: 40,
  };
  snake[4] = {
    x: 0,
    y: 20,
  };
}

class Fruit {
  constructor() {
    this.x = Math.floor(Math.random() * column) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }
  drawFruit() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, unit, unit);
  }

  pickFruitLocation() {
    let overlapping = false;
    let new_fruit_x;
    let new_fruit_y;

    function checkOverlap(new_fruit_x, new_fruit_y) {
      for (let i = 0; i < snake.length; i++) {
        if (new_fruit_x == snake[i].x && new_fruit_y == snake[i].y) {
          overlapping = true; //檢查新位置跟蛇有沒有重疊
          return;
        } else if (new_fruit_x == Toxic.x && new_fruit_y == Toxic.y) {
          overlapping = true; //檢查新位置跟毒品有沒有重疊
          return;
        } else if (new_fruit_x == Bomb.x && new_fruit_y == Bomb.y) {
          overlapping = true; //檢查新位置跟炸彈有沒有重疊
          return;
        } else {
          overlapping = false;
          return;
        }
      }
    }

    do {
      new_fruit_x = Math.floor(Math.random() * column) * unit; //換位置
      new_fruit_y = Math.floor(Math.random() * row) * unit;
      checkOverlap(new_fruit_x, new_fruit_y);
    } while (overlapping);
    this.x = new_fruit_x;
    this.y = new_fruit_y;
  }
}

class Toxic {
  constructor() {
    this.x = Math.floor(Math.random() * column) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }
  drawToxic() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, unit, unit);
  }

  pickToxicLocation() {
    let overlapping = false;
    let new_toxic_x;
    let new_toxic_y;

    function checkOverlap(new_toxic_x, new_toxic_y) {
      for (let i = 0; i < snake.length; i++) {
        if (new_toxic_x == snake[i].x && new_toxic_y == snake[i].y) {
          overlapping = true; //檢查新位置跟蛇有沒有重疊
          toxic_time = 0;
          return;
        } else if (new_toxic_x == Fruit.x && new_toxic_y == Fruit.y) {
          overlapping = true; //檢查新位置跟果實有沒有重疊
          return;
        } else if (new_toxic_x == Bomb.x && new_toxic_y == Bomb.y) {
          overlapping = true; //檢查新位置跟炸彈有沒有重疊
          return;
        } else {
          overlapping = false;
          return;
        }
      }
    }

    do {
      new_toxic_x = Math.floor(Math.random() * column) * unit; //換位置
      new_toxic_y = Math.floor(Math.random() * row) * unit;
      checkOverlap(new_toxic_x, new_toxic_y);
    } while (overlapping);
    this.x = new_toxic_x;
    this.y = new_toxic_y;
  }
}

class Bomb {
  constructor() {
    this.x = Math.floor(Math.random() * column) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }
  drawBomb() {
    ctx.fillStyle = "lightgreen";
    ctx.fillRect(this.x, this.y, unit, unit);
  }

  pickBombLocation() {
    let overlapping = false;
    let new_bomb_x;
    let new_bomb_y;

    function checkOverlap(new_bomb_x, new_bomb_y) {
      for (let i = 0; i < snake.length; i++) {
        if (new_bomb_x == snake[i].x && new_bomb_y == snake[i].y) {
          overlapping = true; //檢查新位置跟蛇有沒有重疊
          return;
        } else if (new_bomb_x == Fruit.x && new_bomb_y == Fruit.y) {
          overlapping = true; //檢查新位置跟果實有沒有重疊
          return;
        } else if (new_bomb_x == Toxic.x && new_bomb_y == Toxic.y) {
          overlapping = true; //檢查新位置跟毒品有沒有重疊
          return;
        } else {
          overlapping = false;
          return;
        }
      }
    }

    do {
      new_bomb_x = Math.floor(Math.random() * column) * unit; //換位置
      new_bomb_y = Math.floor(Math.random() * row) * unit;
      checkOverlap(new_bomb_x, new_bomb_y);
    } while (overlapping);
    this.x = new_bomb_x;
    this.y = new_bomb_y;
  }
}

//初始設定
createSnake();
let myFruit = new Fruit();
let myToxic = new Toxic();
let myBomb = new Bomb();

addEventListener("keydown", changeDirection);
let d = "Down";
function changeDirection(e) {
  //鍵盤下指令同時不要讓蛇180度迴轉
  if ((e.keyCode == 65 || e.keyCode == 37) && d != "Right") {
    d = "Left";
  } else if ((e.keyCode == 68 || e.keyCode == 39) && d != "Left") {
    d = "Right";
  } else if ((e.keyCode == 87 || e.keyCode == 38) && d != "Down") {
    d = "Up";
  } else if ((e.keyCode == 83 || e.keyCode == 40) && d != "Up") {
    d = "Down";
  }
  //按鍵之後在下一幀畫出來之前不接受任何keydown事件
  //防止連續按鍵導致蛇邏輯上自殺
  removeEventListener("keydown", changeDirection);
}

let highestScore;
loadHighestScore();
let score = 0;
document.getElementById("myScore").innerHTML = "Score : " + score;
document.getElementById("myScore2").innerHTML =
  "Highest Score : " + highestScore;

function draw() {
  //每次畫圖之前,確認蛇有沒有咬到自己
  for (i = 1; i < snake.length; i++) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      clearInterval(myGame);
      alert("Game Over");
      return;
    }
  }
  if (score < -3) {
    clearInterval(myGame);
    alert("Game Over");
    return;
  }
  if (snake[0].x == myBomb.x && snake[0].y == myBomb.y) {
    clearInterval(myGame);
    alert("Game Over");
    return;
  }
  //每次draw都重新背景設定黑色, 並重畫蛇
  //沒加這段會一直覆蓋
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  myFruit.drawFruit();
  myToxic.drawToxic();
  myBomb.drawBomb();
  //畫蛇
  for (let i = 0; i < snake.length; i++) {
    if (i == 0) {
      ctx.fillStyle = "lightgreen";
    } else {
      ctx.fillStyle = "lightblue";
    }
    ctx.strokeStyle = "white";

    if (snake[i].x >= canvas.width) {
      snake[i].x = 0;
    } else if (snake[i].x < 0) {
      snake[i].x = canvas.width - unit;
    } else if (snake[i].y >= canvas.height) {
      snake[i].y = 0;
    } else if (snake[i].y < 0) {
      snake[i].y = canvas.height - unit;
    }

    // x, y, width, height
    ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
  }

  //以目前d的變數方向, 決定蛇的下一幀要放在哪個座標
  let snakeX = snake[0].x; //snake[0]是一個物件,snake[0].x是一個number
  let snakeY = snake[0].y;
  if (d == "Left") {
    snakeX -= unit;
  } else if (d == "Right") {
    snakeX += unit;
  } else if (d == "Up") {
    snakeY -= unit;
  } else if (d == "Down") {
    snakeY += unit;
  }

  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  if (bombCounter % 50 == 0) {
    myBomb.pickBombLocation(); //防止剛好在炸彈換位置時間到時蛇吃到東西的問題
    if (snake[0].x == myFruit.x && snake[0].y == myFruit.y) {
      //確認蛇有沒有吃到果實
      myFruit.pickFruitLocation();
      //重新選隨機位置畫果實
      score++;
      document.getElementById("myScore").innerHTML = "Score : " + score;
      setHighestScore(score);
      document.getElementById("myScore2").innerHTML =
        "Highest Score : " + highestScore;
      //更新分數
    } else if (snake[0].x == myToxic.x && snake[0].y == myToxic.y) {
      snake.pop();
      snake.pop();
      myToxic.pickToxicLocation();
      //重新選隨機位置畫毒品
      score--;
      document.getElementById("myScore").innerHTML = "Score : " + score;
      setHighestScore(score);
      document.getElementById("myScore2").innerHTML =
        "Highest Score : " + highestScore;
      //更新分數
    } else {
      snake.pop();
    }
  } else {
    if (snake[0].x == myFruit.x && snake[0].y == myFruit.y) {
      //確認蛇有沒有吃到果實
      myFruit.pickFruitLocation();
      //重新選隨機位置畫果實
      score++;
      document.getElementById("myScore").innerHTML = "Score : " + score;
      setHighestScore(score);
      document.getElementById("myScore2").innerHTML =
        "Highest Score : " + highestScore;
      //更新分數
    } else if (snake[0].x == myToxic.x && snake[0].y == myToxic.y) {
      snake.pop();
      snake.pop();
      myToxic.pickToxicLocation();
      //重新選隨機位置畫毒品
      score--;
      document.getElementById("myScore").innerHTML = "Score : " + score;
      setHighestScore(score);
      document.getElementById("myScore2").innerHTML =
        "Highest Score : " + highestScore;
      //更新分數
    } else {
      snake.pop();
    }
  }

  snake.unshift(newHead);
  addEventListener("keydown", changeDirection);
}
let hardNess = 140 - score * 5; //可改用選單選擇難度, 或長度越長難度越高

if (hardNess < 40) {
  hardNess = 40;
} else {
  hardNess = hardNess;
}

let myGame = setInterval(draw, hardNess);
//可以考慮吃了會遊戲結束的果實
let myBombCounter = setInterval(() => {
  bombCounter++;
  // console.log(bombCounter);
}, hardNess); //隨著分數換位置時間越來越快,同時順應幀數換位置

function loadHighestScore() {
  if (localStorage.getItem("highestScore") == null) {
    highestScore = 0;
  } else {
    highestScore = Number(localStorage.getItem("highestScore"));
  }
}

function setHighestScore(score) {
  if (score > highestScore) {
    localStorage.setItem("highestScore", score);
    highestScore = score;
  }
}
