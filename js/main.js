function init() {
  document.getElementById('app').appendChild(createCanvas())
  var stage = new createjs.Stage("demoCanvas");
  var grid = new createjs.Shape();
  var snake = new createjs.Shape();

  // circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50000)
  // circle.x = 100;
  // circle.y = 100;
  drawGrid(grid.graphics)
  var snakes = [new Point(0, 0), new Point(_gridW(), 0)]
  drawSnake(snake.graphics, snakes)
  stage.addChild(grid);
  stage.addChild(snake);
  setTimeout(function () {
    snakes.push(new Point(_gridW(), _gridW()))
    drawSnake(snake.graphics, snakes)
  }, 1000)
  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener("tick", function () {
    stage.update();
  });
}

function drawSnake(graphics, snakes) {
  graphics.beginFill("DeepSkyBlue")
  for(var i = 0; i < snakes.length; i ++) {
    graphics.drawRect(snakes[i].x, snakes[i].y, _gridW(), _gridW());
  }
}

/**
 * 绘制格子地图
 * @param graphics
 */
function drawGrid(graphics) {
  var gridW = _gridW()
  var paddingW = _padding().w
  var paddingH = _padding().h
  var wNum = _num().w
  var hNum = _num().h
  var w = gridW
  graphics.setStrokeStyle(1).beginStroke('#ffac52')
  /* 横向 */
  for (var i = 0; i <= hNum; i++) {
    graphics.moveTo(paddingW / 2, i * w + paddingH / 2)
    .lineTo(_w() - paddingW / 2, i * w + paddingH / 2)
  }
  /* 纵向 */
  for (i = 0; i <= wNum; i++) {
    graphics.moveTo(i * w + paddingW / 2, paddingH / 2)
    .lineTo(i * w + paddingW / 2, gridW * hNum + paddingH / 2)
  }
}

/**
 * 创建画布
 * @returns {Element}
 */
function createCanvas() {
  var w = _w()
  var h = _h()
  var element = document.createElement('canvas');
  element.setAttribute('id', 'demoCanvas')
  element.setAttribute('width', String(w))
  element.setAttribute('height', String(h))
  return element
}

/**
 * 获取格子宽度（正方形）
 * @returns {number}
 * @private
 */
function _gridW() {
  return Math.floor(_w() / 32)
}

/**
 * 获取横向和纵向的格子数量
 * @returns {{w: number, h: number}}
 * @private
 */
function _num() {
  return {
    w: Math.floor(_w() / _gridW()),
    h: Math.floor(_h() / _gridW())
  }
}

/**
 * 获取绘制地图补丁（如宽11，格子宽2，则补丁是1，因为没有二分之一的格子）
 * @returns {{w: number, h: number}}
 * @private
 */
function _padding() {
  return {
    w: _w() % _gridW(),
    h: _h() % _gridW()
  }
}

/**
 * 获取canvas高度
 * @returns {number}
 * @private
 */
function _h() {
  return Math.floor(window.screen.height * 0.8)
}

/**
 * 获取canvas宽度
 * @returns {number}
 * @private
 */
function _w() {
  return window.screen.width
}