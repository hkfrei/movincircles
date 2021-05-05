import collide from "line-circle-collision";

/*
 * the draw loop to display the circles on the canvas.
 * @param {object} config - function parameter object.
 * @param {canvas} config.canvas - reference to the canvas element.
 * @param {2d context} config.ctx - reference to the 2d context of the canvas.
 * @param {array} balls - ball objects to display inside the canvas.
 * @returns void.
 */
export function draw(config = {}) {
  // clear the previous canvas
  config.ctx.clearRect(0, 0, config.canvas.width, config.canvas.height);
  const ceiling = getCeiling(config.canvas.width, config.canvas.height);
  const floor = getFloor(config.canvas.width, config.canvas.height);
  drawWalls({
    ctx: config.ctx,
    ceiling,
    floor,
    maxHeight: config.canvas.height,
  });
  config.balls.forEach((ball) => {
    drawBall({
      ctx: config.ctx,
      y: ball.y,
      x: ball.x,
      radius: ball.radius,
      color: ball.color,
    });
    ball.x += ball.dx;
    ball.y += ball.dy;

    //combine floor and ceiling and detect collisions
    ceiling.concat(floor).forEach((segment) => {
      const hit = collide(
        [segment.start.x, segment.start.y],
        [segment.end.x, segment.end.y],
        [ball.x, ball.y],
        ball.radius
      );
      if (hit === true) {
        if (segment.direction === "horizontal") {
          ball.dy = -ball.dy;
        } else {
          ball.dx = -ball.dx;
        }
      }
    });
    // bouncing off the top and bottom
    if (
      ball.y + ball.dy < ball.radius ||
      ball.y > config.canvas.height - ball.radius
    ) {
      ball.dy = -ball.dy;
    }
    //bouncing off left and right

    if (
      ball.x + ball.dx > config.canvas.width - ball.radius ||
      ball.x + ball.dx < ball.radius
    ) {
      if (ball.remove) {
        config.balls.pop();
        return;
      }
      ball.dx = -ball.dx;
    }
  });
  requestAnimationFrame(() => draw(config));
}

/*
 * creates a ball with random parameters
 * @returns {object} - ball.
 */
export function getBall(canvas) {
  return {
    x: canvas.width / 2,
    y: canvas.height / 2,
    dx: Math.random() - 0.5,
    dy: Math.random() - 0.5,
    radius: getRandomNumber(3, 20),
    color: getRandomColor(),
  };
}

/*
 * get ceiling line definitions.
 * @param {number} maxWidth - the width of the canvas.
 * @param {number} maxHeight - the height of the canvas.
 * @returns {array} - line objects.
 */
function getCeiling(maxWidth, maxHeight) {
  const ceiling = [
    {
      start: { x: 0, y: maxHeight / 3 },
      end: { x: 50, y: maxHeight / 3 },
      direction: "horizontal",
    },
    {
      start: { x: 50, y: maxHeight / 3 },
      end: { x: 50, y: 10 },
      direction: "vertical",
    },
    {
      start: { x: 50, y: 10 },
      end: { x: maxWidth - 50, y: 10 },
      direction: "horizontal",
    },
    {
      start: { x: maxWidth - 50, y: 10 },
      end: { x: maxWidth - 50, y: maxHeight / 3 },
      direction: "vertical",
    },
    {
      start: { x: maxWidth - 50, y: maxHeight / 3 },
      end: { x: maxWidth, y: maxHeight / 3 },
      direction: "horizontal",
    },
  ];
  return ceiling;
}

/*
 * get the floor line definitions
 * @param {number} maxWidth - the width of the canvas.
 * @param {number} maxHeight - the height of the canvas.
 * @returns {array} - line objects.
 */
function getFloor(maxWidth, maxHeight) {
  const floor = [
    {
      start: { x: 0, y: maxHeight - maxHeight / 3 },
      end: { x: 50, y: maxHeight - maxHeight / 3 },
      direction: "horizontal",
    },
    {
      start: { x: 50, y: maxHeight - maxHeight / 3 },
      end: { x: 50, y: maxHeight - 10 },
      direction: "vertical",
    },
    {
      start: { x: 50, y: maxHeight - 10 },
      end: { x: maxWidth - 50, y: maxHeight - 10 },
      direction: "horizontal",
    },
    {
      start: { x: maxWidth - 50, y: maxHeight - 10 },
      end: { x: maxWidth - 50, y: maxHeight - maxHeight / 3 },
      direction: "vertical",
    },
    {
      start: { x: maxWidth - 50, y: maxHeight - maxHeight / 3 },
      end: { x: maxWidth, y: maxHeight - maxHeight / 3 },
      direction: "horizontal",
    },
  ];
  return floor;
}

/*
 * draws ceiling and floor lines on the canvas.
 * @param {object} params - function parameter object.
 * @param {context} params.ctx - 2d context of the canvas.
 * @param {array} params.ceiling - ceiling line definitons.
 * @param {array} params.floor - floor line definitions.
 * @param {number} params.maxHeight - the canvas height.
 * @returns void.
 */
function drawWalls({ ctx, ceiling, floor, maxHeight }) {
  ctx.strokeStyle = "orangered";
  ctx.lineWidth = 3;
  ctx.lineJoin = "round";
  //ceiling
  ctx.beginPath();
  ctx.moveTo(0, maxHeight / 3);
  for (let i = 0; i < ceiling.length; i++) {
    const line = ceiling[i];
    ctx.lineTo(line.end.x, line.end.y);
  }
  ctx.stroke();
  //floor
  ctx.beginPath();
  ctx.moveTo(0, maxHeight - maxHeight / 3);
  for (let i = 0; i < floor.length; i++) {
    const line = floor[i];
    ctx.lineTo(line.end.x, line.end.y);
  }
  ctx.stroke();
}

/*
 * draws a ball on the context.
 * @param {object} params - function parameter object.
 * @param {context} params.ctx - 2d context of the canvas.
 * @param {number} params.y - y coordinate of the balls center.
 * @param {number} params.x - x coordinate of the balls center.
 * @param {number} params.radius - radius of the ball.
 * @param {string} params.color - the color of the ball.
 */
function drawBall({ ctx, y, x, radius, color }) {
  ctx.beginPath();
  const startAngle = 0;
  const endAngle = Math.PI * 2;
  const drawAntiClockwise = false;
  ctx.arc(x, y, radius, startAngle, endAngle, drawAntiClockwise);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

/*
 * creates a random integer between 2 numbers (inclusive)
 * @param {number} min - min value.
 * @param {number} max - max value.
 * @returns {number} - the generated number.
 */
function getRandomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*
 * create a random hex color.
 * @returns {string} - the color.
 */
function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
