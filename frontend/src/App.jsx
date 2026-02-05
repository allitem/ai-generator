import { useState } from "react";
import axios from "axios";

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

  const addComponent = (type) => setComponents([...components, type]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>AI API & UI Generator Interactive</h1>
      <textarea
        rows={4}
        cols={50}
        placeholder="พิมพ์ความต้องการระบบของคุณ..."
        value={request}
        onChange={(e) => setRequest(e.target.value)}
      />
      <br />
      <button onClick={handleGenerate}>Generate API & UI</button>
      <button onClick={handleSendToSC} style={{ marginLeft: "10px" }}>ส่งไป SC</button>

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h2>API Schema</h2>
          <pre>{JSON.stringify(result.apiSchema, null, 2)}</pre>
          <h2>Validation</h2>
          <pre>{JSON.stringify(result.validation, null, 2)}</pre>

          <h2>UI Preview (Interactive)</h2>
          <div style={{ border: "1px solid #ccc", padding: "10px", minHeight: "100px" }}>
            {components.map((c, i) => (
              <div key={i} style={{ border: "1px solid #888", margin: "5px", padding: "5px" }}>
                {c}
              </div>
            ))}
          </div>
          <button onClick={() => addComponent("Header")}>Add Header</button>
          <button onClick={() => addComponent("ProductList")}>Add ProductList</button>
          <button onClick={() => addComponent("Cart")}>Add Cart</button>
        </div>
      )}
    </div>
  );
}

export default App;
