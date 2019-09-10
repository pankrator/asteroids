const canvasWidth = 1000;
const canvasHeight = 640;
let shouldShow = true;
width = 1000;
height = 640;
var ship, galaxy;
var simulation;
function init() {
    simulation = new Simulation();
    run();
}

function run() {
    simulation.run();
    if (!shouldShow) {
        setTimeout(function() {
            run();
        }, 1);
    }
}

function init2() {
    ship = new Ship();
    galaxy = new Galaxy(ship);
}

window.onload = function() {
    init();
}

function setup() {
    createCanvas(canvasWidth, canvasHeight);
}

function keyPressed() {
    if (keyCode == 32) {
        galaxy.bullets.push(new Bullet(ship.transformation.position.x, ship.transformation.position.y, ship.transformation.rotation));
        return false;
    }

    return true;
}

function update() {
    if (keyIsDown(LEFT_ARROW)) {
        ship.transformation.rotation -= MathHelpers.d2rad(3);
    }

    if (keyIsDown(RIGHT_ARROW)) {
        ship.transformation.rotation += MathHelpers.d2rad(3);
    }

    if (keyIsDown(UP_ARROW)) {
        let direction = Vector.fromAngles(ship.transformation.rotation);
        direction = direction.multiply(0.2);
        ship.velocity = ship.velocity.add(direction);
    }

    galaxy.update();
}

function draw() {
    if (simulation && shouldShow) {
        background(0);
        simulation.run();
    }
}