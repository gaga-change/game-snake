function Point(x, y) {
  this.x = x
  this.y = y
  this.update = function (gridW, direction) {
    switch(direction) {
      case UP:
        break
      case DOWN:
        this.y += gridW
        break
      case LEFT:
        break
      case RIGHT:
        break
    }
  }
}
