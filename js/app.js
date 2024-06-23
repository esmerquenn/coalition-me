const patients_cards = document.querySelector(".patients_cards");
let chart;
const table = document.querySelector(".table");
const lab_div = document.querySelector(".lab_div");
const list = document.querySelector(".list");
const image = document.querySelector(".image");
const carts = document.querySelector(".carts");
const ctx = document.getElementById("myChart").getContext("2d");
const systolic_diastolic = document.querySelector(".systolic_diastolic");
let arr = ["BirthIcon.png", "FemaleIcon.png", "PhoneIcon.png", "PhoneIcon.png", "InsuranceIcon.png"];

/**
 * Show the list of patients in the card format
 * @param {Array} patients - The array of patient objects
 */
function show(patients) {
  patients?.forEach(
    ({ profile_picture, name, gender, age }, i) =>
      (patients_cards.innerHTML += `<div onclick="openDiagnosis('${i}')" class="card">
     <div class="card_div"> <img src="${profile_picture}" alt="profile" />
     <span>
       <h5>${name}</h5>
       <h6>${gender} ${age}</h6>
     </span></div>
      <i class="fa-solid fa-ellipsis"></i>
      </div>`)
  );
}

/**
 * Populate various sections with patient's diagnosis data
 * @param {Object} diagnosisHistory - The diagnosis history of a patient
 */
function diagnosisData(diagnosisHistory) {
  const { profile_picture, diagnosis_history, name, diagnostic_list, lab_results } = diagnosisHistory;
  if (!diagnosisHistory || diagnosis_history.length === 0) {
    diagnosisHistory = patients[4];
  }
  const history = diagnosis_history;
  const systolicData = history.map((item) => item.blood_pressure.systolic.value);
  const diastolicData = history.map((item) => item.blood_pressure.diastolic.value);
  const labels = history
    .slice(0, 6)
    .reverse()
    .map((item) => `${item.month.slice(0, 3)}, ${item.year} `);

  renderChart(labels, systolicData, diastolicData);

  let currentMonthHistory = history.reverse().find((item) => item.month === "March");

  getSystolicDiastolic(currentMonthHistory);
  getRate(currentMonthHistory);
  getListOfPatient(diagnosisHistory);
  getPatient(profile_picture, name);
  getDiagnosticList(diagnostic_list);
  getLabResults(lab_results);
}

/**
 * Render the chart with given labels and data
 * @param {Array} labels - The labels for the x-axis
 * @param {Array} systolicData - The data for systolic blood pressure
 * @param {Array} diastolicData - The data for diastolic blood pressure
 */
function renderChart(labels, systolicData, diastolicData) {
  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Systolic",
          data: systolicData,
          borderColor: "#C26EB4",
          backgroundColor: "#C26EB4",
          fill: false,
          tension: 0.5,
          borderWidth: 2,
          pointRadius: 6,
          pointBackgroundColor: "#E66FD2",
          pointBorderColor: "#fff",
          pointBorderWidth: 1,
        },
        {
          label: "Diastolic",
          data: diastolicData,
          borderColor: "#7E6CAB",
          backgroundColor: "#7e6cab4b",
          fill: false,
          tension: 0.5,
          borderWidth: 2,
          pointRadius: 6,
          pointBackgroundColor: "#8C6FE6",
          pointBorderColor: "#fff",
          pointBorderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            filter: function (legendItem, data) {
              return legendItem.text !== "Systolic" && legendItem.text !== "Diastolic";
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
        },
      },
    },
  });
}
/**
 * Get the appropriate level image based on the level string.
 * @param {string} levels - The levels string to check.
 * @returns {string} - The HTML string for the corresponding image.
 */
function getLevelImage(levels) {
  if (levels.includes("Lower")) {
    return '<img src="images/ArrowDown.png" alt="arrow" />';
  } else if (levels.includes("Higher")) {
    return '<img src="images/ArrowUp.png" alt="arrow" />';
  } else {
    return "";
  }
}

/**
 * Update the systolic and diastolic information in the DOM.
 * @param {Object} currentMonthHistory - The history object for the current month.
 */
