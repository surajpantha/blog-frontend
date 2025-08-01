import Badge from "@/ui_components/Badge";
import BlogWriter from "@/ui_components/BlogWriter";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "@/ui_components/Spinner";
import { HiPencilAlt } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import Modal from "@/ui_components/Modal";
import CreatePostPage from "./CreatePostPage";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"; // ✅ Added Redux hooks
import { getBlogList, deleteBlog } from "../store/CRUD"; // ✅ Use your CRUD operations

const BASE_URL = String(import.meta.env.VITE_BASE_URL)
 // ✅ Added BASE_URL

const DetailPage = ({ username, isAuthenticated }) => {
  const { id } = useParams(); // ✅ Get id from params
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // ✅ Get data from Redux store
  const { blogs, loading, error } = useSelector((state) => state.crud);
  
  // ✅ Find the specific blog
  const blog = blogs.find(b => b.id === parseInt(id));

  // ✅ Load blogs if not already loaded
  useEffect(() => {
    if (blogs.length === 0) {
      dispatch(getBlogList());
    }
  }, [dispatch, blogs.length,id]);

  function toggleModal() {
    setShowModal(curr => !curr);
  }

  // ✅ Fixed delete function
  const handleDeleteBlog = async () => {
    const popUp = window.confirm("Are you sure you want to delete this post?");
    if (!popUp) return;

    try {
      await dispatch(deleteBlog(blog.id));
      navigate("/");
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  if (loading && !blog) {
    return <Spinner />;
  }

  if (!blog) {
    return (
      <div className="padding-dx max-container py-9">
        <p>Blog post not found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="padding-dx max-container py-9">
        <Badge blog={blog} />
        <div className="flex justify-between items-center gap-4">
          <h2 className="py-6 leading-normal text-2xl md:text-3xl text-[#181A2A] tracking-wide font-semibold dark:text-[#FFFFFF]">
            {blog.title}
          </h2>
{/* <h3>{`${BASE_URL}${blog.featured_image}`}</h3> */}
          {isAuthenticated && username === blog.author.username && (
            <span className="flex justify-between items-center gap-2">
              <HiPencilAlt onClick={toggleModal} className="dark:text-white text-3xl cursor-pointer" />
              <MdDelete onClick={handleDeleteBlog} className="dark:text-white text-3xl cursor-pointer" />
            </span>
          )}
        </div>

        <BlogWriter blog={blog} />

        <div className="w-full h-[350px] my-9 overflow-hidden rounded-sm">
          <img
            className="w-full h-full object-cover rounded-sm"
            src={`${BASE_URL}${blog.featured_image}`}
            alt={blog.title}
          />
        </div>
        <p className="text-[16px] leading-[2rem] text-justify text-[#3B3C4A] dark:text-[#BABABF]">
          {blog.content}
        </p>
      </div>

      {showModal && (
        <Modal toggleModal={toggleModal}>
          <CreatePostPage blog={blog} toggleModal={toggleModal} />
        </Modal>
      )}
    </>
  );
};

export default DetailPage;