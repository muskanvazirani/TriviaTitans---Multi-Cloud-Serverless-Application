import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import UserAuthentication from "./pages/UserAuthentication/UserAuthentication";
import InGameExperience from "./pages/InGameExperience/InGameExperience";
import CategoryForm from "./pages/TriviaContentManagement/CreateCategories";
import QuestionForm from "./pages/TriviaContentManagement/CreateQuestion";
import GameForm from "./pages/TriviaContentManagement/CreateGame";
import CategoriesPage from "./pages/TriviaContentManagement/ViewAllCategories";
import UpdateCategoryPage from "./pages/TriviaContentManagement/UpdateCategory";
import GamesPage from "./pages/TriviaContentManagement/ViewAllGames";
import QuestionsPage from "./pages/TriviaContentManagement/ViewAllGameQuestions";
import UpdateGamePage from "./pages/TriviaContentManagement/UpdateGamePage";
import AdminDashboard from "./pages/TriviaContentManagement/AdminDashboard";
import UpdateQuestion from "./pages/TriviaContentManagement/UpdateQuestion";
import ViewAllQuestions from "./pages/TriviaContentManagement/ViewAllQuestions";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<UserAuthentication />} />
            <Route path="/in-game-experience" element={<InGameExperience />} />
            <Route path="/create-category" element={<CategoryForm />} />
            <Route path="/create-question" element={<QuestionForm />} />
            <Route path="/create-game" element={<GameForm />} />
            <Route
              path="/view-questions/:category/:difficultyLevel"
              element={<QuestionsPage />}
            />
            <Route path="/update-game/:gameId" element={<UpdateGamePage />} />
            <Route path="/view-all-categories" element={<CategoriesPage />} />
            <Route path="/view-all-games" element={<GamesPage />} />
            <Route path="/view-all-questions" element={<ViewAllQuestions />} />
            <Route
              path="/update-category/:categoryName"
              element={<UpdateCategoryPage />}
            />
            <Route
              path="update-question/:category/id/:question_id"
              element={<UpdateQuestion />}
            />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
