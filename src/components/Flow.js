import { useState, useCallback, useEffect, useRef } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  ReactFlowProvider,
  MiniMap,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// Import custom nodes and toolbar
import TextInputNode from "./TextInputNode";
import TextAreaNode from "./TextAreaNode";
import DropDownNode from "./DropDownNode";
import CheckboxNode from "./CheckboxNode";
import MasterOutputNode from "./MasterOutputNode";
import NodeToolbar from "./NodeToolbar";
import DatePickerNode from "./DatePickerNode";
import TimePickerNode from "./TimePickerNode";

// Define the custom node types
const nodeTypes = {
  textInput: TextInputNode,
  textArea: TextAreaNode,
  dropdown: DropDownNode,
  checkbox: CheckboxNode,
  datePicker: DatePickerNode,
  timePicker: TimePickerNode,
  masterOutput: MasterOutputNode,
};

let nodeId = 2;

// Inner component that uses React Flow hooks
function FlowContent() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const reactFlowWrapper = useRef(null);

  // Update node data function
  const updateNodeData = useCallback((nodeId, newData) => {
    console.log("Updating node:", nodeId, "with data:", newData);
    setNodes((currentNodes) => {
      return currentNodes.map((node) => {
        if (node.id === nodeId) {
          const updatedNode = {
            ...node,
            data: { ...newData },
          };
          console.log("Updated node:", updatedNode);
          return updatedNode;
        }
        return node;
      });
    });
  }, []);

  // Generate new node data based on type
  const createNodeData = (type) => {
    const baseData = {
      id: `${type}-${nodeId}`,
      onChange: updateNodeData,
    };

    switch (type) {
      case "textInput":
        return {
          ...baseData,
          label: "New Text Field",
          placeholder: "Enter text...",
        };
      case "textArea":
        return {
          ...baseData,
          label: "New Text Area",
          placeholder: "Enter long text...",
          rows: 3,
        };
      case "dropdown":
        return {
          ...baseData,
          label: "New Dropdown",
          options: ["Option 1", "Option 2", "Option 3"],
        };
      case "checkbox":
        return {
          ...baseData,
          label: "New Checkbox Group",
          checkboxText: "I agree to the terms",
          defaultChecked: false,
        };
      case "datePicker":
        return {
          ...baseData,
          label: "New Date Field",
          dateFormat: "YYYY-MM-DD",
          defaultToday: false,
          required: false,
        };
      case "timePicker":
        return {
          ...baseData,
          label: "New Time Field",
          timeFormat: "24h",
          step: "1",
          defaultNow: false,
          required: false,
        };
      default:
        return baseData;
    }
  };

  // Add new node function
  const onAddNode = useCallback(
    (nodeType, position) => {
      const newNode = {
        id: `${nodeType}-${nodeId}`,
        type: nodeType,
        data: createNodeData(nodeType),
        position,
      };

      nodeId++;
      setNodes((nds) => [...nds, newNode]);
    },
    [updateNodeData]
  );

  // Initialize nodes with proper onChange functions
  useEffect(() => {
    const initialNodes = [
      {
        id: "text-1",
        type: "textInput",
        data: {
          label: "Name",
          placeholder: "Enter your name",
          id: "text-1",
          onChange: updateNodeData,
        },
        position: { x: 100, y: 100 },
      },
      {
        id: "master-1",
        type: "masterOutput",
        data: {
          label: "Form Output",
          connectedFields: [],
        },
        position: { x: 500, y: 200 },
        deletable: false,
      },
    ];

    setNodes(initialNodes);
  }, [updateNodeData]);

  // Update master output when edges change
  const updateMasterOutput = useCallback(() => {
    setNodes((currentNodes) => {
      return currentNodes.map((node) => {
        if (node.type === "masterOutput") {
          // Find all edges that connect to this master output node
          const connectedEdges = edges.filter(
            (edge) => edge.target === node.id
          );

          // Get the data from connected field nodes
          const connectedFields = connectedEdges
            .map((edge) => {
              const sourceNode = currentNodes.find((n) => n.id === edge.source);
              if (
                sourceNode &&
                [
                  "textInput",
                  "textArea",
                  "dropdown",
                  "checkbox",
                  "datePicker",
                  "timePicker",
                ].includes(sourceNode.type)
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
                  maxDate: sourceNode.data.maxDate,
                  maxTime: sourceNode.data.maxTime,
                  required: sourceNode.data.required,
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
      });
    });
  }, [edges]);

  // Update master output when edges change
  useEffect(() => {
    updateMasterOutput();
  }, [updateMasterOutput]);

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
        <MiniMap pannable zoomable />
        <Controls position="top-right" />
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