function getSystolicDiastolic(currentMonthHistory) {
  let { systolic, diastolic } = currentMonthHistory.blood_pressure;

  let level_diastolic = getLevelImage(diastolic.levels);
  let level_systolic = getLevelImage(systolic.levels);

  systolic_diastolic.innerHTML = `
  <div class="systolic">
      <h5><span id="purple"></span>Systolic</h5>
      <h3>${systolic.value}</h3>
      <p>${level_systolic} ${systolic.levels}</p>
  </div>
  <div class="diastolic">
      <h5><span id="blue"></span>Diastolic</h5>
      <h3><span></span> ${diastolic.value}</h3>
      <p> ${level_diastolic} ${diastolic.levels}</p>
  </div>`;
}

/**
 * Update the rate information
 * @param {Object} allRate - The rate information object
 */
function getRate(allRate) {
  const { heart_rate, respiratory_rate, temperature } = allRate;
  //   let level_diastolic = getLevelImage(diastolic.levels);
  let respiratury_level = getLevelImage(respiratory_rate.levels);
  let temperature_level = getLevelImage(temperature.levels);
  let heart_rate_level = getLevelImage(heart_rate.levels);
  carts.innerHTML = `
<div class="diagnosis_cart lightblue">
    <img src="images/respiratory rate.png" alt="respiratory" />
    <span>
        <h2>respiratory rate</h2>
        <h1>${respiratory_rate.value} bpm</h1>
    </span>
    <p> ${respiratury_level} ${respiratory_rate.levels}</p>
</div>
<div class="diagnosis_cart lightorange">
    <img src="images/temperature.png" alt="temperature" />
    <span>
        <h2>temperature</h2>
        <h1>${temperature.value} *F</h1>
    </span>
    <p> ${temperature_level} ${temperature.levels}</p>
</div>
<div class="diagnosis_cart lightpink">
    <img src="images/HeartBPM.png" alt="heart" />
    <span>
        <h2>heart rate</h2>
        <h1>${heart_rate.value} bpm</h1>
    </span>
    <p> ${heart_rate_level} ${heart_rate.levels}</p>
</div>`;
}

/**
 * Populate the list of patient details
 * @param {Object} data - The patient data object
 */
function getListOfPatient(data) {
  list.innerHTML = "";
  Object.keys(data)
    .filter(
      (item) =>
        item === "gender" ||
        item === "date_of_birth" ||
        item === "emergency_contact" ||
        item === "insurance_type" ||
        item === "phone_number"
    )
    .forEach((item, i) => {
      list.innerHTML += `
      <div class="card">
          <div class="card_div">
              <img src="images/${arr[i]}" alt="img" />
              <span>
                  <h6>${item.replace(/_/g, " ")}</h6>
                  <h5>${data[item]}</h5>
              </span>
          </div>
      </div>`;
    });
}

/**
 * Update patient profile picture and name
 * @param {string} profile_picture - The URL of the profile picture
 * @param {string} name - The name of the patient
 */
function getPatient(profile_picture, name) {
  image.innerHTML = `<img src="${profile_picture}" alt="${name}" />
      <h3>${name}</h3>`;
}

/**
 * Open the diagnosis information for the specified patient
 * @param {number} [index=3] - The index of the patient in the patients array
 */
function openDiagnosis(index = 3) {
  let patient = patients.find((_, i) => i == index);
  diagnosisData(patient);
}

/**
 * Populate the diagnostic list in the table
 * @param {Array} diagnostic_list - The array of diagnostic items
 */
function getDiagnosticList(diagnostic_list) {
  table.innerHTML = "";
  diagnostic_list.forEach(
    (item) =>
      (table.innerHTML += `<tbody>
        <tr>
          <td> ${item.name} </td>
          <td>${item.description} </td>
          <td>${item.status}</td>
        </tr>
      </tbody>`)
  );
}

/**
 * Populate the lab results section
 * @param {Array} lab_results - The array of lab results
 */
function getLabResults(lab_results) {
  lab_div.innerHTML = "";
  lab_results.forEach(
    (item) =>
      (lab_div.innerHTML += ` <span >
    <h6>${item}</h6>
    <i class="fa-solid fa-download"></i>
  </span>`)
  );
}
