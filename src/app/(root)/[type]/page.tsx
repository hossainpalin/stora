import { Models } from "node-appwrite";
import Sort from "@/components/sort";
import Card from "@/components/card";
import { FileType, SearchParamProps } from "@/types";
import { convertFileSize, getFileTypesParams } from "@/lib/utils";
import { getFiles } from "@/actions/file.actions";
import View from "@/components/view";
import { getCurrentUser } from "@/actions/user.actions";

export default async function Type({ searchParams, params }: SearchParamProps) {
  const type = ((await params)?.type as string) || "";
  const searchText = ((await searchParams)?.query as string) || "";
  const sort = ((await searchParams)?.sort as string) || "";
  const view = ((await searchParams)?.view as string) || "grid";

  const currentUser = await getCurrentUser();

  const types = getFileTypesParams(type) as FileType[];

  const files = await getFiles({ types, searchText, sort });
  const totalSize = files.documents.reduce(
    (acc: number, file: Models.Document) => acc + (file.size as number),
    0
  );

  return (
    <div className="page-container">
      <section className="w-full">
        <h1 className="h1 capitalize">{type}</h1>

        <div className="total-size-section">
          <p className="body-1">
            Total: <span className="h5">{convertFileSize(totalSize)}</span>
          </p>

          <div className="sort-container">
            <Sort />
            <View />
          </div>
        </div>
      </section>

      {files.total > 0 ? (
        <section className="file-list">
          {files.documents.map((file: Models.Document) => (
            <Card
              key={file.$id}
              file={file}
              accountId={currentUser.accountId}
              loggedInUserEmail={currentUser.email}
            />
          ))}
        </section>
      ) : (
        <p className="empty-list">No files uploaded</p>
      )}
    </div>
  );
}
