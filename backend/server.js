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

const AdmZip = require("adm-zip");
const fs = require("fs-extra");
const path = require("path");

app.post("/export", async (req, res) => {
  const { components } = req.body;
  const tempDir = path.join(__dirname, "temp_project");

  await fs.remove(tempDir);
  await fs.mkdirp(path.join(tempDir, "src"));

  // สร้าง App.jsx
  const componentMap = {
    Header: "<header><h1>Header</h1></header>",
    ProductList: "<div>Product List Placeholder</div>",
    Cart: "<div>Cart Placeholder</div>"
  };
  const body = components.map(c => componentMap[c] || "").join("\n");
  const appCode = `import React from 'react';
export default function App(){ return (<div>${body}</div>); }`;

  await fs.writeFile(path.join(tempDir, "src", "App.jsx"), appCode);
  await fs.writeFile(path.join(tempDir, "package.json"), JSON.stringify({
    name: "react-exported-project",
    version: "1.0.0",
    main: "src/App.jsx",
    dependencies: { react: "^18.0.0", "react-dom": "^18.0.0" }
  }, null, 2));

  // Zip
  const zip = new AdmZip();
  zip.addLocalFolder(tempDir);
  const data = zip.toBuffer();

  res.set("Content-Type", "application/zip");
  res.set("Content-Disposition", "attachment; filename=react_project.zip");
  res.send(data);

  await fs.remove(tempDir);
});
const AutoGenerator = require("./autoGenerator");

// Endpoint สั่งสร้าง 1000 API
app.post("/autoGenerate", async (req, res) => {
  try {
    const total = req.body.total || 1000;
    const autoGen = new AutoGenerator(total);
    const result = await autoGen.run();
    res.json({ status: "success", totalGenerated: result.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
