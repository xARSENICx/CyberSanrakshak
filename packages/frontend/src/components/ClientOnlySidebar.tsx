"use client";

import { usePathname } from 'next/navigation';
import SideNavbar from "@/components/SideNavbar";

const ClientOnlySidebar = () => {
  const pathname = usePathname();
  
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  return !isAuthPage ? <SideNavbar /> : null;
};

export default ClientOnlySidebar;
