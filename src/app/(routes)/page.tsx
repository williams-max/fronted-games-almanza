"use client";

import { MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@nextui-org/react";
import ReactFlow, {
  Background,
  Connection,
  Controls,
  Edge,
  MiniMap,
  Node,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";

import "reactflow/dist/style.css";

import { TextUpdaterNode, NodeCentral , NodeSuperior , NodeInferior } from "./components/customNode";
import { ContextMenu } from "./components/contextMenu";
import { v4 as uuidv4 } from 'uuid';

import { useInputNodeStore } from "@/store/nodes-store";
import axios from 'axios'

let id = 0;
//const getId = (type: string) => `${type}_node_${id++}`;

const getId = () => {
  let getIdx = uuidv4();
  return getIdx;
}

export default function DiagramaRender() {

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nombre, setNombre] = useState('')
  const { formState, handleSubmit, control, register, getValues, setValue, unregister, reset } = useForm();

  const urlBase = 'https://backend-games-almanza.onrender.com'//'http://localhost:3003'
  // store handling for input nodes
  const { text } = useInputNodeStore();

  // context menu
  const [menu, setMenu] = useState<any>(null);
  const ref = useRef<any>(null);

  // function to add new node
  const addNewNode = useCallback(
    ({ type, label }: { type: string; label?: string }) => {
      setNodes((nds) => [
        ...nds,
        {
          id: getId(), // getId(type),
          backgroundColor: '#0064A5',
          textColor: '#ffffff',
          data: { content: '', methods: { register, control, getValues, setValue: setValue } ,height:'200px' },
          position: { x: 0, y: 0 },
          type: type,
        },
      ]);
    },
    [setNodes]
  );

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const response = await axios.get(`${urlBase}/componente/7171272e-b31b-4c34-9220-9f535c958c5c`)
      if (response.data.datos.nodes) {
        if (response.data.datos.nombre) {
          setNombre(response.data.datos.nombre)
        }
        const tempNodes = response.data.datos.nodes.map((objeto: any) => {
          if (objeto.hasOwnProperty('data')) {
            return {
              ...objeto,
              data: {
                ...objeto.data,
                methods: {
                  register,
                  control,
                  getValues,
                  setValue
                }
              }
            };
          }
          return objeto;
        });
        setNodes(tempNodes)
        setEdges(response.data.datos.edges)
        setValue('nodes', tempNodes)
        setValue('edges', response.data.datos.edges)
        // console.log('nodes-->' , getValues())
      }
    } catch (error) {

    }
  }

  const updateComonente = async () => {
    try {
      console.log(getValues())
      // crear un un nodes actulazaldo este decir la posicon del node
      // 1 iterear array nodes (que contine la posicion actulal de node)
      // 1 iterear array nodes 
      // tomar en encuenta en en nodesReferenicia tiene la mayor informacion por cada item en data')
      // seria actulizar array nodes con algunos atributos de arrayReferencia ,(item) como data que el mas importante y este exite 
      // en arrayReferencia , para este caso ambos array tiene el mismo id por item , pero dar prioridad 
      /// a array nodes

      // Supongamos que tienes los arrays nodes y nodesReferencia
      const nodesReferencia = getValues('nodes')
      // Utiliza map() para crear un nuevo array con los nodos actualizados
      const nodesActualizados = nodes.map(node => {
        // Busca el elemento correspondiente en nodesReferencia usando el mismo ID
        const nodeReferencia = nodesReferencia.find((item: any) => item.id === node.id);

        // Si se encontró un elemento correspondiente en nodesReferencia
        // y tiene información adicional, actualiza el nodo de nodes
        if (nodeReferencia && nodeReferencia.data) {
          // Retorna un nuevo objeto con los atributos actualizados
          return {
            ...node, // Mantiene los atributos originales de node
            data: nodeReferencia.data // Actualiza el atributo 'data' con la información de nodeReferencia
            // Puedes añadir más atributos aquí según tus necesidades
          };
        } else {
          // Si no se encontró una referencia o no tiene información adicional, devuelve el nodo original
          return node;
        }
      });

      const response = await axios.put(`${urlBase}/componente/7171272e-b31b-4c34-9220-9f535c958c5c`, {
        nodes: nodesActualizados, // getValues('nodes'),
        edges: edges
      })
      console.log('repuesta update ', response)
    } catch (error) {
      console.log('imprimiendo error ', error)
    }
  }

  // function that's called each time when you make connections
  const onConnect = useCallback(
    (params: Edge | Connection) => {
      setEdges(
        (eds) =>
          addEdge(
            {
              ...params,
              animated: true,
            },
            eds
          ) as Edge[]
      );

      const { source, target } = params;
      const sourceNode = nodes.find((node) => node.id === source);
      const targetNode = nodes.find((node) => node.id === target);

      if (sourceNode && targetNode && sourceNode.type === "textUpdater") {
        setNodes((nds) =>
          nds.map((node) =>
            node.id === target
              ? { ...node, data: { ...node.data, label: text } }
              : node
          )
        );
      }
    },
    [text, nodes, setEdges, setNodes]
  );

  // validation
  const isValidConnection = (connection: Connection) => {
    const { source, target } = connection;

    const sourceNode = nodes.find((node) => node.id === source);
    const targetNode = nodes.find((node) => node.id === target);

    if (
      sourceNode &&
      targetNode &&
      sourceNode.id !== targetNode.id &&
      sourceNode.type !== targetNode.type &&
      sourceNode.type === "textUpdater" &&
      targetNode.type === "default"
    ) {
      return true;
    }

    return true;
  };

  // in order to add new nodes, we need to add them to the nodeTypes object
  const nodeTypes = useMemo(() => ({ textUpdater: TextUpdaterNode, nodeCentral: NodeCentral , nodeSuperior: NodeSuperior , nodeInferior:NodeInferior }), []);

  // open node context menu
  const onNodeContextMenu = useCallback(
    (event: any, node: Node<any, string | undefined>) => {
      event.preventDefault();

      // calculate position of the context menu
      const pane = ref.current.getBoundingClientRect();
      setMenu({
        id: node.id,
        top: event.clientY < pane.height - 200 && event.clientY - 100,
        left: event.clientX < pane.width - 200 && event.clientX - 200,
        right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
        bottom:
          event.clientY >= pane.height - 200 && pane.height - event.clientY,
        type: "node",
      });
    },
    [setMenu]
  );

  const onEdgeContextMenu = useCallback(
    (event: MouseEvent<Element, globalThis.MouseEvent>, edge: Edge<any>) => {
      event.preventDefault();

      // calculate position of the context menu
      const pane = ref.current.getBoundingClientRect();
      setMenu({
        id: edge.id,
        top: event.clientY < pane.height - 200 && event.clientY - 100,
        left: event.clientX < pane.width - 200 && event.clientX - 200,
        right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
        bottom:
          event.clientY >= pane.height - 200 && pane.height - event.clientY,
        type: "edge",
      });
    },
    [setMenu]
  );

  const onContextMenu = useCallback(
    (event: MouseEvent<Element, globalThis.MouseEvent>) => {
      event.preventDefault();

      // calculate position of the context menu
      const pane = ref.current.getBoundingClientRect();
      setMenu({
        id: `canvas-${event.clientX}-${event.clientY}`,
        top: event.clientY < pane.height - 200 && event.clientY,
        left: event.clientX < pane.width - 200 && event.clientX,
        right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
        bottom:
          event.clientY >= pane.height - 200 && pane.height - event.clientY,
        type: "canvas",
      });
    },
    [setMenu]
  );

  // for closing the context menu
  const onPaneClick = useCallback(() => setMenu(null), [setMenu]);


  function descargarJSON(data: any) {
    const jsonString = JSON.stringify(data);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col items-start justify-center" style={{ backgroundColor: '#203E52' }}>
      <div className="w-full realtive h-[100vh]">
        <div className="absolute z-10 flex top-5 left-5 items-center gap-x-3 my-3">
          <Button onClick={() => addNewNode({ type: "textUpdater" })}>
            Add new input node
          </Button>
          <Button
            onClick={() =>
              addNewNode({
                type: "nodeSuperior"
              })
            }
          >
            Add node(Sección superior)
          </Button>
          <Button
            onClick={() =>
              addNewNode({
                type: "nodeCentral"
              })
            }
          >
            Add node(Sección central)
          </Button>
          <Button
            onClick={() =>
              addNewNode({
                type: "nodeInferior"
              })
            }
          >
            Add node(Sección inferior)
          </Button>
          <Button onClick={async () => updateComonente()}>Save</Button>
          <div style={ { color:'white'}}>
           Nombre: { nombre}
          </div>
        </div>
        <ReactFlow
          ref={ref}
          className="validationflow"
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          isValidConnection={isValidConnection}
          onPaneClick={onPaneClick}
          onNodeContextMenu={onNodeContextMenu}
          onEdgeContextMenu={onEdgeContextMenu}
          onPaneContextMenu={onContextMenu}
          minZoom = {0.05}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
          {menu && (
            <ContextMenu
              setMenu={setMenu}
              addNewNode={addNewNode}
              onClick={onPaneClick}
              {...menu}
            />
          )}
        </ReactFlow>
      </div>
    </div>
  );
}
