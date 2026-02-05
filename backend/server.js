const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs-extra");
const path = require("path");
const AdmZip = require("adm-zip");

const generateAPISchema = require("./generateAI");
const Prosc = require("./prosc");
const AutoGenerator = require("./autoGenerator");

const app = express();
app.use(bodyParser.json());

let apiLogs = [];

// Generate API + UI
app.post("/generate", async (req, res) => {
  const userRequest = req.body.request;
  const apiSchema = await generateAPISchema(userRequest);
  const validation = await Prosc.validateAPI(apiSchema);
  res.json({ apiSchema, validation });
});

// Send schema to SC
app.post("/sendToSC", async (req, res) => {
  const apiSchema = req.body.apiSchema;
  const result = await Prosc.sendToSC(apiSchema);
  res.json(result);
});

// Export React Project
app.post("/export", async (req, res) => {
  const { components } = req.body;
  const tempDir = path.join(__dirname, "temp_project");

  await fs.remove(tempDir);
  await fs.mkdirp(path.join(tempDir, "src"));

  const componentMap = {
    Header: "<header><h1>Header</h1></header>",
    ProductList: "<div>Product List Placeholder</div>",
    Cart: "<div>Cart Placeholder</div>"
  };
  const body = components.map(c => componentMap[c] || "").join("\n");
  const appCode = `import React from 'react';\nexport default function App(){ return (<div>${body}</div>); }`;

  await fs.writeFile(path.join(tempDir, "src", "App.jsx"), appCode);
  await fs.writeFile(path.join(tempDir, "package.json"), JSON.stringify({
    name: "react-exported-project",
    version: "1.0.0",
    main: "src/App.jsx",
    dependencies: { react: "^18.0.0", "react-dom": "^18.0.0" }
  }, null, 2));

  const zip = new AdmZip();
  zip.addLocalFolder(tempDir);
  const data = zip.toBuffer();

  res.set("Content-Type", "application/zip");
  res.set("Content-Disposition", "attachment; filename=react_project.zip");
  res.send(data);

  await fs.remove(tempDir);
});

// Auto Generate API 1000 ตัว
app.post("/autoGenerate", async (req, res) => {
  const total = req.body.total || 1000;
  const autoGen = new AutoGenerator(total);
  const result = await autoGen.run();
  apiLogs.push(...result);
  res.json({ status: "success", totalGenerated: result.length });
});

// Dashboard
app.get("/dashboard", (req, res) => {
  res.json({ totalAPIs: apiLogs.length, logs: apiLogs });
});

app.listen(3000, () => console.log("Full Auto Backend running at http://localhost:3000"));
