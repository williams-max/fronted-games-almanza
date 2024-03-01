import { useInputNodeStore } from "@/store/nodes-store";
import { ChangeEvent, useCallback, useState, useRef } from "react";
import { Handle, Position } from "reactflow";
import TextareaAutosize from 'react-textarea-autosize';
import { ChromePicker } from 'react-color'; // Importa ChromePicker de react-color
// import PaletteIcon from '@mui/icons-material/Palette'; // Importa el icono de paleta de colores de Material Icons
import ColorLensIcon from '@mui/icons-material/ColorLens';
import ColorizeIcon from '@mui/icons-material/Colorize';
import { Controller, useForm } from "react-hook-form";



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

export function TextDemoNode(props: any) {

  const [isResizing, setIsResizing] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('#0064A5');
  const [textColor, setTextColor] = useState('#ffffff');
  const [showColorPicker, setShowColorPicker] = useState(false); // Estado para mostrar/ocultar la paleta de colores
  const [showTextColorPicker, setShowTextColorPicker] = useState(false); // Estado para mostrar/ocultar la paleta de colores para el texto


  const handleMouseEnter = useCallback(() => {
    setIsResizing(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsResizing(false);
  }, []);

  const handleBackgroundColorChange = (color: any) => {
    setBackgroundColor(color.hex);
    setValue('backgroundColor',color.hex)
  };

  const handleTextColorChange = (color: any) => {
    setTextColor(color.hex);
    setValue('textColor',color.hex)
  };

  const { control, nameRegister, register, getValues , setValue } = props.data.methods
  const { id } = props

  return (
    <>
      <div style={{ border: '2px solid #0064A5', borderRadius: '8px', padding: '0px', margin: '0px', width: '100%', height: '100%' }}>
        <Controller
          name={id}
          render={({ field }: any) => (
            // Cambiamos el input por un textarea

            <TextareaAutosize
              placeholder="Text..."
              {...field}
              onChange={(e) => {
                field.onChange((e.target.value))
                const nodesTemp = getValues('nodes')
                // Suponiendo que tienes tu array llamado `miArray` y el id que estás buscando es "textDemo_node_0"
                // Utiliza map para recorrer el array y actualizar el objeto si el id coincide
                const nuevoArray = nodesTemp.map((objeto: any) => {
                  if (objeto.id === id) {
                    // Si coincide, actualiza la data del objeto
                    return {
                      ...objeto, // Mantén todas las propiedades originales
                      data: { // Actualiza la propiedad 'data' como desees
                        ...objeto.data,
                        content: e.target.value
                      }
                    };
                  } else {
                    return objeto;
                  }
                });
                setValue('nodes',nuevoArray)
              }}
              className={isResizing ? "nodrag" : ""}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '5px',
                backgroundColor: backgroundColor,
                color: textColor, // Aplica el color de texto seleccionado
                resize: 'both'
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
          )}
          control={control}
        />

        <Handle type="target" position={Position.Bottom} id="input_target" />
        <Handle type="source" position={Position.Top} id="input_source" />
      </div>
      <button
        style={{
          fontSize: '20px',
          margin: '0px',
          padding: '0px',
          border: 'none',
          lineHeight: '1',
          cursor: 'pointer',
          backgroundColor: 'transparent',
          color: '#0064A5',
          position: 'absolute',
          top: '-23px',
          left: '10px' // Ajuste de posición del botón de la paleta de colores
        }}
        onClick={() => setShowColorPicker(!showColorPicker)}
      >
        <ColorLensIcon sx={{ color: 'white' }} />
      </button>
      <button
        style={{
          fontSize: '20px',
          margin: '0px',
          padding: '0px',
          border: 'none',
          lineHeight: '1',
          cursor: 'pointer',
          backgroundColor: 'transparent',
          color: '#0064A5',
          position: 'absolute',
          top: '-23px',
          left: '40px' // Ajuste de posición del botón de cambio de color de texto PL
        }}
        onClick={() => setShowTextColorPicker(!showTextColorPicker)} // Mostrar la paleta de colores para el texto
      >
        <ColorizeIcon sx={{ color: 'white' }} />
      </button>
      {showColorPicker && (
        <div style={{ position: 'absolute', zIndex: 2, resize: 'block' }} className={"nodrag"}>
          <ChromePicker color={backgroundColor} onChange={handleBackgroundColorChange} />
        </div>
      )}
      {showTextColorPicker && (
        <div style={{ position: 'absolute', zIndex: 2, resize: 'block', left: '40px' }} className={"nodrag"}>
          <ChromePicker color={textColor} onChange={handleTextColorChange} />
        </div>
      )}
    </>
  );
}