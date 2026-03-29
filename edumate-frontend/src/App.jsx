import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import UploadMarks from "./components/UploadMarks";
import Performance from "./components/Performance";
import Stress from "./components/Stress";
import StudyPlan from "./components/StudyPlan";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        
        
        <Route path="/upload" element={<UploadMarks />} />

      
        <Route path="/performance" element={<Performance />} />
        <Route path="/stress" element={<Stress />} />
        <Route path="/studyplan" element={<StudyPlan />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;