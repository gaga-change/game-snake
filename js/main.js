function init() {
  document.getElementById('app').appendChild(createCanvas())
  var stage = new createjs.Stage("demoCanvas");
  var grid = new createjs.Shape();
  // circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50000)
  // circle.x = 100;
  // circle.y = 100;
  _drawGrid(grid.graphics)
  stage.addChild(grid);
  setTimeout(function () {
    // circle.x = 200;
    // console.log(circle)
  }, 100)
  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener("tick", function () {
    stage.update();
  });
}

function _drawGrid(graphics) {
  var gridW = Math.floor(_w() / 32)
  var paddingW = _w() % gridW
  var paddingH = _h() % gridW
  var wNum = Math.floor(_w() / gridW)
  var hNum = Math.floor(_h() / gridW)
  console.log('paddingH', paddingH)
  console.log('grid gridW', gridW)
  var w = gridW
  graphics.setStrokeStyle(1).beginStroke('#ffac52')
  /* 横向 */
  for (var i = 0; i <= hNum; i++) {
    graphics.moveTo(paddingW / 2, i * w + paddingH / 2)
    .lineTo(_w() - paddingW /2, i * w + paddingH / 2)
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