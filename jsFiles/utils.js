
// initialize jsPsych
const jsPsych = initJsPsych({
    on_finish: (data) => {
        data.boot = boot;
        if(!boot) {
            document.body.innerHTML = 
                `<div align='center' style="margin: 10%">
                    <p>Thank you for participating!<p>
                    <b>You will be automatically re-directed to Prolific in a few moments.</b>
                </div>`;
            setTimeout(() => { 
                location.href = `https://app.prolific.co/submissions/complete?cc=${completionCode}`
            }, 2000);
        }
    },
});

// set and save subject ID
let subject_id = jsPsych.data.getURLVariable("PROLIFIC_PID");
if (!subject_id) { subject_id = jsPsych.randomization.randomID(10) };
jsPsych.data.addProperties({ subject: subject_id });

// define file name
const filename = `${subject_id}.csv`;

// define completion code for Prolific
const completionCode = "CW0CMZ8Y";

// when true, boot participant from study without redirecting to Prolific
let boot = false;

// function for saving survey data in wide format
const saveSurveyData = (data) => {
    const names = Object.keys(data.response);
    const values = Object.values(data.response);
    for(let i = 0; i < names.length; i++) {
        data[names[i]] = values[i];
    };      
};

const getTotalErrors = (data, correctAnswers) => {
    const answers = Object.values(data.response);
    const errors = answers.map((val, index) => val === correctAnswers[index] ? 0 : 1)
    const totalErrors = errors.reduce((partialSum, a) => partialSum + a, 0);
    return totalErrors;
};

