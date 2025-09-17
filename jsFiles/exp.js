

const exp = (function() {


    var p = {};

    const condition = 0;

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
                To maximize your chances of winning $100.00, you'll need as many tokens as possible.</p>
            </div>`,

            `<div class='parent'>
                <p>Each wheel is divided into four wedges, like this:</p>
                <img src="./img/wheel.png" style="width:50%; height:50%">
            </div>`,

            `<div class='parent'>
                <p>The wedge the wheel lands on determines your chance of winning a <em>jackpot</em> on that spin.</p>
                <img src="./img/wheel.png" style="width:50%; height:50%">
            </div>`,

            `<div class='parent'>
                <p>For example, if a wheel lands on this wedge, you have a <strong>25%</strong> chance of winning a jackpot.</p>
                <img src="./img/p25.png" style="width:50%; height:50%">
            </div>`,

            `<div class='parent'>
                <p>If a wheel lands on this wedge, you have a <strong>75%</strong> chance of winning a jackpot.</p>
                <img src="./img/p75.png" style="width:50%; height:50%">
            </div>`,

            `<div class='parent'>
                <p>Jackpots are worth tokens.</p>
                <p>The number of tokens a jackpot is worth can change from one wheel to the next.</p>
                <img src="./img/p75.png" style="width:50%; height:50%">
            </div>`,

            `<div class='parent'>
                <p>Before each wheel, you'll see how many tokens each jackpot is worth. For example, this message means that for the next wheel, each jackpot is worth <strong>7 tokens</strong>.</p>
                <img src="./img/nextJackpot.png" style="width:70%; height:70%">      
            </div>`,

            `<div class='parent'>
                <p>If you win a jackpot, the wedge the wheel landed on will display the jackpot amount, and those tokens will be added to your total:</p>
                <img src="./img/bonus.png" style="width:50%; height:50%">
            </div>`,

            `<div class='parent'>
                <p>If you do not win a jackpot, the wedge the wheel landed on will indicate that you earned <strong>0 tokens</strong>:</p>
                <img src="./img/noBonus.png" style="width:50%; height:50%">
            </div>`,

            `<div class='parent'>
                <p>Different wheels have different probabilites.</p>
                <p>For instance, this wheel always give a 50% chance of winning a jackpot.</p>
                <img src="./img/p50.png" style="width:50%; height:50%">
            </div>`,

            `<div class='parent'>
                <p>This wheel gives either a 100% or 0% chance of winning a jackpot.</p>
                <img src="./img/p100.png" style="width:50%; height:50%">
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

    let correctAnswers = ['100%', '50%', '0%', `Earn as many tokens as possible.`];

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
                prompt: `If a wheel lands on a 100% wedge, what are your chances of winning a jackpot?`, 
                name: `attnChk1`, 
                options: ['100%', '50%', '0%'],
            },
            {
                prompt: `If a wheel lands on a 50% wedge, what are your chances of winning a jackpot?`, 
                name: `attnChk2`, 
                options: ['100%', '50%', '0%'],
            },
            {
                prompt: `If a wheel lands on a 0% wedge, what are your chances of winning a jackpot?`, 
                name: `attnCh3`, 
                options: ['100%', '50%', '0%'],
            },
            {
                prompt: `What is your goal?`, 
                name: `attnChk4`, 
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



    // define each wedge
    const wedges = {
        p50_1:  {color: "#BDBDBD", font: 'white', label:"50%",  prob: .5, nGreenBalls: 2},
        p50_2:  {color: "#737373", font: 'white', label:"50%",  prob: .5, nGreenBalls: 2},
        p75:  {color: "#BDBDBD", font: 'white', label:"75%",  prob: .75, nGreenBalls: 3},
        p25:  {color: "#737373", font: 'white', label:"25%",  prob: .25, nGreenBalls: 1},
        p100: {color: "#BDBDBD", font: 'white', label:"100%", prob: 1, nGreenBalls: 4},
        p0:   {color: "#737373", font: 'white', label:"0%",   prob: 0, nGreenBalls: 0},
    };

    // define each wheel
    const wheels = [
            {sectors: [ wedges.p50_1, wedges.p50_2, wedges.p50_1, wedges.p50_2 ], wheel_id: 1, reward: 5,  ev: 2.5, mi: 0, n_aligned: 6},
            {sectors: [ wedges.p75, wedges.p25, wedges.p75, wedges.p25 ],         wheel_id: 2, reward: 5,  ev: 2.5, mi: 0.1887219, n_aligned: 9},
            {sectors: [ wedges.p100, wedges.p0, wedges.p100, wedges.p0 ],         wheel_id: 3, reward: 5,  ev: 2.5, mi: 1, n_aligned: 12},
            {sectors: [ wedges.p50_1, wedges.p50_2, wedges.p50_1, wedges.p50_2 ], wheel_id: 4, reward: 10, ev: 5.0, mi: 0, n_aligned: 6},
            {sectors: [ wedges.p75, wedges.p25, wedges.p75, wedges.p25 ],         wheel_id: 5, reward: 10, ev: 5.0, mi: 0.1887219, n_aligned: 9},
            {sectors: [ wedges.p100, wedges.p0, wedges.p100, wedges.p0 ],         wheel_id: 6, reward: 10, ev: 5.0, mi: 1, n_aligned: 12},
        ];

    let scoreTracker = 0; // track current score

    let round = 1;  // track current round

    const preSpin = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: function() {
            let pct = jsPsych.timelineVariable('reward');
            let html = `<div class="pFlip">
                          <p class="pFlip__label">For the next wheel, jackpots are worth:</p>
                          <span class="pFlip__value">${pct}</span>
                        </div>`;
            return html;
        },
        choices: "NO_KEYS",
        trial_duration: 5000,
        response_ends_trial: false,
        data: {wheel_id: jsPsych.timelineVariable('wheel_id'), ev: jsPsych.timelineVariable('ev'), mi: jsPsych.timelineVariable('mi')},
        on_finish: function(data) {
            data.round = round;
        }
    };

    const spin = {
        type: jsPsychCanvasButtonResponse,
        stimulus: function(c, spinnerData) {
            createSpinner(c, spinnerData, scoreTracker, jsPsych.timelineVariable('sectors'), jsPsych.timelineVariable('reward'), jsPsych.timelineVariable('n_aligned'), playBool);
        },
        canvas_size: [500, 500],
        score: function() {
            return scoreTracker
        },
        post_trial_gap: 1000,
        data: {wheel_id: jsPsych.timelineVariable('wheel_id'), ev: jsPsych.timelineVariable('ev'), mi: jsPsych.timelineVariable('mi')},
        on_finish: function(data) {
            data.round = round;
            scoreTracker = data.score
        }
    };

    // trial: flow DV
    const flowMeasure = {
        type: jsPsychSurveyLikert,
        questions: [
            {prompt: `Throughout the last round of Wheel of Fortune,<br>how <b>immersed</b> and <b>engaged</b> did you feel in what you were ${doingOrWatching}?`,
            name: `flow`,
            labels: ['0<br>A little', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10<br>Extremely']},
        ],
        randomize_question_order: false,
        scale_width: 600,
        data: {wheel_id: jsPsych.timelineVariable('wheel_id'), ev: jsPsych.timelineVariable('ev'), mi: jsPsych.timelineVariable('mi')},
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
        data: {wheel_id: jsPsych.timelineVariable('wheel_id'), ev: jsPsych.timelineVariable('ev'), mi: jsPsych.timelineVariable('mi')},
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
        timeline: [preSpin, spin, flowMeasure, happinessMeasure],
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
        experiment_id: "pK8RrDDyi3KK",
        filename: filename,
        data_string: ()=>jsPsych.data.get().csv()
    };

    return p;

}());

const timeline = [exp.consent, exp.instLoop, exp.postIntro, exp.task, exp.demographics, exp.save_data];

jsPsych.run(timeline);
