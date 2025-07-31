import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./ui_components/AppLayout";
import HomePage from "./pages/HomePage";
import DetailPage from "./pages/DetailPage";
import SignupPage from "./pages/SignupPage";
import CreatePostPage from "./pages/CreatePostPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./ui_components/ProtectedRoute";
import ProfilePage from "./pages/ProfilePage";
import { useEffect, useState } from "react";
// import { getUsername } from "./services/apiBlog";
// import { useQuery } from "@tanstack/react-query";
import NotFoundPage from "./pages/NotFoundPage";

const App = () => {
  const [username, setUsername] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);





  return (
    <Routes>
      {/* Routes that use shared layout */}
      <Route path="/" element={<AppLayout
        isAuthenticated={isAuthenticated}
        username={username}
        setIsAuthenticated={setIsAuthenticated}
        setUsername={setUsername}
      />
      }>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage setIsAuthenticated={setIsAuthenticated}
          setUsername={setUsername} />} />
        <Route path="signup" element={<SignupPage />} />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreatePostPage isAuthenticated={isAuthenticated}/>
            </ProtectedRoute>
          }
        />
        <Route path="post/:id" element={<DetailPage />} />

        {/* 404 Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default App;