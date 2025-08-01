import { Link } from "react-router-dom";
const BASE_URL = String(import.meta.env.VITE_BASE_URL)

 // ✅ Added BASE_URL

// ✅ Simple date formatter
const FormatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

const BlogWriter = ({ blog }) => {
  return (
    <Link to={`/profile/${blog.author.username}`}>
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-2">
          <div className="w-[40px] h-[40px] rounded-full overflow-hidden">
            <img
              src={`${BASE_URL}${blog.author.profile_picture}`}
              className="rounded-full w-full h-full object-cover"
              alt={`${blog.author.first_name}'s profile`}
            />
          </div>

          <small className="text-[#696A75] text-[14px]">
            {blog.author.first_name} {blog.author.last_name}
          </small>
        </span>

        <small className="text-[#696A75] text-[14px] ml-3">
          {FormatDate(blog.published_date)}
        </small>
      </div>
    </Link>
  );
};

export default BlogWriter;