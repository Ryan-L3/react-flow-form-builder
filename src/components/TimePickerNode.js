import { Handle, Position } from "@xyflow/react";

function TimePickerNode({ data, isConnectable }) {
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
        🕐 Time Picker Field
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

      {/* Time */}
      <div style={{ marginBottom: "8px" }}>
        <label style={{ fontSize: "12px", color: "#666" }}>Time:</label>
        <input
          type="time"
          value={data.time || ""}
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
              data.onChange(data.id, { ...data, time: e.target.value });
            }
          }}
        />
      </div>

      {/* Required Field Option */}
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
            checked={data.required || false}
            onChange={(e) => {
              if (data.onChange) {
                data.onChange(data.id, {
                  ...data,
                  required: e.target.checked,
                });
              }
            }}
          />
          Required field
        </label>
      </div>

      {/* Preview of the actual time picker */}
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
          style={{
            fontSize: "12px",
            fontWeight: "bold",
            marginBottom: "2px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          {data.label || "Time Field Label"}
          {data.required && <span style={{ color: "#f44336" }}>*</span>}
        </div>
        <input
          type="time"
          max={data.time || undefined}
          style={{
            width: "100%",
            padding: "4px 8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "12px",
          }}
          disabled
        />
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        isConnectable={isConnectable}
        style={{
          background: "#795548",
          width: "12px",
          height: "12px",
        }}
      />
    </div>
  );
}

export default TimePickerNode;
