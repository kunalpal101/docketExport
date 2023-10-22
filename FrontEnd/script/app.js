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

async function fetchData() {
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

fetchData();

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
}

function populatePo(data) {
  // Get a reference to the <select> element
  const selectElement = document.getElementById("poSelect");

  // Loop through the data and create <option> elements
  data.forEach((value, index) => {
    const option = document.createElement("option");
    option.value = value; // Set the value attribute of the option (can be used to identify the selected option)
    option.text = value; // Set the text that will be displayed to the user
    selectElement.appendChild(option); // Append the option to the select element
  });
}
