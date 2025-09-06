
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

  // Decide black/white text for contrast on a given bg color
  function contrastTextColor(hex) {
    // expect "#rrggbb"
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!m) return "#000";
    const r = parseInt(m[1], 16), g = parseInt(m[2], 16), b = parseInt(m[3], 16);
    // relative luminance (sRGB)
    const L = (v) => {
      v /= 255;
      return v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4);
    };
    const Y = 0.2126*L(r) + 0.7152*L(g) + 0.0722*L(b);
    return Y > 0.45 ? "#000" : "#fff";
  }

  // Group values by color; supports single value or array of values per sector
  function legendGroupsFromSectors(sectors) {
    const map = new Map();
    for (const s of sectors) {
      const col = s.color;
      const vals = Array.isArray(s.points) ? s.points : [s.points];
      if (!map.has(col)) map.set(col, new Set());
      const set = map.get(col);
      vals.forEach(v => set.add(v));
    }
    // return [{color, values:[...sorted]}]
    return Array.from(map.entries()).map(([color, set]) => ({
      color,
      values: Array.from(set).sort((a,b)=>a-b)
    }));
  }

  function ensureLegendTopContainer() {
    const host = document.getElementById("jspsych-canvas-button-response-stimulus");
    if (!host) return null;
    let el = document.getElementById("wheel-legend-top");
    if (!el) {
      host.insertAdjacentHTML("afterbegin", '<div id="wheel-legend-top" class="wheel-legend"></div>');
      el = document.getElementById("wheel-legend-top");
    }
    return el;
  }

  function legendOrderIndices(tot, arc) {
    // center angle of wedge i (in radians, Canvas coords, 0 at 3 o'clock, increasing clockwise)
    const center = i => (i + 0.5) * arc;           // 0.5 puts you at wedge middle
    const start = 3 * Math.PI / 4;                  // 135° = top-left anchor
    // key increases clockwise from top-left
    const key = theta => ( (theta - start) + 2*Math.PI ) % (2*Math.PI);
    return Array.from({length: tot}, (_, i) => i)
      .sort((a, b) => key(center(a)) - key(center(b)));
  }

  // NEW: render one blotch per wedge (keeps duplicates)
  function renderLegend(sectors) {
    const container = ensureLegendTopContainer();
    if (!container) return;

    const order = legendOrderIndices(sectors.length, arc);  // use geometry-based order
    container.innerHTML = order.map((i) => {
      const s = sectors[i];
      const vals = Array.isArray(s.points) ? s.points : [s.points];
      const text = vals.join(" / ");
      const fg = contrastTextColor(s.color);
      return `
        <div class="legend-item"
             data-idx="${i}"
             data-color="${s.color}"
             style="background:${s.color}; color:${fg};">
          ${text}
        </div>
      `;
    }).join("");
  }

  // OPTIONAL: highlight by *index* (so duplicates don't all light up)
  function highlightLegendByIndex(idx) {
    const items = document.querySelectorAll("#wheel-legend-top .legend-item");
    items.forEach(it => {
      it.classList.toggle("active", Number(it.getAttribute("data-idx")) === idx);
    });
  };

  function getPointerEl() {
    return document.getElementById("spinUp");
  }

  function setPointerText(txt, opts = {}) {
    const el = document.getElementById("spinUp");
    if (!el) return;

    // Text
    el.textContent = txt == null ? "" : String(txt);

    // Optional text size override
    if (opts.fontSize) el.style.fontSize = opts.fontSize;

    // Text color: default white so it pops on a colored core
    el.style.color = opts.color || "#fff";

    // Outer container background stays white
    el.style.background = "#fff";

    // Colored inner "core" using a BIG inset shadow that fills the box
    // Keeps your white ring (4px) around it.
    const core = opts.coreColor || opts.bg || null;
    if (core) {
      el.style.boxShadow =
        `0 0 0 4px #fff,        /* white ring */ 
         0 0 0 9999px ${core} inset`;  // solid inner core fill
    } else {
      // fallback: just the white ring, no fill
      el.style.boxShadow = "0 0 0 4px #fff";
    }
  }
  /* --- NEW: helpers for multi-number wedges --- */

  const sampleOne = (arr) => arr[Math.floor(Math.random() * arr.length)];

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
          spinnerData.outcome_points.push(points);
          spinnerData.outcome_wedge.push(sector.label);
          spinnerData.outcome_color.push(sector.color);
          updateScore(parseFloat(sector.label), sector.color);
          setPointerText(`+${points}`, {
            fontSize: "3rem",
            coreColor: sector.color  // <— fills inner core with the wedge color
          });
          drawSector(sectors, sectorIdx_real);
        };
      };
    };
    animId = requestAnimationFrame(step);
  };

  /* generate random float in range min-max */
  const rand = (m, M) => Math.random() * (M - m) + m;

  const updateScore = (points, color) => {
    spin_num--;
    let s = 's';
    spin_num == 1 ? s == '' : s == 's';
    setTimeout(() => {
      setPointerText("");
      isSpinning = false;
      drawSector(sectors, null);
      onWheel ? canvas.style.cursor = "grab" : canvas.style.cursor = "";
      if (!interactive && spinnerData.outcome_points.length < 5) { setTimeout(startAutoSpin, 225) };
    }, 1500);
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
      // no text on the wedge
      ctx.restore();
    }

  };

  drawSector(sectors, null);
  renderLegend(sectors);

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