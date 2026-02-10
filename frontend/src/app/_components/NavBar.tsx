// src\app\_components\NavBar.tsx
'use client'

import { LanguageSelect } from "./LanguageSelect";
import logo from '@/images/logo.png'
import notificationBell from '@/images/notificationBell.png'
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function NavBar(){



    const pathname = usePathname()
    return(
        <nav className="z-50">

          <div className="flex md:flex-row flex-col gap-y-4 justify-between text-[16px] pb-[24px] bg-[#FFFFFF] md:px-[50px] px-[20px]
                    border-b border-solid border-[#D9D9D9] items-center pt-[22px] fixed top-0 w-full">
            <Link href="/" 
              className="flex gap-2 items-center">
                <Image src={logo} alt="logo" className="w-[19.25px] h-[19.68px]"/>
                <p className="font-semibold text-[16px]">Global Emergency News</p>
            </Link>

            <div className="flex md:w-fit w-full md:gap-[28px] justify-between items-center">
              <Link href={'/'} className={pathname == "/"? "font-semibold": ""}>Home</Link>
              <Link href={'/about'} className={pathname == "/about"? "font-semibold": ""}>About Us</Link>

              <div className="flex gap-[13px]">
                <LanguageSelect/>
                <button className="px-[12px] bg-[#F2E8E8] rounded-[8px]">
                  <Image src={notificationBell} alt="notification" className="w-[14px] h-auto"/>
                </button>
              </div>
            </div>
          </div>
        </nav>
    )
}