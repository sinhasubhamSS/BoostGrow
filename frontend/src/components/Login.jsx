import React from 'react';
import { useForm } from "react-hook-form";
import { Link, useNavigate } from 'react-router-dom';
import styles from "./Csscomponents/login.module.css";
import { useDispatch } from "react-redux";
import { setloggedinuser, loginUser, fetchUsers } from "../Redux/userSlice"
import toast from "react-hot-toast"
import { myprofile } from '../Redux/friendSlice';


function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { handleSubmit, register, formState: { errors } } = useForm();
  const onSubmit = async (data) => {
    const result = await dispatch(loginUser(data));
    console.log("Full Login API Response:", result.payload);;
    if (result.payload?.success) {
      toast.success("user logged in successfully!");
      dispatch(setloggedinuser(result.payload.user))
      dispatch(fetchUsers())

      dispatch(myprofile(result.payload.user._id));
      navigate("/")
    } else {
      toast.error(result.payload?.message || "Something went wrong!");;
    }
  }

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.username}>
              <label className={styles.label}>Email</label>
              <input
                type="text"
                placeholder="Email"
                className={styles.input}
                {...register("email", { required: "email is required" })}
              />
              {errors.email && <p className={styles.errorMessage}>{errors.email.message}</p>}
            </div>

            <div className={styles.password}>
              <label className={styles.label}>Password</label>
              <input
                type="password"
                placeholder="Password"
                className={styles.input}
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && <p className={styles.errorMessage}>{errors.password.message}</p>}
            </div>

            <div className={styles.login}>
              <button type="submit" className={styles.loginBtn}>LogIn</button>
            </div>
          </form>

          <p className={styles.signup}>
            Don't have an account?{" "}
            <Link to="/auth/Signup" className={styles.signupLink}>Signup</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;
