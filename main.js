const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const result = document.getElementById('result');
const context = canvas.getContext('2d');

navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then(stream => {
        video.srcObject = stream;
        video.setAttribute('playsinline', true); // Required for iOS
        video.play();
        requestAnimationFrame(scanQRCode);
    })
    .catch(err => console.error('Error accessing camera:', err));

function scanQRCode() {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
            result.textContent = `QR Code Data: ${code.data}`;
            // Optionally, stop the video stream once a code is detected
            video.srcObject.getTracks().forEach(track => track.stop());
        } else {
            requestAnimationFrame(scanQRCode);
        }
    } else {
        requestAnimationFrame(scanQRCode);
    }
}
