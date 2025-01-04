"use client";

import React, { useState } from "react";
import Image from "next/image";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { Separator } from "@radix-ui/react-separator";
import { navItems } from "@/constants";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signOutUser } from "@/actions/user.actions";
import FileUploader from "@/components/file-uploader";

interface MobileNavProps {
  ownerId: string;
  accountId: string;
  avatar: string;
  email: string;
  name: string;
}

export default function MobileNav({
  ownerId,
  accountId,
  avatar,
  name,
  email
}: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="mobile-header">
      <Image
        className="h-auto"
        src="/assets/icons/logo-full-brand.svg"
        alt="logo"
        width={120}
        height={52}
      />

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger>
          <Image
            src="/assets/icons/menu.svg"
            alt="search"
            width={30}
            height={30}
          />
        </SheetTrigger>
        <SheetContent className="shad-sheet h-screen px-3">
          <SheetTitle>
            <div className="header-user">
              <Image
                src={avatar}
                alt="avatar"
                width={44}
                height={44}
                className="header-user-avatar"
              />

              <div className="sm:hidden lg:block">
                <p className="subtitle-2 capitalize">{name}</p>
                <p className="caption">{email}</p>
              </div>
            </div>

            <Separator className="mb-4 bg-light-200/20" />
          </SheetTitle>

          <nav className="mobile-nav">
            <ul className="flex flex-1 flex-col gap-6">
              {navItems.map((item) => {
                const isActive = pathname === item.url;

                return (
                  <Link className="lg:w-full" href={item.url} key={item.name}>
                    <li
                      className={cn(
                        "mobile-nav-item",
                        isActive && "shad-active"
                      )}>
                      <Image
                        className={cn(
                          "nav-icon",
                          isActive && "nav-icon-active"
                        )}
                        src={item.icon}
                        alt={item.name}
                        width={24}
                        height={24}
                      />

                      <p>{item.name}</p>
                    </li>
                  </Link>
                );
              })}
            </ul>
          </nav>

          <Separator className="my-5 bg-light-200/20" />

          <div className="flex flex-col justify-between gap-5 pb-5">
            <FileUploader ownerId={ownerId} accountId={accountId} />

            <Button
              onClick={async () => await signOutUser()}
              className="mobile-sign-out-button">
              <Image
                src="/assets/icons/logout.svg"
                alt="Logout"
                width={24}
                height={24}
              />
              logout
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
