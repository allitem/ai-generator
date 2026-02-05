import { useDrop } from "react-dnd";

export default function DropArea({ components, setComponents }) {
  const [, drop] = useDrop(() => ({
    accept: "COMPONENT",
    drop: (item) => setComponents([...components, item.type])
  }));

  return (
    <div
      ref={drop}
      style={{ minHeight: "150px", border: "2px dashed #ccc", padding: "10px" }}
    >
      {components.map((c, i) => (
        <div key={i} style={{ border: "1px solid #888", margin: "5px", padding: "5px" }}>
          {c}
        </div>
      ))}
    </div>
  );
          }
