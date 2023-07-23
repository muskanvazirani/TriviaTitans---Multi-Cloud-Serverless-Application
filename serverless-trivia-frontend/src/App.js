import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import UserAuthentication from "./pages/UserAuthentication/UserAuthentication";
import InGameExperience from "./pages/InGameExperience/InGameExperience";
import CreateTeam from "./pages/TeamManagement/CreateTeam";
import InviteUser from "./pages/TeamManagement/InviteUser";
import TeamActionForm from "./pages/TeamManagement/TeamAction";
import TeamStats from "./pages/TeamManagement/TeamStats";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={ <UserAuthentication /> } />
            <Route path="/in-game-experience" element={ <InGameExperience /> } />
            <Route path="/createTeam" element={<CreateTeam />} />
            <Route path="/teamAction" element={<TeamActionForm />} />
            <Route path="/teamStats" element={<TeamStats />} />
            <Route path="/inviteUser" element={<InviteUser />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
