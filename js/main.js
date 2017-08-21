function createCanvas() {
  var w = _w()
  var h = _h()
  var element = document.createElement('canvas');
  element.setAttribute('id', 'demoCanvas')
  element.setAttribute('width', String(w))
  element.setAttribute('height', String(h))
  return element
}

function init() {
  // document.body.appendChild(createCanvas())
  document.getElementById('app').appendChild(createCanvas())
  var stage = new createjs.Stage("demoCanvas");
  var circle = new createjs.Shape();
  circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50000);
  circle.x = 100;
  circle.y = 100;
  stage.addChild(circle);
  setTimeout(function () {
    circle.x = 200;
    console.log(circle)
  }, 100)
  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener("tick", function () {
    stage.update();
  });
}

function _h() {
  return Math.floor(window.screen.height * 0.8)
}

function _w() {
  return window.screen.width
}