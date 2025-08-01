import { useState, useEffect } from "react";
import BlogContainer from "@/ui_components/BlogContainer";
import Header from "@/ui_components/Header";
import PagePagination from "../ui_components/PagePagination";
import { useDispatch, useSelector } from "react-redux"; // ✅ Added Redux hooks
import { getBlogList } from "../store/CRUD"; // ✅ Use your CRUD operations

const HomePage = () => {
  const [page, setPage] = useState(1);
  const numOfBlogsPerPage = 3;
  
  const dispatch = useDispatch();
  const { blogs, loading, error } = useSelector((state) => state.crud); // ✅ Get from Redux

  // ✅ Load blogs on component mount
  useEffect(() => {
    dispatch(getBlogList());
  }, [dispatch]);

  // ✅ Calculate pagination
  const startIndex = (page - 1) * numOfBlogsPerPage;
  const endIndex = startIndex + numOfBlogsPerPage;
  const currentBlogs = blogs.slice(startIndex, endIndex);
  const numOfPages = Math.ceil(blogs.length / numOfBlogsPerPage);

  function handleSetPage(val) {
    setPage(val);
  }

  function increasePageValue() {
    setPage((curr) => curr + 1);
  }

  function decreasePageValue() {
    setPage((curr) => curr - 1);
  }

  return (
    <>
      <Header />
      <BlogContainer isPending={loading} blogs={currentBlogs} />
      <PagePagination
        increasePageValue={increasePageValue}
        decreasePageValue={decreasePageValue}
        page={page}
        numOfPages={numOfPages}
        handleSetPage={handleSetPage}
      />
    </>
  );
};

export default HomePage;