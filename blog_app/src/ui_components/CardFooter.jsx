import { Link } from "react-router-dom";

const BASE_URL = String(import.meta.env.VITE_BASE_URL)
 // ✅ Added BASE_URL

function FormatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString('en-GB', {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
        // hour: '2-digit',
        // minute: '2-digit',
        // second: '2-digit',
        // hour12: true
    }).replace(',', '');
}

const CardFooter = ({ blog }) => {
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

          <small className="text-[#97989F] text-[12px] font-semibold">
            {blog.author.first_name} {blog.author.last_name}
          </small>
        </span>

        <small className="text-[#97989F] text-[12px] font-semibold ml-3">
          {FormatDate(blog.published_date)}
        </small>
      </div>
    </Link>
  );
};

export default CardFooter;