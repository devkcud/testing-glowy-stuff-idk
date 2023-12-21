const flashlightOptions = {
  radius: 100,
  intensity: ["0.2", "0.8", "1", "0.4", "0.1"],
  interval: 100,
};

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 500;

/**
 * Converts a hexadecimal color to RGB.
 *
 * @param {string} hex - The hexadecimal color string (e.g., "#ffffff").
 * @returns {{r: number, g: number, b: number}} An object containing the RGB
 *     values.
 */
function hexToRGB(hex) {
  hex = hex.replace("#", "");

  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return { r, g, b };
}

/**
 * Draws a flashlight effect using a radial gradient
 *
 * @param {number} centerx - X-coordinate of the center of the flashlight
 * @param {number} centery - Y-coordinate of the center of the flashlight
 * @param {number} intensity - Intensity of the flashlight effect
 */
function drawFlashlight(centerx, centery, intensity) {
  const gradient = ctx.createRadialGradient(
    centerx,
    centery,
    0,
    centerx,
    centery,
    flashlightOptions.radius,
  );

  gradient.addColorStop(0, `rgba(255, 255, 255, ${intensity})`);
  gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(centerx, centery, flashlightOptions.radius, 0, 2 * Math.PI);
  ctx.fill();
}

/** Draws the flashlight effect
 *
 * @param {MouseEvent} event - The mouse event
 */
function draw(event) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawFlashlight(event.offsetX, event.offsetY, currentIntensity);
}

let currentInterval;
let currentIntensity =
  typeof flashlightOptions.intensity === "number"
    ? flashlightOptions.intensity
    : flashlightOptions.intensity[0] || 0;
let casting = false;

canvas.addEventListener("click", () => {
  if (casting) {
    clearInterval(currentInterval);
    currentIntensity = flashlightOptions.intensity[0];
  } else {
    if (typeof flashlightOptions.intensity === "object") {
      currentInterval = setInterval(() => {
        currentIntensity =
          flashlightOptions.intensity[
            (flashlightOptions.intensity.indexOf(currentIntensity) + 1) %
              flashlightOptions.intensity.length
          ];
      }, flashlightOptions.interval);
    }
  }

  casting = !casting;
});

canvas.addEventListener("mouseleave", () => {
  if (casting) {
    clearInterval(currentInterval);
    casting = false;
  }
})

canvas.addEventListener("mousemove", (event) => {
  draw(event);
})
