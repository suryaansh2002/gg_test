import './App.css';
import { Routes, Route } from "react-router-dom";
import Landing from './Pages/Landing';
import Analytics from './Pages/Analytics';
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>

    </div>
  );
}

export default App;
