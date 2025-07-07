"use client";
import { useState, useRef } from 'react';
import FormField from './FormField';

function FormRenderer({ formData, onSubmit, mode = "interactive" }) {
  const [formValues, setFormValues] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const formRef = useRef(null);

  const handleFieldChange = (fieldId, value) => {
    setFormValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const submissionData = {
        formId: formData.id || "unknown",
        formTitle: formData.title || "Untitled Form",
        submittedAt: new Date().toISOString(),
        values: formValues,
        fieldData: connectedFields.map(field => ({
          id: field.id,
          type: field.type,
          label: field.label,
          value: formValues[field.id] || ""
        }))
      };

      if (onSubmit) {
        await onSubmit(submissionData);
      } else {
        // Default behavior - download as JSON
        const dataStr = JSON.stringify(submissionData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = `form-submission-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
      }

      setSubmitMessage("Form submitted successfully!");
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormValues({});
        setSubmitMessage("");
        formRef.current?.reset();
      }, 2000);

    } catch (error) {
      setSubmitMessage(`Error submitting form: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormValues({});
    setSubmitMessage("");
    formRef.current?.reset();
  };

  // Extract connected fields from form data
  const connectedFields = formData?.nodes
    ? formData.nodes
        .filter(node => node.type !== 'masterOutput')
        .map(node => ({
          id: node.id,
          type: node.type,
          label: node.data.label,
          placeholder: node.data.placeholder,
          options: node.data.options,
          checkboxText: node.data.checkboxText,
          defaultChecked: node.data.defaultChecked,
          rows: node.data.rows,
          maxDate: node.data.maxDate,
          maxTime: node.data.maxTime,
          required: node.data.required,
        }))
    : [];

  if (!formData) {
    return (
      <div style={{
        padding: "20px",
        textAlign: "center",
        fontSize: "16px",
        color: "#666"
      }}>
        No form data provided
      </div>
    );
  }

  if (connectedFields.length === 0) {
    return (
      <div style={{
        padding: "20px",
        textAlign: "center",
        fontSize: "16px",
        color: "#666"
      }}>
        This form has no fields to display
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: "600px",
      margin: "0 auto",
      padding: "20px",
      background: "#fff",
      borderRadius: "8px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
    }}>
      {/* Form Header */}
      <div style={{ marginBottom: "24px", textAlign: "center" }}>
        <h1 style={{
          fontSize: "24px",
          fontWeight: "bold",
          color: "#333",
          margin: "0 0 8px 0"
        }}>
          {formData.title || "Untitled Form"}
        </h1>
        {formData.description && (
          <p style={{
            fontSize: "14px",
            color: "#666",
            margin: "0"
          }}>
            {formData.description}
          </p>
        )}
        <div style={{
          fontSize: "12px",
          color: "#888",
          marginTop: "8px"
        }}>
          {connectedFields.length} field{connectedFields.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Form Content */}
      <form ref={formRef} onSubmit={handleSubmit}>
        {connectedFields.map((field, index) => (
          <FormField
            key={field.id || index}
            field={field}
            value={formValues[field.id] || ""}
            onChange={handleFieldChange}
            disabled={mode === "preview"}
          />
        ))}

        {/* Submit Message */}
        {submitMessage && (
          <div style={{
            padding: "12px",
            borderRadius: "4px",
            marginBottom: "16px",
            backgroundColor: submitMessage.includes("Error") ? "#ffebee" : "#e8f5e8",
            color: submitMessage.includes("Error") ? "#c62828" : "#2e7d32",
            fontSize: "14px",
            textAlign: "center"
          }}>
            {submitMessage}
          </div>
        )}

        {/* Form Actions */}
        {mode === "interactive" && (
          <div style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            marginTop: "24px"
          }}>
            <button
              type="button"
              onClick={handleReset}
              disabled={isSubmitting}
              style={{
                padding: "10px 20px",
                background: "#f5f5f5",
                color: "#666",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                fontWeight: "500",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => {
                if (!isSubmitting) {
                  e.target.style.backgroundColor = "#e0e0e0";
                }
              }}
              onMouseOut={(e) => {
                if (!isSubmitting) {
                  e.target.style.backgroundColor = "#f5f5f5";
                }
              }}
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: "10px 20px",
                background: isSubmitting ? "#cccccc" : "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "14px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                fontWeight: "500",
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) => {
                if (!isSubmitting) {
                  e.target.style.backgroundColor = "#45a049";
                }
              }}
              onMouseOut={(e) => {
                if (!isSubmitting) {
                  e.target.style.backgroundColor = "#4CAF50";
                }
              }}
            >
              {isSubmitting ? "Submitting..." : "Submit Form"}
            </button>
          </div>
        )}
      </form>

      {/* Form Info */}
      <div style={{
        marginTop: "24px",
        padding: "12px",
        background: "#f8f9fa",
        borderRadius: "4px",
        fontSize: "12px",
        color: "#666"
      }}>
        <div>Form Version: {formData.version || "1.0"}</div>
        {formData.timestamp && (
          <div>Created: {new Date(formData.timestamp).toLocaleString()}</div>
        )}
      </div>
    </div>
  );
}

export default FormRenderer;