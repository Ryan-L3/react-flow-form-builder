import { Handle, Position } from "@xyflow/react";

function MasterOutputNode({ data, isConnectable }) {
  // Get connected form fields from data
  const connectedFields = data.connectedFields || [];
  const onReorderFields = data.onReorderFields;

  const handleExport = () => {
    const formData = {
      fields: connectedFields,
      timestamp: new Date().toISOString(),
    };
    console.log("Exported Form Data:", formData);
    alert("Form exported! Check console for details.");
  };

  const moveFieldUp = (index) => {
    if (index > 0 && onReorderFields) {
      onReorderFields(index, index - 1);
    }
  };

  const moveFieldDown = (index) => {
    if (index < connectedFields.length - 1 && onReorderFields) {
      onReorderFields(index, index + 1);
    }
  };

  // Render different field types in the preview
  const renderField = (field, index) => {
    const fieldContent = renderFieldContent(field, index);
    
    return (
      <div key={index} style={{ position: "relative", border: "1px solid #e0e0e0", borderRadius: "4px", padding: "8px" }}>
        {/* Reorder Controls */}
        <div style={{
          position: "absolute",
          top: "4px",
          right: "4px",
          display: "flex",
          flexDirection: "column",
          gap: "2px",
          zIndex: 10
        }}>
          <button
            onClick={() => moveFieldUp(index)}
            disabled={index === 0}
            style={{
              width: "20px",
              height: "20px",
              padding: "0",
              border: "1px solid #ccc",
              borderRadius: "2px",
              background: index === 0 ? "#f5f5f5" : "#fff",
              cursor: index === 0 ? "not-allowed" : "pointer",
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: index === 0 ? 0.5 : 1,
            }}
            title="Move up"
          >
            ▲
          </button>
          <button
            onClick={() => moveFieldDown(index)}
            disabled={index === connectedFields.length - 1}
            style={{
              width: "20px",
              height: "20px",
              padding: "0",
              border: "1px solid #ccc",
              borderRadius: "2px",
              background: index === connectedFields.length - 1 ? "#f5f5f5" : "#fff",
              cursor: index === connectedFields.length - 1 ? "not-allowed" : "pointer",
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: index === connectedFields.length - 1 ? 0.5 : 1,
            }}
            title="Move down"
          >
            ▼
          </button>
        </div>
        
        {/* Field Content */}
        <div style={{ paddingRight: "30px" }}>
          {fieldContent}
        </div>
      </div>
    );
  };

  // Render field content based on type
  const renderFieldContent = (field, index) => {
    switch (field.type) {
      case "textInput":
        return (
          <div>
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
          <div>
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
          <div>
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
          <div>
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
      case "datePicker":
        return (
          <div>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "bold",
                marginBottom: "4px",
                color: "#333",
              }}
            >
              {field.label || `Date Field ${index + 1}`}
              {field.required && <span style={{ color: "#f44336" }}>*</span>}
            </label>
            <input
              type="date"
              max={field.maxDate || undefined}
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
            <div style={{ fontSize: "11px", color: "#888", marginTop: "2px" }}>
              Format: YYYY-MM-DD
            </div>
          </div>
        );

      case "timePicker":
        return (
          <div>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "bold",
                marginBottom: "4px",
                color: "#333",
              }}
            >
              {field.label || `Time Field ${index + 1}`}
              {field.required && <span style={{ color: "#f44336" }}>*</span>}
            </label>
            <input
              type="time"
              max={field.maxTime || undefined}
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
            <div style={{ fontSize: "11px", color: "#888", marginTop: "2px" }}>
              Format: 24 Hour (HH:MM)
            </div>
          </div>
        );

      default:
        return (
          <div
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
