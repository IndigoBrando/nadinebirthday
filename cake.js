let flameWrapper = document.getElementById('flameWrapper');
    let smokeWrapper = document.getElementById('smokeWrapper');
    let isMicActive = false;
    let micStream;
    let audioContext;
    let analyser;
    let blowThreshold = 50;
    let speakThreshold = 70;
    let blowDetected = false;

    let extinguishDuration = 300000;
    let extinguishedTimer = null;

    // Access the default microphone
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

    // Function to toggle flame and smoke animations based on microphone activity
    function toggleAnimation() {
      if (isMicActive) {
        // Analyze microphone input volume
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

       var modal = document.getElementById("myModal");
       var btn = document.getElementById("openLetter");
       var span = document.getElementsByClassName("close")[0];
   
       btn.onclick = function() {
         modal.style.display = "block";
       }
   
       span.onclick = function() {
         modal.style.display = "none";
       }
   
       window.onclick = function(event) {
         if (event.target == modal) {
           modal.style.display = "none";
         }
       }