require("dotenv").config();

let express = require("express");
var bodyParser = require("body-parser");
let app = express();

const cors = require("cors");
app.use(cors());

//for export data retrival
let mongoose1 = require("mongoose");

//for data submission
let mongoose2 = require("mongoose");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function start_prg() {
  app.listen(process.env.PORT, () => {
    console.log("Listening on port ", process.env.PORT);
  });

  app.get("/", function (req, res) {
    res.sendFile(__dirname + "/FrontEnd/index.html");
  });
  //To use everything under /FrontEnd
  app.use(express.static(__dirname + "/FrontEnd"));
}

mongoose1.set("strictQuery", true);
mongoose2.set("strictQuery", true);

mongoose1
  .connect(process.env.MONGO_URI)
  .then(() => {
    start_prg();
  })
  .catch((error) => {
    console.log("The error is = " + error);
  });

const Schema = mongoose1.Schema;

const exportSchema = new Schema({
  Supplier: { type: String },
  po: { type: String },
});

// const importSchema = new Schema({
//   name: { type: String },
//   start_time: { type: String },
//   end_time: { type: String },
//   hours: { type: String },
//   rate: { type: String },
//   supp: { type: String },
//   po: { type: String },
// });

const importSchema = new Schema({
  input1: { type: String },
  input2: { type: String },
  input3: { type: String },
  input4: { type: String },
  input5: { type: String },
  input6: { type: String },
  input7: { type: String },
});

let export_db = mongoose1.model("export", exportSchema);
let import_db = mongoose1.model("import", importSchema);
//const Record = mongoose.model('Record', recordSchema);
app.get("/sup-fetch", function (req, res) {
  //  res.send(getSup());
  export_db
    .distinct("Supplier")
    .then((uniqueEntries) => {
      console.log("Unique Entries:", uniqueEntries);
      res.send(uniqueEntries);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

app.post("/po-fetch", function (req, res) {
  //  res.send(getSup());
  let body = req.body;
  //console.log(body.Supplier);
  export_db
    .find({ Supplier: body.Supplier }, { "PO Number": 1, _id: 0 })
    //.select("PO Number")
    .then((data) => {
      if (data == null || data.length === 0) {
        console.log("No data");
      } else {
        console.log("foundit");
        let temp = "PO Number";
        // console.log(JSON.stringify(data[0]).Type);
        console.log(data);
        res.send(data);
        // data.forEach((item) => {
        //   console.log("Type:", JSON.stringify().Type);
        // });
      }
    })
    .catch((err) => {
      console.error("Error: ", err);
    });
});

app.post("/submit-data", async function (req, res) {
  let body = req.body;
  console.log(body.input1);
  //console.log(body.Supplier);
  let new_export = new import_db({
    input1: body.input1,
    input2: body.input2,
    input3: body.input3,
    input4: body.input4,
    input5: body.input5,
    input6: body.input6,
    input7: body.input7,
  });
  try {
    const data = await new_export.save();
    res.json({
      status: "success",
      savedData: data,
    });
  } catch (err) {
    if (err) console.log(err);
  }
});

app.get("/get-data", async (req, res) => {
  try {
    const records = await import_db.find();
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: "Error fetching records" });
  }
});

function getSup() {
  export_db
    .distinct("Supplier")
    .then((uniqueEntries) => {
      console.log("Unique Entries:", uniqueEntries);
      return uniqueEntries;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function getPO() {
  export_db
    .find({ Supplier: "Master Hire" })
    //.select("PO Number")
    .then((data) => {
      if (data == null || data.length === 0) {
        console.log("No data");
      } else {
        let temp = "PO Number";
        // console.log(JSON.stringify(data[0]).Type);
        console.log(data);
        // data.forEach((item) => {
        //   console.log("Type:", JSON.stringify().Type);
        // });
      }
    })
    .catch((err) => {
      console.error("Error: ", err);
    });
}
