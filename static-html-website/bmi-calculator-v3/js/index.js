const formEl = document.getElementById("health-form");
const ageEl = document.getElementById("age-el");
const genderEl = document.getElementById("gender-el");
const heightEl = document.getElementById("height-el");
const weightEl = document.getElementById("weight-el");
const exerciseEl = document.getElementById("exercise-el");
const btn = document.getElementById("calculate-btn");
const startOverBtn = document.getElementById("start-over-btn");
const facts1El = document.getElementById("facts-1");
const facts2El = document.getElementById("facts-2");
const facts3El = document.getElementById("facts-3");
const diet1El = document.getElementById("diet-1");
const diet2El = document.getElementById("diet-2");
const resultDivsEl = document.querySelectorAll(".row-results");

//hide results divs to start
function hideDivs(){
    resultDivsEl.forEach(function(resultDiv){
        resultDiv.style.display = "none";
    })
    startOverBtn.style.display = "none";
}
hideDivs();

//input reset
function clearInput(){
    ageEl.value = "";
    genderEl.value = "";
    heightEl.value = "";
    weightEl.value = "";
    exerciseEl.value = "";
}

//start-over function
startOverBtn.addEventListener("click", function(){
    hideDivs();
    clearInput(); 
    formEl.reset();
})

//Calculations
function calculateBMI(weight, height) {
    return weight / (height * height);
}

function calculateBMR(weight, height, ageOfUser, genderOfUser) {
    let BMR;
    if (genderOfUser === "m") {
        BMR = 10 * weight + 6.25 * (height * 100) - 5 * ageOfUser + 50;
    } else {
        BMR = 10 * weight + 6.25 * (height * 100) - 5 * ageOfUser - 150;
    };
    return BMR;
};

function calculateIdealWeight(height) {
    return 22.5 * height * height;
};

function calculateDailyCalories(basalMetabolicRate, doesUserExercise) {
    return doesUserExercise === "yes" 
        ? basalMetabolicRate * 1.6
        : basalMetabolicRate * 1.4;
};

function calculateWeightChange(weight, healthyWeight){
    return weight - healthyWeight;
};

function calculateDietWeeks(weight, healthyWeight){
    return (Math.abs(weight - healthyWeight)) / 0.5; 
}
function calculateDietCalories(weight, healthyWeight, caloriesPerDay){
    return (Math.sign(weight - healthyWeight)) === -1
        ? caloriesPerDay + 500
        : caloriesPerDay - 500
};

function showCalculations(){
    const age = parseInt(ageEl.value);
    const gender = genderEl.value;
    const heightInM = parseFloat(heightEl.value);
    const weightInKg = parseFloat(weightEl.value);
    const dailyExercise = exerciseEl.value;
    
    const BMI = calculateBMI(weightInKg, heightInM);
    const BMR = calculateBMR (weightInKg, heightInM, age, gender);
    const idealWeight = calculateIdealWeight(heightInM);
    const dailyCalories = calculateDailyCalories(BMR, dailyExercise);
    const weightChange = calculateWeightChange(weightInKg, idealWeight);
    const weeksToGoal = calculateDietWeeks(weightInKg, idealWeight);
    const dietCalories = calculateDietCalories(weightInKg, idealWeight, dailyCalories);

    let bmiResults;
    if (BMI < 18.5) {
        bmiResults = "underweight";
    } else if (BMI < 25) {
        bmiResults = "normal";
    } else if (BMI < 30) {
        bmiResults = "overweight";
    } else {
        bmiResults = "obese";
    }

    let typeOfLifestyle;
    if (dailyExercise === "yes") {
        typeOfLifestyle = "an active";
    } else {
        typeOfLifestyle = "a normal";
    };
    resultDivsEl.forEach(function(resultDiv) {
        if (resultDiv.style.display !== "none") {
            resultDiv.style.display = "none";
        } else {
            resultDiv.style.display = "block";
            startOverBtn.style.display = "block";
        }
    })  
    
    facts1El.textContent = `Your BMI is ${Math.round(BMI)} which is considered ${bmiResults}`;
    facts2El.textContent = `Your ideal weight is ${Math.round(idealWeight)} kg`;
    facts3El.textContent = `With ${typeOfLifestyle} lifestyle you burn ${Math.round(dailyCalories)} calories a day`;
    diet1El.textContent = `If you want to reach your ideal weight of ${Math.round(idealWeight)} kg:`;
    diet2El.textContent = `Eat ${Math.round(dietCalories)} calories a day for ${Math.round(weeksToGoal)} weeks`;
}

// VALIDATIONS
function validateForm () {
    let valid = true;
    if (ageEl.value == "" || genderEl.value == "" || heightEl.value == "" || weightEl.value == "" || exerciseEl.value == "") {
        alert ("Please complete all fields");
        valid = false;
    } else if (isNaN(weightEl.value) || isNaN(heightEl.value) || isNaN(ageEl.value)) {
        alert(`
          Please make sure weight, height and age are numbers:
      
          weight (kg) example: 70 
          height (m) example 1.7
          age (years) example 32
        `)
        valid = false;
    } else if (ageEl.value < 20) {
        alert(`
            This BMI calculator is designed for people over 20 years of age.
            BMI is calculated differently for young people.

            For more information please visit:
            https://en.wikipedia.org/wiki/Body_mass_index#Children_(aged_2_to_20)         
        `)
        valid = false;
    } else if (weightEl.value < 30 || weightEl.value > 300) {
        alert(`
            Please provide a number for weight in kilograms between 30 and 300.
            weight (kg) example: 70
        `);
        valid = false;
    } else if (exerciseEl.value !== "yes" && exerciseEl.value !== "no") {
        alert(`
            Please specify if you exercise daily with "yes" or "no"
            example: yes
        `);
        valid = false;
    } else if (genderEl.value !== "m" && genderEl.value !== "f") {
        alert(`
            Please specify if your gender as "m" or "f"
            example: m
        `);
        valid = false;
    } else {
        showCalculations();
    }
    return valid;
}

btn.addEventListener("click", function(){    
    validateForm();    
})
