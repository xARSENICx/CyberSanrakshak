export type BlockRule = {
	id: string;
	hostIds: string[];
	hostNames: string[];
	applications: string[];
	appCategory: string[];
	timeApplied: string;
	whitelistedDomains: string[];
	blacklistedDomains: string[];
	status: "applied" | "idle";
};

export type FilterOptions = {
	appCategory: string[];
	hosts: string[];
	domains: string[];
	internetAccess: boolean;
	timeRange: {
		start: Date | null;
		end: Date | null;
	};
};

export type SortOption = "hostname" | "application" | "timeApplied";
