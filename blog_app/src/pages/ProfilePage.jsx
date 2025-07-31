import BlogContainer from "@/ui_components/BlogContainer";
import Hero from "@/ui_components/Hero";
import Spinner from "@/ui_components/Spinner";
import Modal from "@/ui_components/Modal";
import SignupPage from "./SignupPage";
import { useState, useEffect } from "react"; 
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserByUsername, updateUserProfile } from "../store/authSlice";

const ProfilePage = ({ authUsername }) => {
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const { username } = useParams();
  
  const { viewedProfile, loading, error, user } = useSelector((state) => state.auth);

  // Determine if this is the current user's profile
  const isOwnProfile = authUsername === username;

  useEffect(() => {
    if (username) {
      dispatch(fetchUserByUsername(username));
    }
  }, [dispatch, username]);

  const toggleModal = () => {
    setShowModal(curr => !curr);
  };

  const handleUpdateProfile = async (profileData) => {
    try {
      const resultAction = await dispatch(updateUserProfile(profileData));
      if (updateUserProfile.fulfilled.match(resultAction)) {
        console.log("Profile updated successfully!");
        toggleModal(); // Close modal on success
        // Optionally show success message
      } else {
        console.error("Profile update error:", resultAction.payload);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  if (loading && !viewedProfile) {
    return <Spinner />;
  }

  if (error && !viewedProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            User Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            The user "{username}" could not be found.
          </p>
        </div>
      </div>
    );
  }

  const profileData = viewedProfile;
  const blogs = profileData?.author_posts || [];

  return (
    <>
      <Hero 
        userInfo={profileData} 
        authUsername={authUsername} 
        toggleModal={toggleModal}
        isOwnProfile={isOwnProfile}
      />
      
      <BlogContainer 
        blogs={blogs} 
        title={`🍔 ${username}'s Posts`} 
      />

      {showModal && isOwnProfile && (
        <Modal toggleModal={toggleModal}>
          <SignupPage 
            userInfo={profileData} 
            updateForm={true} 
            toggleModal={toggleModal}
            onSubmit={handleUpdateProfile}
          />
        </Modal>
      )}

      {/* Error Display */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      )}
    </>
  );
};

export default ProfilePage;