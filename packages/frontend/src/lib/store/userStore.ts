import { create } from "zustand";
import axios from "axios";
import { useToast } from "@/components/hooks/use-toast";
import { any } from "zod";
interface User {
	name: string;
	email: string;
	password?: string;
	adminID?: any;
	clientID?: any;
}

interface UserState {
	user: User | null;
	error: string | null;
	isLoading: boolean;
	registerUser: (
		name: string,
		emaile: string,
		passworde: string,
		toast: any
	) => Promise<void>;
	loginUser: (emaile: string, passworde: string, toast: any) => Promise<void>;
	logoutUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
	user: null,
	error: null,
	isLoading: false,

	registerUser: async (name, emaile, passworde, toast) => {
		set({ isLoading: true, error: null });

		try {
			const response = await axios.post("http://localhost:3000/admin/signup", {
				name: name,
				email: emaile,
				password: passworde,
			});

			const {
				// name: user_name,
				email: email,
				password: password,
				adminID: adminID,
				clientID: clientID,
			} = response?.data.admin;

			const userToStore = {
				email: email,
				password: password,
				adminID: adminID,
				clientID: clientID,
			};
			localStorage.setItem("admin", JSON.stringify(userToStore));

			set({
				user: {
					email: email,
					adminID: adminID,
					clientID: clientID,
					name: "",
				},
				error: null,
			});

			toast({
				title: "Signed in successfully",
				description: "User registered successfully.",
			});
		} catch (error: any) {
			const errorMessage =
				error.response?.data?.message || "An error occurred. Please try again.";
			toast({
				title: "Error",
				description: errorMessage,
				variant: "destructive",
			});
			set({ error: errorMessage });
		} finally {
			set({ isLoading: false });
		}
	},

	loginUser: async (emaile, passworde, toast) => {
		set({ isLoading: true, error: null });

		try {
			const response = await axios.post("http://localhost:3000/admin/signin", {
				email: emaile,
				password: passworde,
			});

			if (response.status == 200) {
				const { email, adminID, clientID } = response.data.admin;
				const userToStore = {
					email: email,
					adminID: adminID,
					clientID: clientID,
				};
				localStorage.setItem("admin", JSON.stringify(userToStore));

				set({ user: { email, adminID, clientID, name: "" }, error: null });
				toast({
					title: "Logged in successfully",
					description: "User login successful.",
				});
			} else {
				set({ error: response });
				toast({
					title: response.data.message,
					description: "User registered error.",
				});
			}
		} catch (error: any) {
			set({ error: "An error occurred. Please try again." });
			toast({
				title: error?.response,
				description: "Probelm while looging in",
			});
		} finally {
			set({ isLoading: false });
		}
	},

	logoutUser: () => {
		set({ user: null });
		localStorage.clear();
	},
}));
