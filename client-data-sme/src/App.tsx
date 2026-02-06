import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { SearchPage } from "./pages/SearchPage";
import { ExportPage } from "./pages/ExportPage";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/export" element={<ExportPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
