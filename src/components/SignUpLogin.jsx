import React, { useState } from "react";
import { FiMail, FiLock, FiUserCheck, FiLoader } from "react-icons/fi"; // Added FiLoader for the spinner
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Axios for making HTTP requests
import backgroundImg from "../assets/is01.jpg"; // Adjust this image path as needed
import { toast, ToastContainer } from "react-toastify"; // Import toastify
import "react-toastify/dist/ReactToastify.css"; // Import styles

const SignUpLogin = () => {
  const [isSignUp, setIsSignUp] = useState(true); // Toggle between sign-up and login
  const [formData, setFormData] = useState({
    email: "",
    firstname: "",
    lastname: "",
    position: "",
    gender: "",
    dob: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // Loading state for async calls
  const [isSubmitted, setIsSubmitted] = useState(false); // Disable button after submission

  const facultyPositions = [
    "Professor",
    "Associate Professor",
    "Assistant Professor",
    "Lecturer",
    "Students",
    "Other",
  ];

  const navigate = useNavigate(); // Hook for navigation after success

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (isSignUp) {
      if (!formData.firstname) newErrors.firstname = "First name is required";
      if (!formData.lastname) newErrors.lastname = "Last name is required";
      if (!formData.position)
        newErrors.position = "Faculty position is required";
      if (!formData.gender) newErrors.gender = "Gender is required";
      if (!formData.dob) newErrors.dob = "Date of birth is required";
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Show error toast if form validation fails
    if (!validateForm()) {
      toast.error("Please fill in all fields correctly.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeButton: true,
        icon: "❌",
      });
      return; // Stop here if form validation fails
    }

    setLoading(true);

    try {
      let response;

      // Trigger success toast before calling API (indicating that the form data is valid)
      if (isSignUp) {
        // Sign-Up API call
        response = await axios.post("http://localhost:5000/api/signup", {
          email: formData.email,
          firstname: formData.firstname,
          lastname: formData.lastname,
          position: formData.position,
          gender: formData.gender,
          dob: formData.dob,
          password: formData.password,
          cpassword: formData.confirmPassword,
        });

        const token = response.data.token;

        const userId = response.data.user._id;
            localStorage.setItem("authToken", token);
            localStorage.setItem("userId", userId);
        // localStorage.setItem("authToken", token);
        // localStorage.setItem("userId", userId);
        toast.success("Account created successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeButton: true,
          icon: "✅",
        });

        // Wait for the toast to show, then navigate
        setTimeout(() => {
          navigate("/main"); // Redirect after successful sign-up
        }, 3000); // Delay to ensure the user sees the success toast
      } else {
        // Login API call
        response = await axios.post("http://localhost:5000/api/login", {
          email: formData.email,
          password: formData.password,
        });

        const token = response.data.token;

    const userId = response.data.user._id;
        localStorage.setItem("authToken", token);
        localStorage.setItem("userId", userId);

        console.log("login",userId)

        toast.success("Login successful!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeButton: true,
          icon: "✅",
        });

        // Wait for the toast to show, then navigate
        setTimeout(() => {
          navigate("/main"); // Redirect after successful login
        }, 3000); // Delay to ensure the user sees the success toast
      }

      // Set submitted state to true after successful API call to disable the button
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error);
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeButton: true,
          icon: "❌",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F4F9FD] p-4 md:p-0">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row w-full md:w-8/12 bg-white rounded-xl mx-auto shadow-[0px_12px_30px_4px_rgba(0,0,0,0.5)] overflow-hidden">
          {/* Left side (Image Section) */}
          <div
            className="w-full md:w-1/2 flex flex-col items-center p-8 md:p-12 bg-no-repeat bg-center bg-cover"
            style={{ backgroundImage: `url(${backgroundImg})` }}
          >
            <h1 className="text-white text-3xl md:text-3xl font-bold mt-5 text-center">
              Welcome to IntraChat
            </h1>
            {/* Removed the paragraph on smaller screens */}
            <p className="text-white text-sm font-light text-center md:max-w-xs mx-auto hidden md:block">
              Enhance communication within your department at Islamia College
              University. Connect securely and collaborate seamlessly with
              Intrachat. Start now!
            </p>
          </div>

          {/* Right side (Form Section) */}
          <div className="w-full md:w-1/2 py-8 md:py-16 px-8 md:px-12 bg-[#F7F4FF]">
            <h2 className="text-2xl font-bold text-center mb-6">
              {isSignUp ? "Sign Up" : "Login"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-5 flex items-center border border-gray-400 p-2 rounded w-full">
                <input
                  type="text"
                  name="email"
                  placeholder="Email"
                  className="w-full outline-none  bg-[#F7F4FF]"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <FiMail className="ml-2" />
                {errors.email && <p className="text-red-600">{errors.email}</p>}
              </div>

              {/* Password Section */}
              {!isSignUp && (
                <div className="mb-5 flex items-center border border-gray-400 p-2 rounded w-full">
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="w-full outline-none  bg-[#F7F4FF]"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <FiLock className="ml-2" />
                  {errors.password && (
                    <p className="text-red-600">{errors.password}</p>
                  )}
                </div>
              )}

              {/* Sign-Up Fields */}
              {isSignUp && (
                <>
                  <div className="flex mb-5 space-x-4 w-full">
                    <div className="flex-1">
                      <div className="flex items-center border border-gray-400  p-2 rounded-md">
                        <input
                          type="text"
                          name="firstname"
                          placeholder="First Name"
                          className="w-full outline-none bg-[#F7F4FF]"
                          value={formData.firstname}
                          onChange={handleChange}
                          required
                        />
                        <FiUserCheck className="ml-2 text-gray-500" />
                        {errors.firstname && (
                          <p className="text-red-600">{errors.firstname}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center border border-gray-400 p-2 rounded-md">
                        <input
                          type="text"
                          name="lastname"
                          placeholder="Last Name"
                          className="w-full outline-none  bg-[#F7F4FF]"
                          value={formData.lastname}
                          onChange={handleChange}
                          required
                        />
                        <FiUserCheck className="ml-2 text-gray-500" />
                        {errors.lastname && (
                          <p className="text-red-600">{errors.lastname}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Position Selector */}
                  <div className="mb-5 flex items-center border border-gray-400 p-2 rounded-md w-full">
                    <select
                      name="position"
                      className="w-full outline-none  bg-[#F7F4FF]"
                      value={formData.position}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Faculty Position</option>
                      {facultyPositions.map((position, index) => (
                        <option key={index} value={position}>
                          {position}
                        </option>
                      ))}
                    </select>
                    {errors.position && (
                      <p className="text-red-600">{errors.position}</p>
                    )}
                  </div>

                  {/* Gender Section */}
                  <div className="mb-5">
                    <label className="block text-gray-700 mb-1">Gender</label>
                    <div className="flex space-x-6 ">
                      <label>
                        <input
                          type="radio"
                          name="gender"
                          value="Male"
                          checked={formData.gender === "Male"}
                          onChange={handleChange}
                        />
                        Male
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="gender"
                          value="Female"
                          checked={formData.gender === "Female"}
                          onChange={handleChange}
                        />
                        Female
                      </label>
                      {errors.gender && (
                        <p className="text-red-600">{errors.gender}</p>
                      )}
                    </div>
                  </div>

                  {/* Date of Birth Section */}
                  <div className="mb-5 w-full">
                    <label className="block text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dob"
                      className="w-full border border-gray-400 p-2 rounded  bg-[#F7F4FF]"
                      value={formData.dob}
                      onChange={handleChange}
                      required
                    />
                    {errors.dob && <p className="text-red-600">{errors.dob}</p>}
                  </div>

                  {/* Password Confirmation */}
                  <div className="flex mb-5 space-x-4 w-full">
                    <div className="flex-1">
                      <div className="flex items-center border border-gray-400 p-2 rounded-md">
                        <input
                          type="password"
                          name="password"
                          placeholder="Password"
                          className="w-full outline-none  bg-[#F7F4FF]"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                        <FiLock className="ml-2 text-gray-500" />
                        {errors.password && (
                          <p className="text-red-600">{errors.password}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center border border-gray-400 p-2 rounded-md">
                        <input
                          type="password"
                          name="confirmPassword"
                          placeholder="Confirm Password"
                          className="w-full outline-none  bg-[#F7F4FF]"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                        />
                        <FiLock className="ml-2 text-gray-500" />
                        {errors.confirmPassword && (
                          <p className="text-red-600">
                            {errors.confirmPassword}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full bg-blue-500 text-white p-3 rounded-md ${
                  isSubmitted ? "cursor-not-allowed opacity-50" : ""
                }`}
                disabled={loading || isSubmitted}
              >
                {loading ? (
                  <FiLoader className="animate-spin mx-auto text-white" />
                ) : isSignUp ? (
                  "Sign Up"
                ) : (
                  "Login"
                )}
              </button>
            </form>
            <div className="mt-4 text-center">
              <button
                onClick={() => setIsSignUp((prev) => !prev)}
                className="text-blue-500"
              >
                {isSignUp
                  ? "Already have an account? Login"
                  : "Don't have an account? Sign Up"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignUpLogin;