const createSpinner = function(canvas, spinnerData, score, sectors, reliability, label, interactive) {

  

  /* get context */
  const ctx = canvas.getContext("2d"); 

  let layerArray = Array(6).fill('inner').concat(Array(6).fill('outer'));
  layerArray = jsPsych.randomization.repeat(layerArray, 1);

  /* get score message */
  const scoreMsg = document.getElementById("score");

  /* get wheel properties */
  let wheelWidth = canvas.getBoundingClientRect()['width'];
  let wheelHeight = canvas.getBoundingClientRect()['height'];
  let wheelX = canvas.getBoundingClientRect()['x'] + wheelWidth / 2;
  let wheelY = canvas.getBoundingClientRect()['y'] + wheelHeight / 2;
  const tot = sectors.length; // total number of sectors
  const rad = wheelWidth / 2; // radius of wheel
  const PI = Math.PI;
  const arc = (2 * PI) / tot; // arc sizes in radians

  /* spin dynamics */
  const friction = 0.975;  // 0.995=soft, 0.99=mid, 0.98=hard
  const angVelMin = 5; // Below that number will be treated as a stop
  let angVelMax = 0; // Random ang.vel. to acceletare to 
  let angVel = 0;    // Current angular velocity

  /* state variables */
  let isGrabbed = false;       // true when wheel is grabbed, false otherwise
  let isDragging = false;      // true when wheel is being dragged, false otherwise
  let isSpinning = false;      // true when wheel is spinning, false otherwise
  let isAccelerating = false;  // true when wheel is accelerating, false otherwise
  let lastAngles = [0,0,0];    // store the last three angles
  let correctSpeed = [0]       // speed corrected for 360-degree limit
  let startAngle = null;       // angle of grab
  let oldAngle = 0;            // wheel angle prior to last perturbation
  let oldAngle_corrected;
  let currentAngle = null;     // wheel angle after last perturbation
  let onWheel = false;         // true when cursor is on wheel, false otherwise
  let spin_num = 5             // number of spins
  let liveSectorLabel;
  let direction;
  let animId = null;          // current requestAnimationFrame handle


  /* define spinning functions */

  const onGrab = (x, y) => {
    if (!isSpinning) {
      canvas.style.cursor = "grabbing";
      isGrabbed = true;
      startAngle = calculateAngle(x, y);
    };
  };

  const calculateAngle =  (currentX, currentY) => {
    let xLength = currentX - wheelX;
    let yLength = currentY - wheelY;
    let angle = Math.atan2(xLength, yLength) * (180/Math.PI);
    return 360 - angle;
  };

  const onMove = (x, y) => {
    if(isGrabbed) {
      canvas.style.cursor = "grabbing";
      isDragging = true;
    };
    if(!isDragging)
      return
    lastAngles.shift();
    let deltaAngle = calculateAngle(x, y) - startAngle;
    currentAngle = deltaAngle + oldAngle;
    lastAngles.push(currentAngle);
    let speed = lastAngles[2] - lastAngles[0];
    if (Math.abs(speed) < 200) {
      correctSpeed.shift();
      correctSpeed.push(speed);
    };
    render(currentAngle);
  };

  const render = (deg) => {
    canvas.style.transform = `rotate(${deg}deg)`;
  };


  const onRelease = function() {
    isGrabbed = false;
    if(isDragging){
      isDragging = false;
      oldAngle = currentAngle;
      let speed = correctSpeed[0];
      if (Math.abs(speed) > angVelMin) {
        direction = (speed > 0) ? 1 : -1;
        isAccelerating = true;
        isSpinning = true;
        angVelMax = rand(25, 50);
        giveMoment(speed)
      };
    };   
  };

  const giveMoment = function(initialSpeed) {

    let speed = initialSpeed;
    let lastTimestamp = null;

    function step(timestamp) {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const deltaTime = (timestamp - lastTimestamp) / 1000; // seconds
      lastTimestamp = timestamp;

      // stop accelerating when max speed is reached
      if (Math.abs(speed) >= angVelMax) isAccelerating = false;

      let liveSector = sectors[getIndex(oldAngle)];
      liveSectorLabel = liveSector.label;
      oldAngle_corrected = (oldAngle < 0) ? 360 + (oldAngle % 360) : oldAngle % 360;


      // accelerate
      if (isAccelerating) {
        let growthRate = Math.log(1.06) * 60;
        speed *= Math.exp(growthRate * deltaTime);
        animId = requestAnimationFrame(step);
        oldAngle += speed * deltaTime * 60;
        lastAngles.shift();
        lastAngles.push(oldAngle);
        render(oldAngle);
      }
      
      // decelerate and stop
      else {
        let decayRate = Math.log(friction) * 60; // friction < 1, so log is negative
        isAccelerating = false;
        speed *= Math.exp(decayRate * deltaTime); // Exponential decay
        animId = requestAnimationFrame(step);
        if (Math.abs(speed) > angVelMin * .1) {
          // decelerate
          oldAngle += speed * deltaTime * 60;
          lastAngles.shift();
          lastAngles.push(oldAngle);
          render(oldAngle);       
        } else {
          speed = 0;
          if (animId !== null) {
            cancelAnimationFrame(animId);
            animId = null;
          }
          currentAngle = oldAngle;
          let sectorIdx = getIndex();
          const layer = layerArray.pop();
          let sector = sectors[sectorIdx];
          spinnerData.outcomes_wedges.push(sector.outer.points); // or sector_real.inner.points; your choice
          let prizeObj = sector[layer]; // {label, points}
          let points   = prizeObj.points;
          spinnerData.outcomes_points.push(points);
          setTimeout(() => { updateScore(points, "black", sectorIdx, layer) }, 1000);
        };
      };
    };
    animId = requestAnimationFrame(step);
  };

  /* generate random float in range min-max */
  const rand = (m, M) => Math.random() * (M - m) + m;


  const updateScore = (points, color, sectorIdx, layer) => {
    score += points;
    spinnerData.score = score;
    scoreMsg.innerHTML = `<span style="color:${color}; font-weight: bolder">${score}</span>`;
    drawSector(sectors, sectorIdx, layer); // <--- pass layer
    setTimeout(() => {
      scoreMsg.innerHTML = `${score}`
      isSpinning = (spinnerData.outcomes_points.length >= 12) ? true : false;
      drawSector(sectors, null, null);
      onWheel ? canvas.style.cursor = "grab" : canvas.style.cursor = "";
      if (!interactive && spinnerData.outcomes_points.length < 12) { setTimeout(startAutoSpin, 1000) };
    }, 1000);
  };

  const getIndex = () => {
    let normAngle = 0;
    let modAngle = currentAngle % 360;
    if (modAngle > 270) {
      normAngle = 360 - modAngle + 270;
    } else if (modAngle < -90) { 
      normAngle =  -modAngle - 90;
    } else {
      normAngle = 270 - modAngle;
    }
    let sector = Math.floor(normAngle / (360 / tot))
    return sector
  }

  //* Draw sectors and prizes texts to canvas */
  const drawSector = (sectors, sectorIdx = null, activeLayer = null) => {
    const INNER_F = 0.65;  // fraction of radius for inner disk
    const TEXT_INNER_R = 0.40;
    const TEXT_OUTER_R = 0.80;
    const BORDER_PAD = 6;  // padding so outlines don’t get cut off

    // local radius, keep center at (rad, rad)
    const localR = rad - BORDER_PAD;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < sectors.length; i++) {
      const ang0 = arc * i;
      const ang1 = ang0 + arc;

      // --- fill outer wedge ---
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(rad, rad);
      ctx.arc(rad, rad, localR, ang0, ang1);
      ctx.lineTo(rad, rad);
      ctx.closePath();
      ctx.fillStyle = sectors[i].color;   // <— was sectors[i].color
      ctx.fill();

      // --- knock inner disk to create "ring" ---
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.moveTo(rad, rad);
      ctx.arc(rad, rad, localR * INNER_F, ang0, ang1);
      ctx.lineTo(rad, rad);
      ctx.closePath();
      ctx.fill();

      // --- paint inner disk back ---
      ctx.globalCompositeOperation = 'source-over';
      ctx.beginPath();
      ctx.moveTo(rad, rad);
      ctx.arc(rad, rad, localR * INNER_F, ang0, ang1);
      ctx.lineTo(rad, rad);
      ctx.closePath();
      ctx.fillStyle = sectors[i].color;   // <— was sectors[i].color
      ctx.fill();

      // --- highlight winning layer (if any) ---
      if (sectorIdx !== null && i === sectorIdx && isSpinning) {
        const highlight = (layer) => {
          ctx.save();
          // Clear dim just for target layer
          ctx.globalCompositeOperation = 'destination-out';
          ctx.beginPath();
          if (layer === 'outer') {
            ctx.arc(rad, rad, localR, ang0, ang1, false);
            ctx.arc(rad, rad, localR * INNER_F, ang1, ang0, true);
          } else {
            ctx.moveTo(rad, rad);
            ctx.arc(rad, rad, localR * INNER_F, ang0, ang1, false);
            ctx.lineTo(rad, rad);
          }
          ctx.closePath();
          ctx.fill();

          // Paint back with solid highlight
          ctx.globalCompositeOperation = 'source-over';
          ctx.beginPath();
          if (layer === 'outer') {
            ctx.arc(rad, rad, localR, ang0, ang1, false);
            ctx.arc(rad, rad, localR * INNER_F, ang1, ang0, true);
          } else {
            ctx.moveTo(rad, rad);
            ctx.arc(rad, rad, localR * INNER_F, ang0, ang1, false);
            ctx.lineTo(rad, rad);
          }
          ctx.closePath();
          ctx.fillStyle = '#000';
          ctx.fill();
          ctx.restore();
        };

        if (activeLayer === 'inner' || activeLayer === 'outer') {
          highlight(activeLayer);
        }
      }

      // --- labels ---
      ctx.save();
      ctx.translate(rad, rad); // keep center at (rad, rad)
      ctx.rotate((ang0 + ang1) / 2 + Math.PI / 2);
      ctx.textAlign = "center";
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 3;

      ctx.font = "bold 48px sans-serif";
      const outerLabel = sectors[i].outer.label;
      ctx.strokeText(outerLabel, 0, -localR * TEXT_OUTER_R);
      ctx.fillStyle = "#fff";
      ctx.fillText(outerLabel, 0, -localR * TEXT_OUTER_R);

      ctx.font = "bold 44px sans-serif";
      const innerLabel = sectors[i].inner.label;
      ctx.strokeText(innerLabel, 0, -localR * TEXT_INNER_R);
      ctx.fillStyle = "#fff";
      ctx.fillText(innerLabel, 0, -localR * TEXT_INNER_R);
      ctx.restore();

      // --- borders ---
      ctx.save();
      ctx.beginPath();
      ctx.arc(rad, rad, localR, ang0, ang1);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(0,0,0,0.25)";
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(rad, rad, localR * INNER_F, ang0, ang1);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "rgba(0,0,0,0.25)";
      ctx.stroke();
      ctx.restore();
    }
  };

  drawSector(sectors, null, null);

  function startAutoSpin() {
    direction = (Math.random() < 0.5 ? 1 : -1);
    isAccelerating = true;
    isSpinning = true;
    angVelMax = rand(25, 50);                   
    let initialSpeed = direction * rand(8, 15);
    giveMoment(initialSpeed);
  };

  if (interactive) {
    /* add event listners */
    canvas.addEventListener('mousedown', function(e) {
        if (onWheel) { onGrab(e.clientX, e.clientY) };
    });

    canvas.addEventListener('mousemove', function(e) {
        let dist = Math.sqrt( (wheelX - e.clientX)**2 + (wheelY - e.clientY)**2 );
        dist < rad ? onWheel = true : onWheel = false;
        onWheel && !isGrabbed && !isSpinning ? canvas.style.cursor = "grab" : canvas.style.cursor = "";
        if(isGrabbed && onWheel) { onMove(e.clientX, e.clientY) };
    });

    window.addEventListener('mouseup', onRelease);
  } else {
    setTimeout(startAutoSpin, 1000);
  };

  window.addEventListener('resize', function(event) {
    wheelWidth = canvas.getBoundingClientRect()['width'];
    wheelHeight = canvas.getBoundingClientRect()['height'];
    wheelX = canvas.getBoundingClientRect()['x'] + wheelWidth / 2;
    wheelY = canvas.getBoundingClientRect()['y'] + wheelHeight / 2;
  }, true);

};