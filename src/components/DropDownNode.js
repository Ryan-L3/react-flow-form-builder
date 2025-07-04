import { Handle, Position } from "@xyflow/react";
import { useState, useEffect } from "react";

function DropDownNode({ data, isConnectable }) {
  const [options, setOptions] = useState(
    data.options || ["Option 1", "Option 2", "Option 3"]
  );

  // Sync local state with data.options when data changes
  useEffect(() => {
    if (data.options) {
      setOptions(data.options);
    }
  }, [data.options]);

  const addOption = () => {
    const newOptions = [...options, `Option ${options.length + 1}`];
    setOptions(newOptions);
    if (data.onChange) {
      data.onChange(data.id, { ...data, options: newOptions });
    }
  };

  const removeOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
    if (data.onChange) {
      data.onChange(data.id, { ...data, options: newOptions });
    }
  };

  const updateOption = (index, value) => {
    const newOptions = options.map((option, i) =>
      i === index ? value : option
    );
    setOptions(newOptions);
    if (data.onChange) {
      data.onChange(data.id, { ...data, options: newOptions });
    }
  };

  return (
    <div
      style={{
        background: "#fff",
        border: "2px solid #ddd",
        borderRadius: "8px",
        padding: "12px",
        minWidth: "220px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      {/* Node Header */}
      <div
        style={{
          fontWeight: "bold",
          marginBottom: "8px",
          color: "#333",
          fontSize: "14px",
        }}
      >
        📋 Dropdown Field
      </div>

      {/* Field Label Input */}
      <div style={{ marginBottom: "8px" }}>
        <label style={{ fontSize: "12px", color: "#666" }}>Label:</label>
        <input
          type="text"
          placeholder="Enter field label"
          value={data.label || ""} // FIXED: changed from defaultValue
          style={{
            width: "100%",
            padding: "4px 8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "12px",
            marginTop: "2px",
          }}
          onChange={(e) => {
            if (data.onChange) {
              data.onChange(data.id, { ...data, label: e.target.value });
            }
          }}
        />
      </div>

      {/* Options Management */}
      <div style={{ marginBottom: "8px" }}>
        <label style={{ fontSize: "12px", color: "#666" }}>Options:</label>
        <div style={{ marginTop: "4px" }}>
          {options.map((option, index) => (
            <div
              key={index}
              style={{ display: "flex", gap: "4px", marginBottom: "4px" }}
            >
              <input
                type="text"
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                style={{
                  flex: 1,
                  padding: "4px 8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "11px",
                }}
              />
              {options.length > 1 && (
                <button
                  onClick={() => removeOption(index)}
                  style={{
                    padding: "4px 8px",
                    background: "#f44336",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "10px",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addOption}
            style={{
              padding: "4px 8px",
              background: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "11px",
              cursor: "pointer",
              marginTop: "4px",
            }}
          >
            + Add Option
          </button>
        </div>
      </div>

      {/* Preview of the actual dropdown */}
      <div
        style={{
          background: "#f8f9fa",
          padding: "8px",
          borderRadius: "4px",
          marginTop: "8px",
        }}
      >
        <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>
          Preview:
        </div>
        <div
          style={{ fontSize: "12px", fontWeight: "bold", marginBottom: "2px" }}
        >
          {data.label || "Dropdown Label"}
        </div>
        <select
          style={{
            width: "100%",
            padding: "4px 8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "12px",
          }}
          disabled
        >
          <option value="">Select an option...</option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        isConnectable={isConnectable}
        style={{
          background: "#9C27B0",
          width: "12px",
          height: "12px",
        }}
      />
    </div>
  );
}

export default DropDownNode;
