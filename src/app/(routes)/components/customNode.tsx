import { useInputNodeStore } from "@/store/nodes-store";
import { ChangeEvent, useCallback, useState } from "react";
import { Handle, Position } from "reactflow";

export function TextUpdaterNode() {
  const { text, updateText } = useInputNodeStore();

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    updateText(e.target.value);
  }, [updateText]);

  return (
    <>
      <div>
        <input
          id="text"
          name="text"
          placeholder="Text..."
          value={text}
          onChange={(e) => onChange(e)}
          className=" px-4 py-2 rounded-lg outline-none"
        />
        <Handle type="target" position={Position.Bottom} id="input_target" />
        <Handle type="source" position={Position.Top} id="input_source" />
      </div>
    </>
  );
}

export function TextDemoNode() {
  // const { text, updateText } = useInputNodeStore();
  const [text , setText ] = useState<any>('');
  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  }, [text]);

  return (
    <>
      <div>
        <textarea
          id="text"
          name="text"
          placeholder="Text..."
          value={text}
          onChange={(e:any) => onChange(e)}
          className="px-4 py-2 rounded-lg outline-none text-white"
          style={{ backgroundColor: '#0064A5', color: '#ffffff', resize: 'both', width: '200px', height: '100px' }}
        />
        <Handle type="target" position={Position.Bottom} id="input_target" />
        <Handle type="source" position={Position.Top} id="input_source" />
      </div>
    </>
  );
}
