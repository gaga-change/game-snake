function Point(x, y) {
  this.x = x
  this.y = y
  this.update = function (gridW, direction) {
    switch(direction) {
      case UP:
        this.y -= gridW
        break
      case DOWN:
        this.y += gridW
        break
      case LEFT:
        this.x -= gridW
        break
      case RIGHT:
        this.x += gridW
        break
    }
  }
}
