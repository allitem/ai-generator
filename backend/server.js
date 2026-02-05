const express = require("express");
const bodyParser = require("body-parser");
const generateAPISchema = require("./generateAI");
const Prosc = require("./prosc");

const app = express();
app.use(bodyParser.json());

// รับความต้องการจากผู้ใช้
app.post("/generate", async (req, res) => {
  try {
    const userRequest = req.body.request;
    const apiSchema = await generateAPISchema(userRequest);

    // Validate กับ SC
    const validation = await Prosc.validateAPI(apiSchema);

    res.json({ apiSchema, validation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ส่ง schema ไป SC
app.post("/sendToSC", async (req, res) => {
  try {
    const apiSchema = req.body.apiSchema;
    const result = await Prosc.sendToSC(apiSchema);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("AI Generator Backend running on port 3000"));
