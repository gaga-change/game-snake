/* 全局变量-四个方向 */
var UP = 1
var DOWN = -1
var LEFT = 2
var RIGHT = -2
/* 全局变量 - 游戏状态*/
var END = 1 // 结束
var READY = 2 // 准备
var PLAYING = 3 // 游戏中
/* 蛇移动的方向 */
var DirectionOld = null
var DirectionNew = null
/* 游戏状态 */
var GameState = null

function init() {
  var snakes = _initSnake() // 初始化蛇的坐标
  DirectionOld = DirectionNew = DOWN // 初始化蛇的移动方向
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
  GameState = READY // 准备流程结束
  move(snake.graphics, snakes)
}

/**
 * 跑动引擎
 * @param graphics
 * @param snakes
 */
function move(graphics, snakes) {
  _run()

  function _run() {
    DirectionOld = DirectionNew
    updateSnake(snakes, DirectionOld)
    if (GameState === END) return
    drawSnake(graphics, snakes)
    setTimeout(_run, 1000)
  }
}

/**
 * 改变蛇身坐标
 * @param snakes
 * @param direction
 */
function updateSnake(snakes, direction) {
  var oldHead = snakes[snakes.length - 1]
  var p = new Point(oldHead.x, oldHead.y)
  p.update(_gridW(), direction)
  // 超出边界 游戏结束
  if (p.x < 0 || p.x >= _num().w || p.y < 0 || p.y >= _num().h) {
    GameState = END
    return
  }
  var shiftPoint = snakes.shift()
  snakes.push(p)
  // ‘吃’到自己 游戏结束
  if (snakes.some(function (p1, index1) {
      return snakes.some(function (p2, index2) {
        return p2.x === p1.x && p2.y === p1.y && index1 !== index2
      })
    })) {
    snakes.unshift(shiftPoint) // 还原被删掉的末尾
    snakes.pop() // 删除新添的头部
    GameState = END
    return
  }
}

/**
 * 绘制蛇
 * @param graphics
 * @param snakes // 蛇坐标
 */
function drawSnake(graphics, snakes) {
  graphics.clear()
  graphics.beginFill("#a088ff")
  for (var i = 0; i < snakes.length; i++) {
    if (i === snakes.length - 1) graphics.beginFill("#ff6ff9")
    graphics.drawRect(
      snakes[i].x * _gridW() + _padding().w / 2,
      snakes[i].y * _gridW() + _padding().h / 3,
      _gridW(), _gridW());
  }
}

/**
 * 改变蛇行进方向
 * @param dir
 */
function changeDirection(dir) {
  /* 逆向及同向则不改变 */
  if (DirectionOld + dir === 0
    || DirectionOld === dir
  ) return
  DirectionNew = dir
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
  graphics.setStrokeStyle(.1).beginStroke('#ffac52')
  /* 横向 */
  for (var i = 0; i <= hNum; i++) {
    if (i === hNum || i === 0) graphics.setStrokeStyle(1)
    if (i === 1) graphics.setStrokeStyle(.1)
    graphics.moveTo(paddingW / 2, i * w + paddingH / 2)
    .lineTo(_w() - paddingW / 2, i * w + paddingH / 2)
  }
  graphics.setStrokeStyle(.1)
  /* 纵向 */
  for (i = 0; i <= wNum; i++) {
    if (i === wNum || i === 0) graphics.setStrokeStyle(1)
    if (i === 1) graphics.setStrokeStyle(.1)
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
    new Point(0, 0),
    new Point(1, 0),
    new Point(2, 0),
    new Point(3, 0),
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