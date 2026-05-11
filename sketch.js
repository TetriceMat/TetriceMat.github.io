/**
 * Generative Flower Project
 * Enhanced flower detail with a 25-second drawing phase
 */

let progress = 0;
let finishTime = 0;
let drawStartTime = 0;
let isFinished = false;
let backgroundFlowers = [];
let mainFlowerPrimaryPetalColor = [255, 140, 0];
let mainFlowerSecondaryPetalColor = [255, 190, 80];
let mainFlowerAccentPetalColor = [220, 20, 60];

const drawDuration = 25000;

let lofiStarted = false;
let lofiKick, lofiSnare, lofiBass, lofiCrackle;
let bellStarted = false;
let bellTone1, bellTone2;
let bellNoteTimeouts = [];
let beatPattern = [1, 0, 0, 1, 0, 1, 0, 0];
let beatInterval = 320;
let lastBeatTime = 0;
let beatIndex = 0;
let snareEndTime = 0;
let bellNotes = [660, 880, 740, 660];
let bellNoteIndex = 0;
let bellNextNoteTime = 0;
let bellFadeTime = 0;

function setup() {
  createCanvas(400, 400);
  chooseMainFlowerPetalColors();
  drawSkyBackground();
  drawCanvasTexture();
  drawGrassBackground();
  initBackgroundFlowers();
  drawBackgroundFlowers();
  noStroke();
  drawStartTime = millis();
}

function chooseMainFlowerPetalColors() {
  const palettes = [
    { primary: [255, 140, 0], secondary: [255, 190, 80], accent: [220, 20, 60] },
    { primary: [233, 30, 99], secondary: [255, 180, 220], accent: [255, 230, 145] },
    { primary: [155, 89, 182], secondary: [225, 190, 255], accent: [255, 140, 210] },
    { primary: [74, 195, 255], secondary: [170, 235, 255], accent: [240, 100, 220] },
    { primary: [120, 200, 80], secondary: [190, 240, 130], accent: [255, 215, 120] }
  ];
  let palette = random(palettes);
  mainFlowerPrimaryPetalColor = palette.primary;
  mainFlowerSecondaryPetalColor = palette.secondary;
  mainFlowerAccentPetalColor = palette.accent;
}

function drawSkyBackground() {
  noStroke();
  for (let y = 0; y < height * 0.65; y += 2) {
    let inter = map(y, 0, height * 0.65, 0, 1);
    let skyColor = lerpColor(color(135, 206, 250), color(70, 130, 180), inter);
    fill(skyColor);
    rect(0, y, width, 2);
  }
  fill(245, 235, 220);
  rect(0, height * 0.65, width, height * 0.35);
}

function initBackgroundFlowers() {
  backgroundFlowers = [];
  const flowerPalette = [
    { petal: [255, 140, 0], center: [255, 215, 0] },
    { petal: [233, 30, 99], center: [255, 235, 115] },
    { petal: [155, 89, 182], center: [255, 225, 90] },
    { petal: [74, 195, 255], center: [255, 235, 170] },
    { petal: [255, 95, 135], center: [255, 215, 80] }
  ];

  for (let i = 0; i < 8; i++) {
    let x = random(width);
    let y = random(height * 0.3, height * 0.7);
    let scaleValue = random(0.15, 0.25);
    let palette = random(flowerPalette);
    backgroundFlowers.push({
      x,
      y,
      scale: scaleValue,
      petalColor: color(...palette.petal, 180),
      centerColor: color(...palette.center, 200)
    });
  }
}

function drawCanvasTexture() {
  noStroke();
  for (let i = 0; i < 120; i++) {
    fill(255, 250, 240, random(8, 16));
    ellipse(random(width), random(height), random(24, 72), random(4, 16));
  }
  for (let i = 0; i < 80; i++) {
    fill(255, 255, 255, random(6, 14));
    ellipse(random(width), random(height), random(2, 10));
  }
}

