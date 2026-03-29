import { useState } from "react";
import { useNavigate } from "react-router-dom"
export default function UploadMarks() {
  const [mode, setMode] = useState("upload");
  const [file, setFile] = useState(null);
  const [rows, setRows] = useState([{ subject: "", credits: "" }]);
  const [errors, setErrors] = useState({});
  const validGrades = ["O", "A+", "A", "B+", "B", "C", "D", "P", "F"];

  const navigate = useNavigate();
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }
    console.log("Uploading:", file);
  };

  const handleRowChange = (index, field, value) => {
    const updated = [...rows];
    updated[index] = { ...updated[index], [field]: value };
    setRows(updated);
  };

  const addRow = () => {
    setRows((prev) => [...prev, { subject: "", credits: "" }]);
  };

  const removeRow = (index) => {
    if (rows.length <= 1) return;
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted:", rows);
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-6">
      <div className="w-full max-w-2xl ">

        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-indigo-600 text-center">
          Upload Marksheet
        </h1>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border">

          {/* Toggle Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 mb-6">
            <button
              type="button"
              onClick={() => setMode("upload")}
              className={`w-full sm:w-auto px-4 py-2 rounded-lg font-medium transition ${
                mode === "upload"
                  ? "bg-indigo-600 text-white"
                  : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
              }`}
            >
              Upload Marksheet
            </button>

            <button
              type="button"
              onClick={() => setMode("manual")}
              className={`w-full sm:w-auto px-4 py-2 rounded-lg font-medium transition ${
                mode === "manual"
                  ? "bg-indigo-600 text-white"
                  : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
              }`}
            >
              Enter Manually
            </button>
          </div>

          {/* Upload Mode */}
          {mode === "upload" ? (
            <>
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

              {file && (
                <p className="mt-3 text-sm text-slate-500 break-all">
                  Selected: <span className="font-medium">{file.name}</span>
                </p>
              )}

              <button
                onClick={handleUpload}
                className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition font-medium"
              >
                Upload
              </button>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">

              {rows.map((row, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row gap-3 sm:items-end bg-gray-50 p-3 rounded-lg"
                >
                  {/* Subject */}
                  <div className="w-full sm:w-1/2">
                    <label className="text-sm font-medium text-slate-700">
                      Subject Name
                    </label>
                     <input
                    type="text"
                    value={row.subject}
                    onChange={(e) => {
                      const value = e.target.value;

                      // Remove invalid characters
                      const cleanedValue = value.replace(/[^A-Za-z\s]/g, "");

                      handleRowChange(index, "subject", cleanedValue);

                      // Show error ONLY if user tried to type invalid chars
                      if (value !== cleanedValue) {
                        setErrors((prev) => ({
                          ...prev,
                          [index]: "No numbers allowed",
                        }));
                      } else {
                        setErrors((prev) => ({
                          ...prev,
                          [index]: "",
                        }));
                      }
                    }}
                    className={`mt-1 w-full border rounded-lg p-2 focus:ring-2 ${
                      errors[index]
                        ? "border-red-500 focus:ring-red-300"
                        : "border-slate-300 focus:ring-indigo-300"
                    }`}
                    placeholder="Subject"
                    required
                  />
                  {errors[index] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[index]}
                      </p>
                    )}
                  </div>

                        
                  {/* Grades */}
                      <div className="w-full sm:w-1/3">
                    <label className="text-sm font-medium text-slate-700">
                      Grade
                    </label>

                    <input
                      type="text"
                      value={row.credits}
                      onChange={(e) => {
                        let value = e.target.value.toUpperCase();

                        handleRowChange(index, "credits", value);

                        // Validate grade
                        if (value === "" || validGrades.includes(value)) {
                          setErrors((prev) => ({
                            ...prev,
                            [`grade-${index}`]: "",
                          }));
                        } else {
                          setErrors((prev) => ({
                            ...prev,
                            [`grade-${index}`]:
                              "Enter only valid grades like O, A, A+, B, B+, C, D, P, F",
                          }));
                        }
                      }}
                      className={`mt-1 w-full border rounded-lg p-2 focus:ring-2 ${
                        errors[`grade-${index}`]
                          ? "border-red-500 focus:ring-red-300"
                          : "border-slate-300 focus:ring-indigo-300"
                      }`}
                      placeholder="Enter Grade (e.g., A+)"
                      required
                    />

                    {/* Error Message */}
                    {errors[`grade-${index}`] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[`grade-${index}`]}
                      </p>
                    )}
                  </div>
                  {/* Buttons */}
                  <div className="flex gap-2 justify-end sm:justify-start">
                    <button
                      type="button"
                      onClick={addRow}
                      className="px-3 py-2 rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                    >
                      +
                    </button>

                    {rows.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRow(index)}
                        className="px-3 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                      >
                        -
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition font-medium"
              >
                Submit
              </button>
            </form>
          )}
        </div>
      </div>
             <div className="mt-6 flex justify-end">
              <button
                onClick={() => navigate("/dashboard/performance")}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg 
                hover:bg-indigo-700 transition duration-200 font-medium"
              >
                Next → Get Performance Analysis
              </button>
            </div>
                </div>
  );
}