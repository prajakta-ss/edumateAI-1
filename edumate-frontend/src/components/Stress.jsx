import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Stress() {
  const navigate = useNavigate();

  const questions = [
    " I feel overwhelmed by my academic workload.",
    " I have difficulty concentrating on studies.",
    " I feel nervous before exams.",
    " I feel mentally exhausted after studying.",
    " I feel pressure to achieve high grades.",
    " I struggle to manage my study time.",
    " I feel anxious about my academic future.",
    " Do you feel stressed daily?",
    " Do you have trouble sleeping?",
    " Do you feel physically tired often?",
    " Do you feel difficulty relaxing?",
    " Do you experience headaches due to stress?",
    " Do you feel distracted easily?",
    " Do you feel irritated frequently?",
    " Do you feel emotionally drained?",
    " I feel confident about handling academic challenges.",
    " I feel supported by friends or family.",
    " I feel capable of managing stress effectively.",
    " I feel satisfied with my academic performance.",
    " I feel positive about my studies."
  ];

  const likertScale = [
    { label: "Strongly Disagree", value: 1 },
    { label: "Disagree", value: 2 },
    { label: "Neutral", value: 3 },
    { label: "Agree", value: 4 },
    { label: "Strongly Agree", value: 5 }
  ];

  const yesNoMaybe = [
    { label: "Yes", value: 1 },
    { label: "No", value: 0 },
    { label: "Maybe", value: 2 }
  ];

  const getOptions = (index) => {
    if (index <= 6) return likertScale;
    if (index >= 7 && index <= 14) return yesNoMaybe;
    return likertScale;
  };

  const [answers, setAnswers] = useState(Array(20).fill(""));
  const [current, setCurrent] = useState(0);
  const [result, setResult] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (index, value) => {
    const updated = [...answers];
    updated[index] = Number(value);
    setAnswers(updated);
  };

  const getEmojiFeedback = (index, value) => {
    if (index <= 6) {
      const map = { 1: "😄", 2: "🙂", 3: "😐", 4: "😟", 5: "😫" };
      return map[value]?.repeat(value);
    }

    if (index >= 7 && index <= 14) {
      if (value === 1) return "😫😫😫";
      if (value === 2) return "😐😐";
      if (value === 0) return "😄";
    }

    if (index >= 15) {
      const map = { 1: "😫", 2: "😟", 3: "😐", 4: "🙂", 5: "😄" };
      return map[value]?.repeat(value);
    }

    return null;
  };

  const handleSubmit = async () => {
    if (answers.includes("")) {
      alert("Please answer all questions");
      return;
    }
    const user = JSON.parse(localStorage.getItem("user"));
    const student_id = user?._id;

    if (!student_id) {
      alert("Please login first");
      return;
    }
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/stress/predict",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            student_id: student_id,
            answers: answers 
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
      console.error(data);   
      throw new Error(data.error || "Server error");
    }

      setResult(data.stress_level);
      setAnalysis(data.analysis);

    } catch (err) {
      alert(err.message);
    }

    setLoading(false);
  };

  return (
  <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6">

    {!result ? (
      <div className="max-w-md mx-auto">

        <h1 className="text-2xl font-bold mb-4 text-indigo-600 text-center">
          Stress Analysis
        </h1>

        <div className="w-full bg-gray-200 h-2 rounded mb-4">
          <div
            className="bg-indigo-600 h-2 rounded"
            style={{ width: `${((current + 1) / questions.length) * 100}%` }}
          />
        </div>

        

        <h2 className="text-lg font-semibold mb-4 text-center">
          {questions[current]}
        </h2>

        <div className="flex flex-col gap-3">
          {getOptions(current).map((opt) => (
            <label
              key={opt.value}
              className={`border rounded-lg p-3 cursor-pointer text-center
              ${answers[current] === opt.value ? "bg-indigo-100 border-indigo-500" : ""}`}
            >
              <input
                type="radio"
                className="hidden"
                checked={answers[current] === opt.value}
                onChange={() => handleChange(current, opt.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>

        {answers[current] !== "" && (
          <div className="mt-4 text-3xl text-center">
            {getEmojiFeedback(current, answers[current])}
          </div>
        )}

        <div className="flex justify-between mt-6">
          <button
            disabled={current === 0}
            onClick={() => setCurrent(current - 1)}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            ←
          </button>

          {current < questions.length - 1 ? (
            <button
              onClick={() => {
                if (answers[current] === "") return alert("Select an option");
                setCurrent(current + 1);
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded"
            >
              →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              {loading ? "..." : "Submit"}
            </button>
          )}
        </div>

      </div>
    ) : (

    
      <div className="w-full">

        <h1 className="text-3xl font-bold text-indigo-600 mb-4">
          Stress Analysis Result
        </h1>

        <p className="text-2xl font-semibold text-gray-800 mb-3">
          {result}
        </p>

        <p className="text-gray-700 leading-relaxed text-lg">
          {analysis}
        </p>

        <button
          onClick={() => navigate("/dashboard/studyplan")}
          className="mt-8 bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700"
        >
          Next → Get Study Plan
        </button>

      </div>
    )}

  </div>
);
}