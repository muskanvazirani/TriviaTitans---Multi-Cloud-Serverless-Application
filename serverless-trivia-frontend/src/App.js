import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import UserAuthentication from "./pages/UserAuthentication/UserAuthentication";
import InGameExperience from "./pages/InGameExperience/InGameExperience";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={ <UserAuthentication /> } />
            <Route path="/in-game-experience" element={ <InGameExperience /> } />
          </Routes>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
