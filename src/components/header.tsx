import { Button } from "@/components/ui/button";
import Image from "next/image";
import Search from "@/components/search";
import FileUploader from "@/components/file-uploader";
import { signOutUser } from "@/actions/user.actions";

interface HeaderProps {
  ownerId: string;
  accountId: string;
}

export default function Header({ ownerId, accountId }: HeaderProps) {
  return (
    <header className="header">
      <Search />
      <div className="header-wrapper">
        <FileUploader ownerId={ownerId} accountId={accountId} />
        <form
          action={async () => {
            "use server";

            await signOutUser();
          }}>
          <Button type="submit" className="sign-out-button">
            <Image
              src="/assets/icons/logout.svg"
              alt="Logout"
              width={24}
              height={24}
              className="w-6"
            />
          </Button>
        </form>
      </div>
    </header>
  );
}
