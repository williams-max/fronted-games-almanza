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

import { TextUpdaterNode, TextDemoNode } from "./components/customNode";
import { ContextMenu } from "./components/contextMenu";

import { useInputNodeStore } from "@/store/nodes-store";
import DataNodes from './DataNodes.json'
import DataEdges from './DataEdges.json'

let id = 0;
const getId = (type: string) => `${type}_node_${id++}`;

export default function Home() {
 
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { formState, handleSubmit, control, register, getValues, setValue, unregister, reset } = useForm();
   

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
          id: getId(type),
          backgroundColor: '#0064A5',
          textColor: '#ffffff',
          data: { content: '' , methods : {register, control , getValues , setValue : setValue}},
          position: { x: 0, y: 0 },
          type: type,
        },
      ]);
    },
    [setNodes]
  );

 useEffect ( () => {
    
    console.log('data nodes', DataNodes)
    console.log('data edges', DataEdges)
    if(DataNodes && DataEdges){
     const tempNodes = DataNodes.map((objeto: any) => {
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
      console.log('temp ', tempNodes)
      setNodes(tempNodes)
      setEdges(DataEdges)
    setValue('nodes',DataNodes)
    setValue('edges',DataEdges)
    }
  },[]) 


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
  const nodeTypes = useMemo(() => ({ textUpdater: TextUpdaterNode, textDemo: TextDemoNode }), []);

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
                type: "textDemo"
              })
            }
          >
            Add new node
          </Button>
          <Button onClick={() => {
            console.log('diagra actual  ', nodes)
          }}>
            Guardar 
          </Button>
          <Button onClick={() => { 
           //  setValue('nodes',nodes)
           //  setValue('edges',edges)
            //descargarJSON(getValues('nodes'))
            console.log(getValues())}}>Guardar informacion</Button>
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