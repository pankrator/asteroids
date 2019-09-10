class Asteroid {
    constructor(x, y, size) {
        this.transformation = new Transformation();
        this.transformation.position.x = x;
        this.transformation.position.y = y;
        this.direction = Vector.randomDirection();
        this.size = size || randomIntFromInterval(14, 100);
    }

    show() {
        stroke("white");
        noFill();
        circle(this.transformation.position.x, this.transformation.position.y, this.size);
    }

    update() {
        this.transformation.position = this.transformation.position.add(this.direction);
    }

    offscreen() {
        return (this.transformation.position.x < 0 || this.transformation.position.x > width || this.transformation.position.y < 0 || this.transformation.position.y > height);
    }
}