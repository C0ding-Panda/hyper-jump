var engine = Matter.Engine.create();

var render = Matter.Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: "url(background2.png)",
    },
});

let evenNums = [];
for (let i = 0; i < 5; i++) {
    let randomNum = Math.floor(Math.random() * (42 - 26 + 1)) + 26;
    let evenNum = Math.floor(randomNum / 2) * 2;
    if (evenNum < 26) {
        evenNum += 2;
    } else if (evenNum > 42) {
        evenNum -= 2;
    }
    evenNums.push(evenNum);
}

var rectangle = Matter.Bodies.rectangle(100, 400, 80, 80, {
    frictionAir: 0.3,
    render: {
        sprite: {
            texture: "character1.png",
            xScale: 0.155,
            yScale: 0.155,
        },
    },
});

let bottomWall = Matter.Bodies.rectangle(600, 450, 1900, 20, {
    render: { fillStyle: "transparent" },
    isStatic: true,
});
let topWall = Matter.Bodies.rectangle(600, 0, 1900, 20, {
    render: { fillStyle: "transparent" },
    isStatic: true,
});
let rightWall = Matter.Bodies.rectangle(1455, 0, 40, 2000, {
    render: { fillStyle: "transparent" },
    isStatic: true,
});
let leftWall = Matter.Bodies.rectangle(5, 0, 10, 3000, {
    render: { fillStyle: "transparent" },
    isStatic: true,
});
let circle1 = Matter.Bodies.circle(200, 50, evenNums[0], {frictionAir: 0.5});
let circle2 = Matter.Bodies.circle(500, 50, evenNums[1], {frictionAir: 0.5});
let circle3 = Matter.Bodies.circle(800, 50, evenNums[2], {frictionAir: 0.5});
let circle4 = Matter.Bodies.circle(1200, 50, evenNums[3], {frictionAir: 0.5});
let circle5 = Matter.Bodies.circle(1500, 50, evenNums[4], {frictionAir: 0.5});

engine.world.gravity.y = 7;
Matter.World.add(engine.world, rectangle);
Matter.World.add(engine.world, bottomWall);
Matter.World.add(engine.world, topWall);
Matter.World.add(engine.world, rightWall);
Matter.World.add(engine.world, leftWall);
Matter.World.add(engine.world, circle1);
Matter.World.add(engine.world, circle2);
Matter.World.add(engine.world, circle3);
Matter.World.add(engine.world, circle4);
Matter.World.add(engine.world, circle5);
Matter.Engine.run(engine);

setInterval(() => {
    Matter.Body.setPosition(circle1, { x: 200, y: 50 });
    Matter.Body.setPosition(circle2, { x: 500, y: 50 });
    Matter.Body.setPosition(circle3, { x: 800, y: 50 });
    Matter.Body.setPosition(circle4, { x: 1200, y: 50 });
    Matter.Body.setPosition(circle5, { x: 1500, y: 50 });
},1500)

document.addEventListener("keydown", function (event) {
    if (event.code === "ArrowLeft") {
        Matter.Body.applyForce(rectangle, rectangle.position, {x: -0.1,y: 0,});
    } else if (event.code === "ArrowRight") {
        Matter.Body.applyForce(rectangle, rectangle.position, { x: 0.2, y: 0 });
    }
});

// Create an array of circle bodies
var circles = [circle1, circle2, circle3, circle4, circle5];


// Set up collisions with the different circles
Matter.Events.on(engine, "collisionStart", function (event) {
    let pairs = event.pairs;
    for (let i = 0; i < pairs.length; i++) {
        let pair = pairs[i];
        for (let j = 0; j < circles.length; j++) {
            let circle = circles[j];
            if (
                (pair.bodyA === rectangle && pair.bodyB === circle) ||
                (pair.bodyA === circle && pair.bodyB === rectangle)
            ) {
                Matter.Body.setPosition(rectangle, { x: 100, y: 400 });
                counter -= 2;
                document.getElementById("counter").innerHTML = counter;
            }
        }
    }
});

var counter = 0;

Matter.Events.on(engine, "collisionStart", function (event) {
    let pairs = event.pairs;
    for (let i = 0; i < pairs.length; i++) {
        let pair = pairs[i];
        if (pair.bodyA === rectangle || pair.bodyB === rightWall) {
            Matter.Body.setPosition(rectangle, { x: 100, y: 400 });
            counter++;
            document.getElementById("counter").innerHTML = counter;
            var bounds = pair.bodyA.bounds;
            if (bounds.max.x === engine.world.bounds.max.x) {
                Matter.Body.setPosition(rectangle, { x: 200, y: 200 });
            }
        }
    }
});

Matter.Render.run(render);
