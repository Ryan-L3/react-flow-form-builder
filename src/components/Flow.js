"use client";
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
  const [isMobile, setIsMobile] = useState(false);
  const [formTitle, setFormTitle] = useState("Untitled Form");
  const [formDescription, setFormDescription] = useState("");
  const [showSettings, setShowSettings] = useState(false);
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

  // Delete node function
  const deleteNode = useCallback((nodeId) => {
    setNodes((currentNodes) =>
      currentNodes.filter((node) => node.id !== nodeId)
    );
    setEdges((currentEdges) =>
      currentEdges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      )
    );
  }, []);

  // Reorder fields in master output
  const reorderFields = useCallback((fromIndex, toIndex) => {
    setNodes((currentNodes) => {
      return currentNodes.map((node) => {
        if (node.type === "masterOutput") {
          const connectedFields = [...(node.data.connectedFields || [])];
          const [movedField] = connectedFields.splice(fromIndex, 1);
          connectedFields.splice(toIndex, 0, movedField);
          
          return {
            ...node,
            data: {
              ...node.data,
              connectedFields,
              onReorderFields: reorderFields,
            },
          };
        }
        return node;
      });
    });
  }, []);

  // Handle mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Generate new node data based on type
  const createNodeData = useCallback((type) => {
    const baseData = {
      id: `${type}-${nodeId}`,
      onChange: updateNodeData,
      onDelete: deleteNode,
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
  }, [updateNodeData, deleteNode]);

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
    [createNodeData]
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
          onDelete: deleteNode,
        },
        position: { x: 100, y: 100 },
      },
      {
        id: "master-1",
        type: "masterOutput",
        data: {
          label: "Form Output",
          connectedFields: [],
          onReorderFields: reorderFields,
        },
        position: { x: 500, y: 200 },
        deletable: false,
      },
    ];

    setNodes(initialNodes);
  }, [updateNodeData, deleteNode, reorderFields]);

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
              onReorderFields: reorderFields,
            },
          };
        }
        return node;
      });
    });
  }, [edges, reorderFields]);

  // Update master output when edges change
  useEffect(() => {
    updateMasterOutput();
  }, [updateMasterOutput]);

  // Export form function
  const exportForm = useCallback(() => {
    const formData = {
      version: "1.0",
      title: formTitle,
      description: formDescription,
      timestamp: new Date().toISOString(),
      nodes: nodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          // Remove function references for serialization
          onChange: undefined,
          onDelete: undefined,
        }
      })),
      edges: edges,
    };

    const dataStr = JSON.stringify(formData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `form-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [nodes, edges, formTitle, formDescription]);

  // Import form function
  const importForm = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const formData = JSON.parse(e.target.result);
        
        // Validate the imported data
        if (!formData.nodes || !formData.edges || !formData.version) {
          alert('Invalid form file format');
          return;
        }

        // Restore function references to nodes
        const restoredNodes = formData.nodes.map(node => ({
          ...node,
          data: {
            ...node.data,
            onChange: node.type !== 'masterOutput' ? updateNodeData : undefined,
            onDelete: node.type !== 'masterOutput' ? deleteNode : undefined,
          }
        }));

        // Update node ID counter to avoid conflicts
        const maxId = Math.max(...restoredNodes
          .filter(node => node.id.includes('-'))
          .map(node => parseInt(node.id.split('-')[1]) || 0)
        );
        if (maxId >= nodeId) {
          nodeId = maxId + 1;
        }

        setNodes(restoredNodes);
        setEdges(formData.edges);
        
        // Restore form title and description
        setFormTitle(formData.title || "Untitled Form");
        setFormDescription(formData.description || "");
        
        alert(`Form "${formData.title}" imported successfully!`);
      } catch (error) {
        alert('Error importing form: ' + error.message);
      }
    };
    reader.readAsText(file);
    
    // Clear the input
    event.target.value = '';
  }, [updateNodeData, deleteNode]);

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
        fitViewOptions={{
          padding: 0.3,
          minZoom: 0.5,
          maxZoom: 1.5,
        }}
      >
        <Background />
        <MiniMap
          pannable
          zoomable
          style={{
            width: isMobile ? 120 : 200,
            height: isMobile ? 80 : 150,
          }}
        />
        <Controls position="top-right" />
      </ReactFlow>

      {/* Node Toolbar */}
      <NodeToolbar onAddNode={onAddNode} />
      
      {/* Navigation */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          zIndex: 1000,
        }}
      >
        <a
          href="/render"
          style={{
            display: "inline-block",
            padding: "8px 16px",
            background: "#9C27B0",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
            fontSize: "13px",
            fontWeight: "500",
            transition: "background-color 0.2s",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#7B1FA2"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#9C27B0"}
        >
          📋 Form Renderer
        </a>
      </div>

      {/* Import/Export Controls */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 1000,
          display: "flex",
          gap: "8px",
        }}
      >
        {/* Settings Button */}
        <button
          onClick={() => setShowSettings(true)}
          style={{
            background: "#FF9800",
            color: "white",
            border: "none",
            borderRadius: "6px",
            padding: "8px 12px",
            fontSize: "13px",
            cursor: "pointer",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#F57C00")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#FF9800")}
          title="Form settings"
        >
          ⚙️ Settings
        </button>

        {/* Export Button */}
        <button
          onClick={exportForm}
          style={{
            background: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "6px",
            padding: "8px 12px",
            fontSize: "13px",
            cursor: "pointer",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#45a049")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#4CAF50")}
          title="Export form to JSON file"
        >
          📤 Export
        </button>

        {/* Import Button */}
        <div style={{ position: "relative" }}>
          <input
            type="file"
            accept=".json"
            onChange={importForm}
            style={{
              position: "absolute",
              opacity: 0,
              width: "100%",
              height: "100%",
              cursor: "pointer",
            }}
          />
          <button
            style={{
              background: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "6px",
              padding: "8px 12px",
              fontSize: "13px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              transition: "background-color 0.2s",
              pointerEvents: "none",
            }}
            title="Import form from JSON file"
          >
            📥 Import
          </button>
        </div>
      </div>

      {/* Form Settings Modal */}
      {showSettings && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 2000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px"
        }}>
          <div style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "24px",
            maxWidth: "500px",
            width: "100%",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
          }}>
            <h3 style={{
              margin: "0 0 20px 0",
              fontSize: "20px",
              fontWeight: "bold",
              color: "#333"
            }}>
              Form Settings
            </h3>
            
            <div style={{ marginBottom: "16px" }}>
              <label style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                marginBottom: "6px",
                color: "#333"
              }}>
                Form Title
              </label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Enter form title"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px",
                  outline: "none",
                  transition: "border-color 0.2s"
                }}
                onFocus={(e) => e.target.style.borderColor = "#2196F3"}
                onBlur={(e) => e.target.style.borderColor = "#ddd"}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                marginBottom: "6px",
                color: "#333"
              }}>
                Form Description
              </label>
              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Enter form description (optional)"
                rows={3}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px",
                  outline: "none",
                  resize: "vertical",
                  transition: "border-color 0.2s"
                }}
                onFocus={(e) => e.target.style.borderColor = "#2196F3"}
                onBlur={(e) => e.target.style.borderColor = "#ddd"}
              />
            </div>

            <div style={{
              display: "flex",
              gap: "12px",
              justifyContent: "flex-end"
            }}>
              <button
                onClick={() => setShowSettings(false)}
                style={{
                  padding: "10px 20px",
                  background: "#f5f5f5",
                  color: "#666",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px",
                  cursor: "pointer",
                  fontWeight: "500",
                  transition: "background-color 0.2s"
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = "#e0e0e0"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#f5f5f5"}
              >
                Cancel
              </button>
              <button
                onClick={() => setShowSettings(false)}
                style={{
                  padding: "10px 20px",
                  background: "#2196F3",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "14px",
                  cursor: "pointer",
                  fontWeight: "500",
                  transition: "background-color 0.2s"
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = "#1976D2"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#2196F3"}
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
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
