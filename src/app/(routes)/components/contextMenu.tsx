import { useCallback } from "react";

import { useReactFlow } from "reactflow";

import { Listbox, ListboxItem, cn } from "@nextui-org/react";
import { Menu, MenuItem } from "@mui/material";
import { v4 as uuidv4 } from 'uuid';

interface ContextMenuProps {
  id: string;
  top: number;
  left: number;
  right: number;
  bottom: number;
  type: "node" | "edge" | "canvas";
  setMenu: (menu: boolean) => void;
  addNewNode: ({ type, label }: { type: string; label?: string }) => void;
}

export const ContextMenu = ({
  id,
  top,
  left,
  right,
  bottom,
  type,
  setMenu,
  addNewNode,
  ...props
}: ContextMenuProps) => {
  const { getNode, setNodes, addNodes, setEdges } = useReactFlow();
  const getId = () => {
    let getIdx = uuidv4();
    return getIdx;
  }
  const duplicateNode = useCallback(() => {
    const node = getNode(id);

    if (!node) {
      return;
    }

    const position = {
      x: node.position.x + 100,
      y: node.position.y + 100,
    };
    addNodes({ ...node, id: getId(), position });
    // addNodes({ ...node, id: `${node.id}-copy`, position });

    setMenu(false);
  }, [id, getNode, addNodes, setMenu]);

  const deleteNode = useCallback(() => {
    console.log('entre a este medo')
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id));

    setMenu(false);
  }, [id, setNodes, setEdges, setMenu]);

  const deleteEdge = useCallback(() => {
    setEdges((edges) => edges.filter((edge) => edge.id !== id));

    setMenu(false);
  }, [setEdges, id, setMenu]);

  const actions = {
    node: [
      {
        label: "Copy node",
        onClick: duplicateNode,
      },
      {
        label: "Delete node",
        onClick: deleteNode,
        color: "danger",
      },
    ],
    edge: [
      {
        label: "Delete edge",
        onClick: deleteEdge,
        color: "danger",
      },
    ],
    canvas: [
      {
        label: "Add node",
        onClick: () => {
          addNewNode({ type: "default", label: "New node" });
          setMenu(false);
        },
        color: "default",
      },
    ],
  };

  return (
    <Menu
      open={Boolean(top && left)}
      onClose={() => setMenu(false)}
      anchorReference="anchorPosition"
      anchorPosition={{ top: top || 0, left: left || 0 }}
      {...props}
    >
      {actions[type].map((action, index) => (
        <MenuItem key={index} onClick={action.onClick}>
          {action.label}
        </MenuItem>
      ))}
    </Menu>
  );
};
