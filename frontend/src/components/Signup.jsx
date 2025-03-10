import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Csscomponents/signup.module.css';
import axios from "axios"


function Signup() {
  const { handleSubmit, register, watch, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const gender = watch("gender"); // track the gender field dynamically

  const onSubmit = async (data) => {
    try {
      console.log(data);

      const response = await axios.post('http://localhost:3000/api/users/register', data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      navigate('/auth/Login')
    } catch (error) {
      console.log(error.response ? error.response.data : error);
    }
  };

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.formGroup}>
            {/* Fullname */}
            <div className={styles.fullname}>
              <label className={styles.label}>Fullname</label>
              <input
                type="text"
                placeholder="Fullname"
                className={styles.input}
                {...register("fullname", { required: "Fullname is required" })}
              />
              {errors.fullname && <p className={styles.errorMessage}>{errors.fullname.message}</p>}
            </div>

            {/* Username */}
            <div className={styles.username}>
              <label className={styles.label}>Username</label>
              <input
                type="text"
                placeholder="Username"
                className={styles.input}
                {...register("username", { required: "Username is required" })}
              />
              {errors.username && <p className={styles.errorMessage}>{errors.username.message}</p>}
            </div>
            <div className={styles.email}>
              <label className={styles.label}>Email</label>
              <input
                type="text"
                placeholder="Email"
                className={styles.input}
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && <p className={styles.errorMessage}>{errors.username.message}</p>}
            </div>

            {/* Password */}
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

            {/* Confirm Password */}
            <div className={styles.confirmpassword}>
              <label className={styles.label}>Confirm Password</label>
              <input
                type="text"
                placeholder="Confirm Password"
                className={styles.input}
                {...register("confirmpassword", {
                  validate: value => value === watch("password") || "Confirm Password not matched"
                })}
              />
              {errors.confirmpassword && <p className={styles.errorMessage}>{errors.confirmpassword.message}</p>}
            </div>

            {/* Gender */}
            <div className={styles.gender}>
              <label className={styles.label}>Gender</label>
              <label>
                <input
                  type="radio"
                  value="male"
                  className={styles.genderInput}
                  {...register("gender", { required: "Gender is required" })}
                />
                <span className={styles.genderCustom}>Male</span>
              </label>
              <label>
                <input
                  type="radio"
                  value="female"
                  className={styles.genderInput}
                  {...register("gender", { required: "Gender is required" })}
                />
                <span className={styles.genderCustom}>Female</span>
              </label>
            </div>
            {errors.gender && <p className={styles.errorMessage}>{errors.gender.message}</p>}

            {/* Submit Button */}
            <div className={styles.signup}>
              <button type="submit" className={styles.btn}>SignUp</button>
            </div>
          </form>
          <p className={styles.login}>
            Already have an account? <Link to="/auth/Login">Login</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Signup;
