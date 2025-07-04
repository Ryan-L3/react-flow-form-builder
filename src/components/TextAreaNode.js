import { Handle, Position } from "@xyflow/react";

function TextAreaNode({ data, isConnectable }) {
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
          fontWeight: "bold",
          marginBottom: "8px",
          color: "#333",
          fontSize: "14px",
        }}
      >
        📄 Text Area Field
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

      {/* Field Placeholder Input */}
      <div style={{ marginBottom: "8px" }}>
        <label style={{ fontSize: "12px", color: "#666" }}>Placeholder:</label>
        <input
          type="text"
          placeholder="Enter placeholder text"
          value={data.placeholder || ""} // FIXED: changed from defaultValue
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
              data.onChange(data.id, { ...data, placeholder: e.target.value });
            }
          }}
        />
      </div>

      {/* Rows Setting */}
      <div style={{ marginBottom: "8px" }}>
        <label style={{ fontSize: "12px", color: "#666" }}>Rows:</label>
        <input
          type="number"
          min="2"
          max="10"
          value={data.rows || 3} // FIXED: changed from defaultValue
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
              data.onChange(data.id, {
                ...data,
                rows: parseInt(e.target.value),
              });
            }
          }}
        />
      </div>

      {/* Preview of the actual textarea */}
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
          {data.label || "Text Area Label"}
        </div>
        <textarea
          placeholder={data.placeholder || "Enter long text..."}
          rows={data.rows || 3}
          style={{
            width: "100%",
            padding: "4px 8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "12px",
            resize: "vertical",
          }}
          disabled
          readOnly
        />
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        isConnectable={isConnectable}
        style={{
          background: "#FF9800",
          width: "12px",
          height: "12px",
        }}
      />
    </div>
  );
}

export default TextAreaNode;
