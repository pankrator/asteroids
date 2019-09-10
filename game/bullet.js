class Bullet {
    constructor(x, y, rotation) {
        this.transformation = new Transformation();
        this.transformation.position.x = x;
        this.transformation.position.y = y;
        this.transformation.rotation = rotation;
        this.speed = 15;
        this.radius = 10;
    }

    show() {
        fill("red");
        circle(this.transformation.position.x, this.transformation.position.y, this.radius);
    }

    update() {
        let direction = Vector.fromAngles(this.transformation.rotation).multiply(this.speed);
        this.transformation.position = this.transformation.position.add(direction);
    }

    offscreen() {
        return (this.transformation.position.x < 0 || this.transformation.position.x > width || this.transformation.position.y < 0 || this.transformation.position.y > height);
    }
}