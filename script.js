var engine = Matter.Engine.create();

var render = Matter.Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: 'url(background2.png)',
    }
});

var rectangle = Matter.Bodies.rectangle(100, 400, 80, 80, {
    frictionAir: 0.1,
    render: {fillStyle: "#FE89F9"},
});
var circleOfDeath = Matter.Bodies.circle(400, 100, 70, {
    mass: 1000,
    frictionAir: 0.2,
})
let bottomWall = Matter.Bodies.rectangle(0, 700, 3000, 519, {
    render: {fillStyle: "transparent"}, 
    isStatic: true, 
});
let rightWall = Matter.Bodies.rectangle(1455, 0, 10, 2000, {
    render: {fillStyle: "red"},
    isStatic: true,
})
let leftWall = Matter.Bodies.rectangle(5, 0, 10, 3000, {
    render: {fillStyle: "blue"},
    isStatic: true,
})
const slide = Matter.Bodies.rectangle(800, 410, 400, 20, {
    isStatic: true,
    friction: 0, // Adjust this value to control the slide's "slipperiness"
    angle: -Math.PI / 16,
});

engine.world.gravity.y = 7;
Matter.World.add(engine.world, rectangle);
Matter.World.add(engine.world, bottomWall);
Matter.World.add(engine.world, rightWall);
Matter.World.add(engine.world, leftWall);
Matter.World.add(engine.world, circleOfDeath);
Matter.World.add(engine.world, slide);
Matter.Engine.run(engine);

let counter = 0;


setInterval(() => {
    Matter.Body.applyForce(rectangle, rectangle.position, {x: -0.1, y: 0});
    counter++;
    document.getElementById("counter").innerHTML = counter;
}, 200)

setInterval(() => {
    Matter.Body.setPosition(circleOfDeath, {x: 400, y: 100});
},1500)

document.addEventListener("keydown", function(event) {
    if (event.code === "ArrowUp") {
        Matter.Body.applyForce(rectangle, rectangle.position, {x: 0, y: -0.1});
    } else if (event.code === "ArrowDown") {
        Matter.Body.applyForce(rectangle, rectangle.position, {x: 0, y: 0.1});
    }
    else if (event.code === "ArrowLeft") {
        Matter.Body.applyForce(rectangle, rectangle.position, {x: -0.05, y: 0});
    }
    else if (event.code === "ArrowRight") {
        Matter.Body.applyForce(rectangle, rectangle.position, {x: 0.1, y: 0});
    }
    else if (event.code === "ArrowUp" && event.code === "ArrowRight") {
        Matter.Body.applyForce(rectangle, rectangle.position, {x: 0.2, y: -0.2});
    }
});

var collisionEventHandler = Matter.Events.on(
    engine,
    "collisionStart",
    function (event) {
        var pairs = event.pairs;
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i];
            if (
                (pair.bodyA === rectangle && pair.bodyB === circleOfDeath) ||
                (pair.bodyA === circleOfDeath && pair.bodyB === rectangle)
            ) {
                rectangle.render.fillStyle = "red";
                Matter.Body.applyForce(rectangle, rectangle.position, {x: 0.5, y: -0.5});
            }
        }
    }
);


Matter.Events.on(engine, 'beforeUpdate', function() {
    Matter.Detector.canCollide(rectangle.collisionFilter, circleOfDeath.collisionFilter, collisionEventHandler);
});

var collisionEventHandler = Matter.Events.on(
    engine,
    "collisionStart",
    function (event) {
        var pairs = event.pairs;
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i];
            if (
                (pair.bodyA === rectangle && pair.bodyB === slide) ||
                (pair.bodyA === slide && pair.bodyB === rectangle)
            ) {
                rectangle.frictionAir = 0;
                rectangle.render.fillStyle = "white";
                setTimeout(() => {
                    rectangle.frictionAir = 0.1;
                },1000)
            }
        }
    }
);

// Add the collision event handler to the engine
Matter.Events.on(engine, 'beforeUpdate', function() {
    Matter.Detector.canCollide(slide.collisionFilter, rectangle.collisionFilter, collisionEventHandler);
});
rectangle.render.fillStyle = "blue";

Matter.Render.run(render);
