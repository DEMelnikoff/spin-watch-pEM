

const exp = (function() {


    var p = {};

    let pid = jsPsych.data.getURLVariable("PROLIFIC_PID");

    function hashPID(pid) {
      let hash = 0;
      for (let i = 0; i < pid.length; i++) {
        hash = (hash << 5) - hash + pid.charCodeAt(i);
        hash = hash & hash; // Convert to 32bit integer
      }
      return Math.abs(hash);
    };

    const condition = hashPID(pid) % 2;

    const play = ["play", "watch"][condition];

    const doingOrWatching = ["doing", "watching"][condition];

    const playBool = [true, false][condition];

    jsPsych.data.addProperties({
        condition: play,
    });


   /*
    *
    *   INSTRUCTIONS
    *
    */

    const html = {
        welcome_play: [
            `<div class='parent'>
                <p><strong>Welcome to Wheel of Fortune!</strong></p>
                <p>In Wheel of Fortune, you'll spin a series of prize wheels.</p>
                <p>With each spin, you'll earn tokens.</p>
                <p>Your goal is to earn as many tokens as possible!</p>
            </div>`,
        ],

        welcome_watch: [
            `<div class='parent'>
                <p><strong>Welcome to Wheel of Fortune!</strong></p>
                <p>In Wheel of Fortune, you'll observe a series of spinning prize wheels.</p>
                <p>Each time a prize wheel spins, you'll earn tokens.</p>
                <p>Your goal is to earn as many tokens as possible!</p>
            </div>`,
        ],

        how_to_earn: [
            `<div class='parent'>
                <p>The more tokens you earn, the better your chances of winning a <strong>$100.00 bonus prize</strong>.</p>
                <p>The tokens you earn will be entered into a lottery, and if one of your tokens is drawn, you'll win $100.00. 
                To maximize your chances of winning $100.00, you'll need as many tokens as possible.</p>
            </div>`,

            `<div class='parent'>
                <p>Each wheel is divided into wedges.</p>
                <p>Each wedge contains and inner and outer segment:</p>
                <img src="./img/wheel.png" style="width:50%; height:50%">
            </div>`,

            `<div class='parent'>
                <p>After a wheel lands on a wedge, one of the segments will activate.</p>
                <img src="./img/wheel.png" style="width:50%; height:50%">
            </div>`,

            `<div class='parent'>
                <p>50% of the time, the inner segment will activate, like this:</p>
                <img src="./img/inner.png" style="width:50%; height:50%">
            </div>`,

            `<div class='parent'>
                <p>50% of the time, the outer segment will activate, like this:</p>
                <img src="./img/outer.png" style="width:50%; height:50%">
            </div>`,

            `<div class='parent'>
                <p>The number on the activated wedge is added to your token tally.</p>
                <img src="./img/outer.png" style="width:50%; height:50%">
            </div>`,

            `<div class='parent'>
                <p>For example, after landing on this wedge, you'd have a 50% of getting 7 tokens and a 50% chance of getting 1 token.</p>
                <img src="./img/1_7.png" style="width:50%; height:50%">
            </div>`,

            `<div class='parent'>
                <p>After landing on this wedge, you'd have a 100% of getting 7 tokens.</p>
                <img src="./img/7_7.png" style="width:50%; height:50%">
            </div>`,
        ],

        how_to_spin_play: [
            `<div class='parent'>
                <p>To spin a prize wheel, just grab it with your cursor and give it a spin!
                <br>Watch the animation below to see how it's done.</p>
                <img src="./img/spin-${play}-gif.gif" style="width:60%; height:60%">
            </div>`,

            `<div class='parent'>
                <p>Throughout Wheel of Fortune, you'll answer questions about your feelings.</p>
                <p>Specifically, you'll report how <strong>immersed and engaged</strong> you feel while spinning each wheel,
                as well as how <strong>happy</strong> you currently feel.</p>
            </div>`,      

            `<div class='parent'>
                <p>You're ready to start Wheel of Fortune!</p>
                <p>Continue to the next screen to begin.</p>
            </div>`,      
        ],

        how_to_spin_watch: [
            `<div class='parent'>
                <p>Each prize wheel spins automatically.
                <br>Watch the animation below to see an example.</p>
                <img src="./img/spin-${play}-gif.gif" style="width:60%; height:60%">
            </div>`,

            `<div class='parent'>
                <p>Throughout Wheel of Fortune, you'll answer questions about your feelings.</p>
                <p>Specifically, you'll report how <strong>immersed and engaged</strong> you feel during each round of Wheel of Fortune,
                as well as how <strong>happy</strong> you currently feel.</p>
            </div>`,      

            `<div class='parent'>
                <p>You're ready to start Wheel of Fortune!</p>
                <p>Continue to the next screen to begin.</p>
            </div>`,      
        ],

        postTask: [
            `<div class='parent'>
                <p>Wheel of Fortune is now complete!</p>
                <p>To finish this study, please continue to answer a few final questions.</p>
            </div>`
        ],
    };

    p.consent = {
        type: jsPsychExternalHtml,
        url: "./html/consent.html",
        cont_btn: "advance",
    };

    const intro = {
        type: jsPsychInstructions,
        pages: [[html.welcome_play, html.welcome_watch][condition], ...html.how_to_earn],
        show_clickable_nav: true,
        post_trial_gap: 500,
        allow_keys: false,
    };

    let correctAnswers = [`50%`, `100%`, `Earn as many tokens as possible.`];

    const errorMessage = {
        type: jsPsychInstructions,
        pages: [`<div class='parent'><p>You provided the wrong answer.<br>To make sure you understand the game, please continue to re-read the instructions.</p></div>`],
        show_clickable_nav: true,
        allow_keys: false,
    };

    const attnChk = {
        type: jsPsychSurveyMultiChoice,
        preamble: `<div class='parent'>
            <p>Please answer the following questions.</p>
            </div>`,
        questions: [
            {
                prompt: `If you land on a wedge with a 1 in the inner segment and a 7 in the outer segment, what are your chances of earning 7 tokens?`, 
                name: `attnChk1`, 
                options: ['100%', '75%', '50%', '25%'],
            },
            {
                prompt: `If you land on a wedge with a 7 in both the inner and outer segment, what are your chances of earning 7 tokens?`, 
                name: `attnChk2`, 
                options: ['100%', '75%', '50%', '25%'],
            },
            {
                prompt: `What is your goal?`, 
                name: `attnChk3`, 
                options: [`Get as many standard outcomes as possible.`, `Get as many random outcomes as possible.`, `Earn as many tokens as possible.`],
            },
        ],
        scale_width: 500,
        on_finish: (data) => {
              const totalErrors = getTotalErrors(data, correctAnswers);
              data.totalErrors = totalErrors;
        },
    };

    const conditionalNode = {
      timeline: [errorMessage],
      conditional_function: () => {
        const fail = jsPsych.data.get().last(1).select('totalErrors').sum() > 0 ? true : false;
        return fail;
      },
    };

    p.instLoop = {
      timeline: [intro, attnChk, conditionalNode],
      loop_function: () => {
        const fail = jsPsych.data.get().last(2).select('totalErrors').sum() > 0 ? true : false;
        return fail;
      },
    };

    p.postIntro = {
        type: jsPsychInstructions,
        pages: [html.how_to_spin_play, html.how_to_spin_watch][condition],
        show_clickable_nav: true,
        post_trial_gap: 500,
        allow_keys: false,
    };

    
   /*
    *
    *   TASK
    *
    */




    // tiny helper for consistency + fewer typos

    let colors = ["#06D6A0", "#EF476F", "#F4D35E", "#6A9FB5", "#EE964B", "#736CED"];

    colors = jsPsych.randomization.repeat(colors, 1);

    function makeWedge({ name, color, font = 'white', inner, outer }) {
      return {
        name,
        color,
        font,
        inner: { label: String(inner.label), points: inner.points },
        outer: { label: String(outer.label), points: outer.points }
      };
    }

    // Build your wedge library with custom inner/outer values
    const wedges = {
      one_seven: makeWedge({
        name: 'one_seven',
        color: colors[0],
        inner: { label: "1",  points: 1 },   // inner pays 2
        outer: { label: "7",  points: 7 },   // outer pays 1
      }),
      three_five: makeWedge({
        name: 'three_five',
        color: colors[1],
        inner: { label: "3",  points: 3 },
        outer: { label: "5",  points: 5 },
      }),
      five_eleven: makeWedge({
        name: 'five_eleven',
        color: colors[2],
        inner: { label: "5",  points: 5 },
        outer: { label: "11", points: 11 },
      }),
      seven_nine: makeWedge({
        name: 'seven_nine',
        color: colors[3],
        inner: { label: "7", points: 7 },
        outer: { label: "9",  points: 9  },
      }),
      one: makeWedge({
        name: 'one',
        color: colors[0],
        inner: { label: "1", points: 1 },
        outer: { label: "1", points: 1  },
      }),
      three: makeWedge({
        name: 'three',
        color: colors[1],
        inner: { label: "3", points: 3 },
        outer: { label: "3", points: 3 },
      }),
      five: makeWedge({
        name: 'five',
        color: colors[2],
        inner: { label: "5", points: 5 },
        outer: { label: "5", points: 5 },
      }),
      seven: makeWedge({
        name: 'seven',
        color: colors[3],
        inner: { label: "7", points: 7 },
        outer: { label: "7", points: 7 },
      }),
      nine: makeWedge({
        name: 'nine',
        color: colors[4],
        inner: { label: "9", points: 9 },
        outer: { label: "9", points: 9 },
      }),
      eleven: makeWedge({
        name: 'eleven',
        color: colors[5],
        inner: { label: "11", points: 11 },
        outer: { label: "11", points: 11 },
      }),
    };

    // define each wheel
    const wheels = [

            {sectors: [ wedges.one_seven, wedges.three_five, wedges.one_seven, wedges.three_five ],     wheel_id: 1, reliability: 1, label: "100%", ev: 4, sd: 2, mi: 1},
            {sectors: [ wedges.five_eleven, wedges.seven_nine, wedges.five_eleven, wedges.seven_nine ], wheel_id: 2, reliability: 1, label: "100%", ev: 8, sd: 2, mi: 1},
            {sectors: [ wedges.one, wedges.three, wedges.five, wedges.seven ],   wheel_id: 3, reliability: 1, label: "100%", ev: 4, sd: 2, mi: 2},
            {sectors: [ wedges.five, wedges.seven, wedges.nine, wedges.eleven ], wheel_id: 4, reliability: 1, label: "100%", ev: 8, sd: 2, mi: 2},

        ];

    let scoreTracker = 0; // track current score

    let round = 1;  // track current round


    const preSpin = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: function() {
            let pct = jsPsych.timelineVariable('label');
            let html = `<div class='pFlip-style'>
                            <p><span style='font-size:100px'><strong>${pct}</strong></span>
                            <br><br><br>chance of standard outcome</p>
                        </div>`;
            return html;
        },
        choices: "NO_KEYS",
        trial_duration: 5000,
        response_ends_trial: false,
        data: {wheel_id: jsPsych.timelineVariable('wheel_id'), ev: jsPsych.timelineVariable('ev'), sd: jsPsych.timelineVariable('sd'), reliability: jsPsych.timelineVariable('reliability'), mi: jsPsych.timelineVariable('mi')},
        on_finish: function(data) {
            data.round = round;
        }
    };

    const spin = {
        type: jsPsychCanvasButtonResponse,
        stimulus: function(c, spinnerData) {
            createSpinner(c, spinnerData, scoreTracker, jsPsych.timelineVariable('sectors'), jsPsych.timelineVariable('reliability'), jsPsych.timelineVariable('label'), playBool);
        },
        canvas_size: [500, 500],
        score: function() {
            return scoreTracker
        },
        post_trial_gap: 1000,
        data: {wheel_id: jsPsych.timelineVariable('wheel_id'), ev: jsPsych.timelineVariable('ev'), sd: jsPsych.timelineVariable('sd'), reliability: jsPsych.timelineVariable('reliability'), mi: jsPsych.timelineVariable('mi')},
        on_finish: function(data) {
            data.round = round;
            scoreTracker = data.score
        }
    };

    // trial: flow DV
    const flowMeasure = {
        type: jsPsychSurveyLikert,
        questions: [
            {prompt: `During the last round of Wheel of Fortune,<br>how <b>immersed</b> and <b>engaged</b> did you feel in what you were ${doingOrWatching}?`,
            name: `flow`,
            labels: ['0<br>A little', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10<br>Extremely']},
        ],
        randomize_question_order: false,
        scale_width: 600,
        data: {wheel_id: jsPsych.timelineVariable('wheel_id'), ev: jsPsych.timelineVariable('ev'), sd: jsPsych.timelineVariable('sd'), reliability: jsPsych.timelineVariable('reliability'), mi: jsPsych.timelineVariable('mi')},
        on_finish: function(data) {
            data.round = round;
            let scoreArray = jsPsych.data.get().select('score').values;
            let outcomesArray = jsPsych.data.get().select('outcomes').values;
            data.score = scoreArray[scoreArray.length - 1];
            data.outcomes = outcomesArray[outcomesArray.length - 1];
            saveSurveyData(data);
        }
    };

    const happinessMeasure = {
        type: jsPsychSurveyMultiChoice,
        questions: [
            {
                prompt: `How <b>happy</b> are you right now?`, 
                name: `happiness`, 
                options: ['10 (Very Happy)', '9', '8', '7', '6', '5', '4', '3', '2', '1', '0 (Very Unhappy)'],
            },
        ],
        scale_width: 500,
        data: {wheel_id: jsPsych.timelineVariable('wheel_id'), ev: jsPsych.timelineVariable('ev'), sd: jsPsych.timelineVariable('sd'), reliability: jsPsych.timelineVariable('reliability'), mi: jsPsych.timelineVariable('mi')},
        on_finish: (data) => {
            data.round = round;
            let scoreArray = jsPsych.data.get().select('score').values;
            let outcomesArray = jsPsych.data.get().select('outcomes').values;
            data.score = scoreArray[scoreArray.length - 2];
            data.outcomes = outcomesArray[outcomesArray.length - 2];
            saveSurveyData(data);
            round++;
        },
    };

    // timeline: main task
    p.task = {
        timeline: [spin, flowMeasure, happinessMeasure],
        repetitions: 1,
        timeline_variables: wheels,
        randomize_order: true,
    };

   /*
    *
    *   Demographics
    *
    */

    p.demographics = (function() {


        const taskComplete = {
            type: jsPsychInstructions,
            pages: html.postTask,
            show_clickable_nav: true,
            post_trial_gap: 500,
        };

        const gender = {
            type: jsPsychHtmlButtonResponse,
            stimulus: '<p>What is your gender?</p>',
            choices: ['Male', 'Female', 'Other'],
            on_finish: (data) => {
                data.gender = data.response;
            }
        };

        const age = {
            type: jsPsychSurveyText,
            questions: [{prompt: "Age:", name: "age"}],
            on_finish: (data) => {
                saveSurveyData(data); 
            },
        }; 

        const ethnicity = {
            type: jsPsychHtmlButtonResponse,
            stimulus: '<p>What is your race?</p>',
            choices: ['White / Caucasian', 'Black / African American','Asian / Pacific Islander', 'Hispanic', 'Native American', 'Other'],
            on_finish: (data) => {
                data.ethnicity = data.response;
            }
        };

        const english = {
            type: jsPsychHtmlButtonResponse,
            stimulus: '<p>Is English your native language?:</p>',
            choices: ['Yes', 'No'],
            on_finish: (data) => {
                data.english = data.response;
            }
        };  

        const finalWord = {
            type: jsPsychSurveyText,
            questions: [{prompt: "Questions? Comments? Complains? Provide your feedback here!", rows: 10, columns: 100, name: "finalWord"}],
            on_finish: (data) => {
                saveSurveyData(data); 
            },
        }; 

        const demos = {
            timeline: [taskComplete, gender, age, ethnicity, english, finalWord]
        };

        return demos;

    }());


   /*
    *
    *   SAVE DATA
    *
    */

    p.save_data = {
        type: jsPsychPipe,
        action: "save",
        experiment_id: "IwQNFLyrr0Kr",
        filename: filename,
        data_string: ()=>jsPsych.data.get().csv()
    };

    return p;

}());

const timeline = [exp.consent, exp.instLoop, exp.postIntro, exp.task, exp.demographics, exp.save_data];

jsPsych.run(timeline);
