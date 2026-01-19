import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  // Safety check
  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen w-screen bg-slate-100 flex flex-col">
      
      {/* Header */}
      <header className="  p-4 flex justify-between items-center">
       
        <h1 className="text-indigo-600 text-sm font-semibold text-center tracking-wide">
          Edumate AI Dashboard
        </h1>
        <button
          onClick={() => {
            localStorage.removeItem("user");
            navigate("/login");
          }}
          className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium"
        >
          Logout
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold">
            Welcome, {user.name}
          </h2>
          <p className="text-slate-600 mt-2">
            You are successfully logged in.
          </p>
        </div>
      </main>
    </div>
  );
}
