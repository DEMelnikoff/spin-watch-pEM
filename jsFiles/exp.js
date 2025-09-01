

const exp = (function() {


    var p = {};

    const condition = 1;

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
                To maximize your chances of winning a $100.00 bonus, you'll need to earn as many tokens as possible.</p>
            </div>`,

            `<div class='parent'>
                <p>Each wheel is divided into four wedges, like this:</p>
                <img src="./img/highMI.png" style="width:50%; height:50%">
            </div>`,

            `<div class='parent'>
                <p>After a wheel stops spinning, you'll see how many tokens you won.</p>
                <img src="./img/highMI.png" style="width:50%; height:50%">
            </div>`,

            `<div class='parent'>
                <p>For example, if a wheel lands on a 3...</p>
                <img src="./img/highMI-activated.png" style="width:50%; height:50%">
            </div>`,

            `<div class='parent'>
                <p>...you'll see that you received 3 tokens.</p>
                <img src="./img/outcome.png" style="width:50%; height:50%">
            </div>`,

            `<div class='parent'>
                <p>Some wedges have multiple numbers, like this:</p>
                <img src="./img/mediumMI.png" style="width:50%; height:50%">
            </div>`,

            `<div class='parent'>
                <p>If the wheel lands on a wedge with multiple numbers, one number is randomly selected.</p>
                <p>You then receive that many tokens.</p>
                <img src="./img/mediumMI.png" style="width:50%; height:50%">
            </div>`,

            `<div class='parent'>
                <p>In this example, you'd have an equal chance of receiving 5 or 7 tokens.</p>
                <img src="./img/mediumMI-activated.png" style="width:50%; height:50%">
            </div>`,

            `<div class='parent'>
                <p>In this example, you'd have an equal chance of receiving 1, 3, or 5 tokens.</p>
                <img src="./img/lowMI-activated.png" style="width:50%; height:50%">
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
                <p>You're ready to start playing Wheel of Fortune!</p>
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
                <p>You're ready to start playing Wheel of Fortune!</p>
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

    let correctAnswers = ["I'll definitely receive 5 tokens.", "I'll randomly receive 5 or 7 tokens.", "I'll randomly receive 3, 5, or 7 tokens."];

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
                prompt: `What happens if a wheel lands on a wedge with a 5?`, 
                name: `attnChk1`, 
                options: ["I'll definitely receive 5 tokens.", "I'll randomly receive 5 or 7 tokens.", "I'll randomly receive 3, 5, or 7 tokens."],
            },
            {
                prompt: `What happens if a wheel lands on a wedge with a 5 and 7?`, 
                name: `attnChk2`, 
                options: ["I'll definitely receive 5 tokens.", "I'll randomly receive 5 or 7 tokens.", "I'll randomly receive 3, 5, or 7 tokens."],
            },
            {
                prompt: `What happens if a wheel lands on a wedge with a 3, 5, and 7?`, 
                name: `attnCh3`, 
                options: ["I'll definitely receive 5 tokens.", "I'll randomly receive 5 or 7 tokens.", "I'll randomly receive 3, 5, or 7 tokens."],
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
        one_three: {color: "#06D6A0", label: "1_3", points: [1, 3]},
        five_seven: {color: "#EF476F", label: "5_7", points: [5, 7]},
        one_three_five: {color: "#EF476F", label: "1_3_5", points: [1, 3, 5]},
        one: {color: "#F4D35E", label: "1", points: [1]},
        three: {color: "#6A9FB5", label: "3", points: [3]},
        five: {color: "#EE964B", label: "5", points: [5]},
        seven: {color: "#736CED", label: "7", points: [7]},
    };

    function shuffleColorsInPlace(wedgesObj) {
        const shuffledColors = jsPsych.randomization.repeat(Object.values(wedgesObj).map(w => w.color), 1);
        Object.keys(wedgesObj).forEach((key, i) => { wedgesObj[key].color = shuffledColors[i] });
    };

    // define each wheel
    const wheels = [

            {sectors: [ wedges.one_three, wedges.five_seven, wedges.one_three, wedges.five_seven ], wheel_id: 1, ev: 4, sd: 2, mi: 2},
            {sectors: [ wedges.one_three, wedges.five_seven, wedges.one_three, wedges.five_seven ], wheel_id: 2, ev: 4, sd: 2, mi: .792},
            {sectors: [ wedges.one_three_five, wedges.one_three_five, wedges.one_three_five, wedges.seven ], wheel_id: 3, ev: 4, sd: 2, mi: .208},
            {sectors: [ wedges.one_three_five, wedges.one_three_five, wedges.one_three_five, wedges.seven ], wheel_id: 4, ev: 4, sd: 2, mi: 0},

            {sectors: [ wedges.one, wedges.three, wedges.five, wedges.seven ], wheel_id: 5, ev: 8, sd: 2, mi: 2},
            {sectors: [ wedges.one, wedges.three, wedges.five, wedges.seven ], wheel_id: 6, ev: 8, sd: 2, mi: .792},
            {sectors: [ wedges.one, wedges.three, wedges.five, wedges.seven ], wheel_id: 7, ev: 8, sd: 2, mi: .208},
            {sectors: [ wedges.one, wedges.three, wedges.five, wedges.seven ], wheel_id: 8, ev: 8, sd: 2, mi: 0},

        ];

    let round = 1;  // track current round

    const spin = {
        type: jsPsychCanvasButtonResponse,
        stimulus: function(c, spinnerData) {
            //shuffleColorsInPlace(wedges);
            createSpinner(c, spinnerData, jsPsych.timelineVariable('sectors'), playBool);
        },
        canvas_size: [500, 500],
        data: {wheel_id: jsPsych.timelineVariable('wheel_id'), ev: jsPsych.timelineVariable('ev'), sd: jsPsych.timelineVariable('sd'), mi: jsPsych.timelineVariable('mi')},
        on_finish: function(data) {
            data.round = round;
        }
    };

    const feedback = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: () => {
            const last = jsPsych.data.get().last(1).values()[0]; // spin trial
            const pts = last.outcome_points;     // <-- awarded (reliability-adjusted)
            const col = last.outcome_color;      // <-- matching color
            return `
                <div class="center">
                    <div style="color:${col}; line-height:1.2">
                        <div style="font-size:150px; font-weight:800;">+${pts}</div>
                        <div style="font-size:80px; font-weight:600;">Tokens</div>
                    </div>
                </div>
            `;
        },
        choices: "NO_KEYS",
        trial_duration: 1750,
        data: {wheel_id: jsPsych.timelineVariable('wheel_id'), ev: jsPsych.timelineVariable('ev'), sd: jsPsych.timelineVariable('sd'), mi: jsPsych.timelineVariable('mi')},
        on_finish: function(data) {
            data.round = round;
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
        data: {wheel_id: jsPsych.timelineVariable('wheel_id'), ev: jsPsych.timelineVariable('ev'), sd: jsPsych.timelineVariable('sd'), mi: jsPsych.timelineVariable('mi')},
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
        data: {wheel_id: jsPsych.timelineVariable('wheel_id'), ev: jsPsych.timelineVariable('ev'), sd: jsPsych.timelineVariable('sd'), mi: jsPsych.timelineVariable('mi')},
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

    const spinLoop = {
        timeline: [spin, feedback],
        repetitions: 10,
    }

    // timeline: main task
    p.task = {
        timeline: [spinLoop, flowMeasure, happinessMeasure],
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
        experiment_id: "9paGFcUANmDw",
        filename: filename,
        data_string: ()=>jsPsych.data.get().csv()
    };

    return p;

}());

const timeline = [exp.consent, exp.instLoop, exp.postIntro, exp.task, exp.demographics, exp.save_data];

jsPsych.run(timeline);