function drawGrassBackground() {
  noStroke();
  for (let y = height * 0.56; y < height; y += 3) {
    fill(100, 160, 90, random(80, 140));
    rect(0, y, width, 4);
  }
  for (let i = 0; i < 130; i++) {
    let x = random(width);
    let bladeHeight = random(20, 50);
    let y = height - random(10, 24);
    fill(40, 120, 50, random(140, 220));
    push();
    translate(x, y);
    rotate(random(-0.25, 0.25));
    triangle(0, 0, -2, -bladeHeight, 2, -bladeHeight * 0.75);
    pop();
  }
  for (let i = 0; i < 6; i++) {
    fill(74, 154, 76, random(90, 150));
    ellipse(random(width), height - random(12, 22), random(36, 54), random(16, 24));
  }
}

function drawBackgroundFlowers(isNight = false) {
  // Draw multiple smaller flowers scattered in the background, reusing stored flower state
  for (let i = 0; i < backgroundFlowers.length; i++) {
    let flower = backgroundFlowers[i];
    let sway = isNight ? sin(millis() * 0.003 + i * 0.5) * 3 : 0;
    drawSmallFlower(flower.x, flower.y + sway, flower.scale, isNight, flower);
  }
}

function drawSmallFlower(x, y, scale, isNight = false, flowerData = null) {
  push();
  translate(x, y);
 

  // Draw small stem
  if (isNight) {
    stroke(color(20, 60, 20, 150));
  } else {
    stroke(color(34, 139, 34, 150));
  }
  strokeWeight(3);
  line(0, 0, 0, 40);

  // Draw small petals
  noStroke();
  if (isNight) {
    if (flowerData) {
      let base = flowerData.petalColor;
      fill(red(base) * 0.55, green(base) * 0.55, blue(base) * 0.55, 140);
    } else {
      fill(color(100, 60, 0, 120)); // Darker petals for night
    }
  } else {
    fill(flowerData ? flowerData.petalColor : color(255, 140, 0, 180));
  }
  for (let i = 0; i < 6; i++) {
    let angle = i * TWO_PI / 6;
    push();
    rotate(angle);
    translate(0, -25);
    ellipse(0, 0, 20, 35);
    pop();
  }

  // Draw small center
  if (isNight) {
    if (flowerData) {
      let base = flowerData.centerColor;
      fill(red(base) * 0.55, green(base) * 0.55, blue(base) * 0.55, 160);
    } else {
      fill(color(150, 100, 0, 150)); // Dimmer center for night
    }
  } else {
    fill(flowerData ? flowerData.centerColor : color(255, 215, 0, 200));
  }
  ellipse(0, 0, 15, 15);

  pop();
}

function changeFlowerColor(flower) {
  const flowerPalette = [
    { petal: [255, 140, 0], center: [255, 215, 0] },
    { petal: [233, 30, 99], center: [255, 235, 115] },
    { petal: [155, 89, 182], center: [255, 225, 90] },
    { petal: [74, 195, 255], center: [255, 235, 170] },
    { petal: [255, 95, 135], center: [255, 215, 80] }
  ];
  let palette = random(flowerPalette);
  flower.petalColor = color(...palette.petal, 180);
  flower.centerColor = color(...palette.center, 200);
}

function redrawBackgroundLayer() {
  drawSkyBackground();
  drawCanvasTexture();
  drawGrassBackground();
  drawBackgroundFlowers();
}

function drawNightGrass() {
  noStroke();
  for (let y = height * 0.64; y < height; y += 3) {
    fill(18, 45, 20, random(140, 190));
    rect(0, y, width, 4);
  }
  for (let i = 0; i < 100; i++) {
    let x = random(width);
    let bladeHeight = random(18, 42);
    let y = height - random(10, 18);
    fill(30, 80, 36, random(120, 180));
    push();
    translate(x, y);
    rotate(random(-0.2, 0.2));
    triangle(0, 0, -2, -bladeHeight, 2, -bladeHeight * 0.75);
    pop();
  }
  for (let i = 0; i < 4; i++) {
    fill(42, 92, 42, random(100, 140));
    ellipse(random(width), height - random(10, 20), random(30, 46), random(14, 20));
  }
}

function painterlyLine(x1, y1, x2, y2, weight, c) {
  stroke(c);
  strokeWeight(weight);
  for (let i = 0; i < 3; i++) {
    line(
      x1 + random(-1.5, 1.5),
      y1 + random(-1.5, 1.5),
      x2 + random(-1.5, 1.5),
      y2 + random(-1.5, 1.5)
    );
  }
}

