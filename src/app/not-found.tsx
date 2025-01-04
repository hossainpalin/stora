import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center px-6 py-12">
      <div className="mx-auto flex max-w-sm flex-col items-center text-center">
        <p className="rounded-full bg-brand-100 p-3 text-sm font-medium text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="size-6">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl">
          Page not found
        </h1>
        <p className="mt-4 text-gray-500 dark:text-gray-400">
          The page you are looking for doesn&apos;t exist. Please check the URL
          in the address bar.
        </p>

        <div className="mt-6 flex w-full shrink-0 items-center justify-center gap-x-3 sm:w-auto">
          <Link
            href="/"
            className="flex w-1/2 items-center justify-center gap-x-2 rounded-lg border border-brand-100 bg-brand-100 px-6 py-2 text-sm text-white transition-colors duration-200 hover:border-brand hover:bg-brand sm:w-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-5 rtl:rotate-180">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
              />
            </svg>

            <span>Go back</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
