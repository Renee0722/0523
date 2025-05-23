let video;
let facemesh;
let predictions = [];
// 嘴巴外圈的點
const mouthPoints = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95, 185, 40, 39, 37, 0, 267, 269, 270, 409, 415, 310, 311, 312, 13, 82, 81, 42, 183, 78];
// 新增要串接的點
const customLinePoints = [76,77,90,180,85,16,315,404,320,307,306,408,304,303,302,11,72,73,74,184];
// 左右眼外圈的點（依官方facemesh編號）
const leftEyePoints = [33, 246, 161, 160, 159, 158, 157, 173];
const rightEyePoints = [263, 466, 388, 387, 386, 385, 384, 398];

function setup() {
  createCanvas(640, 480).position(
    (windowWidth - width) / 2,
    (windowHeight - height) / 2
  );
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  facemesh = ml5.facemesh(video, modelReady);
  facemesh.on('predict', results => {
    predictions = results;
  });
}

function modelReady() {
  console.log('Facemesh model loaded!');
}

function draw() {
  // 畫布鏡像
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);

  if (predictions.length > 0) {
    const keypoints = predictions[0].scaledMesh;

    // 嘴巴外圈造型：紅色粗線+半透明填色
    fill(255, 0, 0, 80); // 半透明紅色
    stroke(255, 0, 0);
    strokeWeight(10);
    beginShape();
    for (let i = 0; i < mouthPoints.length; i++) {
      const idx = mouthPoints[i];
      const [x, y] = keypoints[idx];
      vertex(x, y);
    }
    endShape(CLOSE);

    // 自訂線條造型：黃色線
    stroke(255, 255, 0);
    strokeWeight(8);
    noFill();
    beginShape();
    for (let i = 0; i < customLinePoints.length; i++) {
      const idx = customLinePoints[i];
      const [x, y] = keypoints[idx];
      vertex(x, y);
    }
    endShape();

    // 左眼造型：綠色線+白色填色
    fill(255, 255, 255, 180);
    stroke(0, 255, 0);
    strokeWeight(6);
    beginShape();
    for (let i = 0; i < leftEyePoints.length; i++) {
      const idx = leftEyePoints[i];
      const [x, y] = keypoints[idx];
      vertex(x, y);
    }
    endShape(CLOSE);

    // 左眼瞳孔（圓形）
    let lx = 0, ly = 0;
    for (let i = 0; i < leftEyePoints.length; i++) {
      const idx = leftEyePoints[i];
      lx += keypoints[idx][0];
      ly += keypoints[idx][1];
    }
    lx /= leftEyePoints.length;
    ly /= leftEyePoints.length;
    fill(0, 180, 0);
    noStroke();
    ellipse(lx, ly, 18, 18);

    // 右眼造型：藍色線+白色填色
    fill(255, 255, 255, 180);
    stroke(0, 0, 255);
    strokeWeight(6);
    beginShape();
    for (let i = 0; i < rightEyePoints.length; i++) {
      const idx = rightEyePoints[i];
      const [x, y] = keypoints[idx];
      vertex(x, y);
    }
    endShape(CLOSE);

    // 右眼瞳孔（圓形）
    let rx = 0, ry = 0;
    for (let i = 0; i < rightEyePoints.length; i++) {
      const idx = rightEyePoints[i];
      rx += keypoints[idx][0];
      ry += keypoints[idx][1];
    }
    rx /= rightEyePoints.length;
    ry /= rightEyePoints.length;
    fill(0, 0, 180);
    noStroke();
    ellipse(rx, ry, 18, 18);

    // ====== 加入黑色眼睫毛 ======
    // 以左眼和右眼外圈點為基礎，向外延伸短線段
    drawEyelashes(leftEyePoints, keypoints, 15);
    drawEyelashes(rightEyePoints, keypoints, 15);
  }
  pop();
}

// 畫眼睫毛的輔助函式
function drawEyelashes(eyePoints, keypoints, len = 15) {
  stroke(0);
  strokeWeight(3);
  for (let i = 0; i < eyePoints.length; i++) {
    const idx = eyePoints[i];
    const prevIdx = eyePoints[(i - 1 + eyePoints.length) % eyePoints.length];
    const nextIdx = eyePoints[(i + 1) % eyePoints.length];
    const [x, y] = keypoints[idx];
    const [px, py] = keypoints[prevIdx];
    const [nx, ny] = keypoints[nextIdx];

    // 取前後點的中點，計算法線方向
    const dx = nx - px;
    const dy = ny - py;
    // 法線向量（單位向量）
    const mag = Math.sqrt(dx * dx + dy * dy);
    const nxn = -dy / mag;
    const nyn = dx / mag;

    // 眼睫毛終點
    const ex = x + nxn * len;
    const ey = y + nyn * len;

    line(x, y, ex, ey);
  }
}
