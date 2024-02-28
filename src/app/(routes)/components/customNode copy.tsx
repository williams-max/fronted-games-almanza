import { useInputNodeStore } from "@/store/nodes-store";
import { ChangeEvent, useCallback, useState , useRef } from "react";
import { Handle, Position } from "reactflow";
import TextareaAutosize from 'react-textarea-autosize';

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
  const [text, setText] = useState<any>('');
  const [isResizing, setIsResizing] = useState(false);

  const onChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsResizing(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsResizing(false);
  }, []);

  return (
    <>
      <TextareaAutosize
        id="text"
        name="text"
        placeholder="Text..."
        value={text}
        onChange={onChange}
        className={isResizing ? "nodrag" : ""}
        style={{
          width: '100%',
          padding: '8px',
          border: 'none',
          borderRadius: '8px',
          backgroundColor: '#0064A5',
          color: '#ffffff',
          resize: 'both', // Enable resizing
          overflow: 'auto',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      <Handle type="target" position={Position.Bottom} id="input_target" />
      <Handle type="source" position={Position.Top} id="input_source" />
      <button style={{fontSize:'7px' , margin: '0px', padding: '0px', border:'none', lineHeight: '1', cursor: 'pointer' , backgroundColor: 'red'
    }}>Move</button>
    </>
  );
}