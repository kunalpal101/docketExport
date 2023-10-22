require("dotenv").config();

let express = require("express");
var bodyParser = require("body-parser");
let app = express();

const cors = require("cors");
app.use(cors());

let mongoose = require("mongoose");

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

mongoose.set("strictQuery", true);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    start_prg();
  })
  .catch((error) => {
    console.log("The error is = " + error);
  });

const Schema = mongoose.Schema;

const exportSchema = new Schema({
  Supplier: { type: String },
  po: { type: String },
});

let export_db = mongoose.model("export", exportSchema);

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
  console.log(body.Supplier);
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

//fun();

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

//getPO();
