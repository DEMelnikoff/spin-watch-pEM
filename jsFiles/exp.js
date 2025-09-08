

const exp = (function() {


    var p = {};

    const condition = Math.floor(Math.random()*2);

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
                <p>With each spin, you'll have a chance of earning tokens.</p>
                <p>Your goal is to earn as many tokens as possible!</p>
            </div>`,
        ],

        welcome_watch: [
            `<div class='parent'>
                <p><strong>Welcome to Wheel of Fortune!</strong></p>
                <p>In Wheel of Fortune, you'll observe a series of spinning prize wheels.</p>
                <p>Each time a prize wheel spins, you'll have a chance of earning tokens.</p>
                <p>Your goal is to earn as many tokens as possible!</p>
            </div>`,
        ],

        how_to_earn: [
            `<div class='parent'>
                <p>The more tokens you earn, the better your chances of winning a <strong>$100.00 bonus prize</strong>.</p>
                <p>The tokens you earn will be entered into a lottery, and if one of your tokens is drawn, you'll win $100.00. 
                To maximize your odds of winning $100.00, earn as many tokens as possible.</p>
            </div>`,

            `<div class='parent'>
                <p>In Wheel of Fortune, tokens are earned by winning "jackpots."</p>
                <p>In each round of Wheel of Fortune, jackpots are worth a different number of tokens.</p>
            </div>`,

            `<div class='parent'>
                <p>To start each round, you'll see a message indicating the value of each jackpot.</p>
                <p>For example, this message means that in Round 1, each jackpot is worth 5 tokens:</p>
                <img src="./img/round-info.png" style="width:70%; height:70%">
            </div>`,

            `<div class='parent'>
                <p>To win jackpots, you'll spin wheels like this:</p>
                <img src="./img/mediumMI.png" style="width:70%; height:70%">
            </div>`,

            `<div class='parent'>
                <p>Your probability of winning a jackpot depends on where the wheel lands.</p>
                <img src="./img/mediumMI.png" style="width:70%; height:70%">
            </div>`,

            `<div class='parent'>
                <p>If a wheel lands on 80%, you'll have an 80% chance of winning a jackpot.</p>
                <img src="./img/mediumMI-activated1.png" style="width:70%; height:70%">
            </div>`,

            `<div class='parent'>
                <p>If a wheel lands on 20%, you'll have a 20% chance of winning a jackpot.</p>
                <img src="./img/mediumMI-activated0.png" style="width:70%; height:70%">
            </div>`,

            `<div class='parent'>
                <p>If a wheel lands on 100%, you'll have a 100% chance of winning a jackpot.</p>
                <img src="./img/highMI-activated1.png" style="width:70%; height:70%">
            </div>`,

            `<div class='parent'>
                <p>If a wheel lands on 0%, you'll have a 0% chance of winning a jackpot.</p>
                <img src="./img/highMI-activated0.png" style="width:70%; height:70%">
            </div>`,

            `<div class='parent'>
                <p>If a wheel lands on 60%, you'll have a 60% chance of winning a jackpot.</p>
                <img src="./img/lowMI-activated1.png" style="width:70%; height:70%">
            </div>`,

            `<div class='parent'>
                <p>If a wheel lands on 40%, you'll have a 40% chance of winning a jackpot.</p>
                <img src="./img/lowMI-activated0.png" style="width:70%; height:70%">
            </div>`,

            `<div class='parent'>
                <p>If you win a jackpot, you'll see how many tokens you won:</p>
                <img src="./img/jackpot.png" style="width:70%; height:70%">
            </div>`,

            `<div class='parent'>
                <p>If you fail to win a jackpot, you'll see you earned 0 tokens:</p>
                <img src="./img/no-jackpot.png" style="width:70%; height:70%">
            </div>`,
        ],

        how_to_spin_play: [
            `<div class='parent'>
                <p>To spin a prize wheel, just grab it with your cursor and give it a spin!
                <br>Watch the animation below to see how it's done.</p>
                <img src="./img/spin-${play}-gif.gif" style="width:60%; height:60%">
            </div>`,

            `<div class='parent'>
                <p>You'll complete 12 rounds of Wheel of Fortune.</p>
                <p>Each round will feature a different wheel.</p>
                <p>After each round, you'll answer questions about your feelings: You'll report how <strong>immersed and engaged</strong> you felt during the last round,
                as well as how <strong>happy</strong> you currently feel.</p>
            </div>`,     

            `<div class='parent'>
                <p>You're ready to start playing Wheel of Fortune!</p>
                <p>Continue to the next screen to begin Round 1.</p>
            </div>`,      
        ],

        how_to_spin_watch: [
            `<div class='parent'>
                <p>Each prize wheel spins automatically.
                <br>Watch the animation below to see an example.</p>
                <img src="./img/spin-${play}-gif.gif" style="width:60%; height:60%">
            </div>`,

            `<div class='parent'>
                <p>You'll complete 9 rounds of Wheel of Fortune.</p>
                <p>After each round, you'll answer questions about your feelings: You'll report how <strong>immersed and engaged</strong> you felt during the last round,
                as well as how <strong>happy</strong> you currently feel.</p>
            </div>`,            

            `<div class='parent'>
                <p>You're ready to start playing Wheel of Fortune!</p>
                <p>Continue to the next screen to begin Round 1.</p>
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

    let correctAnswers = ["I'll have a 100% chance of winning a jackpot.", "I'll have an 80% chance of winning a jackpot.", "I'll have a 20% chance of winning a jackpot.", "I'll have a 0% chance of winning a jackpot."];

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
                prompt: `What happens if a wheel lands on 100%?`, 
                name: `attnChk1`, 
                options: ["I'll have a 100% chance of winning a jackpot.", "I'll have an 80% chance of winning a jackpot.", "I'll have a 20% chance of winning a jackpot.", "I'll have a 0% chance of winning a jackpot."],
            },
            {
                prompt: `What happens if a wheel lands on 80%?`, 
                name: `attnChk2`, 
                options: ["I'll have a 100% chance of winning a jackpot.", "I'll have an 80% chance of winning a jackpot.", "I'll have a 20% chance of winning a jackpot.", "I'll have a 0% chance of winning a jackpot."],
            },
            {
                prompt: `What happens if a wheel lands on 20%?`, 
                name: `attnCh3`, 
                options: ["I'll have a 100% chance of winning a jackpot.", "I'll have an 80% chance of winning a jackpot.", "I'll have a 20% chance of winning a jackpot.", "I'll have a 0% chance of winning a jackpot."],
            },
            {
                prompt: `What happens if a wheel lands on 0%?`, 
                name: `attnCh4`, 
                options: ["I'll have a 100% chance of winning a jackpot.", "I'll have an 80% chance of winning a jackpot.", "I'll have a 20% chance of winning a jackpot.", "I'll have a 0% chance of winning a jackpot."],
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

    const wedge_colors = jsPsych.randomization.repeat(["#1F77B4", "#D62728"], 1);


    const wedges = {

        sixty:   { color: wedge_colors[0], label:"60%", prob:[.6] },
        fourty:  { color: wedge_colors[1], label:"40%", prob:[.4] },

        eighty:  { color: wedge_colors[0], label:"80%", prob:[.8] },
        twenty:  { color: wedge_colors[1], label:"20%", prob:[.2] },

        hundred:   { color: wedge_colors[0], label:"100%", prob:[1] },
        zero:  { color: wedge_colors[1], label:"0%", prob:[0] },
    };

    const pairs = {



    };

    // define each wheel
    const wheels = [

            {sectors: [ wedges.sixty, wedges.fourty, wedges.sixty, wedges.fourty ],   wheel_id: 1, reward: 9, ev: 4.5, mi: 0.02904941},
            {sectors: [ wedges.eighty, wedges.twenty, wedges.eighty, wedges.twenty ], wheel_id: 2, reward: 9, ev: 4.5, mi: 0.2780719},
            {sectors: [ wedges.hundred, wedges.zero, wedges.hundred, wedges.zero ],   wheel_id: 3, reward: 9, ev: 4.5, mi: 1},

            {sectors: [ wedges.sixty, wedges.fourty, wedges.sixty, wedges.fourty ],   wheel_id: 4, reward: 7, ev: 3.5, mi: 0.02904941},
            {sectors: [ wedges.eighty, wedges.twenty, wedges.eighty, wedges.twenty ], wheel_id: 5, reward: 7, ev: 3.5, mi: 0.2780719},
            {sectors: [ wedges.hundred, wedges.zero, wedges.hundred, wedges.zero ],   wheel_id: 6, reward: 7, ev: 3.5, mi: 1},

            {sectors: [ wedges.sixty, wedges.fourty, wedges.sixty, wedges.fourty ],   wheel_id: 7, reward: 5, ev: 2.5, mi: 0.02904941},
            {sectors: [ wedges.eighty, wedges.twenty, wedges.eighty, wedges.twenty ], wheel_id: 8, reward: 5, ev: 2.5, mi: 0.2780719},
            {sectors: [ wedges.hundred, wedges.zero, wedges.hundred, wedges.zero ],   wheel_id: 9, reward: 5, ev: 2.5, mi: 1},
        ];

    let round = 1;  // track current round

    function ensureRoundHeader() {
      let el = document.getElementById("round-header");
      if (!el) {
        el = document.createElement("div");
        el.id = "round-header";
        document.body.appendChild(el);
        document.body.classList.add("has-round-header");   // ← add
      }
      return el;
    }

    function setRoundHeader(roundNumber) {
      const el = ensureRoundHeader();
      el.textContent = `Round ${roundNumber}`;
    }

    function removeRoundHeader() {
      const el = document.getElementById("round-header");
      if (el) el.remove();
      document.body.classList.remove("has-round-header");  // ← remove
    }


    const preSpin = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: function() {
            let jackpot = jsPsych.timelineVariable('reward');
            return `<div class="jackpot" style="--accent:#D62728">
                      <span class="label">Round ${round} Jackpot:</span>
                      <span class="amount"><strong>${jackpot} Tokens</strong></span>
                    </div>`;

        },
        choices: "NO_KEYS",
        trial_duration: 5000,
        response_ends_trial: false,
        data: {wheel_id: jsPsych.timelineVariable('wheel_id'), ev: jsPsych.timelineVariable('ev'), reward: jsPsych.timelineVariable('reward'), mi: jsPsych.timelineVariable('mi')},
        on_start: function() {
            setRoundHeader(round);
        },
        on_finish: function(data) {
            data.round = round;
        }
    };

    const spin = {
        type: jsPsychCanvasButtonResponse,
        stimulus: function(c, spinnerData) {
            createSpinner(c, spinnerData, jsPsych.timelineVariable('sectors'), playBool);
        },
        canvas_size: [500, 500],
        data: {wheel_id: jsPsych.timelineVariable('wheel_id'), ev: jsPsych.timelineVariable('ev'), reward: jsPsych.timelineVariable('reward'), mi: jsPsych.timelineVariable('mi')},
        on_start: function() {
            setRoundHeader(round);
        },
        on_finish: function(data) {
            data.round = round;
        },
    };

    const feedback = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: () => {
            const last = jsPsych.data.get().last(1).values()[0]; // spin trial
            const reward = jsPsych.timelineVariable('reward');
            if (last.outcome_bonus == true) {
                return `<div class="payout" style="--accent: #2ecc71;">
                          <span class="amount">+${reward}</span>
                          <span class="unit">Tokens</span>
                        </div>`;
            } else {
                return `<div class="payout-plain">
                          <span class="amount">+0</span>
                          <span class="unit">Tokens</span>
                        </div>`;
            };
        },
        choices: "NO_KEYS",
        trial_duration: 2000,
        data: {wheel_id: jsPsych.timelineVariable('wheel_id'), ev: jsPsych.timelineVariable('ev'), reward: jsPsych.timelineVariable('reward'), mi: jsPsych.timelineVariable('mi')},
        on_start: function() {
            setRoundHeader(round);
        },
        on_finish: function(data) {
            data.round = round;
        }
    };

    // trial: flow DV
    const flowMeasure = {
        type: jsPsychSurveyLikert,
        questions: function () {
            let flow_question = [
                {prompt: `During Round ${round} of Wheel of Fortune,<br>how <b>immersed</b> and <b>engaged</b> did you feel in what you were ${doingOrWatching}?`,
                name: `flow`,
                labels: ['0<br>A little', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10<br>Extremely']},
            ];
            return flow_question;
        },
        randomize_question_order: false,
        scale_width: 600,
        data: {wheel_id: jsPsych.timelineVariable('wheel_id'), ev: jsPsych.timelineVariable('ev'), reward: jsPsych.timelineVariable('reward'), mi: jsPsych.timelineVariable('mi')},
        on_finish: function(data) {
            data.round = round;
            saveSurveyData(data);
        },
        on_start: function() {
            removeRoundHeader();
        },
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
        data: {wheel_id: jsPsych.timelineVariable('wheel_id'), ev: jsPsych.timelineVariable('ev'), reward: jsPsych.timelineVariable('reward'), mi: jsPsych.timelineVariable('mi')},
        on_finish: (data) => {
            data.round = round;
            saveSurveyData(data);
            round++;
        },
    };

    const spinLoop = {
        timeline: [spin, feedback],
        repetitions: 5,
    }

    // timeline: main task
    p.task = {
        timeline: [preSpin, spinLoop, flowMeasure, happinessMeasure],
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
        experiment_id: "7pAJighOzxol",
        filename: filename,
        data_string: ()=>jsPsych.data.get().csv()
    };

    return p;

}());

const timeline = [exp.consent, exp.instLoop, exp.postIntro, exp.task, exp.demographics, exp.save_data];

jsPsych.run(timeline);
