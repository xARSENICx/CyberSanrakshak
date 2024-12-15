import { BlockRule } from "../types/rules";

export const mockRules: BlockRule[] = [
	{
		id: "1",
		hostIds: ["host1", "host2"],
		hostNames: ["Development PC", "Testing Machine"],
		applications: ["Chrome", "Firefox"],
		appCategory: ["Browsers"],
		timeApplied: "2024-01-07T10:00:00Z",
		whitelistedDomains: ["github.com", "stackoverflow.com"],
		blacklistedDomains: ["facebook.com", "twitter.com"],
		status: "applied",
	},
	{
		id: "2",
		hostIds: ["*"],
		hostNames: ["All Hosts"],
		applications: ["Slack", "Discord"],
		appCategory: ["Communication"],
		timeApplied: "2024-01-06T15:30:00Z",
		whitelistedDomains: ["slack.com"],
		blacklistedDomains: ["gaming.com"],
		status: "idle",
	},
	// Add more mock data as needed
];

export const mockCategories = [
	"Browsers",
	"Communication",
	"Entertainment",
	"Development",
	"Social Media",
];
export const mockHosts = [
	"Development PC",
	"Testing Machine",
	"Production Server",
	"All Hosts",
];
