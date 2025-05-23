let video;
let facemesh;
let predictions = [];
const points = [409,270,269,267,0,37,39,40,185,61,146,91,181,84,17,314,405,321,375,291];

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

    // 畫出所有臉部特徵點
    fill(0, 255, 0);
    noStroke();
    for (let i = 0; i < keypoints.length; i++) {
      const [x, y] = keypoints[i];
      ellipse(width - x, y, 5, 5); // 鏡像處理
    }

    // 畫紅色粗線串接指定點
    stroke(255, 0, 0);
    strokeWeight(10);
    noFill();
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = keypoints[points[i]];
      const p2 = keypoints[points[i + 1]];
      if (p1 && p2) {
        line(width - p1[0], p1[1], width - p2[0], p2[1]);
      }
    }
  }
  pop();
}
