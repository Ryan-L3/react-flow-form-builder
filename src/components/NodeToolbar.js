import { useState } from "react";

function NodeToolbar({ onAddNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const nodeTypes = [
    {
      type: "textInput",
      label: "Text Input",
      icon: "📝",
      description: "Single line text field",
    },
    {
      type: "textArea",
      label: "Text Area",
      icon: "📄",
      description: "Multi-line text field",
    },
    {
      type: "dropdown",
      label: "Dropdown",
      icon: "📋",
      description: "Select from options",
    },
    {
      type: "checkbox",
      label: "Checkbox",
      icon: "☑️",
      description: "True/false selection",
    },
  ];

  const handleDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleAddNode = (nodeType) => {
    // Add node at a random position for now
    const position = {
      x: Math.random() * 300 + 50,
      y: Math.random() * 300 + 50,
    };
    onAddNode(nodeType, position);
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "20px",
        left: "20px",
        zIndex: 1000,
        background: "#fff",
        border: "2px solid #ddd",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        width: isCollapsed ? "60px" : "280px",
        transition: "width 0.3s ease",
      }}
    >
      {/* Toolbar Header */}
      <div
        style={{
          background: "#f8f9fa",
          padding: "12px",
          borderBottom: "1px solid #ddd",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: "6px 6px 0 0",
        }}
      >
        <div
          style={{
            fontWeight: "bold",
            fontSize: "14px",
            color: "#333",
            display: isCollapsed ? "none" : "block",
          }}
        >
          🛠️ Form Fields
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            background: "none",
            border: "none",
            fontSize: "16px",
            cursor: "pointer",
            padding: "4px",
          }}
        >
          {isCollapsed ? "➡️" : "⬅️"}
        </button>
      </div>

      {/* Node Types */}
      {!isCollapsed && (
        <div style={{ padding: "12px" }}>
          <div
            style={{
              fontSize: "12px",
              color: "#666",
              marginBottom: "8px",
              fontStyle: "italic",
            }}
          >
            Drag to canvas or click to add
          </div>

          {nodeTypes.map((node, index) => (
            <div
              key={index}
              draggable
              onDragStart={(e) => handleDragStart(e, node.type)}
              onClick={() => handleAddNode(node.type)}
              style={{
                background: "#f8f9fa",
                border: "1px solid #ddd",
                borderRadius: "6px",
                padding: "10px",
                marginBottom: "8px",
                cursor: "grab",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
              onMouseOver={(e) => {
                e.target.style.background = "#e3f2fd";
                e.target.style.borderColor = "#2196F3";
                e.target.style.transform = "translateY(-1px)";
              }}
              onMouseOut={(e) => {
                e.target.style.background = "#f8f9fa";
                e.target.style.borderColor = "#ddd";
                e.target.style.transform = "translateY(0)";
              }}
              onMouseDown={(e) => {
                e.target.style.cursor = "grabbing";
              }}
              onMouseUp={(e) => {
                e.target.style.cursor = "grab";
              }}
            >
              <span style={{ fontSize: "18px" }}>{node.icon}</span>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "13px",
                    color: "#333",
                  }}
                >
                  {node.label}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#666",
                  }}
                >
                  {node.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Add Buttons when collapsed */}
      {isCollapsed && (
        <div style={{ padding: "8px" }}>
          {nodeTypes.slice(0, 2).map((node, index) => (
            <button
              key={index}
              onClick={() => handleAddNode(node.type)}
              style={{
                width: "100%",
                background: "#f8f9fa",
                border: "1px solid #ddd",
                borderRadius: "4px",
                padding: "8px",
                marginBottom: "4px",
                cursor: "pointer",
                fontSize: "16px",
              }}
              title={node.label}
            >
              {node.icon}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default NodeToolbar;
