import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { loginUser } from "../store/authSlice"; // 👈 make sure this path is correct
import InputError from "@/ui_components/InputError";
import SmallSpinner from "@/ui_components/SmallSpinner";
import SmallSpinnerText from "@/ui_components/SmallSpinnerText";


const LoginPage = ({ setIsAuthenticated, setUsername }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { register, handleSubmit, formState } = useForm();
  const { errors } = formState;

  const { loading, error } = useSelector((state) => state.auth); // 👈 grab loading & error from redux

  const onSubmit = async (data) => {
    try{

      const resultAction = await dispatch(loginUser(data))
  
      if (loginUser.fulfilled.match(resultAction)) {
       
  console.log("resultAction:", resultAction);
        setIsAuthenticated(true);
        setUsername(data.username); 
        navigate("/"); // redirect after login
      } else {
        console.error("Login error:", resultAction.payload);
      }
    }catch(error){
       console.error("Unexpected error:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="md:px-16 px-8 py-6 flex flex-col mx-auto my-9 
        items-center gap-4 w-fit rounded-lg bg-[#FFFFFF] shadow-xl 
        dark:text-white dark:bg-[#141624]"
    >
      <div className="flex flex-col gap-2 justify-center items-center mb-2">
        <h3 className="font-semibold text-2xl">Login Form</h3>
        <p>Welcome back! Log in to continue.</p>
      </div>

      {/* Email */}
      <div>
        <Label htmlFor="username" className="dark:text-[97989F]">
          Username
        </Label>
        <Input
          type="text"
          id="username"
          placeholder="Enter username"
          {...register("username", { required: "Username is required" })}
          className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-[300px]"
        />
        {errors?.username?.message && (
          <InputError error={errors.username.message} />
        )}
      </div>

      {/* Password */}
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          id="password"
          placeholder="Enter password"
          {...register("password", { required: "Password is required" })}
          className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px]  w-[300px]"
        />
        {errors?.password?.message && (
          <InputError error={errors.password.message} />
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="text-red-500 text-sm mt-2">
          {error}
        </p>
      )}

      {/* Submit */}
      <div className="w-full flex items-center justify-center flex-col my-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-[#4B6BFB] text-white w-full py-3 px-2 rounded-md flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <SmallSpinner />
              <SmallSpinnerText text="Logging in..." />
            </>
          ) : (
            <SmallSpinnerText text="Sign In" />
          )}
        </button>
        <p className="text-[14px]">
          Don&apos;t have an account? <Link to="/signup">Signup</Link>
        </p>
      </div>
    </form>
  );
};

export default LoginPage;
