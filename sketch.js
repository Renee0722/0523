let video;
let facemesh;
let predictions = [];
// 嘴巴外圈的點
const mouthPoints = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95, 185, 40, 39, 37, 0, 267, 269, 270, 409, 415, 310, 311, 312, 13, 82, 81, 42, 183, 78];
// 新增要串接的點
const customLinePoints = [76,77,90,180,85,16,315,404,320,307,306,408,304,303,302,11,72,73,74,184];

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

    // 畫嘴巴外圈
    stroke(255, 0, 0);
    strokeWeight(10);
    noFill();
    beginShape();
    for (let i = 0; i < mouthPoints.length; i++) {
      const idx = mouthPoints[i];
      const [x, y] = keypoints[idx];
      vertex(width - x, y);
    }
    endShape(CLOSE);

    // 畫自訂陣列的紅色粗線
    stroke(255, 0, 0);
    strokeWeight(10);
    noFill();
    beginShape();
    for (let i = 0; i < customLinePoints.length; i++) {
      const idx = customLinePoints[i];
      const [x, y] = keypoints[idx];
      vertex(width - x, y);
    }
    endShape();
  }
  pop();
}
