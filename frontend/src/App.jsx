const handleAutoGenerate = async () => {
  const total = parseInt(prompt("จำนวน API ที่ต้องการสร้าง", "1000"));
  if (!total) return;
  const res = await axios.post("http://localhost:3000/autoGenerate", { total });
  alert(`สร้าง API เรียบร้อย: ${res.data.totalGenerated} ตัว`);
};

// เพิ่มปุ่มใน JSX
<button onClick={handleAutoGenerate} style={{ marginLeft: "10px" }}>Auto Generate API</button>
