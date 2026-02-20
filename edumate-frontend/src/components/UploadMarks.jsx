import { useState } from "react";

export default function UploadMarks() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    console.log("Uploading:", file);
    // Later: send to backend using FormData
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-6 text-indigo-600">
        Upload Marksheet
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-md border">
        
        {/* File Input */}
        <label className="block mb-3 text-sm font-medium text-slate-700">
          Choose Marksheet File
        </label>

        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          className="block w-full text-sm text-slate-600
          file:mr-4 file:py-2 file:px-4
          file:rounded-lg file:border-0
          file:text-sm file:font-semibold
          file:bg-indigo-100 file:text-indigo-600
          hover:file:bg-indigo-200 cursor-pointer"
        />

        {/* Selected File Name */}
        {file && (
          <p className="mt-3 text-sm text-slate-500">
            Selected: <span className="font-medium">{file.name}</span>
          </p>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          className="mt-6 w-full bg-indigo-600 text-indigo-600 py-2 rounded-lg 
          hover:bg-indigo-700 transition duration-200 font-medium"
        >
          Upload
        </button>
      </div>
    </div>
  );
}
