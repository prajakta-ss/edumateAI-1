import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveMarks } from "../api/axios";

export default function UploadMarks() {
  const [mode, setMode] = useState("upload");
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const validGrades = ["O", "A+", "A", "B+", "B", "C", "D", "P", "F"];

  const subjectsList = [
   
    'Systems in mechanical engg',
    'Basic electrical engg',
    'Engineering  Physics',
    'Programming & Problem solving',
    'Engg Mathematics - I',
    'Engineering  Mechanics',
    'Basic electronics engineering ',
    'Engg Chemistry',
    'Engg Graphics',
    'Engg Mathematics II',
    'Fundamentals of Programming Languages\n(For 2024 Pattern only!)'
  ];

  const [grades, setGrades] = useState(
    subjectsList.map(() => "")
  );

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

  const handleGradeChange = (index, value) => {
    const updated = [...grades];
    const upperValue = value.toUpperCase();

    updated[index] = upperValue;
    setGrades(updated);

    if (upperValue === "" || validGrades.includes(upperValue)) {
      setErrors((prev) => ({
        ...prev,
        [index]: "",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        [index]: "Invalid grade",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    let hasErrors = false;
    const validationErrors = {};

    grades.forEach((grade, index) => {
      if (!grade) {
        validationErrors[index] = "Grade is required";
        hasErrors = true;
      } else if (!validGrades.includes(grade)) {
        validationErrors[index] = "Invalid grade";
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setErrors(validationErrors);
      setErrorMessage("Please fix all errors before submitting");
      return;
    }

    setLoading(true);

    try {
      const marksData = subjectsList.map((subject, index) => ({
        subject,
        grade: grades[index],
      }));

      await saveMarks(marksData);

      setSuccessMessage("✓ Marks saved successfully!");
      setGrades(subjectsList.map(() => ""));
      setErrors({});

      setTimeout(() => {
        navigate("/dashboard/performance");
      }, 2000);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to save marks";
      setErrorMessage(errorMsg);
      console.error("Error saving marks:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-6">
      <div className="w-full max-w-2xl">

        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-indigo-600 text-center">
          Upload Marksheet
        </h1>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border">

          {/* Toggle Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 mb-6">
            <button
              type="button"
              onClick={() => setMode("upload")}
              className={`w-full sm:w-auto px-4 py-2 rounded-lg font-medium ${
                mode === "upload"
                  ? "bg-indigo-600 text-white"
                  : "bg-indigo-50 text-indigo-600"
              }`}
            >
              Upload Marksheet
            </button>

            <button
              type="button"
              onClick={() => setMode("manual")}
              className={`w-full sm:w-auto px-4 py-2 rounded-lg font-medium ${
                mode === "manual"
                  ? "bg-indigo-600 text-white"
                  : "bg-indigo-50 text-indigo-600"
              }`}
            >
              Enter Manually
            </button>
          </div>

          {/* Success */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 border text-green-700 rounded-lg">
              {successMessage}
            </div>
          )}

          {/* Error */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 border text-red-700 rounded-lg">
              {errorMessage}
            </div>
          )}

          {/* Upload Mode */}
        
          {mode === "upload" ? ( 
            <> 
            <label className="block mb-3 text-sm font-medium text-slate-700"> Choose Marksheet File </label> 
            <input 
            type="file" accept=".pdf,.jpg,.jpeg,.png" 
            onChange={handleFileChange} 
            className="block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 
                      file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-100
                       file:text-indigo-600 hover:file:bg-indigo-200 cursor-pointer" /> 
                       {file && ( <p className="mt-3 text-sm text-slate-500 break-all"> Selected: 
                        <span className="font-medium">{file.name}</span> </p> )} 
                        <button onClick={handleUpload} 
                        className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-xl
                         hover:bg-indigo-700 transition font-medium" > 
                         Upload 
                         </button> </>         
                          ) : (
           
                  <form onSubmit={handleSubmit} className="space-y-4">

              {subjectsList.map((subject, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row gap-3 bg-gray-50 p-3 rounded-lg"
                >
                  {/* Subject */}
                  <div className="w-full sm:w-1/2 font-medium text-slate-700">
                    {subject}
                  </div>

                  {/* Grade */}
                  <div className="w-full sm:w-1/2">
                    <input
                      type="text"
                      value={grades[index]}
                      onChange={(e) =>
                        handleGradeChange(index, e.target.value)
                      }
                      className={`w-full border rounded-lg p-2 ${
                        errors[index]
                          ? "border-red-500"
                          : "border-slate-300"
                      }`}
                      placeholder="Enter Grade"
                      required
                    />

                    {errors[index] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[index]}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl ${
                  loading
                    ? "bg-indigo-400"
                    : "bg-indigo-600 hover:bg-indigo-700"
                } text-white`}
              >
                {loading ? "Saving..." : "Submit"}
              </button>
            </form>
          )}
        </div>

        {/* Next Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => navigate("/dashboard/performance")}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
          >
            Next → Get Performance Analysis
          </button>
        </div>
      </div>
    </div>
  );
}