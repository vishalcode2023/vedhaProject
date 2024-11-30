const video = document.getElementById('video');
const loginButton = document.getElementById('loginButton');
let faceDescriptor = null;

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
])
  .then(() => {
    console.log('FaceAPI models loaded');
    startVideo();
  })
  .catch(err => {
    console.error('Error loading models:', err);
  });

function startVideo() {
  navigator.mediaDevices.getUserMedia({ video: {} })
    .then((stream) => {
      video.srcObject = stream;
    })
    .catch((err) => {
      console.error('Error accessing webcam:', err);
    });
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);

  canvas.style.position = 'absolute';
  canvas.style.top = video.offsetTop + 'px';
  canvas.style.left = video.offsetLeft + 'px';

  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({
      inputSize: 512,
      scoreThreshold: 0.5
    }))
      .withFaceLandmarks()
      .withFaceDescriptors()
      .withFaceExpressions();

    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

    if (detections.length > 0) {
      faceDescriptor = detections[0].descriptor;
      console.log('Face detected');
    } else {
      console.log('No face detected');
    }
  }, 200);
});

// Handle single and double clicks
let singleClickTimeout;

loginButton.addEventListener('click', () => {
  // Clear the single-click timeout in case of a double-click
  clearTimeout(singleClickTimeout);

  // Set a timeout for the single-click action
  singleClickTimeout = setTimeout(() => {
    alert('No face detected. Please make sure your face is visible.');
  }, 300); // 300ms delay to differentiate from double click
});

loginButton.addEventListener('dblclick', () => {
  clearTimeout(singleClickTimeout);
    window.location.href = '/profile';
});
