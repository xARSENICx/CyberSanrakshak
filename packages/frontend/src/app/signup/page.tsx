"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "../../lib/store/userStore";
import { useRouter } from "next/navigation"; // Import useRouter hook
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/components/hooks/use-toast";

const Signup: React.FC = () => {
	const router = useRouter(); // Initialize useRouter
	const [username, setUsername] = useState(""); // New state for username
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [role, setRole] = useState("user");

	const registerUser = useUserStore((state) => state.registerUser);
	const error = useUserStore((state) => state.error);
	const isLoading = useUserStore((state) => state.isLoading);
	const { toast } = useToast();

	const handleSignup = async (e: React.FormEvent) => {
		e.preventDefault();
		// Passing username to registerUser along with email, password, and role
		await registerUser(username, email, password, toast);

		if (!error) {
			router.push("/");
		}
	};

	return (
		<div className='flex justify-center items-center p-4 sm:p-8 h-screen bg-gray-100'>
			<div className='w-full max-w-md sm:max-w-sm bg-white p-4 sm:p-8 rounded-lg shadow-lg'>
				{/* UI Components */}
				<h2 className='text-lg sm:text-2xl text-center font-bold text-gray-700 mb-2 sm:mb-4'>
					Sign up for Cyber Sanrakshak
				</h2>

				<form onSubmit={handleSignup}>
					{/* Username Input */}
					{/* <div className='mb-2 sm:mb-4'>
						<label className='block text-gray-700 text-xs sm:text-sm font-bold mb-1 sm:mb-2'>
							Username
						</label>
						<input
							type='text'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							placeholder='Enter your username'
							className='w-full px-2 sm:px-3 py-1 sm:py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring focus:border-blue-300'
							required
						/>
					</div> */}

					{/* Email Input */}
					<div className='mb-2 sm:mb-4'>
						<label className='block text-gray-700 text-xs sm:text-sm font-bold mb-1 sm:mb-2'>
							Email
						</label>
						<input
							type='email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder='Enter your email'
							className='w-full px-2 sm:px-3 py-1 sm:py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring focus:border-blue-300'
							required
						/>
					</div>

					{/* Role Selection */}
					{/* <div className='mb-2 sm:mb-4'>
						<label className='block text-gray-700 text-xs sm:text-sm font-bold mb-1 sm:mb-2'>
							Role
						</label>
						<div className='flex flex-wrap sm:gap-2 sm:space-x-4'>
							<label className='inline-flex items-center text-xs sm:text-sm'>
								<input
									type='radio'
									value='user'
									checked={role === "user"}
									onChange={() => setRole("user")}
									className='form-radio text-blue-500'
								/>
								<span className='ml-1 sm:ml-2'>User</span>
							</label>
							<label className='inline-flex items-center text-xs sm:text-sm'>
								<input
									type='radio'
									value='admin'
									checked={role === "admin"}
									onChange={() => setRole("admin")}
									className='form-radio text-blue-500'
								/>
								<span className='ml-1 sm:ml-2'>Admin</span>
							</label>
						</div>
					</div> */}

					{/* Password Input */}
					<div className='mb-4 sm:mb-6'>
						<label className='block text-gray-700 text-xs sm:text-sm font-bold mb-1 sm:mb-2'>
							Password
						</label>
						<div className='relative'>
							<input
								type={showPassword ? "text" : "password"}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder='Create your password'
								className='w-full px-2 sm:px-3 py-1 sm:py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring focus:border-blue-300'
								required
							/>
							<button
								type='button'
								className='absolute inset-y-0 right-3 flex items-center'
								onClick={() => setShowPassword((prev) => !prev)}>
								<Image
									src={showPassword ? "/eye.png" : "/hidden.png"}
									alt={showPassword ? "Hide password" : "Show password"}
									width={20}
									height={20}
								/>
							</button>
						</div>
					</div>

					{/* Signup Button */}
					<div className='flex justify-between items-center'>
						<button
							type='submit'
							className='w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 text-xs sm:text-base'
							disabled={isLoading} // Disable button while loading
						>
							{isLoading ? "Signing up..." : "Sign up"}
						</button>
					</div>

					{/* Error message */}
					{error && <p className='text-red-500 mt-2'>{error}</p>}
				</form>

				<div className='mt-4 text-center text-xs sm:text-sm'>
					<span>Already have an account?</span>{" "}
					<Link
						href='/login'
						className='text-blue-500 hover:text-blue-700'>
						Log in
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Signup;
