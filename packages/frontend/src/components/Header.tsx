import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarSeparator,
	MenubarShortcut,
	MenubarTrigger,
} from "@/components/ui/menubar";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/userStore";

const Header = () => {
	const router = useRouter();
	const logoutUser = useUserStore((state) => state.logoutUser);
	return (
		<div className='w-[99vw] h-[5vh] bg-[#102542] flex justify-between items-center px-8 z-50 sticky top-0  '>
			<div className='text-white'>CSS ADMIN PORTAL</div>
			<Menubar className='rounded-full w-8 h-8 flex justify-center'>
				<MenubarMenu>
					<MenubarTrigger>
						<Avatar className='w-6 h-6 items-stretch'>
							<AvatarImage src='https://github.com/shadcn.png' />
							<AvatarFallback>Admin</AvatarFallback>
						</Avatar>
					</MenubarTrigger>
					<MenubarContent>
						<MenubarItem
							onClick={() => {
								router.push("/profile");
							}}>
							Profile
						</MenubarItem>
						<MenubarSeparator />
						<MenubarItem
							onClick={() => {
								localStorage.clear();
								logoutUser();
								router.push("/login");
							}}>
							Logout
						</MenubarItem>
					</MenubarContent>
				</MenubarMenu>
			</Menubar>
		</div>
	);
};

export default Header;
