import Image from "next/image";
import Link from "next/link";
import { Models } from "node-appwrite";
import { getFiles, getTotalSpaceUsed } from "@/actions/file.actions";
import { checkFileOwner, convertFileSize, getUsageSummary } from "@/lib/utils";
import Chart from "@/components/chart";
import { Separator } from "@/components/ui/separator";
import FormattedDateTime from "@/components/formatted-date-time";
import Thumbnail from "@/components/thumbnail";
import ActionDropdown from "@/components/action-dropdown";
import { getCurrentUser } from "@/actions/user.actions";

export default async function Dashboard() {
  // Parallel requests
  const [files, totalSpace, currentUser] = await Promise.all([
    getFiles({ types: [], limit: 5 }),
    getTotalSpaceUsed(),
    getCurrentUser()
  ]);

  const myFiles = files.documents.filter(
    (file: Models.Document) => file.owner.accountId === currentUser.accountId
  );

  const sharedFiles = files.documents.filter(
    (file: Models.Document) => file.owner.accountId !== currentUser.accountId
  );

  // Get usage summary
  const usageSummary = getUsageSummary(totalSpace);

  return (
    <div className="dashboard-container">
      <section className="">
        <Chart used={totalSpace.used} />

        {/* Uploaded file type summaries */}
        <ul className="dashboard-summary-list">
          {usageSummary.map((summary) => (
            <Link
              href={summary.url}
              key={summary.title}
              className="dashboard-summary-card">
              <div className="space-y-4">
                <div className="flex justify-between gap-3">
                  <Image
                    src={summary.icon}
                    width={100}
                    height={100}
                    alt="uploaded image"
                    className="summary-type-icon"
                  />
                  <h4 className="summary-type-size">
                    {convertFileSize(summary.size) || 0}
                  </h4>
                </div>

                <h5 className="summary-type-title">{summary.title}</h5>
                <Separator className="bg-light-400" />
                <FormattedDateTime
                  date={summary.latestDate}
                  className="text-center"
                />
              </div>
            </Link>
          ))}
        </ul>
      </section>

      {/* Recent files uploaded */}
      <section className="flex flex-col gap-y-6 xl:gap-y-10">
        <div className="dashboard-recent-files">
          <h2 className="h3 xl:h2 text-light-100">Recent uploaded files</h2>
          {myFiles.length > 0 ? (
            <ul className="mt-5 flex flex-col gap-5">
              {myFiles.map((file: Models.Document) => (
                <Link
                  href={file.url}
                  target="_blank"
                  className="flex items-center gap-3"
                  key={file.$id}>
                  <Thumbnail
                    type={file.type}
                    extension={file.extension}
                    url={file.url}
                  />

                  <div className="recent-file-details">
                    <div className="flex flex-col gap-1">
                      <p className="recent-file-name">{file.name}</p>
                      <FormattedDateTime
                        date={file.$createdAt}
                        className="caption"
                      />
                    </div>
                    <ActionDropdown
                      file={file}
                      owner={checkFileOwner(file, currentUser.accountId)}
                      loggedInUserEmail={currentUser.email}
                    />
                  </div>
                </Link>
              ))}
            </ul>
          ) : (
            <p className="empty-list">No files uploaded</p>
          )}
        </div>

        <div className="dashboard-recent-files">
          <h2 className="h3 xl:h2 text-light-100">Shared with me</h2>
          {sharedFiles.length > 0 ? (
            <ul className="mt-5 flex flex-col gap-5">
              {sharedFiles.map((file: Models.Document) => (
                <Link
                  href={file.url}
                  target="_blank"
                  className="flex items-center gap-3"
                  key={file.$id}>
                  <Thumbnail
                    type={file.type}
                    extension={file.extension}
                    url={file.url}
                  />

                  <div className="recent-file-details">
                    <div className="flex flex-col gap-1">
                      <p className="recent-file-name">{file.name}</p>
                      <FormattedDateTime
                        date={file.$createdAt}
                        className="caption"
                      />
                    </div>
                    <ActionDropdown
                      file={file}
                      owner={checkFileOwner(file, currentUser.accountId)}
                      loggedInUserEmail={currentUser.email}
                    />
                  </div>
                </Link>
              ))}
            </ul>
          ) : (
            <p className="empty-list">No files shared with you</p>
          )}
        </div>
      </section>
    </div>
  );
}
