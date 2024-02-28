import { DragEvent } from "react";
import { Handle, NodeProps, Position } from "reactflow";

const onDragStart = (event: DragEvent<HTMLDivElement>, nodeType: string) => {
  event.dataTransfer.setData("application/reactflow", nodeType);
  event.dataTransfer.effectAllowed = "move";
};

export default function DraggableNode() {
  return (
    <div
      onDragStart={(e) => onDragStart(e, "drag")}
      draggable
      className="bg-blue-400 p-2 rounded-lg active:cursor-grabbing cursor-grab"
    >
      <Handle type="source" position={Position.Top} id="drag_source" />
      <Handle type="target" position={Position.Bottom} id="drag_target" />
      Some draggable node
    </div>
  );
}
