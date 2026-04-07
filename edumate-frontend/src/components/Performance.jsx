import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
export default function Performance() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const res = await axios.get("/performance/marks");
        setData(res.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load performance"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPerformance();
  }, []);

  // -----------------------------
  // UI STATES
  // -----------------------------
  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (error) {
    return (
      <p className="text-center mt-10 text-red-500 font-medium">
        {error}
      </p>
    );
  }

  if (!data || !data.marks?.length) {
    return (
      <p className="text-center mt-10 text-gray-500">
        No performance data available
      </p>
    );
  }

  // -----------------------------
  // MAIN UI
  // -----------------------------
  return (
    <div className="min-h-screen px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 text-indigo-600 text-center">
        Performance Analysis
      </h1>

      <div className="max-w-3xl mx-auto space-y-6">

        {/* Performance Summary */}
        <div className="bg-white p-6 rounded-xl shadow border">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Overall Performance
          </h2>

          <p className="text-xl font-bold text-indigo-600">
            {data.performance_level || "N/A"}
          </p>

          <p className="text-gray-600 mt-2">
            {data.analysis || "No analysis available"}
          </p>
        </div>

        {/* Marks Table */}
        <div className="bg-white p-6 rounded-xl shadow border">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Subject-wise Grades
          </h2>

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-indigo-100 text-indigo-700">
                <th className="p-2 text-left">Subject</th>
                <th className="p-2 text-left">Grade</th>
              </tr>
            </thead>
            <tbody>
              {data.marks.map((mark, index) => (
                <tr key={index} className="border-t">
                  <td className="p-2">{mark.subject}</td>
                  <td className="p-2 font-medium">{mark.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Metadata */}
        <div className="text-sm text-gray-500 text-center">
          <p>Last Updated:</p>
          <p>
            {data.updated_at
              ? new Date(data.updated_at).toLocaleString()
              : "N/A"}
          </p>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => navigate("/dashboard/stress")}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
          >
            Next → Get Stress Analysis
          </button>
        </div>

      </div>
    </div>
  );
}