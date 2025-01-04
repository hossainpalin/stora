import Image from "next/image";
import { cn, getFileIcon } from "@/lib/utils";

interface ThumbnailProps {
  type: string;
  extension: string;
  url?: string;
  className?: string;
  imageClassName?: string;
}

export default function Thumbnail({
  type,
  extension,
  url = "",
  className,
  imageClassName
}: ThumbnailProps) {
  const isImage = type === "image" && extension !== "svg";
  return (
    <figure className={cn("thumbnail", className)}>
      <Image
        className={cn(
          "size-8 object-contain",
          imageClassName,
          isImage && "thumbnail-image"
        )}
        src={isImage ? url : getFileIcon(extension, type)}
        alt="thumbnail"
        width={100}
        height={100}
      />
    </figure>
  );
}
