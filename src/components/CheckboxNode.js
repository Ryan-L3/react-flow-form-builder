import { Handle, Position } from "@xyflow/react";

function CheckboxNode({ data, isConnectable }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "2px solid #ddd",
        borderRadius: "8px",
        padding: "12px",
        minWidth: "200px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      {/* Node Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <div
          style={{
            fontWeight: "bold",
            color: "#333",
            fontSize: "14px",
          }}
        >
          ☑️ Checkbox Field
        </div>
        <button
          onClick={() => data.onDelete && data.onDelete(data.id)}
          style={{
            background: "#ff4444",
            color: "white",
            border: "none",
            borderRadius: "4px",
            padding: "4px 8px",
            fontSize: "12px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
          onMouseOver={(e) => e.target.style.background = "#cc0000"}
          onMouseOut={(e) => e.target.style.background = "#ff4444"}
        >
          ×
        </button>
      </div>

      {/* Field Label Input */}
      <div style={{ marginBottom: "8px" }}>
        <label style={{ fontSize: "12px", color: "#666" }}>Label:</label>
        <input
          type="text"
          placeholder="Enter field label"
          value={data.label || ""}
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

      {/* Checkbox Text Input */}
      <div style={{ marginBottom: "8px" }}>
        <label style={{ fontSize: "12px", color: "#666" }}>
          Checkbox Text:
        </label>
        <input
          type="text"
          placeholder="Text next to checkbox"
          value={data.checkboxText || ""}
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
              data.onChange(data.id, { ...data, checkboxText: e.target.value });
            }
          }}
        />
      </div>

      {/* Default Checked Setting */}
      <div style={{ marginBottom: "8px" }}>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12px",
            color: "#666",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={data.defaultChecked || false}
            onChange={(e) => {
              if (data.onChange) {
                data.onChange(data.id, {
                  ...data,
                  defaultChecked: e.target.checked,
                });
              }
            }}
          />
          Default checked
        </label>
      </div>

      {/* Preview of the actual checkbox */}
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
          style={{ fontSize: "12px", fontWeight: "bold", marginBottom: "6px" }}
        >
          {data.label || "Checkbox Group Label"}
        </div>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12px",
            color: "#333",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={data.defaultChecked || false}
            disabled
            readOnly
          />
          {data.checkboxText || "Checkbox option text"}
        </label>
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        isConnectable={isConnectable}
        style={{
          background: "#E91E63",
          width: "12px",
          height: "12px",
        }}
      />
    </div>
  );
}

export default CheckboxNode;
