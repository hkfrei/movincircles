import { draw, getBall } from "./helper.js";

//references to html elements.
const canvas = document.getElementById("museum");
const removeButton = document.getElementById("removeBall");
const addButton = document.getElementById("addBall");
const ctx = canvas.getContext("2d");

//set width and height of the canvas
const maxWidth = window.innerWidth;
const maxHeight = window.innerHeight - 78;
canvas.width = maxWidth;
canvas.height = maxHeight;

// logic to add/remove balls
addButton.addEventListener("click", function () {
  const ball = getBall(canvas);
  balls.push(ball);
});

removeButton.addEventListener("click", function () {
  // remove the first ball but get a copy of it.
  const ball = balls.shift();
  ball.remove = true;
  ball.dx = 0;
  ball.dy = 0;
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  balls.push(ball);
  const removeDirection = Math.random() > 0.5 ? 50 : -50;
  window.setTimeout(() => {
    ball.dx = removeDirection;
  }, 500);
});

const balls = [];
//number of balls to display initially.
const ballCount = 50;
// fill the balls array
for (let i = 0; i < ballCount; i++) {
  balls.push(getBall(canvas));
}

let config = { canvas, ctx, balls };
// display the balls on the canvas
draw(config);
