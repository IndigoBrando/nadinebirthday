
  let flameWrapper = document.getElementById('flameWrapper');
  let smokeWrapper = document.getElementById('smokeWrapper');
  let isMicActive = false;
  let micStream;
  let audioContext;
  let analyser;
  let blowThreshold = 50;
  let speakThreshold = 70;
  let extinguishDuration = 300000;
  let extinguishedTimer = null;

  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function (stream) {
      micStream = stream;
      isMicActive = true;
      initAudioAnalyzer();
      toggleAnimation();
    })
    .catch(function (error) {
      console.error('Error accessing default microphone:', error);
    });

  function initAudioAnalyzer() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    let source = audioContext.createMediaStreamSource(micStream);
    source.connect(analyser);
    analyser.fftSize = 256;
  }

  function toggleAnimation() {
    if (isMicActive) {
      let averageVolume = getAverageVolume();

      if (averageVolume > blowThreshold) {
        smokeWrapper.style.display = 'block';
        flameWrapper.style.display = 'none';

        if (extinguishedTimer) clearTimeout(extinguishedTimer);
        extinguishedTimer = setTimeout(() => {
          flameWrapper.style.display = 'block';
          smokeWrapper.style.display = 'none';
          extinguishedTimer = null;
        }, extinguishDuration);
      } else if (averageVolume > speakThreshold) {
        smokeWrapper.style.display = 'block';
        flameWrapper.style.display = 'none';
      } else {
        smokeWrapper.style.display = 'none';
        flameWrapper.style.display = 'block';
      }

      setTimeout(toggleAnimation, 50);
    }
  }

  function getAverageVolume() {
    let dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);
    let values = 0;
    let length = dataArray.length;
    for (let i = 0; i < length; i++) {
      values += dataArray[i];
    }
    let averageVolume = values / length;
    return averageVolume;
  }





  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement('div');
    confetti.classList.add('confetti');
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
    document.body.appendChild(confetti);
  }
