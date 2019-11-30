$(function () {
  var LINE_WIDTH = 1 // 线条宽度
  var LINE_MAX_NUM = 32 // 一行格子数量
  var SNAKE_START_POINT = [[0, 3], [1, 3], [2, 3], [3, 3]] // 初始蛇坐标
  var DIR_ENUM = { UP: 1, DOWN: -1, LEFT: 2, RIGHT: -2 }    // 移动的四个方向枚举值，两个对立方向相加等于0
  var GAME_STATE_ENUM = { END: 1, READY: 2 } // 游戏状态枚举
  var canvasHeight = $('canvas').height() // 获取canvas的高度
  var canvasWidth = $('canvas').width() // 获取canvas的宽度
  var gridWidth = (canvasWidth - LINE_WIDTH) / LINE_MAX_NUM // 格子宽度，按一行32个格子计算
  var num = { w: LINE_MAX_NUM, h: Math.floor((canvasHeight - LINE_WIDTH) / gridWidth) } // 计算横向和纵向多少个格子，即：横坐标的最大值和纵坐标的最大值
  var directionNow = null // 当前移动移动方向
  var directionNext = null // 下一步移动方向
  var gameState = null // 游戏状态
  var scope = 0 // 分数
  var maxScope = 0 // 最高分

  /**
 * 绘制格子地图
 * @param graphics
 */
  function drawGrid(graphics) {
    var wNum = num.w
    var hNum = num.h
    graphics.setStrokeStyle(LINE_WIDTH).beginStroke('#ffac52')
    // 画横向的线条
    for (var i = 0; i <= hNum; i++) {
      if (i === hNum || i === 0) graphics.setStrokeStyle(LINE_WIDTH)
      if (i === 1) graphics.setStrokeStyle(0.1)
      graphics.moveTo(LINE_WIDTH / 2, i * gridWidth + LINE_WIDTH / 2)
        .lineTo(gridWidth * wNum + LINE_WIDTH / 2, i * gridWidth + LINE_WIDTH / 2)
    }
    graphics.setStrokeStyle(LINE_WIDTH)
    // 画纵向的线条
    for (i = 0; i <= wNum; i++) {
      if (i === wNum || i === 0) graphics.setStrokeStyle(LINE_WIDTH)
      if (i === 1) graphics.setStrokeStyle(.1)
      graphics.moveTo(i * gridWidth + LINE_WIDTH / 2, LINE_WIDTH / 2)
        .lineTo(i * gridWidth + LINE_WIDTH / 2, gridWidth * hNum + LINE_WIDTH / 2)
    }
  }

  /** 
   * 坐标类
   */
  function Point(x, y) {
    this.x = x
    this.y = y
  }

  /**
   * 根据移动的方向，获取当前坐标的下一个坐标
   * @param direction 移动的方向
   */
  Point.prototype.nextPoint = function nextPoint(direction) {
    var point = new Point(this.x, this.y)
    switch (direction) {
      case DIR_ENUM.UP:
        point.y -= 1
        break
      case DIR_ENUM.DOWN:
        point.y += 1
        break
      case DIR_ENUM.LEFT:
        point.x -= 1
        break
      case DIR_ENUM.RIGHT:
        point.x += 1
        break
    }
    return point
  }

  /**
 * 初始化蛇的坐标
 * @returns {[Point,Point,Point,Point,Point ...]}
 * @private
 */
  function initSnake() {
    return SNAKE_START_POINT.map(function (item) {
      return new Point(item[0], item[1])
    })
  }

  /**
   * 绘制蛇
   * @param graphics
   * @param snakes // 蛇坐标
   */
  function drawSnake(graphics, snakes) {
    graphics.clear()
    graphics.beginFill("#a088ff")
    var len = snakes.length
    for (var i = 0; i < len; i++) {
      if (i === len - 1) graphics.beginFill("#ff6ff9")
      graphics.drawRect(
        snakes[i].x * gridWidth + LINE_WIDTH / 2,
        snakes[i].y * gridWidth + LINE_WIDTH / 2,
        gridWidth, gridWidth)
    }
  }

  /**
 * 改变蛇身坐标
 * @param snakes 蛇坐标集
 * @param direction 方向
 */
  function updateSnake(snakes, fruits, direction, fruitGraphics) {
    var oldHead = snakes[snakes.length - 1]
    var newHead = oldHead.nextPoint(direction)
    // 超出边界 游戏结束
    if (newHead.x < 0 || newHead.x >= num.w || newHead.y < 0 || newHead.y >= num.h) {
      gameState = GAME_STATE_ENUM.END
    } else if (snakes.some(function (p) { // ‘吃’到自己 游戏结束
      return newHead.x === p.x && newHead.y === p.y
    })) {
      gameState = GAME_STATE_ENUM.END
    } else if (fruits.some(function (p) { // ‘吃’到水果
      return newHead.x === p.x && newHead.y === p.y
    })) {
      updateScope()
      snakes.push(newHead)
      var temp = 0
      fruits.forEach(function (p, i) {
        if (newHead.x === p.x && newHead.y === p.y) {
          temp = i
        }
      })
      fruits.splice(temp, 1)
      var newFruit = createFruit(snakes, fruits)
      if (newFruit) {
        fruits.push(newFruit)
        drawFruit(fruitGraphics, fruits)
      }
    } else {
      snakes.push(newHead)
      snakes.shift()
    }
  }

  /**
   * 引擎
   * @param graphics
   * @param snakes
   */
  function start(snakeGraphics, fruitGraphics, snakes, fruits, stage) {
    clearTimeout(window._engine) // 重启时关停之前的引擎
    run()
    function run() {
      directionNow = directionNext
      updateSnake(snakes, fruits, directionNow, fruitGraphics) // 更新蛇坐标
      if (gameState === GAME_STATE_ENUM.END) {
        end()
      } else {
        drawSnake(snakeGraphics, snakes)
        stage.update()
        window._engine = setTimeout(run, 500 * Math.pow(0.9, scope))
      }
    }
  }

  /**
   * 游戏结束回调
   */
  function end() {
    gameState = GAME_STATE_ENUM.END
    var text = '当前分数：' + scope + '分'
    if (scope > maxScope) {
      text = '新记录！' + text
    }
    swal(text, {
      button: { text: '确定' },
    })
    renderHistory(scope)
    $('#MenuArea').show()
  }

  /**
   * 改变蛇行进方向
   * @param dir
   */
  function changeDirection(dir) {
    /* 逆向及同向则不改变 */
    if (directionNow + dir === 0 || directionNow === dir) return
    directionNext = dir
  }

  /**
   * 绑定相关元素点击事件
   */
  function bindEvent() {
    $('#UpBtn').click(function () { changeDirection(DIR_ENUM.UP) })
    $('#LeftBtn').click(function () { changeDirection(DIR_ENUM.LEFT) })
    $('#RightBtn').click(function () { changeDirection(DIR_ENUM.RIGHT) })
    $('#DownBtn').click(function () { changeDirection(DIR_ENUM.DOWN) })
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
        }).then(function () {
          location.href = location.href
        })
      }, 1000)
    })
    // 监听上下左右按钮
    $(window).keydown(function (e) {
      switch (e.keyCode) {
        case 37:
          changeDirection(DIR_ENUM.LEFT)
          $('#LeftBtn').eq(0).focus()
          break
        case 38:
          changeDirection(DIR_ENUM.UP)
          $('#UpBtn').eq(0).focus()
          break
        case 39:
          changeDirection(DIR_ENUM.RIGHT)
          $('#RightBtn').eq(0).focus()
          break
        case 40:
          changeDirection(DIR_ENUM.DOWN)
          $('#DownBtn').eq(0).focus()
          break
      }
    })
  }

  /**
 * 创建水果坐标
 * @returns Point
 * @param snakes
 * @param fruits
 */
  function createFruit(snakes, fruits) {
    var totals = {}
    for (var x = 0; x < num.w; x++) {
      for (var y = 0; y < num.h; y++) {
        totals[x + '-' + y] = true
      }
    }
    snakes.forEach(function (item) {
      delete totals[item.x + '-' + item.y]
    })
    fruits.forEach(function (item) {
      delete totals[item.x + '-' + item.y]
    })
    var keys = Object.keys(totals)
    if (keys.length) {
      var temp = Math.floor(keys.length * Math.random())
      var key = keys[temp].split('-')
      return new Point(Number(key[0]), Number(key[1]))
    } else {
      return null
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
        fruits[i].x * gridWidth + LINE_WIDTH / 2,
        fruits[i].y * gridWidth + LINE_WIDTH / 2,
        gridWidth, gridWidth)
    }
  }

  /**
   * 更新页面中显示的分数
   */
  function updateScope(num) {
    if (num !== undefined) scope = num
    else
      scope++
    $('#scope').text(scope)
  }

  /** 更新历史记录 */
  function renderHistory(scope) {
    var history = localStorage.getItem('HISTORY')
    try {
      history = JSON.parse(history)
    } catch (err) {
      history = []
    }
    history = history || []
    maxScope = history[0] || 0
    if (scope) {
      history.push(scope)
      history.sort(function (a, b) {
        return b - a
      })
      history.splice(3, 1)
      window.localStorage.setItem('HISTORY', JSON.stringify(history))
    }
    $('#HistoryArea').empty()
    history.forEach(function (scope, index) {
      $('#HistoryArea').append('<p>' + (index + 1) + '：' + scope + '分</p>')
    })
    if (!history.length) {
      $('#HistoryArea').append('<p>暂无记录</p>')
    }
  }

  function init() {
    $('canvas').attr('width', canvasWidth) // 给canvas设置宽高属性赋值上当前canvas的宽度和高度（单用样式配置宽高会被拉伸）
    $('canvas').attr('height', canvasHeight)
    directionNow = directionNext = DIR_ENUM.DOWN // 初始化蛇的移动方向
    gameState = GAME_STATE_ENUM.READY
    updateScope(0)
    var snakes = initSnake()
    var fruits = []
    fruits.push(createFruit(snakes, fruits))
    fruits.push(createFruit(snakes, fruits))
    var stage = new createjs.Stage($('canvas')[0])
    var grid = new createjs.Shape()
    var snake = new createjs.Shape()
    var fruit = new createjs.Shape()
    drawGrid(grid.graphics) // 绘制格子
    drawSnake(snake.graphics, snakes)
    drawFruit(fruit.graphics, fruits)
    stage.addChild(grid)
    stage.addChild(snake)
    stage.addChild(fruit)
    stage.update()
    start(snake.graphics, fruit.graphics, snakes, fruits, stage)
  }
  renderHistory()
  bindEvent()
})