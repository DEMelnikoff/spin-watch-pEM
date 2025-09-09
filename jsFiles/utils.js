
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

const createSpinner = function (canvas, spinnerData, sectors, interactive = true) {
  const ctx = canvas.getContext("2d");

  // --- label drawing ---
  const TEXT_RADIUS_FRAC = 0.66;
  const drawWedgeLabel = (w, highlight = false, rad, arc) => {
    const text = w.label;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeStyle = "rgba(0,0,0,0.85)";
    ctx.fillStyle = "#fff";

    const rText = rad * TEXT_RADIUS_FRAC;
    const chord = 2 * rText * Math.sin(arc / 2);
    const maxWidth = chord * 0.9;

    let fontSize = highlight ? 84 : 64;
    while (fontSize > 26) {
      ctx.font = `${highlight ? "bolder" : "bold"} ${fontSize}px sans-serif`;
      if (ctx.measureText(text).width <= maxWidth) break;
      fontSize -= 2;
    }
    ctx.strokeText(text, 0, -rText);
    ctx.fillText(text, 0, -rText);
  };

  // --- geometry ---
  let rect = canvas.getBoundingClientRect();
  let wheelWidth = rect.width;
  let wheelHeight = rect.height;
  let rad = wheelWidth / 2;
  const tot = sectors.length;
  const arc = (2 * Math.PI) / tot;

  function resize() {
    rect = canvas.getBoundingClientRect();
    wheelWidth = rect.width;
    wheelHeight = rect.height;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(wheelWidth * dpr);
    canvas.height = Math.round(wheelHeight * dpr);
    canvas.style.width = `${wheelWidth}px`;
    canvas.style.height = `${wheelHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    rad = Math.min(wheelWidth, wheelHeight) / 2;
    drawSector(sectors, null);
  }

  // --- state ---
  let currentAngle = 0;     // degrees
  let speed = 0;            // deg/frame (~60fps)
  let animId = null;
  let phase = "pause";      // "pause" -> "ramp" -> "ready" -> "stopped"
  let direction = Math.random() < 0.5 ? 1 : -1;

  const START_PAUSE_MS = 900;
  let pauseUntil = 0;

  const READY_SPEED = 40;
  const MAX_SPEED = 45;
  const GROWTH = Math.log(1.06) * 30;
  const FRICTION = 1.0;

  // observe-mode auto stop delay (after "ready")
  const AUTO_STOP_MIN_MS = 300;
  const AUTO_STOP_MAX_MS = 3000;
  let autoStopTimer = null;

  const render = (deg) => { canvas.style.transform = `rotate(${deg}deg)`; };

  const getIndex = () => {
    let normAngle = 0;
    let modAngle = currentAngle % 360;
    if (modAngle > 270) {
      normAngle = 360 - modAngle + 270;
    } else if (modAngle < -90) {
      normAngle = -modAngle - 90;
    } else {
      normAngle = 270 - modAngle;
    }
    return Math.floor(normAngle / (360 / tot));
  };

  const drawSector = (sectors, hiIdx) => {
    ctx.clearRect(0, 0, wheelWidth, wheelHeight);
    for (let i = 0; i < sectors.length; i++) {
      const ang = arc * i;
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = sectors[i].color;
      ctx.moveTo(rad, rad);
      ctx.arc(rad, rad, rad, ang, ang + arc);
      ctx.lineTo(rad, rad);
      ctx.fill();

      ctx.translate(rad, rad);
      const rotation = (arc / 2) * (1 + 2 * i) + Math.PI / 2;
      ctx.rotate(rotation);

      drawWedgeLabel(sectors[i], hiIdx === i, rad, arc);
      ctx.restore();
    }
  };

  function setReadyGlow(on) {
    const stage = canvas.closest(".wheel-stage") || canvas.parentElement;
    if (!stage) return;
    stage.classList.toggle("ready", !!on);
  }

  function randMs(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function stopNow() {
    if (phase === "stopped") return;
    phase = "stopped";
    if (animId) { cancelAnimationFrame(animId); animId = null; }
    if (autoStopTimer) { clearTimeout(autoStopTimer); autoStopTimer = null; }
    setReadyGlow(false);

    const sectorIdx = getIndex();
    const sector = sectors[sectorIdx];

    const bonus = Math.random() < sector.prob[0];
    spinnerData.outcome_bonus = bonus;
    spinnerData.outcome_wedge = sector.label;

    drawSector(sectors, sectorIdx);
  }

  function step(ts) {
    if (phase === "pause") {
      if (ts >= pauseUntil) {
        phase = "ramp";
        speed = direction * 4;  // gentle start
      } else {
        animId = requestAnimationFrame(step);
        return;
      }
    }

    if (phase === "ramp") {
      speed = Math.min(MAX_SPEED, speed * Math.exp(GROWTH / 60) || (direction * 4));
      if (Math.abs(speed) >= READY_SPEED) {
        phase = "ready";
        setReadyGlow(true);
        // hold steady fast speed
        speed = direction * Math.min(MAX_SPEED, Math.max(READY_SPEED, Math.abs(speed)));

        // In observe mode, schedule an automatic stop
        if (!interactive) {
          autoStopTimer = setTimeout(stopNow, randMs(AUTO_STOP_MIN_MS, AUTO_STOP_MAX_MS));
        }
      }
    } else if (phase === "ready") {
      speed *= FRICTION;
    } else if (phase === "stopped") {
      return;
    }

    currentAngle += speed;
    render(currentAngle);
    animId = requestAnimationFrame(step);
  }

  function onKeyDown(e) {
    if (!interactive) return;                 // ignore keys in observe mode
    if (e.code !== "Space" && e.keyCode !== 32) return;
    if (phase !== "ready") return;            // only when glowing
    e.preventDefault();
    stopNow();
  }

  // setup
  resize();
  drawSector(sectors, null);
  window.addEventListener("resize", resize);
  if (interactive) window.addEventListener("keydown", onKeyDown);

  // start paused, then run
  pauseUntil = performance.now() + START_PAUSE_MS;
  animId = requestAnimationFrame(step);

  return {
    destroy() {
      if (animId) cancelAnimationFrame(animId);
      if (autoStopTimer) clearTimeout(autoStopTimer);
      window.removeEventListener("resize", resize);
      if (interactive) window.removeEventListener("keydown", onKeyDown);
      setReadyGlow(false);
    }
  };
};
