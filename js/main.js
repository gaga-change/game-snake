init ()
function createCanvas(w, h) {
  var element = document.createElement('canvas');
  element.setAttribute('id', 'demoCanvas')
  element.setAttribute('width', w)
  element.setAttribute('height', h)
  return element
}
function init() {
  document.body.appendChild(createCanvas(500, 500))
  var stage = new createjs.Stage("demoCanvas");
  var circle = new createjs.Shape();
  circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
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