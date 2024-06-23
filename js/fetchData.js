let patients = [];
const base64Credentials = btoa("coalition:skills-test");

fetch("https://fedskillstest.coalitiontechnologies.workers.dev", {
  method: "GET",
  headers: {
    Authorization: `Basic ${base64Credentials}`,
    "Content-Type": "application/json",
  },
}).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }).then((data) => {
    patients.push(...data);
    console.log(patients);
    show(patients);
    openDiagnosis()
    
    
  })
  .catch((error) => console.error("Error:", error));


  

