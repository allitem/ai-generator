import { useDrag } from "react-dnd";
export default function DraggableComponent({ type }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "COMPONENT",
    item: { type },
    collect: (monitor) => ({ isDragging: !!monitor.isDragging() })
  }));
  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1, border: "1px solid #888", margin: "5px", padding: "5px", cursor: "move" }}>
      {type}
    </div>
  );
}