function paintDabs(x, y, w, h, count, c) {
  noStroke();
  for (let i = 0; i < count; i++) {
    fill(red(c), green(c), blue(c), random(12, 45));
    ellipse(
      x + random(-w * 0.3, w * 0.3),
      y + random(-h * 0.35, h * 0.15),
      random(w * 0.08, w * 0.2),
      random(h * 0.06, h * 0.16)
    );
  }
}

function startLofiAudio() {
  if (lofiStarted) return;
  userStartAudio();
  lofiStarted = true;

  lofiBass = new p5.Oscillator('triangle');
  lofiBass.freq(110);
  lofiBass.amp(0);
  lofiBass.start();

  lofiKick = new p5.Oscillator('sine');
  lofiKick.freq(60);
  lofiKick.amp(0);
  lofiKick.start();

  lofiSnare = new p5.Noise('white');
  lofiSnare.disconnect();
  let snareFilter = new p5.LowPass();
  lofiSnare.connect(snareFilter);
  snareFilter.freq(1400);
  lofiSnare.amp(0);
  lofiSnare.start();

  lofiCrackle = new p5.Noise('brown');
  lofiCrackle.disconnect();
  let crackleFilter = new p5.LowPass();
  lofiCrackle.connect(crackleFilter);
  crackleFilter.freq(1200);
  lofiCrackle.amp(0.04);
  lofiCrackle.start();

  lastBeatTime = millis();
  beatIndex = 0;
}

function triggerKick() {
  lofiKick.amp(0.16, 0.01);
  lofiKick.freq(60 + random(-6, 6));
  lofiKick.amp(0, 0.18, 0.05);
}

function triggerSnare() {
  lofiSnare.amp(0.08, 0.01);
  snareEndTime = millis() + 80;
}

function updateLofiBeat() {
  if (!lofiStarted) return;
  let now = millis();
  if (now - lastBeatTime > beatInterval) {
    lastBeatTime += beatInterval;
    if (beatPattern[beatIndex] === 1) {
      triggerKick();
    }
    if (beatIndex % 2 === 1) {
      triggerSnare();
    }
    beatIndex = (beatIndex + 1) % beatPattern.length;
    lofiBass.amp(0.12, 0.04);
    lofiBass.freq(100 + sin(now * 0.001) * 10 + random(-3, 3));
    lofiBass.amp(0, 0.18, 0.05);
  }
  // Handle snare fade out
  if (snareEndTime > 0 && now > snareEndTime) {
    if (lofiSnare) lofiSnare.amp(0, 0.12);
    snareEndTime = 0;
  }
}

function stopLofiAudio() {
  if (!lofiStarted) return;
  lofiStarted = false;
  if (lofiKick) lofiKick.amp(0, 0.8);
  if (lofiSnare) lofiSnare.amp(0, 0.8);
  if (lofiBass) lofiBass.amp(0, 0.8);
  if (lofiCrackle) lofiCrackle.amp(0, 0.8);
  snareEndTime = 0;
}

function startBellMusic() {
  if (bellStarted) return;
  bellStarted = true;

  bellTone1 = new p5.Oscillator('triangle');
  bellTone1.freq(440);
  bellTone1.amp(0);
  bellTone1.start();

  bellTone2 = new p5.Oscillator('sine');
  bellTone2.freq(660);
  bellTone2.amp(0);
  bellTone2.start();

  bellNoteIndex = 0;
  bellNextNoteTime = millis();
}

function playBellNote(freq) {
  if (!bellTone1 || !bellTone2) return;
  bellTone1.freq(freq);
  bellTone2.freq(freq * 1.5);
  bellTone1.amp(0.14, 0.01);
  bellTone2.amp(0.08, 0.01);
  bellFadeTime = millis() + 300;
}

function stopBellMusic() {
  bellNoteTimeouts.forEach(clearTimeout);
  bellNoteTimeouts = [];
  bellStarted = false;
  bellNoteIndex = 0;
  bellNextNoteTime = 0;
  bellFadeTime = 0;
  if (bellTone1) bellTone1.amp(0, 0.5);
  if (bellTone2) bellTone2.amp(0, 0.5);
}

function roughEllipse(x, y, w, h, c, alpha, layers = 3) {
  for (let i = 0; i < layers; i++) {
    fill(red(c), green(c), blue(c), alpha / (i + 1));
    ellipse(
      x + random(-1, 1),
      y + random(-1, 1),
      w + random(-6, 6),
      h + random(-6, 6)
    );
  }
}

