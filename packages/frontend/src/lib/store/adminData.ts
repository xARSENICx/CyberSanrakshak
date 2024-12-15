import { create } from "zustand";
import axios from "axios";
import { useToast } from "@/components/hooks/use-toast";
import { any } from "zod";
interface Admin {
	admin: any;
	activeClients: any;
}

interface UserState {
	adminData: Admin | null;
	error: string | null;
	isLoading: boolean;
	fetchAdminData: (email: string) => Promise<void>;
}

export const useAdminStore = create<UserState>((set) => ({
	adminData: null,
	error: null,
	isLoading: false,

	fetchAdminData: async (emailOfAdmin) => {
		set({ isLoading: true, error: null });

		try {
			const response = await axios.post("http://localhost:3000/details/admin", {
				email: emailOfAdmin,
			});

			const adminData = response?.data.admin;
			const activeClients = response?.data.activeClients;
			// console.log(response);

			set({
				adminData: { admin: adminData, activeClients: activeClients },
				error: null,
			});
		} catch (error: any) {
			const errorMessage =
				error.response?.data?.message || "An error occurred. Please try again.";
			set({ error: errorMessage });
		} finally {
			set({ isLoading: false });
		}
	},
}));
