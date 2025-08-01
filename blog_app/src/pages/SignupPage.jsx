import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import InputError from "@/ui_components/InputError";

import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../store/authSlice";

const SignupPage = ({ userInfo, updateForm, toggleModal, onSubmit, customTitle }) => {
  console.log(userInfo);

  const { register, handleSubmit, formState, reset, watch } = useForm({ 
    defaultValues: userInfo ? userInfo : {} 
  });
  const { errors } = formState;

  const { loading, error } = useSelector((state) => state.auth);
  const password = watch("password");
  const dispatch = useDispatch();

  // 🔧 Fixed submit handler
  const handleFormSubmit = async (data) => {
    try {
      if (updateForm && onSubmit) {
        // Profile update mode - use custom onSubmit
        await onSubmit(data);
      } else {
        // Registration mode - use registerUser
        const resultAction = await dispatch(registerUser(data));
        if (registerUser.fulfilled.match(resultAction)) {
          console.log("User created successfully");
          reset();
        } else {
          console.error("Registration error", resultAction.payload);
        }
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  return (
    <form
      className={`${updateForm && "h-[90%] overflow-auto"} md:px-16 px-8 py-6 flex flex-col mx-auto my-9 items-center gap-4 w-fit rounded-lg bg-[#FFFFFF] shadow-xl dark:text-white dark:bg-[#141624]`}
      onSubmit={handleSubmit(handleFormSubmit)} // 🔧 Use the fixed handler
    >
      <div className="flex flex-col gap-2 justify-center items-center mb-2">
        <h3 className="font-semibold text-2xl">
          {customTitle || (updateForm ? "Update Profile Form" : "SignUp Form")}
        </h3>
        <p>
          {updateForm
            ? "You can tell us more about you."
            : "Create your account to get started!"}
        </p>
      </div>

      {/* 🔧 Show Redux errors */}
      {error && (
        <div className="w-full max-w-[300px]">
          <InputError error={error} />
        </div>
      )}

      {/* Username Field - Disable in update mode */}
      <div>
        <Label htmlFor="username" className="dark:text-[97989F]">
          Username
        </Label>
        <Input
          type="text"
          id="username"
          placeholder="Enter username"
          disabled={updateForm} // 🔧 Disable username editing in update mode
          {...register("username", {
            required: !updateForm ? "Username is required" : false,
            minLength: {
              value: 3,
              message: "Username must be at least 3 characters",
            },
          })}
          className={`border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-[300px] ${updateForm ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : ''}`}
        />
        {errors?.username?.message && (
          <InputError error={errors.username.message} />
        )}
      </div>

      {/* First Name */}
      <div>
        <Label htmlFor="first_name">First Name</Label>
        <Input
          type="text"
          id="first_name"
          placeholder="Enter first name"
          {...register("first_name", {
            required: "First name is required",
            minLength: {
              value: 2, // 🔧 Reduced from 3 to 2 for names
              message: "First name must be at least 2 characters",
            },
          })}
          className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-[300px]"
        />
        {errors?.first_name?.message && (
          <InputError error={errors.first_name.message} />
        )}
      </div>

      {/* Last Name */}
      <div>
        <Label htmlFor="last_name">Last Name</Label>
        <Input
          type="text"
          id="last_name"
          placeholder="Enter last name"
          {...register("last_name", {
            required: "Last name is required",
            minLength: {
              value: 2, // 🔧 Reduced from 3 to 2 for names
              message: "Last name must be at least 2 characters",
            },
          })}
          className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-[300px]"
        />
        {errors?.last_name?.message && (
          <InputError error={errors.last_name.message} />
        )}
      </div>

    
    

      {/* Bio - Only in update mode */}
      {updateForm && (
        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            placeholder="Tell us more about you"
            {...register("bio", {
              required: false, // 🔧 Made optional
              minLength: {
                value: 10,
                message: "Bio must be at least 10 characters",
              },
            })}
            className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[180px] w-[300px] text-justify"
          />
          {errors?.bio?.message && (
            <InputError error={errors.bio.message} />
          )}
        </div>
      )}

      {/* Social Media Links - Only in update mode */}
      {updateForm && (
        <>
          <div>
            <Label htmlFor="facebook">Facebook URL</Label>
            <Input
              type="url"
              id="facebook"
              placeholder="https://facebook.com/yourprofile"
              {...register("facebook")}
              className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-[300px]"
            />
          </div>

          <div>
            <Label htmlFor="instagram">Instagram URL</Label>
            <Input
              type="url"
              id="instagram"
              placeholder="https://instagram.com/yourprofile"
              {...register("instagram")}
              className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-[300px]"
            />
          </div>

          <div>
            <Label htmlFor="youtube">YouTube URL</Label>
            <Input
              type="url"
              id="youtube"
              placeholder="https://youtube.com/yourchannel"
              {...register("youtube")}
              className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-[300px]"
            />
          </div>
        </>
      )}

      {/* Profile Picture - Only in update mode */}
      {updateForm && (
        <div className="w-full">
          <Label htmlFor="profile_picture">Profile Picture</Label>
          <Input
            type="file"
            id="profile_picture"
            accept="image/*" // 🔧 Only accept images
            {...register("profile_picture", {
              required: false,
            })}
            className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-full max-sm:w-[300px] max-sm:text-[14px]"
          />
        </div>
      )}

      {/* Password Fields - Only in signup mode */}
      {!updateForm && (
        <>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              placeholder="Enter password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-[300px]"
            />
            {errors?.password?.message && (
              <InputError error={errors.password.message} />
            )}
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              type="password"
              id="confirmPassword"
              placeholder="Confirm password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) => value === password || "Passwords do not match",
              })}
              className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-[300px]"
            />
            {errors?.confirmPassword?.message && (
              <InputError error={errors.confirmPassword.message} />
            )}
          </div>
        </>
      )}

      {/* Submit Button */}
      <div className="w-full flex items-center justify-center flex-col my-4">
        <button
          type="submit"
          disabled={loading}
          className={`bg-[#4B6BFB] text-white w-full py-3 px-2 rounded-md flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              {updateForm ? "Updating..." : "Signing up..."}
            </>
          ) : (
            updateForm ? "Update Profile" : "Sign Up"
          )}
        </button>

        {/* Cancel button for update mode */}
        {updateForm && toggleModal && (
          <button
            type="button"
            onClick={toggleModal}
            className="mt-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Cancel
          </button>
        )}

        {/* Sign in link for signup mode */}
        {!updateForm && (
          <p className="text-[14px] mt-2">
            Already have an account? <Link to="/login" className="text-[#4B6BFB] hover:underline">Sign In</Link>
          </p>
        )}
      </div>
    </form>
  );
};

export default SignupPage;