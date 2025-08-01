import pic from "../images/pic.jpg";
import { FaInstagram } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import { FaYoutube } from "react-icons/fa";
import { HiPencilAlt } from "react-icons/hi";

// 🔧 Add BASE_URL - adjust this to match your setup
const BASE_URL = String(import.meta.env.VITE_BASE_URL)


const Hero = ({ userInfo, authUsername, toggleModal, isOwnProfile }) => {
  // 🔧 Function to get profile image URL
  const getProfileImageUrl = () => {
    if (!userInfo?.profile_picture) {
      return pic; // Default image
    }
    
    // If it's already a full URL, use it
    if (userInfo.profile_picture.startsWith('http')) {
      return userInfo.profile_picture;
    }
    
    // Otherwise, prepend BASE_URL
    return `${BASE_URL}${userInfo.profile_picture}`;
  };

  // 🔧 Function to check if social link exists and format it
  const getSocialLink = (url) => {
    if (!url) return null;
    
    // If URL doesn't start with http, add https://
    if (!url.startsWith('http')) {
      return `https://${url}`;
    }
    
    return url;
  };

  return (
    <div className="padding-x py-9 max-container flex flex-col items-center justify-center gap-4 bg-[#F6F6F7] dark:bg-[#242535] rounded-md">
      <div className="flex gap-4">
        {/* Profile Picture */}
        <div className="w-[70px] h-[70px] rounded-full overflow-hidden">
          <img
            src={getProfileImageUrl()}
            alt={`${userInfo?.first_name || 'User'}'s profile`}
            className="w-[70px] h-[70px] rounded-full object-cover"
            onError={(e) => {
              e.target.src = pic; // Fallback to default image on error
            }}
          />
        </div>

        {/* User Info */}
        <span>
          <p className="text-[18px] text-[#181A2A] dark:text-white">
            {userInfo?.first_name} {userInfo?.last_name}
          </p>
          <p className="text-[14px] text-[#696A75] font-thin dark:text-[#BABABF]">
            {userInfo?.job_title || "Writer & Editor"}
          </p>
        </span>

        {/* Edit Button - Only show for own profile */}
        {isOwnProfile && (
          <span>
            <HiPencilAlt
              className="dark:text-white text-2xl cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              onClick={toggleModal}
              title="Edit Profile"
            />
          </span>
        )}
      </div>

      {/* Bio */}
      {userInfo?.bio && (
        <p className="text-[#3B3C4A] text-[16px] max-md:leading-[2rem] lg:leading-normal lg:mx-[200px] text-center dark:text-[#BABABF]">
          {userInfo.bio}
        </p>
      )}

      {/* Social Media Links */}
      <div className="flex gap-4 justify-center items-center text-white text-xl">
        {/* Instagram */}
        {getSocialLink(userInfo?.instagram) ? (
          <a
            href={getSocialLink(userInfo.instagram)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-[40px] h-[40px] rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex justify-center items-center hover:scale-110 transition-transform"
            title="Instagram"
          >
            <FaInstagram />
          </a>
        ) : (
          <div className="w-[40px] h-[40px] rounded-lg bg-[#696A75] flex justify-center items-center opacity-50">
            <FaInstagram />
          </div>
        )}

        {/* Facebook */}
        {getSocialLink(userInfo?.facebook) ? (
          <a
            href={getSocialLink(userInfo.facebook)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-[40px] h-[40px] rounded-lg bg-blue-600 flex justify-center items-center hover:scale-110 transition-transform"
            title="Facebook"
          >
            <FaFacebookF />
          </a>
        ) : (
          <div className="w-[40px] h-[40px] rounded-lg bg-[#696A75] flex justify-center items-center opacity-50">
            <FaFacebookF />
          </div>
        )}

        {/* Twitter/X */}
        <div className="w-[40px] h-[40px] rounded-lg bg-[#696A75] flex justify-center items-center opacity-50">
          <BsTwitterX />
        </div>

        {/* YouTube */}
        {getSocialLink(userInfo?.youtube) ? (
          <a
            href={getSocialLink(userInfo.youtube)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-[40px] h-[40px] rounded-lg bg-red-600 flex justify-center items-center hover:scale-110 transition-transform"
            title="YouTube"
          >
            <FaYoutube />
          </a>
        ) : (
          <div className="w-[40px] h-[40px] rounded-lg bg-[#696A75] flex justify-center items-center opacity-50">
            <FaYoutube />
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;