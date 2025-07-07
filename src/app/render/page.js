"use client";
import { useState } from "react";
import FormRenderer from "@/components/FormRenderer";
import Link from "next/link";

export default function RenderPage() {
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("interactive"); // "interactive" or "preview"

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".json")) {
      setError("Please select a JSON file");
      return;
    }

    setIsLoading(true);
    setError("");

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);

        // Validate the form data structure
        if (!data.nodes || !data.edges) {
          throw new Error("Invalid form file format - missing nodes or edges");
        }

        if (!data.version) {
          throw new Error("Invalid form file format - missing version");
        }

        setFormData(data);
        setError("");
      } catch (err) {
        setError(`Error loading form: ${err.message}`);
        setFormData(null);
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      setError("Error reading file");
      setIsLoading(false);
    };

    reader.readAsText(file);

    // Clear the input to allow re-uploading the same file
    event.target.value = "";
  };

  const handleFormSubmit = async (submissionData) => {
    console.log("Form submitted:", submissionData);

    // You can customize this to send to your backend
    // For now, we'll just download the submission as JSON
    const dataStr = JSON.stringify(submissionData, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `form-submission-${
      new Date().toISOString().split("T")[0]
    }.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const clearForm = () => {
    setFormData(null);
    setError("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        padding: "20px",
      }}
    >
      {/* Header */}
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          marginBottom: "24px",
        }}
      >
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            color: "#333",
            margin: "0 0 8px 0",
            textAlign: "center",
          }}
        >
          Form Renderer
        </h1>
        <p
          style={{
            fontSize: "16px",
            color: "#666",
            textAlign: "center",
            margin: "0",
          }}
        >
          Upload and render forms created with the Form Builder
        </p>
      </div>

      {/* Navigation */}
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          marginBottom: "24px",
          textAlign: "center",
        }}
      >
        <Link
          href="/"
          style={{
            display: "inline-block",
            padding: "8px 16px",
            background: "#2196F3",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
            fontSize: "14px",
            fontWeight: "500",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#1976D2")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#2196F3")}
        >
          ← Back to Form Builder
        </Link>
      </div>

      {/* File Upload Section */}
      {!formData && (
        <div
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            background: "#fff",
            borderRadius: "8px",
            padding: "32px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "48px",
              marginBottom: "16px",
            }}
          >
            📄
          </div>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#333",
              margin: "0 0 8px 0",
            }}
          >
            Upload Form JSON
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "#666",
              margin: "0 0 24px 0",
            }}
          >
            Select a JSON file exported from the Form Builder to render and
            interact with the form
          </p>

          <div
            style={{
              position: "relative",
              display: "inline-block",
            }}
          >
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              disabled={isLoading}
              style={{
                position: "absolute",
                opacity: 0,
                width: "100%",
                height: "100%",
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
            />
            <button
              disabled={isLoading}
              style={{
                padding: "12px 24px",
                background: isLoading ? "#cccccc" : "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "16px",
                cursor: isLoading ? "not-allowed" : "pointer",
                fontWeight: "500",
                transition: "background-color 0.2s",
                pointerEvents: "none",
              }}
            >
              {isLoading ? "Loading..." : "Choose JSON File"}
            </button>
          </div>

          {error && (
            <div
              style={{
                marginTop: "16px",
                padding: "12px",
                background: "#ffebee",
                color: "#c62828",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}
        </div>
      )}

      {/* Form Display Section */}
      {formData && (
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          {/* Form Controls */}
          <div
            style={{
              background: "#fff",
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "16px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <label
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#333",
                }}
              >
                Mode:
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                style={{
                  padding: "6px 12px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px",
                  background: "white",
                }}
              >
                <option value="interactive">Interactive</option>
                <option value="preview">Preview Only</option>
              </select>
            </div>

            <div
              style={{
                display: "flex",
                gap: "8px",
              }}
            >
              <button
                onClick={clearForm}
                style={{
                  padding: "8px 16px",
                  background: "#f5f5f5",
                  color: "#666",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px",
                  cursor: "pointer",
                  fontWeight: "500",
                  transition: "all 0.2s",
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#e0e0e0")
                }
                onMouseOut={(e) => (e.target.style.backgroundColor = "#f5f5f5")}
              >
                Load Different Form
              </button>
            </div>
          </div>

          {/* Form Renderer */}
          <FormRenderer
            formData={formData}
            onSubmit={handleFormSubmit}
            mode={mode}
          />
        </div>
      )}
    </div>
  );
}
