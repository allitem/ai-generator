import { useState } from "react";
import axios from "axios";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DraggableComponent from "./DraggableComponent.jsx";
import DropArea from "./DropArea.jsx";

function App() {
  const [request, setRequest] = useState("");
  const [result, setResult] = useState(null);
  const [components, setComponents] = useState([]);

  const handleGenerate = async () => {
    const res = await axios.post("http://localhost:3000/generate", { request });
    setResult(res.data);
    setComponents(res.data.apiSchema.uiPreview.homepage.components || []);
  };

  const handleSendToSC = async () => {
    if (!result) return;
    const res = await axios.post("http://localhost:3000/sendToSC", { apiSchema: result.apiSchema });
    alert("ส่งไป SC: " + JSON.stringify(res.data));
  };

  const handleExport = async () => {
    // ส่ง components ไป backend สร้าง React project ZIP
    const res = await axios.post("http://localhost:3000/export", { components }, { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "react_project.zip");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ padding: "20px" }}>
        <h1>AI Generator Interactive + Export</h1>
        <textarea
          rows={4}
          cols={50}
          placeholder="พิมพ์ความต้องการระบบของคุณ..."
          value={request}
          onChange={(e) => setRequest(e.target.value)}
        />
        <br />
        <button onClick={handleGenerate}>Generate API & UI</button>
        <button onClick={handleSendToSC}>ส่งไป SC</button>

        {result && (
          <>
            <h2>API Schema</h2>
            <pre>{JSON.stringify(result.apiSchema, null, 2)}</pre>
            <h2>Validation</h2>
            <pre>{JSON.stringify(result.validation, null, 2)}</pre>

            <h2>Drag & Drop Components</h2>
            <div style={{ display: "flex" }}>
              <div style={{ marginRight: "20px" }}>
                <h4>Components</h4>
                <DraggableComponent type="Header" />
                <DraggableComponent type="ProductList" />
                <DraggableComponent type="Cart" />
              </div>
              <DropArea components={components} setComponents={setComponents} />
            </div>

            <button onClick={handleExport} style={{ marginTop: "10px" }}>Export React Project</button>
          </>
        )}
      </div>
    </DndProvider>
  );
}

export default App;
