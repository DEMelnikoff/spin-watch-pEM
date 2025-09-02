
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

const createSpinner = function(canvas, spinnerData, sectors, interactive) {

  /* get context */
  const ctx = canvas.getContext("2d"); 

  /* --- NEW: helpers for multi-number wedges --- */

  const sampleOne = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const drawWedgeLabel = (w, highlight) => {
    const vals = (Array.isArray(w.points) ? w.points : []).map(String);
    if (!vals.length) return;

    const count  = vals.length;                 // 1, 2, or 3
    const weight = highlight ? "bolder" : "bold";

    // --- base font sizes (start points; fit loop still clamps) ---
    const baseNormal    = { 1: 76,  2: 70,  3: 72 };
    const baseHighlight = { 1: 96,  2: 90,  3: 94 };
    let fontSize = (highlight ? baseHighlight[count] : baseNormal[count]) ?? (highlight ? 92 : 72);

    // --- minimum size (slightly higher for stacked so they don't collapse) ---
    const minSize = count >= 2 ? (highlight ? 34 : 30) : 28;

    // --- vertical gaps (tighter for stacked; doubles a touch looser than triples) ---
    const gapNormal    = { 1: 0.00, 2: 0.32, 3: 0.28 };
    const gapHighlight = { 1: 0.00, 2: 0.28, 3: 0.26 };
    const gapRatio = (highlight ? gapHighlight[count] : gapNormal[count]) ?? (highlight ? 0.28 : 0.30);

    const padX = 10;

    // --- radial band geometry (controls vertical position & available height) ---
    let rOuter, rInner, textRadius;

    // Singles: center around ~0.60 * rad (inward from rim)
    if (count === 1) {
      rOuter     = 0.90 * rad;          // outer bound (keeps margin from rim)
      rInner     = 0.30 * rad;          // inner bound
      textRadius = 0.60 * rad;          // <-- vertical center for single numbers
    } else {
      // Stacked (keeps your existing behavior)
      rOuter = 0.95 * rad;
      rInner = (
        count === 2 ? (highlight ? 0.30 : 0.38) :
                      (highlight ? 0.25 : 0.32)
      ) * rad;
      textRadius = (rOuter + rInner) / 2; // center of band
    }

    const maxHeight = rOuter - rInner;

    // Width budget uses the chord at the text radius.
    const chord    = 2 * textRadius * Math.sin(arc / 2);
    const maxWidth = 0.95 * chord;

    // Fit loop: shrink until both width and height constraints are satisfied.
    let widths = [];
    let totalHeight = 0;
    while (fontSize >= minSize) {
      ctx.font = `${weight} ${fontSize}px sans-serif`;
      widths = vals.map(t => ctx.measureText(t).width);

      const gap = fontSize * gapRatio;
      totalHeight = vals.length * fontSize + (vals.length - 1) * gap;

      const fitsW = (Math.max(...widths) + 2 * padX) <= maxWidth;
      const fitsH = totalHeight <= maxHeight;
      if (fitsW && fitsH) break;

      fontSize -= 2;
    }

    // --- draw ---
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";                      // easier vertical centering
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "black";
    ctx.lineWidth = Math.max(2, 3 * (fontSize / 64));

    const gap  = fontSize * gapRatio;
    const step = fontSize + gap;

    // centers the whole block around -textRadius (negative y = outward)
    const firstY = -textRadius - 0.5 * (vals.length - 1) * step;

    // divider lines between rows
    if (vals.length > 1) {
      for (let i = 0; i < vals.length - 1; i++) {
        const y1 = firstY + i * step;
        const y2 = firstY + (i + 1) * step;
        const yMid = (y1 + y2) / 2;

        const adjHalf = Math.min(maxWidth / 2, Math.max(widths[i], widths[i + 1]) / 2 + padX);

        ctx.save();
        ctx.lineCap = "round";
        // dark under-stroke
        ctx.strokeStyle = "rgba(0,0,0,0.7)";
        ctx.lineWidth = Math.max(4, 4 * (fontSize / 64));
        ctx.beginPath(); ctx.moveTo(-adjHalf, yMid); ctx.lineTo(adjHalf, yMid); ctx.stroke();
        // light top-stroke
        ctx.strokeStyle = "rgba(255,255,255,0.95)";
        ctx.lineWidth = Math.max(2, 2 * (fontSize / 64));
        ctx.beginPath(); ctx.moveTo(-adjHalf, yMid); ctx.lineTo(adjHalf, yMid); ctx.stroke();
        ctx.restore();
      }
    }

    // numbers
    for (let i = 0; i < vals.length; i++) {
      const y = firstY + i * step;
      ctx.font = `${weight} ${fontSize}px sans-serif`;
      ctx.strokeText(vals[i], 0, y);
      ctx.fillText(vals[i], 0, y);
    }
  };

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
  let direction;
  let animId = null;          // current requestAnimationFrame handle

  let loseSpeed = 37

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


      if (Math.abs(speed) >= angVelMax) isAccelerating = false;

      let liveSector = sectors[getIndex(oldAngle)];
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
          oldAngle += speed * deltaTime * 60;
          lastAngles.shift();
          lastAngles.push(oldAngle);
          render(oldAngle);       
        } else {
          // stop spinner
          speed = 0;
          if (animId !== null) {
            cancelAnimationFrame(animId);
            animId = null;
          };
          currentAngle = oldAngle;
          let sectorIdx_real = getIndex();
          let sector = sectors[sectorIdx_real];
          let points;
          if (sector.points.length > 1) {
            points = sampleOne(sector.points);
          } else {
            points = sector.points[0]
          }
          spinnerData.outcome_points = points;
          spinnerData.outcome_wedge = sector.label;
          spinnerData.outcome_color = sector.color;
          drawSector(sectors, sectorIdx_real);
        };
      };
    };
    animId = requestAnimationFrame(step);
  };

  /* generate random float in range min-max */
  const rand = (m, M) => Math.random() * (M - m) + m;

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
  const drawSector = (sectors, sector) => {
    for (let i = 0; i < sectors.length; i++) {
      const ang = arc * i;
      ctx.save();

      // fill
      ctx.beginPath();
      ctx.fillStyle = sectors[i].color;
      ctx.moveTo(rad, rad);
      ctx.arc(rad, rad, rad, ang, ang + arc);
      ctx.lineTo(rad, rad);
      ctx.fill();

      // text
      ctx.translate(rad, rad);
      const rotation = (arc/2) * (1 + 2*i) + Math.PI/2;
      ctx.rotate(rotation);

      const highlight = (isSpinning && i == sector);
      drawWedgeLabel(sectors[i], highlight);
      ctx.restore();
    }
  };

  drawSector(sectors, null);

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