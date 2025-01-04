"use client";

import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function View() {
  const searchParams = useSearchParams();

  const view = searchParams.get("view");

  const router = useRouter();
  const pathname = usePathname();

  const handleViewChange = (value: string) => {
    router.push(`${pathname}?view=${value}`);
  };

  useEffect(() => {
    if (view) {
      return router.push(pathname.replace(searchParams.toString(), ""));
    }
  }, []);

  return (
    <div className="hidden sm:block">
      <div className="flex items-center justify-end gap-3">
        <Image
          onClick={() => handleViewChange("list")}
          className="view-container"
          src="/assets/icons/list.svg"
          alt="list"
          width={24}
          height={24}
        />
        <Image
          onClick={() => handleViewChange("grid")}
          className="view-container"
          src="/assets/icons/grid.svg"
          alt="grid"
          width={24}
          height={24}
        />
      </div>
    </div>
  );
}
