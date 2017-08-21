/* 全局变量-四个方向 */
var UP = 1
var DOWN = -1
var LEFT = 2
var RIGHT = -2
/* 蛇移动的方向 */
var Direction = null

function init() {
  var snakes = _initSnake() // 初始化蛇的坐标
  Direction = DOWN // 初始化蛇的移动方向
  document.getElementById('app').appendChild(createCanvas()) // 创建画布
  var stage = new createjs.Stage("demoCanvas")
  var grid = new createjs.Shape()
  var snake = new createjs.Shape()
  drawGrid(grid.graphics)
  stage.addChild(grid)
  stage.addChild(snake)
  createjs.Ticker.setFPS(60)
  createjs.Ticker.addEventListener("tick", function () {
    stage.update()
  })
  //
  move(snake.graphics, snakes)
}

var test = 0

function move(graphics, snakes) {
  _run()

  function _run() {
    updateSnake(snakes, Direction)
    drawSnake(graphics, snakes)
    test++
    if (test > 100) return
    setTimeout(_run, 1000)
  }
}

function updateSnake(snakes, direction) {
  snakes.shift()
  var oldHead = snakes[snakes.length - 1]
  var p = new Point(oldHead.x, oldHead.y)
  p.update(_gridW(), direction)
  snakes.push(p)
}

/**
 * 绘制蛇
 * @param graphics
 * @param snakes // 蛇坐标
 */
function drawSnake(graphics, snakes) {
  console.log('drawSnake')
  graphics.clear()
  graphics.beginFill("DeepSkyBlue")
  for (var i = 0; i < snakes.length; i++) {
    graphics.drawRect(snakes[i].x, snakes[i].y, _gridW(), _gridW());
  }
}

/**
 * 改变蛇行进方向
 * @param dir
 */
function changeDirection(dir) {
  /* 逆向及同向则不改变 */
  if (Direction + dir === 0 || Direction === dir) return
  Direction = dir
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
 * 初始化蛇的坐标
 * @returns {[Point,Point,Point,Point,Point ...]}
 * @private
 */
function _initSnake() {
  return [
    new Point(_padding().w / 2, _padding().h / 2),
    new Point(_gridW() + _padding().w / 2, _padding().h / 2),
    new Point(_gridW() * 2 + _padding().w / 2, _padding().h / 2),
    new Point(_gridW() * 3 + _padding().w / 2, _padding().h / 2),
    new Point(_gridW() * 4 + _padding().w / 2, _padding().h / 2),
  ]
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