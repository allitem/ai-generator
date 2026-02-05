import { useState } from "react";

function App() {
  const [request, setRequest] = useState("");
  const [result, setResult] = useState(null);

  const handleGenerate = async () => {
    const res = await fetch("http://localhost:3000/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ request })
    });
    const data = await res.json();
    setResult(data);
  };

  const handleSendToSC = async () => {
    if (!result) return;
    const res = await fetch("http://localhost:3000/sendToSC", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiSchema: result.apiSchema })
    });
    const data = await res.json();
    alert("ส่งไป SC: " + JSON.stringify(data));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>AI API & UI Generator</h1>
      <textarea
        rows={5}
        cols={50}
        placeholder="พิมพ์ความต้องการระบบของคุณ..."
        value={request}
        onChange={(e) => setRequest(e.target.value)}
      />
      <br/>
      <button onClick={handleGenerate}>Generate API & UI</button>
      <button onClick={handleSendToSC} style={{ marginLeft: "10px" }}>ส่งไป SC</button>

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h2>API Schema</h2>
          <pre>{JSON.stringify(result.apiSchema, null, 2)}</pre>
          <h2>Validation</h2>
          <pre>{JSON.stringify(result.validation, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
