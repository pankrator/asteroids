class Galaxy {
    constructor(ship) {
        this.ship = ship;
        this.ship.galaxy = this;
        this.bullets = [];
        this.asteroids = [];
        this.physics = new Physics();
        this.collisionPoints = [];
        this.stopped = false;

        setTimeout(function() {
            this._addAsteroid();
        }.bind(this), 1000);
    }

    update() {
        if (this.stopped) {
            return;
        }

        this.ship.update();
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            if (this.bullets[i].offscreen()) {
                this.bullets.splice(i, 1);
                continue;
            }
            this.bullets[i].update();
        }
        if (this.asteroids.length > 0) {
            for (let i = this.asteroids.length - 1; i >= 0; i--) {
                this.asteroids[i].update();
                if (this.asteroids[i].offscreen()) {
                    this.asteroids.splice(i, 1);
                }
            }
        }

        let A = new Vector(this.ship.transformation.position.x - 20, this.ship.transformation.position.y - 20);
        let B = new Vector(this.ship.transformation.position.x + 30, this.ship.transformation.position.y);
        let C = new Vector(this.ship.transformation.position.x - 20, this.ship.transformation.position.y + 20);

        A = A.subtract(this.ship.transformation.position);
        A = Vector.rotate(A, new Vector(), this.ship.transformation.rotation);
        A = A.add(this.ship.transformation.position);

        B = B.subtract(this.ship.transformation.position);
        B = Vector.rotate(B, new Vector(), this.ship.transformation.rotation);
        B = B.add(this.ship.transformation.position);

        C = C.subtract(this.ship.transformation.position);
        C = Vector.rotate(C, new Vector(), this.ship.transformation.rotation);
        C = C.add(this.ship.transformation.position);

        this.collisionPoints = [];

        for(let i = this.asteroids.length-1; i >= 0; i--) {
            let destroyed = false;
            for (let j = this.bullets.length-1; j >= 0; j--) {
                let distance = this.bullets[j].transformation.position.subtract(this.asteroids[i].transformation.position).length();
                if (distance < this.asteroids[i].size/2 + this.bullets[j].radius/2) {
                    if (this.asteroids[i].size > 28) {
                        let asteroid1 = new Asteroid(this.asteroids[i].transformation.position.x, this.asteroids[i].transformation.position.y);
                        asteroid1.size = this.asteroids[i].size/2;
                        asteroid1.size = this.asteroids[i].size/2;
                        let asteroid2 = new Asteroid(this.asteroids[i].transformation.position.x, this.asteroids[i].transformation.position.y);
                        asteroid2.size = this.asteroids[i].size/2;
                        asteroid2.size = this.asteroids[i].size/2;
                        this.asteroids.push(asteroid1, asteroid2);
                    }

                    this.asteroids.splice(i,1);
                    this.bullets.splice(j,1);
                    this.ship.score += 0.2;
                    destroyed = true;
                    break;
                }
            }
            if (destroyed) {
                continue;
            }
            let checkAB = this.physics.circle2LineIntersect(
                {x:this.asteroids[i].transformation.position.x, y:this.asteroids[i].transformation.position.y, radius:this.asteroids[i].size/2},
                {x1: A.x, y1: A.y, x2: B.x, y2: B.y});
            let checkBC = this.physics.circle2LineIntersect(
                {x:this.asteroids[i].transformation.position.x, y:this.asteroids[i].transformation.position.y, radius:this.asteroids[i].size/2},
                {x1:B.x,y1:B.y,x2:C.x,y2:C.y});
            let checkCA = this.physics.circle2LineIntersect(
                {x:this.asteroids[i].transformation.position.x, y:this.asteroids[i].transformation.position.y, radius:this.asteroids[i].size/2},
                {x1:C.x,y1:C.y,x2:A.x,y2:A.y});

            if (checkAB) {
                this.collisionPoints.push(checkAB);
            }
            if (checkBC) {
                this.collisionPoints.push(checkBC);
            }
            if (checkCA) {
                this.collisionPoints.push(checkCA);
            }
        }

        if (this.collisionPoints.length > 0) {
            // init();
            this.stopped = true;
        }
    }

    show() {
        this.ship.show();
        this.bullets.forEach(bullet => {
            bullet.show();
        });
        this.asteroids.forEach(asteroid => {
            asteroid.show();
        });

        fill("green");
        for(let i = 0; i < this.collisionPoints.length; i++) {
            if (this.collisionPoints[i].x1) {
                circle(this.collisionPoints[i].x1, this.collisionPoints[i].y1, 10);
            }
            if (this.collisionPoints[i].x2) {
                circle(this.collisionPoints[i].x2, this.collisionPoints[i].y2, 10);
            }
        }

    }

    _addAsteroid() {
        let x = randomIntFromInterval(10, width);
        let y = randomIntFromInterval(10, height);
        let size = randomIntFromInterval(14, 100);
        let dist = this.ship.transformation.position.distanceTo(new Vector(x, y));
        while (dist < size + 300) {
            x = randomIntFromInterval(0, width);
            y = randomIntFromInterval(0, height);
            dist = this.ship.transformation.position.distanceTo(new Vector(x, y));
        }
        this.asteroids.push(new Asteroid(x, y, size));
        if (!this.stopped) {
            setTimeout(function() {
                this._addAsteroid();
            }.bind(this), 300);
        }
    }
}