document.addEventListener('DOMContentLoaded', function() {
  // All webcam and motion detection logic extracted from index.html

  const video = document.getElementById('webcam');
  const canvas = document.getElementById('changeCanvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  const screenshotCanvas = document.getElementById('screenshotCanvas');
  const screenshotCtx = screenshotCanvas ? screenshotCanvas.getContext('2d') : null;
  const webcamCanvas = document.getElementById('webcamCanvas');
  const webcamCtx = webcamCanvas ? webcamCanvas.getContext('2d') : null;
  const startBtn = document.getElementById('startWebcam');
  const stopBtn = document.getElementById('stopWebcam');
  const startMotionBtn = document.getElementById('startMotion');
  const stopMotionBtn = document.getElementById('stopMotion');

  // Log errors if any element is missing
  if (!video) console.error('Element #webcam not found');
  if (!canvas) console.error('Element #changeCanvas not found');
  if (!ctx) console.error('2D context for #changeCanvas not found');
  if (!screenshotCanvas) console.error('Element #screenshotCanvas not found');
  if (!screenshotCtx) console.error('2D context for #screenshotCanvas not found');
  if (!webcamCanvas) console.error('Element #webcamCanvas not found');
  if (!webcamCtx) console.error('2D context for #webcamCanvas not found');
  if (!startBtn) console.error('Element #startWebcam not found');
  if (!stopBtn) console.error('Element #stopWebcam not found');
  if (!startMotionBtn) console.error('Element #startMotion not found');
  if (!stopMotionBtn) console.error('Element #stopMotion not found');

  let prevImageData = null;
  let stream = null;
  let intervalId = null;
  let motionDetectionActive = true;
  let cameraStatus = "inactive";

  function getFrameData() {
    return webcamCtx.getImageData(0, 0, webcamCanvas.width, webcamCanvas.height);
  }

  function detectChange() {
    if (!motionDetectionActive) return;
    if (video.readyState < 2) return;
    const currImageData = getFrameData();
    let significantChange = false;
    if (prevImageData) {
      const diff = ctx.createImageData(currImageData.width, currImageData.height);
      const threshold = 40;
      for (let i = 0; i < currImageData.data.length; i += 4) {
        const r = Math.abs(currImageData.data[i] - prevImageData.data[i]);
        const g = Math.abs(currImageData.data[i+1] - prevImageData.data[i+1]);
        const b = Math.abs(currImageData.data[i+2] - prevImageData.data[i+2]);
        const avg = (r + g + b) / 3;
        if (avg > threshold) significantChange = true;
        if (avg > threshold) {
          diff.data[i] = diff.data[i+1] = diff.data[i+2] = avg;
          diff.data[i+3] = 255;
        } else {
          diff.data[i] = diff.data[i+1] = diff.data[i+2] = 0;
          diff.data[i+3] = 0;
        }
      }
      ctx.putImageData(diff, 0, 0);
      if (significantChange) {
        screenshotCtx.putImageData(currImageData, 0, 0);
        const now = new Date();
        const datetimeString = now.toLocaleString();
        document.getElementById('screenshotDatetime').textContent = `Captured: ${datetimeString}`;
      }
    }
    prevImageData = currImageData;
  }

  function drawWebcamToCanvas() {
    if (video.readyState >= 2 && !video.paused && !video.ended) {
      webcamCtx.drawImage(video, 0, 0, webcamCanvas.width, webcamCanvas.height);
    }
    if (stream) {
      requestAnimationFrame(drawWebcamToCanvas);
    }
  }

  function updateButtonStates() {
    if (cameraStatus === "inactive") {
      startMotionBtn.disabled = true;
      stopMotionBtn.disabled = true;
      startBtn.disabled = false;
      stopBtn.disabled = true;
    } else {
      startMotionBtn.disabled = false;
      stopMotionBtn.disabled = false;
      startBtn.disabled = true;
      stopBtn.disabled = false;
    }
  }

  function startWebcam() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(s => {
          stream = s;
          video.srcObject = stream;
          video.onloadedmetadata = () => {
            video.play();
            canvas.style.display = '';
            screenshotCanvas.style.display = '';
            document.getElementById('webcamCaption').style.display = '';
            document.getElementById('changeCaption').style.display = '';
            document.getElementById('screenshotCaption').style.display = '';
            if (intervalId) clearInterval(intervalId);
            intervalId = setInterval(detectChange, 3000);
            drawWebcamToCanvas();
            cameraStatus = "active";
            updateButtonStates();
          };
        })
        .catch(err => {
          console.error('Error accessing webcam: ', err);
        });
    } else {
      alert('getUserMedia not supported in this browser.');
    }
  }

  function stopWebcam() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      video.srcObject = null;
      stream = null;
      canvas.style.display = 'none';
      screenshotCanvas.style.display = 'none';
      document.getElementById('webcamCaption').style.display = 'none';
      document.getElementById('changeCaption').style.display = 'none';
      document.getElementById('screenshotCaption').style.display = 'none';
      // Clear the captured datetime when webcam is stopped
      document.getElementById('screenshotDatetime').textContent = '';
      // Clear the webcam feed canvas as well
      webcamCtx.clearRect(0, 0, webcamCanvas.width, webcamCanvas.height);
      cameraStatus = "inactive";
      updateButtonStates();
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }
  }

  function startMotionDetection() {
    motionDetectionActive = true;
    canvas.style.display = '';
    screenshotCanvas.style.display = '';
    document.getElementById('changeCaption').style.display = '';
    document.getElementById('screenshotCaption').style.display = '';
    document.getElementById('screenshotDatetime').style.display = ''; // Show screenshotDatetime
    if (!intervalId) {
      intervalId = setInterval(detectChange, 3000);
    }
    detectChange();
  }

  function stopMotionDetection() {
    motionDetectionActive = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.display = 'none';
    screenshotCanvas.style.display = 'none';
    document.getElementById('changeCaption').style.display = 'none';
    document.getElementById('screenshotCaption').style.display = 'none';
    document.getElementById('screenshotDatetime').style.display = 'none'; // Hide screenshotDatetime
  }

  // Initialize button states on page load
  updateButtonStates();

  startBtn.addEventListener('click', startWebcam);
  stopBtn.addEventListener('click', stopWebcam);
  startMotionBtn.addEventListener('click', startMotionDetection);
  stopMotionBtn.addEventListener('click', stopMotionDetection);
});
