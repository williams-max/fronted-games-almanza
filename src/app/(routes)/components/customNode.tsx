import { useInputNodeStore } from "@/store/nodes-store";
import { ChangeEvent, useCallback, useState, useRef } from "react";
import { Handle, Position } from "reactflow";
import TextareaAutosize from 'react-textarea-autosize';
import { ChromePicker } from 'react-color'; // Importa ChromePicker de react-color
// import PaletteIcon from '@mui/icons-material/Palette'; // Importa el icono de paleta de colores de Material Icons
import ColorLensIcon from '@mui/icons-material/ColorLens';


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
  const [text, setText] = useState('');
  const [isResizing, setIsResizing] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('#0064A5');
  const [showColorPicker, setShowColorPicker] = useState(false); // Estado para mostrar/ocultar la paleta de colores

  const onChange = useCallback((e) => {
    setText(e.target.value);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsResizing(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsResizing(false);
  }, []);

  const handleColorChange = (color: any) => {
    console.log('cambiar')
    setBackgroundColor(color.hex); // Utiliza color.hex para obtener el valor hexadecimal del color seleccionado
  };

  return (
    <>
      <div style={{ border: '2px solid #0064A5', borderRadius: '8px', padding: '0px', margin: '0px', width:'100%', height:'100%' }}>
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
            borderRadius: '5px',
            backgroundColor: backgroundColor,
            color: '#ffffff',
            resize: 'both'
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      </div>
      <Handle type="target" position={Position.Bottom} id="input_target" />
      <Handle type="source" position={Position.Top} id="input_source" />
      <button
        style={{
          fontSize: '20px',
          margin: '0px',
          padding: '0px',
          border: 'none',
          lineHeight: '1',
          cursor: 'pointer',
          backgroundColor: 'transparent',
          color: '#0064A5'
        }}
        onClick={() => setShowColorPicker(!showColorPicker)}
      >
        <ColorLensIcon />
      </button>
      {showColorPicker && (
        <div style={{ position: 'absolute', zIndex: 2, resize: 'block' }} className={"nodrag"}>
          <ChromePicker color={backgroundColor} onChange={handleColorChange} />
        </div>
      )}
    </>
  );
}