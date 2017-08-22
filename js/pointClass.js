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
