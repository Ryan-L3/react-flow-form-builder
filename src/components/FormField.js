import { useState } from 'react';

function FormField({ field, value, onChange, disabled = false }) {
  const [localValue, setLocalValue] = useState(value || '');

  const handleChange = (newValue) => {
    setLocalValue(newValue);
    if (onChange) {
      onChange(field.id, newValue);
    }
  };

  const fieldId = `field-${field.id}`;
  const isRequired = field.required || false;

  // Common input styles
  const inputStyle = {
    width: "100%",
    padding: "8px 10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "13px",
    transition: "border-color 0.2s",
    outline: "none",
    backgroundColor: disabled ? "#f5f5f5" : "white",
    color: disabled ? "#666" : "#333",
  };

  const labelStyle = {
    display: "block",
    fontSize: "13px",
    fontWeight: "bold",
    marginBottom: "4px",
    color: "#333",
  };

  const onFocus = (e) => {
    if (!disabled) {
      e.target.style.borderColor = "#2196F3";
    }
  };

  const onBlur = (e) => {
    if (!disabled) {
      e.target.style.borderColor = "#ddd";
    }
  };

  switch (field.type) {
    case "textInput":
      return (
        <div style={{ marginBottom: "16px" }}>
          <label htmlFor={fieldId} style={labelStyle}>
            {field.label || "Text Field"}
            {isRequired && <span style={{ color: "#f44336" }}>*</span>}
          </label>
          <input
            id={fieldId}
            type="text"
            placeholder={field.placeholder || "Enter text..."}
            value={localValue}
            onChange={(e) => handleChange(e.target.value)}
            disabled={disabled}
            required={isRequired}
            style={inputStyle}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </div>
      );

    case "textArea":
      return (
        <div style={{ marginBottom: "16px" }}>
          <label htmlFor={fieldId} style={labelStyle}>
            {field.label || "Text Area"}
            {isRequired && <span style={{ color: "#f44336" }}>*</span>}
          </label>
          <textarea
            id={fieldId}
            placeholder={field.placeholder || "Enter long text..."}
            rows={field.rows || 3}
            value={localValue}
            onChange={(e) => handleChange(e.target.value)}
            disabled={disabled}
            required={isRequired}
            style={{
              ...inputStyle,
              resize: "vertical",
            }}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </div>
      );

    case "dropdown":
      return (
        <div style={{ marginBottom: "16px" }}>
          <label htmlFor={fieldId} style={labelStyle}>
            {field.label || "Dropdown"}
            {isRequired && <span style={{ color: "#f44336" }}>*</span>}
          </label>
          <select
            id={fieldId}
            value={localValue}
            onChange={(e) => handleChange(e.target.value)}
            disabled={disabled}
            required={isRequired}
            style={{
              ...inputStyle,
              background: disabled ? "#f5f5f5" : "white",
            }}
            onFocus={onFocus}
            onBlur={onBlur}
          >
            <option value="">Select an option...</option>
            {(field.options || []).map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      );

    case "checkbox":
      return (
        <div style={{ marginBottom: "16px" }}>
          <div style={labelStyle}>
            {field.label || "Checkbox Group"}
            {isRequired && <span style={{ color: "#f44336" }}>*</span>}
          </div>
          <label
            htmlFor={fieldId}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px",
              color: "#333",
              cursor: disabled ? "not-allowed" : "pointer",
            }}
          >
            <input
              id={fieldId}
              type="checkbox"
              checked={localValue === true || localValue === "true"}
              onChange={(e) => handleChange(e.target.checked)}
              disabled={disabled}
              required={isRequired}
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
        <div style={{ marginBottom: "16px" }}>
          <label htmlFor={fieldId} style={labelStyle}>
            {field.label || "Date Field"}
            {isRequired && <span style={{ color: "#f44336" }}>*</span>}
          </label>
          <input
            id={fieldId}
            type="date"
            value={localValue}
            onChange={(e) => handleChange(e.target.value)}
            disabled={disabled}
            required={isRequired}
            max={field.maxDate || undefined}
            style={inputStyle}
            onFocus={onFocus}
            onBlur={onBlur}
          />
          <div style={{ fontSize: "11px", color: "#888", marginTop: "2px" }}>
            Format: YYYY-MM-DD
          </div>
        </div>
      );

    case "timePicker":
      return (
        <div style={{ marginBottom: "16px" }}>
          <label htmlFor={fieldId} style={labelStyle}>
            {field.label || "Time Field"}
            {isRequired && <span style={{ color: "#f44336" }}>*</span>}
          </label>
          <input
            id={fieldId}
            type="time"
            value={localValue}
            onChange={(e) => handleChange(e.target.value)}
            disabled={disabled}
            required={isRequired}
            max={field.maxTime || undefined}
            style={inputStyle}
            onFocus={onFocus}
            onBlur={onBlur}
          />
          <div style={{ fontSize: "11px", color: "#888", marginTop: "2px" }}>
            Format: 24 Hour (HH:MM)
          </div>
        </div>
      );

    default:
      return (
        <div style={{ marginBottom: "16px" }}>
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
        </div>
      );
  }
}

export default FormField;