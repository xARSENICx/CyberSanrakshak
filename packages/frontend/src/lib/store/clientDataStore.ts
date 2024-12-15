import { create } from "zustand";
import axios from "axios";
import { useAdminStore } from "./adminData";

interface ClientDataState {
	clientData: any;
	isLoading: boolean;
	error: string | null;
	fetchClientData: ({ clientIDS }: any) => Promise<void>;
}

export const useClientDataStore = create<ClientDataState>((set) => ({
	clientData: null,
	isLoading: false,
	error: null,

	fetchClientData: async ({ clientIDS }: any) => {
		set({ isLoading: true, error: null });

		try {
			const response = await axios.post(
				`http://localhost:3000/details/clients`,
				{
					clientIDS: clientIDS,
				}
			);

			set({ clientData: response.data.data, isLoading: false });
		} catch (error: any) {
			console.error("Error fetching client data:", error);
			set({
				error: error || "Failed to fetch client data",
				isLoading: false,
			});
		}
	},
}));