function draw() {
  if (isFinished) {
    background(12, 16, 30);
    drawNightGrass();
    drawBackgroundFlowers(true); // true for night mode
    drawStarField();
    drawFlowerCentered();
    drawTopRightLabel();
    
    // Handle bell music timing
    let now = millis();
    if (bellStarted && bellNoteIndex < bellNotes.length && now >= bellNextNoteTime) {
      playBellNote(bellNotes[bellNoteIndex]);
      bellNoteIndex++;
      bellNextNoteTime = now + 700;
    }
    if (bellFadeTime > 0 && now >= bellFadeTime) {
      if (bellTone1) bellTone1.amp(0, 0.5);
      if (bellTone2) bellTone2.amp(0, 0.5);
      bellFadeTime = 0;
    }
    
    if (millis() - finishTime > 8000) {
      resetSketch();
    }
    return;
  }

  // Drawing phase
  let elapsed = millis() - drawStartTime;
  progress = constrain(elapsed / drawDuration, 0, 1);

  if (lofiStarted) {
    updateLofiBeat();
  }

  push();
  translate(width / 2, height / 2);
  drawOngoingFlower(progress);
  pop();

  if (!lofiStarted) {
    drawAudioPrompt();
  }

  drawTopRightLabel();

  if (elapsed >= drawDuration) {
    finalizeFlower();
  }
}

function drawTopRightLabel() {
  push();
  resetMatrix();
  noStroke();
  fill(255, 255, 255, 220);
  textSize(16);
  textAlign(RIGHT, TOP);
  text('click the flowers', width - 16, 16);
  pop();
}

function drawFlowerCentered() {
  push();
  translate(width / 2, height / 2);
  drawStem();
  let sway = sin((millis() - finishTime) * 0.004) * 10;
  let leafSway = sway * 0.4;
  let petalSway = sway;
  let centerSway = sway * 0.25;
  drawLeaves(leafSway);
  drawPetals(petalSway);
  drawCenter(centerSway);
  pop();
}

function drawStem() {
  stroke(34, 139, 34, 220);
  strokeWeight(10);
  noFill();
  beginShape();
  vertex(0, 0);
  bezierVertex(-12, 60, 12, 110, 0, 150);
  endShape();

  painterlyLine(0, 0, 0, 150, 6, color(34, 139, 34, 140));

  stroke(28, 100, 24, 180);
  strokeWeight(4);
  let thornYs = [40, 70, 100, 130];
  for (let y of thornYs) {
    painterlyLine(0, y, -8, y + 10, 3, color(28, 100, 24, 180));
    painterlyLine(0, y + 10, 8, y + 18, 3, color(28, 100, 24, 180));
  }
}

function drawLeaves(sway = 0) {
  noStroke();
  push();
  translate(sway, 0);
  drawLeaf(-40, 90, -PI / 4, 1.1);
  drawLeaf(40, 105, PI / 4, 0.95);
  pop();
}

function drawPetals(sway = 0) {
  push();
  translate(sway, -20);
  for (let layer = 0; layer < 3; layer++) {
    let count = 10 + layer * 2;
    let radius = 80 - layer * 15;
    let petalWidth = 46 - layer * 6;
    let petalHeight = 100 - layer * 12;
    let alpha = 180 - layer * 40;
    let fillColor = layer === 0 ? color(...mainFlowerPrimaryPetalColor, alpha) : color(...mainFlowerSecondaryPetalColor, alpha);

    fill(fillColor);
    noStroke();
    for (let i = 0; i < count; i++) {
      let angleStep = TWO_PI / count;
      push();
      rotate(i * angleStep);
      translate(0, -radius);
      
      // Randomly make some petals the accent color
      let petalColor = fillColor;
      if (random() < 0.3) {
        petalColor = color(...mainFlowerAccentPetalColor, alpha);
      }
      
      roughEllipse(0, 0, petalWidth, petalHeight, petalColor, alpha, 3);
      paintDabs(0, 0, petalWidth, petalHeight, 6, petalColor);
      pop();
    }

    stroke(255, 220, 130, 80);
    strokeWeight(2);
    for (let i = 0; i < count; i++) {
      let angleStep = TWO_PI / count;
      for (let j = 0; j < 3; j++) {
        let a = i * angleStep + random(-0.05, 0.05);
        let inner = radius - random(12, 24);
        let outer = radius - random(4, 10);
        let x1 = cos(a) * inner + random(-3, 3);
        let y1 = sin(a) * inner + random(-3, 3);
        let x2 = cos(a) * outer + random(-3, 3);
        let y2 = sin(a) * outer + random(-3, 3);
        painterlyLine(x1, y1, x2, y2, 2, color(255, 220, 130, 120));
      }
    }
    noStroke();
  }

  fill(255, 210, 100, 120);
  noStroke();
  for (let i = 0; i < 8; i++) {
    let angleStep = TWO_PI / 8;
    push();
    rotate(i * angleStep + 0.1);
    translate(0, -42);
    ellipse(0, 0, 14, 24);
    pop();
  }

  stroke(255, 215, 120, 80);
  strokeWeight(1.5);
  for (let i = 0; i < 24; i++) {
    let a = random(TWO_PI);
    let r = random(20, 60);
    let x1 = cos(a) * r + random(-2, 2);
    let y1 = sin(a) * r + random(-2, 2) - 20;
    let x2 = x1 + random(-8, 8);
    let y2 = y1 + random(-8, 8);
    line(x1, y1, x2, y2);
  }
  pop();
}

