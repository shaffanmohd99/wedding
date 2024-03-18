import Button from "@/components/reuseable/Button";
import LoadingButton from "@/components/reuseable/LoadingButton";
import Typography from "@/components/reuseable/Typography";
import { useRouter } from "next/router";
import { useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "react-query";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { login } from "../../api-call/auth";
import axios from "@/lib/axios";


export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [errorPassword, setErrorPassword] = useState("");
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const schema = yup.object().shape({
    password: yup
      .string()
      .required("Please enter a password")
      .min(6, "Password must be at least 6 characters"),
    email: yup
      .string()
      .email("Please enter a valid email address")
      .required("Please enter an email address"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { mutate, isLoading } = useMutation(
    (data) => axios.post(`/auth/login`, data),
    {
      onSuccess: (response) => {
        setErrorPassword("");
        router.push({
          pathname: "/meowmeow",
          // query: { page: 1, row: 10 },
        });
      },
      onError: (error) => {
        console.log(error);
        setErrorPassword("Wrong username or password");
      },
    }
  );
  const onSubmit = (data) => {
    mutate(data);
  };
  return (
    <div className="flex justify-center items-center h-screen  bg-[#faf7f2] ">
      <div className="relative w-full flex justify-center  ">
        <div className="w-[500px] bg-[#bc8c53] flex  flex-col gap-4 px-4 sm:px-6 lg:px-8 py-8 rounded-lg">
          <div>
            <Typography
              variant="body"
              className="font-semibold text-white mb-6"
            >
              Login
            </Typography>
            <Typography variant="body" className=" text-white">
              Email
            </Typography>
            <input
              {...register("email")}
              //   placeholder="E.g The date of making Will/Wasiat is not stated"
              className="px-2 py-1  border border-[#bc8c53] w-full rounded  appearance-none outline-none "
            />
            <Typography className="text-[#FF0000]" variant="sub">
              {errors.email?.message}
            </Typography>
          </div>
          <div>
            <Typography variant="body" className=" text-white">
              Password
            </Typography>
            <div className="relative">
              <input
                {...register("password")}
                //   placeholder="E.g The date of making Will/Wasiat is not stated"
                className="px-2 py-1  border border-[#bc8c53] w-full rounded  appearance-none outline-none "
                type={showPassword ? "text" : "password"}
              />
              <div
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>

            <Typography className="text-[#FF0000]" variant="sub">
              {errorPassword || errors.password?.message}
            </Typography>
          </div>
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="outlined"
            width=""
            styles=" flex justify-center items-center"
          >
            {isLoading ? <LoadingButton /> : "Submit"}
          </Button>
        </div>
      </div>
    </div>
  );
}
