// Auto Accident Detection using DeviceMotion API
export class AccidentDetector {
  constructor(onDetect) {
    this.onDetect = onDetect;
    this.accelerationThreshold = 15; // m/s²
    this.cooldownPeriod = 30000; // 30 seconds
    this.lastDetection = 0;
  }

  start() {
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
      DeviceMotionEvent.requestPermission().then(permissionState => {
        if (permissionState === 'granted') {
          window.addEventListener('devicemotion', this.handleMotion.bind(this));
        }
      });
    } else if ('DeviceMotionEvent' in window) {
      window.addEventListener('devicemotion', this.handleMotion.bind(this));
    }
  }

  stop() {
    window.removeEventListener('devicemotion', this.handleMotion.bind(this));
  }

  handleMotion(event) {
    const acc = event.accelerationIncludingGravity;
    const magnitude = Math.sqrt(acc.x ** 2 + acc.y ** 2 + acc.z ** 2);
    const now = Date.now();

    if (magnitude > this.accelerationThreshold && now - this.lastDetection > this.cooldownPeriod) {
      this.lastDetection = now;
      this.onDetect({
        timestamp: now,
        acceleration: magnitude,
        event
      });
    }
  }
}

// Usage in React component:
// const detector = new AccidentDetector((data) => {
//   setShowAccidentPrompt(true);
// });
// detector.start();