function drawCenter(sway = 0) {
  push();
  translate(sway, 0);
  noStroke();
  for (let r = 30; r > 0; r -= 6) {
    let alpha = map(r, 30, 0, 200, 255);
    fill(255, 215, 0, alpha);
    roughEllipse(0, 0, r * 2, r * 2, color(255, 215, 0), alpha, 2);
  }

  stroke(180, 130, 20, 220);
  strokeWeight(2);
  for (let i = 0; i < 12; i++) {
    let a = i * TWO_PI / 12;
    let x = cos(a) * 12;
    let y = sin(a) * 12;
    painterlyLine(x, y, cos(a) * 26, sin(a) * 26, 2, color(180, 130, 20, 220));
  }

  stroke(255, 235, 180, 100);
  strokeWeight(3);
  for (let r = 18; r < 32; r += 4) {
    arc(0, 0, r * 2 + random(-4, 4), r * 2 + random(-4, 4), random(-0.4, 0.4), random(PI - 0.4, PI + 0.4));
  }

  paintDabs(0, 0, 30, 30, 8, color(255, 240, 120));
  fill(255, 240, 120);
  noStroke();
  ellipse(0, 0, 18, 18);
  pop();
}

function drawOngoingFlower(progress) {
  if (progress > 0.05) {
    drawProgressStem(progress);
  }
  if (progress > 0.25) {
    drawProgressLeaves(progress);
  }
  if (progress > 0.45) {
    drawProgressPetals(progress);
  }
  if (progress > 0.75) {
    drawProgressCenter(progress);
  }
}

function drawProgressStem(progress) {
  let stemProgress = constrain((progress - 0.05) / 0.25, 0, 1);
  stroke(34, 139, 34, map(stemProgress, 0, 1, 60, 255));
  strokeWeight(4);
  noFill();
  line(0, 0, 0, 150 * stemProgress);
}

function drawProgressLeaves(progress) {
  let leafAlpha = map(progress, 0.25, 0.5, 0, 170);
  noStroke();
  fill(50, 205, 50, leafAlpha);
  drawLeaf(-40, 90, -PI / 4, 1.1, leafAlpha);
  drawLeaf(40, 105, PI / 4, 0.95, leafAlpha);
}

