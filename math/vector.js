"use strict";

function Vector(x, y) {
    this.x = x || 0;
    this.y = y || 0;
}

Vector.prototype = {
    negated: function () {
        return new Vector(-this.x, -this.y);
    },
    add: function (v) {
        if (v instanceof Vector) return new Vector(this.x + v.x, this.y + v.y);
        else return new Vector(this.x + v, this.y + v);
    },
    subtract: function (v) {
        if (v instanceof Vector) return new Vector(this.x - v.x, this.y - v.y);
        else return new Vector(this.x - v, this.y - v);
    },
    multiply: function (v) {
        if (v instanceof Vector) return new Vector(this.x * v.x, this.y * v.y);
        else return new Vector(this.x * v, this.y * v);
    },
    divide: function (v) {
        if (v instanceof Vector) return new Vector(this.x / v.x, this.y / v.y);
        else return new Vector(this.x / v, this.y / v);
    },
    equals: function (v) {
        return this.x == v.x && this.y == v.y;
    },
    dot: function (v) {
        return this.x * v.x + this.y * v.y;
    },
    length: function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    },
    lengthSquared: function () {
        return this.x * this.x + this.y * this.y;
    },
    distanceTo: function (v) {
        var dx = this.x - v.x;
        var dy = this.y - v.y;
        return Math.sqrt(dx * dx + dy * dy);
    },
    distanceToSquared: function (v) {
        var dx = this.x - v.x;
        var dy = this.y - v.y;
        return dx * dx + dy * dy;
    },
    normalized: function () {
        return this.divide(this.length());
    },
    min: function () {
        return Math.min(this.x, this.y);
    },
    max: function () {
        return Math.max(this.x, this.y);
    },
    rotate: function (angle) {
        var cos = Math.cos(angle),
            sin = Math.sin(angle);
        return new Vector(this.x * cos - this.y * sin,
                          this.x * sin + this.y * cos);
    },
    angleTo: function (a) {
        return Math.acos(this.dot(a) / (this.length() * a.length()));
    },
    angleTo360: function (a) {
        var n1 = this.clone(),
            n2 = a.clone();
        Vector.normalize(n1);
        Vector.normalize(n2);
        var cos = n1.dot(n2);
        var sin = ((n2.x + n2.y) - (n1.x + n1.y) * cos) / (n1.x - n1.y);
        var angle = Math.acos(cos);

        if (sin <= 0)
            angle = -angle;

        angle += Math.PI / 2;
        return angle;
    },
    toArray: function () {
        return [this.x, this.y];
    },
    clone: function () {
        return new Vector(this.x, this.y);
    },
    set: function (x, y) {
        if (y === undefined) {
            this.x = x.x;
            this.y = x.y;
            return this;
        }
        this.x = x; this.y = y;
        return this;
    },
    toString: function () {
        return "(" + this.x + ", " + this.y + ")";
    }
};

Vector.zero = new Vector(0, 0);
Vector.right = new Vector(1, 0);
Vector.up = new Vector(0, 1);
Vector.left = new Vector(-1, 0);
Vector.down = new Vector(0, -1);
Vector.one = new Vector(1, 1);

Vector.add = function (a, b, c) {
    if (b instanceof Vector) {
        c.x = a.x + b.x;
        c.y = a.y + b.y;
    }
    else {
        c.x = a.x + b;
        c.y = a.y + b;
    }
    return c;
};

Vector.subtract = function (a, b, c) {
    if (b instanceof Vector) {
        c.x = a.x - b.x;
        c.y = a.y - b.y;
    }
    else {
        c.x = a.x - b;
        c.y = a.y - b;
    }
    return c;
};

Vector.negate = function (a, b) {
    b.x = -a.x;
    b.y = -a.y;
    return b;
};

Vector.multiply = function (a, b, c) {
    if (b instanceof Vector) {
        c.x = a.x * b.x;
        c.y = a.y * b.y;
    }
    else {
        c.x = a.x * b;
        c.y = a.y * b;
    }
    return c;
};

Vector.divide = function (a, b, c) {
    if (b instanceof Vector) {
        c.x = a.x / b.x;
        c.y = a.y / b.y;
    }
    else {
        c.x = a.x / b;
        c.y = a.y / b;
    }
    return c;
};

Vector.unit = function (a, b) {
    var length = a.length();
    b.x = a.x / length;
    b.y = a.y / length;
    return b;
};

Vector.normalize = function (a) {
    var length = a.length();
    a.x /= length;
    a.y /= length;
    return a;
};

Vector.rotate = function (a, b, angle) {
    var cos = Math.cos(angle),
        sin = Math.sin(angle);
    var x = a.x,
        y = a.y;
    b.set(x * cos - y * sin, x * sin + y * cos);
    return b;
};

Vector.fromAngles = function (phi) {
    return new Vector(Math.cos(phi), Math.sin(phi));
};

Vector.randomDirection = function () {
    return Vector.fromAngles(Math.random() * Math.PI * 2);
};

Vector.min = function (a, b) {
    return new Vector(Math.min(a.x, b.x), Math.min(a.y, b.y));
};

Vector.max = function (a, b) {
    return new Vector(Math.max(a.x, b.x), Math.max(a.y, b.y));
};

Vector.lerp = function (a, b, alpha) {
    return b.subtract(a).multiply(alpha).add(a);
};

Vector.fromArray = function (a) {
    return new Vector(a[0], a[1]);
};

Vector.angleBetween = function (a, b) {
    return a.angleTo(b);
};
