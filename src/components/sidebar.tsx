"use client";

import Link from "next/link";
import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { navItems } from "@/constants";
import { cn } from "@/lib/utils";

export default function Sidebar({
  avatar,
  email,
  name
}: {
  avatar: string;
  email: string;
  name: string;
}) {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <Link href="/">
        <Image
          src="/assets/icons/logo-full-brand.svg"
          alt="logo"
          width={160}
          height={50}
          className="hidden h-auto lg:block"
        />

        <Image
          src="/assets/icons/logo-brand.svg"
          alt="logo"
          width={52}
          height={52}
          className="lg:hidden"
        />
      </Link>

      <nav className="sidebar-nav">
        <ul className="flex flex-1 flex-col gap-6">
          {navItems.map((item) => {
            const isActive = pathname === item.url;

            return (
              <Link className="lg:w-full" href={item.url} key={item.name}>
                <li
                  className={cn("sidebar-nav-item", isActive && "shad-active")}>
                  <Image
                    className={cn("nav-icon", isActive && "nav-icon-active")}
                    src={item.icon}
                    alt={item.name}
                    width={24}
                    height={24}
                  />

                  <p className="hidden lg:block">{item.name}</p>
                </li>
              </Link>
            );
          })}
        </ul>
      </nav>

      <Image
        className="w-full"
        src="/assets/images/files-2.png"
        alt="files"
        width={506}
        height={418}
      />

      <div className="sidebar-user-info">
        <Image
          className="sidebar-user-avatar"
          src={avatar}
          alt="avatar"
          width={44}
          height={44}
        />

        <div className="hidden lg:block">
          <p className="subtitle-2 capitalize">{name}</p>
          <p className="caption">{email}</p>
        </div>
      </div>
    </aside>
  );
}
