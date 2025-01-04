"use client";

import { Models } from "node-appwrite";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import Image from "next/image";
import { actionsDropdownItems } from "@/constants";
import { ActionType } from "@/types";
import Link from "next/link";
import { cn, constructDownloadUrl } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  deleteFile,
  removeFileUser,
  renameFile,
  updateFileUsers
} from "@/actions/file.actions";
import { usePathname } from "next/navigation";
import ShareInput, { FileDetails } from "@/components/action-modal-content";

export default function ActionDropdown({
  file,
  owner,
  loggedInUserEmail
}: {
  file: Models.Document;
  owner: boolean;
  loggedInUserEmail: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [action, setAction] = useState<ActionType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState<string[]>([]);

  const [name, setName] = useState(file.name);
  const path = usePathname();

  // Close all modals and dropdowns
  const closeAllModels = () => {
    setIsModalOpen(false);
    setIsDropdownOpen(false);
    setAction(null);
    setName(file.name);
  };

  // Handle action based on the selected action
  const handleAction = async () => {
    if (!action) return;
    setIsLoading(true);
    let success = false;

    const actions = {
      rename: () =>
        renameFile({ fileId: file.$id, name, extension: file.extension, path }),
      share: () => updateFileUsers({ fileId: file.$id, emails: email, path }),
      delete: () =>
        !owner
          ? removeFileUser({ fileId: file.$id, email: loggedInUserEmail, path })
          : deleteFile({
              fileId: file.$id,
              bucketFileId: file.bucketFileId,
              path
            })
    };

    success = await actions[action.value as keyof typeof actions]();

    if (success) {
      closeAllModels();
    }
    setIsLoading(false);
  };

  // Handle remove user from shared file
  const handleRemoveUser = async (email: string) => {
    await removeFileUser({ fileId: file.$id, email, path });
  };

  // Render dialog content based on the selected action
  const renderDialogContent = () => {
    if (!action) return null;

    const { value, label } = action;

    return (
      <DialogContent className="shad-dialog button">
        <DialogHeader className="flex flex-col gap-3">
          <DialogTitle className="text-center text-light-100">
            {label}
          </DialogTitle>

          {value === "rename" && (
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          {value === "details" && <FileDetails file={file} />}
          {value === "share" && (
            <ShareInput
              owner={owner}
              file={file}
              onInputChange={setEmail}
              onRemove={handleRemoveUser}
            />
          )}
          {value === "delete" && (
            <p className="delete-confirmation">
              Are you sure you want to delete{" "}
              <span className="delete-file-name">{file.name}</span>?
            </p>
          )}
        </DialogHeader>

        {["rename", "share", "delete"].includes(value) && (
          <DialogFooter className="flex flex-col gap-3 md:flex-row">
            <Button onClick={closeAllModels} className="modal-cancel-button">
              Cancel
            </Button>
            <Button onClick={handleAction} className="modal-submit-button">
              <p>Submit</p>
              {isLoading && (
                <Image
                  className="animate-spin"
                  src="/assets/icons/loader.svg"
                  alt="loading"
                  width={24}
                  height={24}
                />
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    );
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger className="shad-no-focus">
          <Image
            src="/assets/icons/dots.svg"
            alt="dots"
            width={34}
            height={34}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="max-w-[200px] truncate">
            {file.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actionsDropdownItems.map((actionItem) => (
            <DropdownMenuItem
              onClick={() => {
                setAction(actionItem);

                if (
                  ["rename", "details", "share", "delete"].includes(
                    actionItem.value
                  )
                ) {
                  if (actionItem.value === "rename" && !owner) {
                    setIsModalOpen(false);
                  } else {
                    setIsModalOpen(true);
                  }
                }
              }}
              className={cn(
                "cursor-pointer",
                actionItem.value === "rename" &&
                  !owner &&
                  "opacity-50 cursor-not-allowed"
              )}
              key={actionItem.value}>
              {actionItem.value === "download" ? (
                <Link
                  href={constructDownloadUrl(file.bucketFileId)}
                  download={file.name}
                  className="flex items-center gap-2">
                  <Image
                    src={actionItem.icon}
                    alt={actionItem.label}
                    width={30}
                    height={30}
                  />
                  {actionItem.label}
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Image
                    src={actionItem.icon}
                    alt={actionItem.label}
                    width={30}
                    height={30}
                  />
                  {actionItem.label}
                </div>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {isModalOpen && renderDialogContent()}
    </Dialog>
  );
}