function drawLeaf(offsetX, offsetY, angleOffset, scaleFactor, alpha = 255) {
  push();
  translate(offsetX, offsetY);
  rotate(angleOffset);
  scale(scaleFactor);

  fill(34, 139, 34, alpha);
  beginShape();
  vertex(0, 0);
  bezierVertex(-45, -15, -55, -55, 0, -90);
  bezierVertex(55, -55, 45, -15, 0, 0);
  endShape(CLOSE);

  fill(60, 179, 113, alpha * 0.7);
  beginShape();
  vertex(0, 0);
  bezierVertex(-30, -10, -38, -45, 0, -70);
  bezierVertex(38, -45, 30, -10, 0, 0);
  endShape(CLOSE);

  paintDabs(0, -40, 70, 120, 10, color(50, 205, 50));

  stroke(120, 200, 140, alpha * 0.7);
  strokeWeight(2);
  painterlyLine(0, 0, 0, -70, 2, color(120, 200, 140, alpha * 0.7));
  for (let t = 1; t <= 3; t++) {
    let y = -20 * t;
    painterlyLine(0, y, -14 - t * 3, y - 12, 2, color(120, 200, 140, alpha * 0.7));
    painterlyLine(0, y, 14 + t * 2, y - 10, 2, color(120, 200, 140, alpha * 0.7));
  }

  noStroke();
  fill(255, 255, 255, alpha * 0.08);
  for (let j = 0; j < 6; j++) {
    let y = -15 - j * 12;
    ellipse(random(-12, 12), y + random(-4, 4), 14, 6);
  }
  pop();
}

function drawProgressPetals(progress) {
  let petalAlpha = map(progress, 0.45, 0.75, 0, 190);
  let petalCount = int(map(progress, 0.45, 0.75, 4, 14));
  let radius = map(progress, 0.45, 0.75, 45, 80);

  push();
  translate(0, -20);
  fill(...mainFlowerPrimaryPetalColor, petalAlpha);
  noStroke();
  for (let i = 0; i < petalCount; i++) {
    let angleStep = TWO_PI / petalCount;
    push();
    rotate(i * angleStep);
    translate(0, -radius);
    ellipse(0, 0, 32, 66);
    pop();
  }
  pop();
}

function drawProgressCenter(progress) {
  let centerProgress = constrain((progress - 0.75) / 0.25, 0, 1);
  let radius = 30 * centerProgress;
  noStroke();
  fill(255, 215, 0, centerProgress * 230);
  ellipse(0, 0, radius * 2, radius * 2);

  stroke(180, 130, 20, centerProgress * 220);
  strokeWeight(2);
  let stamenCount = int(6 + centerProgress * 6);
  for (let i = 0; i < stamenCount; i++) {
    let a = i * TWO_PI / stamenCount;
    line(cos(a) * 8, sin(a) * 8, cos(a) * (18 + radius * 0.4), sin(a) * (18 + radius * 0.4));
  }
}

function finalizeFlower() {
  isFinished = true;
  finishTime = millis();
  stopLofiAudio();
  startBellMusic();
}

function drawAudioPrompt() {
  push();
  resetMatrix();
  noStroke();
  fill(20, 20, 30, 200);
  rect(12, height - 48, 180, 32, 8);
  fill(255);
  textSize(14);
  textAlign(LEFT, CENTER);
  text('Click to start lofi music', 20, height - 32);
  pop();
}

function mousePressed() {
  let clickedFlower = null;
  for (let flower of backgroundFlowers) {
    let distance = dist(mouseX, mouseY, flower.x, flower.y);
    if (distance < 42 * flower.scale) {
      clickedFlower = flower;
      break;
    }
  }

  if (clickedFlower) {
    changeFlowerColor(clickedFlower);
    redrawBackgroundLayer();
    if (!lofiStarted) {
      startLofiAudio();
    }
    return;
  }

  if (!isFinished && dist(mouseX, mouseY, width / 2, height / 2) < 110) {
    changeMainFlowerPetals();
    return;
  }

  if (!lofiStarted) {
    startLofiAudio();
  }
}

function changeMainFlowerPetals() {
  chooseMainFlowerPetalColors();
}

function drawStarField() {
  noStroke();
  for (let i = 0; i < 40; i++) {
    fill(255, 245, 230, random(80, 160));
    ellipse(random(width), random(height), random(4, 8), random(4, 8));
  }
  let cols = 8;
  let rows = 8;
  let spacingX = width / (cols + 1);
  let spacingY = height / (rows + 1);
  for (let col = 1; col <= cols; col++) {
    for (let row = 1; row <= rows; row++) {
      fill(255, 248, 230, random(160, 220));
      ellipse(col * spacingX + random(-6, 6), row * spacingY + random(-6, 6), random(4, 8), random(4, 8));
    }
  }
}

function resetSketch() {
  progress = 0;
  drawStartTime = millis();
  isFinished = false;
  chooseMainFlowerPetalColors();
  initBackgroundFlowers();
  redrawBackgroundLayer();
  stopBellMusic();
  snareEndTime = 0;
}
