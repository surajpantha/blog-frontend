import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import InputError from "@/ui_components/InputError";
import { useNavigate } from "react-router-dom";
import SmallSpinner from "@/ui_components/SmallSpinner";
import SmallSpinnerText from "@/ui_components/SmallSpinnerText";
import LoginPage from "./LoginPage";
import { useDispatch, useSelector } from "react-redux";
import { createPost, updateBlog } from "../store/CRUD"; // ✅ Use your CRUD operations

const CreatePostPage = ({ blog, isAuthenticated ,toggleModal}) => {
  const { register, handleSubmit, formState, setValue, watch } = useForm({
    defaultValues: blog ? blog : {},
  });
  const { errors } = formState;
  const navigate = useNavigate();
  const dispatch = useDispatch(); // ✅ Added dispatch
  const { loading, error } = useSelector((state) => state.crud); // ✅ Get from Redux store

  // ✅ Add onSubmit function
  const onSubmit = async (data) => {
    try {
      if (blog) {


        // Update existing blog


       const result= await dispatch(updateBlog({ id: blog.id, postData: data }));
    if(updateBlog.fulfilled.match(result)) {
        console.log("Blog updated successfully:", result);
        toggleModal(); // Close the modal after updating
         navigate(`/post/${blog.id}`);
        // Optionally, you can show a success message or redirect
      } else if (updateBlog.rejected.match(result)) {
        console.error("Failed to update blog:", result.payload);
      }

        
       


      } else {
        // Create new blog
        await dispatch(createPost(data));
        navigate("/");
      }
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };
  const watchedValues = watch();
  console.log("🔍 Form values:", watchedValues);
  // const blogID = blog?.id;

  if (isAuthenticated === false) {
    return <LoginPage />;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`${blog && "h-[90%] overflow-auto"
        }  md:px-16 px-8 py-6 flex flex-col mx-auto my-9 items-center gap-6 w-fit rounded-lg bg-[#FFFFFF] shadow-xl dark:text-white dark:bg-[#141624]`}
    >

      <div className="flex flex-col gap-2 justify-center items-center mb-2">
        <h3 className="font-semibold text-2xl max-sm:text-xl">
          {blog ? "Update Post" : "Create Post"}
        </h3>

        <p className="max-sm:text-[14px]">
          {blog
            ? "Do you want to update your post?"
            : "Create a new post and share your ideas."}
        </p>
      </div>

      <div>
        <Label htmlFor="title" className="dark:text-[97989F]">
          Title
        </Label>
        <Input
          type="text"
          id="title"
          {...register("title", {
            required: "Blog's title is required",
            minLength: {
              value: 3,
              message: "The title must be at least 3 characters",
            },
          })}
          placeholder="Give your post a title"
          className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-[400px] max-sm:w-[300px] max-sm:text-[14px]"
        />

        {errors?.title?.message && <InputError error={errors.title.message} />}
      </div>

      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          placeholder="Write your blog post"
          {...register("content", {
            required: "Blog's content is required",
            minLength: {
              value: 10,
              message: "The content must be at least 10 characters",
            },
          })}
          className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[180px]  w-[400px] text-justify max-sm:w-[300px] max-sm:text-[14px]"
        />
        {errors?.content?.message && (
          <InputError error={errors.content.message} />
        )}
      </div>

      <div className="w-full">
        <Label htmlFor="category">Category</Label>

        <Select
          {...register("category", { required: "Blog's category is required" })}
          onValueChange={(value) => setValue("category", value)}
          defaultValue={blog ? blog.category : ""}
        >
          <SelectTrigger className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-full max-sm:w-[300px] max-sm:text-[14px]">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Categories</SelectLabel>
              <SelectItem value="Frontend">Frontend</SelectItem>
              <SelectItem value="Backend">Backend</SelectItem>
              <SelectItem value="Fullstack">Fullstack</SelectItem>
              <SelectItem value="Web3">Web3</SelectItem>
              <SelectItem value="Design">Design</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {errors?.category?.message && (
          <InputError error={errors.category.message} />
        )}
      </div>

      <div className="w-full">
        <Label htmlFor="featured_image">Featured Image</Label>
        <Input
          type="file"
          id="featured_image"
          {...register("featured_image", {
            required: blog ? false : "Blog's featured image is required",
          })}
          className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-full max-sm:w-[300px] max-sm:text-[14px]"
        />

        {errors?.featured_image?.message && (
          <InputError error={errors.featured_image.message} />
        )}
      </div>

      <div className="w-full flex items-center justify-center flex-col my-4">
        <button
          disabled={loading}
          type='submit'
          className="bg-[#4B6BFB] text-white w-full py-3 px-2 rounded-md flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <SmallSpinner />
              <SmallSpinnerText text={blog ? "Updating post..." : "Creating post..."} />
            </>
          ) : (
            <SmallSpinnerText text={blog ? "Update post" : "Create post"} />
          )}
        </button>
      </div>
    </form>
  );
};

export default CreatePostPage;