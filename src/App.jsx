import { ThemeProvider } from "@emotion/react";
import { createTheme } from '@mui/material/styles';
import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./GLOBALS.scss";
import MainLayout from "./layouts/MainLayout";
import ProjectLayout from "./layouts/ProjectLayout";
import Assignments from "./pages/assignments/Assignments";
import Authenticate from "./pages/authenticate/Authenticate";
import BackLog from "./pages/backlog/BackLog";
import Board from "./pages/board/Board";
import Branch from "./pages/branch/Branch";
import DashBoard from "./pages/dashboard/DashBoard";
import Home from "./pages/home/Home";
import NotFoundPage from "./pages/notFoundPage/NotFoundPage";
import ProjectDetails from "./pages/projectDetails/ProjectDetails";
import Projects from "./pages/projects/Projects";
import Register from "./pages/register/Register";
import Reports from "./pages/reports/Reports";
import Requests from "./pages/requests/Requests";
import Settings from "./pages/settings/Settings";
import Team from "./pages/team/Team";
import Teams from "./pages/teams/Teams";
import Preferences from "./pages/preferences/Preferences";
import TeamLayout from "./layouts/TeamLayout";
import Defense from "./pages/defense/Defense";
import AssignmentsResult from "./pages/assignmentsResult/AssignmentsResult";
import MakePreferences from "./pages/preferences/MakePreferences"

function App() {
  const [mode , setMode] = useState(localStorage.getItem("mode") || "light");
  const theme = createTheme({
    palette: {
      mode: mode,
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/auth/authenticate" element={<Authenticate />} />
          <Route path="/auth/register" element={<Register />} />
          <Route
            path="/"
            element={<MainLayout mode={mode} setMode={setMode} />}
          >
            <Route index element={<Home />} />
            <Route path="project" element={<ProjectLayout />}>
              <Route index element={<DashBoard />} />
              <Route path="backlog" element={<BackLog />} />
              <Route path="board" element={<Board />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
              <Route path="team/:id" element={<TeamLayout />}>
                <Route index element={<Team />} />
                <Route path="preferences" element={<Preferences />} />
                <Route path="makepreferences" element={<MakePreferences />} />
              </Route>
            </Route>
            {/* this one is for the supervisor */}
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:id" element={<ProjectDetails />} />
            {/* end */}
            {/* for every one */}
            <Route path="assignments" element={<Assignments mode={mode}/>} />
            <Route path="assignments/result" element={<AssignmentsResult mode={mode}/>} />
            <Route path="teams" element={<Teams />} />
            <Route path="branch" element={<Branch />} />
            {/* end */}
            {/* for the head of branch */}
            <Route path="requests" element={<Requests />} />
            <Route path="teams" element={<Teams />} />
            {/* end */}
            {/* for hob ans supervisor */}
            <Route path="defense" element={<Defense />} />
            {/* end */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
