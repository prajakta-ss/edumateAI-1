import { BrowserRouter, Routes, Route } from "react-router-dom";
import EdumateHomepage from './components/EdumateHomepage';
import Login from './components/Login'
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EdumateHomepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard/*" element={ <ProtectedRoute><Dashboard /></ProtectedRoute> }/>
       
  

      </Routes>
    </BrowserRouter>
  );
}
