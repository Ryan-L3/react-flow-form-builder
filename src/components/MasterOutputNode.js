import { Handle, Position } from "@xyflow/react";

function MasterOutputNode({ data, isConnectable }) {
  // Get connected form fields from data
  const connectedFields = data.connectedFields || [];

  const handleExport = () => {
    const formData = {
      fields: connectedFields,
      timestamp: new Date().toISOString(),
    };
    console.log("Exported Form Data:", formData);
    alert("Form exported! Check console for details.");
  };

  // Render different field types in the preview
  const renderField = (field, index) => {
    switch (field.type) {
      case "textInput":
        return (
          <div key={index}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "bold",
                marginBottom: "4px",
                color: "#333",
              }}
            >
              {field.label || `Text Field ${index + 1}`}
            </label>
            <input
              type="text"
              placeholder={field.placeholder || "Enter text..."}
              style={{
                width: "100%",
                padding: "8px 10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "13px",
                transition: "border-color 0.2s",
                outline: "none",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#2196F3")}
              onBlur={(e) => (e.target.style.borderColor = "#ddd")}
            />
          </div>
        );

      case "textArea":
        return (
          <div key={index}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "bold",
                marginBottom: "4px",
                color: "#333",
              }}
            >
              {field.label || `Text Area ${index + 1}`}
            </label>
            <textarea
              placeholder={field.placeholder || "Enter long text..."}
              rows={field.rows || 3}
              style={{
                width: "100%",
                padding: "8px 10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "13px",
                transition: "border-color 0.2s",
                outline: "none",
                resize: "vertical",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#2196F3")}
              onBlur={(e) => (e.target.style.borderColor = "#ddd")}
            />
          </div>
        );

      case "dropdown":
        return (
          <div key={index}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "bold",
                marginBottom: "4px",
                color: "#333",
              }}
            >
              {field.label || `Dropdown ${index + 1}`}
            </label>
            <select
              style={{
                width: "100%",
                padding: "8px 10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "13px",
                transition: "border-color 0.2s",
                outline: "none",
                background: "white",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#2196F3")}
              onBlur={(e) => (e.target.style.borderColor = "#ddd")}
            >
              <option value="">Select an option...</option>
              {(field.options || []).map((option, optIndex) => (
                <option key={optIndex} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );

      case "checkbox":
        return (
          <div key={index}>
            <div
              style={{
                fontSize: "13px",
                fontWeight: "bold",
                marginBottom: "6px",
                color: "#333",
              }}
            >
              {field.label || `Checkbox Group ${index + 1}`}
            </div>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "13px",
                color: "#333",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                defaultChecked={field.defaultChecked || false}
                style={{
                  width: "16px",
                  height: "16px",
                }}
              />
              {field.checkboxText || "Checkbox option text"}
            </label>
          </div>
        );

      default:
        return (
          <div
            key={index}
            style={{
              padding: "8px",
              background: "#f5f5f5",
              borderRadius: "4px",
              fontSize: "12px",
              color: "#666",
            }}
          >
            Unknown field type: {field.type}
          </div>
        );
    }
  };

  return (
    <div
      style={{
        background: "#e3f2fd",
        border: "2px solid #2196F3",
        borderRadius: "8px",
        padding: "16px",
        minWidth: "300px",
        maxWidth: "400px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}
    >
      {/* Node Header */}
      <div
        style={{
          fontWeight: "bold",
          marginBottom: "12px",
          color: "#1976D2",
          fontSize: "16px",
          textAlign: "center",
        }}
      >
        📝 Final Form Output
      </div>

      {/* Connected Fields Count */}
      <div
        style={{
          background: "#fff",
          padding: "8px",
          borderRadius: "4px",
          marginBottom: "8px",
          textAlign: "center",
          fontSize: "12px",
          border: "1px solid #ddd",
        }}
      >
        Connected Fields: {connectedFields.length}
      </div>

      {/* Live Form Preview */}
      <div
        style={{
          background: "#fff",
          padding: "12px",
          borderRadius: "6px",
          border: "1px solid #ddd",
          overflow: "auto",
        }}
      >
        <div
          style={{
            fontSize: "14px",
            fontWeight: "bold",
            marginBottom: "12px",
            color: "#333",
            textAlign: "center",
          }}
        >
          Live Form Preview
        </div>

        {connectedFields.length === 0 ? (
          <div
            style={{
              fontSize: "12px",
              color: "#666",
              fontStyle: "italic",
              textAlign: "center",
              padding: "20px",
              background: "#f8f9fa",
              borderRadius: "4px",
              border: "1px dashed #ddd",
            }}
          >
            Connect form fields to see live preview
          </div>
        ) : (
          // Show actual live form with different field types
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {connectedFields.map((field, index) => renderField(field, index))}
            <button
              style={{
                padding: "10px 16px",
                background: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "13px",
                cursor: "pointer",
                marginTop: "8px",
                fontWeight: "bold",
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#45a049")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#4CAF50")}
            >
              Submit Form
            </button>
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div
        style={{
          marginTop: "12px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <button
          onClick={handleExport}
          style={{
            padding: "8px 16px",
            background: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "13px",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#1976D2")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#2196F3")}
        >
          Export Form
        </button>
      </div>

      {/* Input Handle - where connections come IN to this node */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        isConnectable={isConnectable}
        style={{
          background: "#2196F3",
          width: "12px",
          height: "12px",
        }}
      />
    </div>
  );
}

export default MasterOutputNode;
