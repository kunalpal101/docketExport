//const { application } = require("express");

const back_uri = window.location.href.replace(/\/$/, "");

let selectField1 = document.getElementById("supSelect");
selectField1.addEventListener("change", function () {
  const selectedValue = selectField1.value;
  // Call your function or perform actions when the value changes
  console.log("Selected value:", selectedValue);
  // Add your function calls or actions here

  async function getPO() {
    try {
      const response = await fetch(back_uri + "/po-fetch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Supplier: selectedValue,
        }),
      });
      if (response.status === 404) {
        window.alert("Error");
      } else {
        const data = await response.json();
        let temp = "PO Number";

        const poNumbers = data.map((item) => item["PO Number"]);
        const poNumbers1 = new Set(poNumbers);
        //console.log(data[0]["PO Number"]);

        console.log(poNumbers1);
        populatePo(poNumbers1);
        //getPO(data);
        //populateSup(data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }
  getPO();
});

async function fetchSup() {
  try {
    const response = await fetch(back_uri + "/sup-fetch", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 404) {
      window.alert("Error");
    } else {
      const data = await response.json();
      console.log(data);
      populateSup(data);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}
fetchSup();

function populateSup(data) {
  // Get a reference to the <select> element
  const selectElement = document.getElementById("supSelect");

  // Loop through the data and create <option> elements
  data.forEach((value, index) => {
    const option = document.createElement("option");
    option.value = value; // Set the value attribute of the option (can be used to identify the selected option)
    option.text = value; // Set the text that will be displayed to the user
    selectElement.appendChild(option); // Append the option to the select element
  });

  //for initial setup

  data[0];
}

function populatePo(data) {
  // Get a reference to the <select> element
  const selectElement = document.getElementById("poSelect");
  while (selectElement.firstChild) {
    selectElement.removeChild(selectElement.firstChild);
  }
  // Loop through the data and create <option> elements
  data.forEach((value, index) => {
    const option = document.createElement("option");
    option.value = value; // Set the value attribute of the option (can be used to identify the selected option)
    option.text = value; // Set the text that will be displayed to the user
    selectElement.appendChild(option); // Append the option to the select element
  });
}

function handleChange() {
  // Get the select element
  let subBtn = document.getElementById("submit-button");
  //subBtn.onclick(submitVal());

  // Get the selected value

  // Run your desired function with the selected value

  let input1 = document.getElementById("input1").value;
  let input3 = document.getElementById("input3").value;
  let input2 = document.getElementById("input2").value;
  let input4 = document.getElementById("input4").value;
  let input5 = document.getElementById("input5").value;

  async function submitData() {
    try {
      const response = await fetch(back_uri + "/submit-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input1: input1,
          input2: input2,
          input3: input3,
          input4: input4,
          input5: input5,
          input6: document.getElementById("poSelect").value,
          input7: document.getElementById("supSelect").value,
        }),
      });
      if (response.status === 404) {
        window.alert("Error");
      } else {
        window.alert("Form submitted");
        location.reload();
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }
  submitData();
}

// Fetch records and create card elements
fetch("/get-data")
  .then((response) => response.json())
  .then((records) => {
    const cardContainer = document.getElementById("record-cards");
    records.forEach((record) => {
      const card = document.createElement("div");
      card.className = "col-md-3";
      card.innerHTML = `
      <div class="card mb-4 shadow-sm">
        <div class="card-body">
          <h5 class="card-title">Name: ${record.input1}</h5>
          <p class="card-text">Start Time: ${record.input2}</p>
          <p class="card-text">End Time${record.input3}</p>
          <p class="card-text">No. of hours worked: ${record.input4}</p>
          <p class="card-text">Rate per hour: ${record.input5}</p>
          <p class="card-text">PO NUmber: ${record.input6}</p>
          <p class="card-text">Supplier: ${record.input7}</p>
        </div>
      </div>
    `;
      cardContainer.appendChild(card);
    });
  })
  .catch((error) => {
    console.error(error);
  });
