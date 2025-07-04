import { useState, useCallback, useEffect, useRef } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// Import our custom nodes and toolbar
import TextInputNode from "./TextInputNode";
import TextAreaNode from "./TextAreaNode";
import DropDownNode from "./DropDownNode";
import CheckboxNode from "./CheckboxNode";
import MasterOutputNode from "./MasterOutputNode";
import NodeToolbar from "./NodeToolbar";

// Define the custom node types
const nodeTypes = {
  textInput: TextInputNode,
  textArea: TextAreaNode,
  dropdown: DropDownNode,
  checkbox: CheckboxNode,
  masterOutput: MasterOutputNode,
};

const initialNodes = [
  {
    id: "text-1",
    type: "textInput",
    data: {
      label: "Name",
      placeholder: "Enter your name",
      id: "text-1",
    },
    position: { x: 100, y: 100 },
  },
  {
    id: "text-2",
    type: "textInput",
    data: {
      label: "Email",
      placeholder: "Enter your email",
      id: "text-2",
    },
    position: { x: 100, y: 300 },
  },
  {
    id: "master-1",
    type: "masterOutput",
    data: {
      label: "Form Output",
      connectedFields: [],
    },
    position: { x: 500, y: 200 },
  },
];

const initialEdges = [];

let nodeId = 3; // Counter for new node IDs

// Inner component that uses React Flow hooks
function FlowContent() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const reactFlowWrapper = useRef(null);

  // Generate new node data based on type
  const createNodeData = (type) => {
    switch (type) {
      case "textInput":
        return {
          label: "New Text Field",
          placeholder: "Enter text...",
          id: `text-${nodeId}`,
        };
      case "textArea":
        return {
          label: "New Text Area",
          placeholder: "Enter long text...",
          rows: 3,
          id: `textarea-${nodeId}`,
        };
      case "dropdown":
        return {
          label: "New Dropdown",
          options: ["Option 1", "Option 2", "Option 3"],
          id: `dropdown-${nodeId}`,
        };
      case "checkbox":
        return {
          label: "New Checkbox Group",
          checkboxText: "I agree to the terms",
          defaultChecked: false,
          id: `checkbox-${nodeId}`,
        };
      default:
        return { id: `node-${nodeId}` };
    }
  };

  // Add new node function
  const onAddNode = useCallback((nodeType, position) => {
    const newNode = {
      id: `${nodeType}-${nodeId}`,
      type: nodeType,
      data: createNodeData(nodeType),
      position,
    };

    nodeId++;
    setNodes((nds) => [...nds, newNode]);
  }, []);

  // Handle drag and drop from toolbar
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");

      if (!type) {
        return;
      }

      // Calculate position relative to the flow
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      onAddNode(type, position);
    },
    [onAddNode]
  );

  // Update node data function
  const updateNodeData = useCallback((nodeId, newData) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...newData } }
          : node
      )
    );
  }, []);

  // Add onChange function to all field nodes
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (
          ["textInput", "textArea", "dropdown", "checkbox"].includes(node.type)
        ) {
          return {
            ...node,
            data: {
              ...node.data,
              onChange: updateNodeData,
            },
          };
        }
        return node;
      })
    );
  }, [updateNodeData]);

  // Update master output node with connected fields whenever edges change
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.type === "masterOutput") {
          // Find all edges that connect to this master output node
          const connectedEdges = edges.filter(
            (edge) => edge.target === node.id
          );

          // Get the data from connected field nodes
          const connectedFields = connectedEdges
            .map((edge) => {
              const sourceNode = nds.find((n) => n.id === edge.source);
              if (
                sourceNode &&
                ["textInput", "textArea", "dropdown", "checkbox"].includes(
                  sourceNode.type
                )
              ) {
                return {
                  id: sourceNode.id,
                  type: sourceNode.type,
                  label: sourceNode.data.label,
                  placeholder: sourceNode.data.placeholder,
                  options: sourceNode.data.options,
                  checkboxText: sourceNode.data.checkboxText,
                  defaultChecked: sourceNode.data.defaultChecked,
                  rows: sourceNode.data.rows,
                };
              }
              return null;
            })
            .filter(Boolean);

          return {
            ...node,
            data: {
              ...node.data,
              connectedFields,
            },
          };
        }
        return node;
      })
    );
  }, [edges]);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  return (
    <div style={{ height: "100vh", width: "100vw" }} ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>

      {/* Node Toolbar */}
      <NodeToolbar onAddNode={onAddNode} />
    </div>
  );
}

// Main component with ReactFlowProvider
function Flow() {
  return (
    <ReactFlowProvider>
      <FlowContent />
    </ReactFlowProvider>
  );
}

export default Flow;
