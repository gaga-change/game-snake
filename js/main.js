(function ($) {
  /* 全局变量-四个方向 */
  var UP = 1
  var DOWN = -1
  var LEFT = 2
  var RIGHT = -2
  /* 全局变量 - 游戏状态*/
  var END = 1 // 结束
  var READY = 2 // 准备
  /* 蛇移动的方向 */
  var DirectionOld = null
  var DirectionNew = null
  /* 游戏状态 */
  var GameState = null
  var Scope = null

  function init() {
    updateScope(0) // 初始化分数
    var snakes = _initSnake() // 初始化蛇的坐标
    var fruits = []
    fruits.push(createFruit(snakes, fruits)) // 初始化水果坐标，默认是两个
    fruits.push(createFruit(snakes, fruits))
    DirectionOld = DirectionNew = DOWN // 初始化蛇的移动方向
    document.getElementById('content-canvas').innerHTML = ''
    document.getElementById('content-canvas').appendChild(createCanvas()) // 创建画布
    var stage = new createjs.Stage("demoCanvas")
    var grid = new createjs.Shape()
    var snake = new createjs.Shape()
    var fruit = new createjs.Shape()
    drawGrid(grid.graphics)
    stage.addChild(grid)
    stage.addChild(snake)
    stage.addChild(fruit)
    createjs.Ticker.setFPS(60)
    createjs.Ticker.addEventListener("tick", function () {
      stage.update()
    })
    GameState = READY // 准备流程结束
    drawFruit(fruit.graphics, fruits)
    move({ snake: snake.graphics, fruit: fruit.graphics }, snakes, fruits)
  }

  /**
   * 绑定相关事件（方向键、开始按钮、结束按钮的点击）
   */
  function initEvent() {
    $('#UpBtn').click(function () { changeDirection(UP) })
    $('#LeftBtn').click(function () { changeDirection(LEFT) })
    $('#RightBtn').click(function () { changeDirection(RIGHT) })
    $('#DownBtn').click(function () { changeDirection(DOWN) })
    $('#EndBtn').click(end)
    $('#StartBtn').click(function () {
      $('#MenuArea').hide()
      init()
    })
    var id = null
    $(window).resize(function () {
      // 事件防抖
      if (id) {
        clearTimeout(id)
      }
      id = setTimeout(function () {
        id = null
        swal('当前窗口大小发生调整，页面将刷新！', {
          button: { text: '确定' },
        }).then((value) => {
          location.href = location.href
        })
      }, 1000)
    })
  }

  /** 
   * 游戏结束dom处理
  */
  function end() {
    GameState = END
    $('#MenuArea').show()
  }

  /**
   * 引擎
   * @param graphics
   * @param snakes
   * @param fruits
   */
  function move(graphics, snakes, fruits) {
    clearTimeout(window.engine) // 重启时关停之前的引擎
    _run()

    function _run() {
      DirectionOld = DirectionNew
      fruits = updateSnake(snakes, DirectionOld, fruits) || fruits
      if (GameState === END) {
        end()
        return
      }
      if (fruits.length < 2) {
        fruits.push(createFruit(snakes, fruits))
        drawFruit(graphics.fruit, fruits)
      }
      drawSnake(graphics.snake, snakes)
      window.engine = setTimeout(_run, 500 * Math.pow(0.9, Scope))
    }
  }

  /**
   * 绘制水果
   * @param graphics
   * @param fruits 水果坐标集
   */
  function drawFruit(graphics, fruits) {
    graphics.clear()
    graphics.beginFill("#16ff16")
    for (var i = 0; i < fruits.length; i++) {
      graphics.drawRect(
        fruits[i].x * _gridW() + _padding().w / 2,
        fruits[i].y * _gridW() + _padding().h / 2,
        _gridW(), _gridW())
    }
  }

  /**
   * 创建水果坐标
   * @returns Point
   * @param snakes
   * @param fruits
   */
  function createFruit(snakes, fruits) {
    return (function _createPoint() {
      var p = new Point(Math.floor(Math.random() * _num().w), Math.floor(Math.random() * _num().h))
      if (snakes.some(function (point) {
        return p.x === point.x && p.y === point.y
      }) || fruits.some(function (point) {
        return p.x === point.x && p.y === point.y
      })) {
        return _createPoint()
      }
      return p
    })()
  }

  /**
   * 改变蛇身坐标
   * @param snakes 蛇坐标集
   * @param direction 方向
   * @param fruits 水果坐标集
   */
  function updateSnake(snakes, direction, fruits) {
    var oldHead = snakes[snakes.length - 1]
    var p = new Point(oldHead.x, oldHead.y)
    p.update(_gridW(), direction)
    // 超出边界 游戏结束
    if (p.x < 0 || p.x >= _num().w || p.y < 0 || p.y >= _num().h) {
      GameState = END
      return
    }
    fruits = fruits.filter(function (point) {
      return !(point.x === p.x && point.y === p.y)
    })
    var shiftPoint = null
    if (fruits.length === 2) // 没有吃到水果才消除尾巴
      shiftPoint = snakes.shift()
    snakes.push(p)
    // ‘吃’到自己 游戏结束
    if (snakes.some(function (p1, index1) {
      return snakes.some(function (p2, index2) {
        return p2.x === p1.x && p2.y === p1.y && index1 !== index2
      })
    })) {
      if (fruits.length === 2) snakes.unshift(shiftPoint) // 还原被删掉的末尾
      snakes.pop() // 删除新添的头部
      GameState = END
    }
    if (fruits.length < 2) { // 如果水果没有减少则不更新现有的水果坐标数组
      updateScope()
      return fruits
    }
  }

  /**
   * 更新页面中显示的分数
   */
  function updateScope(num) {
    if (num !== undefined) Scope = 0
    else
      Scope++
    $('#scope').text(Scope)
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
        snakes[i].y * _gridW() + _padding().h / 2,
        _gridW(), _gridW())
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
    var element = document.createElement('canvas')
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
      new Point(3, 0)
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
    return Math.floor(document.body.scrollHeight * 0.8)
  }

  /**
   * 获取canvas宽度
   * @returns {number}
   * @private
   */
  function _w() {
    return Math.min(document.body.scrollWidth, 768)
  }

  function Point(x, y) {
    this.x = x
    this.y = y
    this.update = function (gridW, direction) {
      switch (direction) {
        case UP:
          this.y -= 1
          break
        case DOWN:
          this.y += 1
          break
        case LEFT:
          this.x -= 1
          break
        case RIGHT:
          this.x += 1
          break
      }
    }
  }

  initEvent() // 绑定事件
}($))