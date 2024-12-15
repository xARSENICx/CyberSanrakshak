/** @format */
"use client";

import { useState } from "react";
import { Nav } from "./ui/nav";

type Props = {};

import {
	ShoppingCart,
	LayoutDashboard,
	UserRound,
	Settings,
	PlusCircle,
	ChevronRight,
	Ban,
} from "lucide-react";
import { Button } from "./ui/button";

import { useWindowWidth } from "@react-hook/window-size";

export default function SideNavbar({}: Props) {
	const [isCollapsed, setIsCollapsed] = useState(false);

	const onlyWidth = useWindowWidth();
	const mobileWidth = onlyWidth < 768;

	function toggleSidebar() {
		setIsCollapsed(!isCollapsed);
	}

	return (
		<div
			className={`${isCollapsed ? "w-14" : "min-w-[120px]"} ${
				mobileWidth ? "w-[100vw] flex justify-center" : ""
			} h-[50px] md:h-[100vh] border-r px-3 pb-10 md:pt-12 bg-[#e85555] sticky top-0 z-0 text-[#cdd7d6]`}>
			{!mobileWidth && (
				<div className={`${isCollapsed ? "ml-6" : "ml-44"} right-[-20px] `}>
					<Button
						onClick={toggleSidebar}
						variant='secondary'
						className=' rounded-full p-2 border border-red-900'>
						<ChevronRight />
					</Button>
				</div>
			)}
			<Nav
				isCollapsed={mobileWidth ? true : isCollapsed}
				links={[
					{
						title: "Dashboard",
						href: "/",
						icon: LayoutDashboard,
						variant: "default",
					},
					{
						title: "Clients",
						href: "/host",
						icon: UserRound,
						variant: "ghost",
					},
					{
						title: "Rules",
						href: "/rules",
						icon: PlusCircle,
						variant: "ghost",
					},
					// {
					// 	title: "Log",
					// 	href: "/log",
					// 	icon: Settings,
					// 	variant: "ghost",
					// },
					{
						title: "Alerts",
						href: "/add-rule",
						icon: Ban,
						variant: "ghost",
					},
				]}
			/>
		</div>
	);
}
