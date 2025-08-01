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
import { loginUser, setUserAuthenticated } from "./store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "./store/authSlice";
const App = () => {
  const [username, setUsername] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dispatch =useDispatch()
  
useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      dispatch(fetchUser())
        .unwrap()
        .then((data) => {
          setUsername(data.username);
          setIsAuthenticated(true);
        })
        .catch(() => {
          setUsername(null);
          setIsAuthenticated(false);
          localStorage.removeItem("accessToken");
        });
    }
  }, []);

  



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
        <Route path="login" element={<LoginPage 
         
          setIsAuthenticated={setIsAuthenticated}
       
          setUsername={setUsername} />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="profile/:username" element={<ProfilePage authUsername={username} />} />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreatePostPage isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
            </ProtectedRoute>
          }
        />
        <Route path="post/:id" element={<DetailPage isAuthenticated={isAuthenticated} username={username} />} />

        {/* 404 Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default App;