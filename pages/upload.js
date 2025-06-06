import React, { useState, useEffect, useRef } from "react";
import JSZip from "jszip";

export default function UploadPage() {
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState("");
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const inputRef = useRef();

  useEffect(() => {
    fetch("/api/getBuses")
      .then((r) => r.json())
      .then((data) => setBuses(data.buses || []));
  }, []);

  // File selector & ZIP extractor: always sets correct type!
  async function handleFiles(event) {
    setError("");
    setSuccess("");
    let newFiles = [];
    for (const file of Array.from(event.target.files)) {
      if (file.type === "application/zip" || file.name.endsWith(".zip")) {
        try {
          const zip = await JSZip.loadAsync(file);
          for (const name in zip.files) {
            const entry = zip.files[name];
            if (!entry.dir && /\.(jpe?g|jpeg|png)$/i.test(entry.name)) {
              const blob = await entry.async("blob");
              // Set type correctly based on extension!
              let type = "";
              if (/\.jpe?g$/i.test(entry.name)) type = "image/jpeg";
              if (/\.png$/i.test(entry.name)) type = "image/png";
              newFiles.push(new File([blob], entry.name, { type }));
            }
          }
        } catch (e) {
          setError("Failed to extract ZIP file. Please check the file and try again.");
        }
      } else {
        newFiles.push(file);
      }
    }
    // Log file names/types for debug
    console.log("Files ready for upload:");
    newFiles.forEach(f => console.log(f.name, f.type));
    setFiles((prev) => [...prev, ...newFiles]);
  }

  function handleUpload() {
    setError("");
    setSuccess("");
    if (!selectedBus || files.length === 0) {
      setError("Please select a bus and choose at least one file.");
      return;
    }
    // Show all files/types before upload
    console.log("Uploading files:");
    files.forEach(f => console.log(f.name, f.type));
    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("busId", selectedBus);
    files.forEach((file) => formData.append("files", file));

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/uploadBusImages");

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setProgress(percent);
      }
    };

    xhr.onload = () => {
      setUploading(false);
      setProgress(100);
      console.log("XHR Response:", xhr.status, xhr.responseText);
      if (xhr.status === 200) {
        setFiles([]);
        setSuccess("Upload successful!");
        setError("");
        setTimeout(() => setProgress(0), 1000);
        if (inputRef.current) inputRef.current.value = "";
      } else {
        try {
          const data = JSON.parse(xhr.responseText);
          setError(data.error || "Upload failed. Please try again.");
        } catch {
          setError("Upload failed. Please try again.");
        }
        setTimeout(() => setProgress(0), 1000);
      }
    };

    xhr.onerror = () => {
      setUploading(false);
      setError("Upload failed. Please try again.");
      setTimeout(() => setProgress(0), 1000);
      console.error("XHR error!", xhr.status, xhr.statusText);
    };

    xhr.send(formData);
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Bus Image Upload</h2>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Select Bus Unit:</label>
        <select
          className="border p-2 w-full"
          value={selectedBus}
          onChange={(e) => setSelectedBus(e.target.value)}
        >
          <option value="">Choose Bus...</option>
          {buses.map((bus) => (
            <option key={bus._id} value={bus._id}>
              {bus.model?.title || ""} - {bus.serialNumber}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.zip"
          multiple
          onChange={handleFiles}
        />
      </div>
      {files.length > 0 && (
        <div className="mb-4">
          <strong>Files ready for upload:</strong>
          <ul className="list-disc pl-6">
            {files.map((file, idx) => (
              <li key={idx}>
                {file.name}{" "}
                <span className="text-gray-500 text-xs">({file.type || "unknown"})</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {uploading && (
        <div className="mb-4 w-full">
          <div className="h-5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-200"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-center mt-1 text-sm text-blue-700 font-semibold">{progress}%</div>
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{success}</div>
      )}
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
