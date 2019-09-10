class Ship {
    constructor() {
        this.galaxy = null;
        this.transformation = new Transformation();
        this.transformation.position.x = 70;
        this.transformation.position.y = 300;
        this.acceleration = new Vector();
        this.speed = 0;
        this.maxSpeed = 10;
        this.velocity = new Vector(0, 0);
        this.lastShotTime = Date.now();
        this.shotCooldown = 350;

        this.score = 0;
        this.brain = new NeuralNet(12, 3, 3, 5);
    }

    update() {
        if (this.transformation.position.x > width) {
            this.transformation.position.x = 0;
        }
        if (this.transformation.position.x < 0) {
            this.transformation.position.x = width;
        }
        if (this.transformation.position.y > height) {
            this.transformation.position.y = 0;
        }
        if (this.transformation.position.y < 0) {
            this.transformation.position.y = height;
        }

        if (this.galaxy != null && this.galaxy.asteroids.length > 0) {
            let myDir = this.transformation.rotation;
            this.galaxy.asteroids.sort((a, b) => {
                return a.transformation.position.distanceTo(this.transformation.position)-b.transformation.position.distanceTo(this.transformation.position);
            });
                let inputs = [];
                for (let i = 0; i < Math.min(3, this.galaxy.asteroids.length); i++) {
                    let dir = Math.atan2(this.galaxy.asteroids[i].direction.y, this.galaxy.asteroids[i].direction.x);
                    let dirToVector = this.galaxy.asteroids[i].transformation.position.subtract(this.transformation.position).normalized();
                    let dirTo = Math.atan2(dirToVector.y, dirToVector.x);
                    let dist = this.galaxy.asteroids[i].transformation.position.distanceTo(this.transformation.position);
                    let size = this.galaxy.asteroids[i].size;
                    dir = MathHelpers.normalize(dir, -1, 1, -1, 1);
                    dist = MathHelpers.normalize(dist, 10, 1000, -1, 1);
                    dirTo = MathHelpers.normalize(dirTo, -1, 1, -1, 1);
                    inputs.push(dir, dist, dirTo, size);
                }
                let outputs = this.brain.activate(inputs);
                if (outputs[0] < 0.2) {
                    this.transformation.rotation -= MathHelpers.d2rad(2);
                } else if (outputs[0] > 0.7) {
                    this.transformation.rotation += MathHelpers.d2rad(2);
                }

                if (outputs[1] > 0.7 && Date.now() - this.lastShotTime > this.shotCooldown) {
                    this.lastShotTime = Date.now();
                    this.galaxy.bullets.push(new Bullet(this.transformation.position.x, this.transformation.position.y, this.transformation.rotation));
                }

                if (outputs[2] > 0.2) {
                    let direction = Vector.fromAngles(this.transformation.rotation);
                    direction = direction.multiply(0.2);
                    this.velocity = this.velocity.add(direction);
                }
        }

        let friction = this.velocity.normalized().negated().multiply(0.07);
        this.velocity = this.velocity.add(friction);
        if (this.velocity.length() > this.maxSpeed) {
            this.velocity = this.velocity.normalized().multiply(this.maxSpeed);
        }

        this.score += this.velocity.length();
        this.transformation.position = this.transformation.position.add(this.velocity);
        this.score += 0.03;
    }

    show() {
        fill("white");
        push();

        translate(this.transformation.position.x, this.transformation.position.y);
        rotate(this.transformation.rotation);
        translate(-this.transformation.position.x, -this.transformation.position.y);

        stroke("white");

        triangle(this.transformation.position.x - 20, this.transformation.position.y - 20,
            this.transformation.position.x + 30, this.transformation.position.y,
            this.transformation.position.x - 20, this.transformation.position.y + 20);
        fill("red");
        circle(this.transformation.position.x, this.transformation.position.y, 5);
        pop();
    }
}