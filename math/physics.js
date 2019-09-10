'use strict';

const WORLD_GRAVITY = 0.3;

var Physics = function () {};

Physics.prototype.update = function (objects) {
    for (let i = 0; i < objects.length; i++) {
        let object = objects[i];

        if (!object.onGround && object.velocityX != 0) {
            object.velocityX = Math.sign(object.velocityX) * (object.speed / 2);
        }

        object.x += object.velocityX;
        object.y += object.velocityY;

        object.velocityY += WORLD_GRAVITY;

        if (object.velocityY > 20) {
            object.velocityY = 20;
        } 
    }
}

Physics.prototype.getPossibleCollision = function (object, against, flags) {
    // object.top, object.left, object.right, object.bottom, object.x, object.y
    let result = {};
    if (flags['down']) {
        result.down = [];
        const floors = against.filter((el) => { return el.type === 0; });

        let leftLeg = this.rayCast(object.left, object.bottom, 0, 1, floors, 100);
        leftLeg && result.down.push(leftLeg);

        let rightLeg = this.rayCast(object.right, object.bottom, 0, 1, floors, 100)
        rightLeg && result.down.push(rightLeg);
    }
    if (flags['up']) {
        result.up = [];

        let toUp = this.rayCast(object.x, object.y, 0, -1, against, 100);
        toUp && result.up.push(toUp);
    }
    if (flags['right']) {
        result.right = [];

        let toRight = this.rayCast(object.x, object.bottom - 1, 1, 0, against, 100);
        toRight && result.right.push(toRight); 
    }
    if (flags['left']) {
        result.left = [];

        let toLeft = this.rayCast(object.x, object.bottom - 1, -1, 0, against, 100);
        toLeft && result.left.push(toLeft)
    }

    return result;
}

Physics.prototype.rayCast = function (fromX, fromY, dirX, dirY, testAgainst, steps) {
    const stepsToTake = steps || 400;
    const stepDist = 1;

    let currX = parseInt(fromX);
    let currY = parseInt(fromY);
    for (let i = 0; i < stepsToTake; i++) {
        for (let j = 0; j < testAgainst.length; j++) {
            const against = testAgainst[j];
            if (this.isPointOnLineSegment(against, {x: currX, y: currY})) {
                return { object: against, distance: this.distanceBetween(fromX, fromY, currX, currY) };
            }
        }
        currX += dirX * stepDist;
        currY += dirY * stepDist;
    }

    return null;
}

Physics.prototype.distanceBetween = function (x, y, toX, toY) {
    return Math.sqrt((toX - x) * (toX - x) + (toY - y) * (toY -y));
}

Physics.prototype.isPointOnLineSegment = function(line, point) {
    const lineX = Math.min(line.x, line.toX);
    const lineToX = Math.max(line.x, line.toX);
    const lineY = Math.min(line.y, line.toY);
    const lineToY = Math.max(line.y, line.toY);

    return point.x >= lineX && point.x <= lineToX &&
           point.y >= lineY && point.y <= lineToY;
}

Physics.prototype.circle2LineIntersect = function(circle, line) {
    /**
     * (x-x1)^2+(y-y1)^2=r^2
     * 
     * y-y1=m(x-x1)
     * m=(y2-y1)/(x2-x1)
     */
    let xl = line.x1;
    let yl = line.y1;
    let x1 = circle.x;
    let y1 = circle.y
    let r = circle.radius;
    if (line.x2-line.x1 === 0) {
        let a = 1;
        let b = -2*y1;
        let c = xl*xl - 2*xl*x1 + x1*x1 + y1*y1 - r*r;
        let d = b*b - 4*a*c;
        if (d < 0) {
            return false;
        } else if (d > 0) {
            let yr1 = (-b+Math.sqrt(d))/(2*a);
            let yr2 = (-b-Math.sqrt(d))/(2*a);

            let result = {};
            let found = false;
            if (yr1 >= Math.min(line.y1,line.y2) && yr1 <= Math.max(line.y1,line.y2)) {
                found=true;
                result.x1 = xl;
                result.y1 = yr1;
            }
            if (yr2 >= Math.min(line.y1,line.y2) && yr2 <= Math.max(line.y1,line.y2)) {
                    found=true;
                    result.x2 = xl;
                    result.y2 = yr2;
                }
            if (found) {
                return result
            }
            return false;
        }
    } else {
        let m = (line.y2-line.y1)/(line.x2-line.x1);
        let a = 1+m*m;
        let b = -2*x1 - 2*m*m*xl + 2*m*yl - 2*y1*m
        let c = x1*x1 + m*m*xl*xl + yl*yl - 2*m*xl*yl + 2*y1*m*xl - 2*y1*yl + y1*y1 - r*r;
        let d = b*b - 4*a*c;
        if (d < 0) {
            return false;
        } else if (d > 0) {
            let xr1=(-b+Math.sqrt(d))/(2*a);
            let xr2=(-b-Math.sqrt(d))/(2*a);
            let yr1=m*xr1-m*xl+yl;
            let yr2=m*xr2-m*xl+yl;
            let result = {};
            let found = false;
            if (xr1 >= Math.min(line.x1,line.x2) && xr1 <= Math.max(line.x1,line.x2) &&
                yr1 >= Math.min(line.y1,line.y2) && yr1 <= Math.max(line.y1,line.y2)) {
                    found=true;
                    result.x1 = xr1;
                    result.y1 = yr1;
                }
            if (xr2 >= Math.min(line.x1,line.x2) && xr2 <= Math.max(line.x1,line.x2) &&
                yr2 >= Math.min(line.y1,line.y2) && yr2 <= Math.max(line.y1,line.y2)) {
                    found=true;
                    result.x2 = xr2;
                    result.y2 = yr2;
                }
            if (found) {
                return result
            }
            return false;
        }
    }
}
