import StatisticPage from "@/pages/StatisticPage.tsx";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import ExtensionPopup from "@/pages/ExtensionPopup";

function App() {
  return (
    <Router>
      <Routes>
        <Route index path="/" element={<ExtensionPopup />} />
        <Route path="/statistic-page" element={<StatisticPage />} />
      </Routes>
    </Router>
  );
}

export default App;
