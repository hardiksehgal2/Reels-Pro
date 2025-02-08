"use client";
import React, {  useState } from "react";
import {  IKUpload } from "imagekitio-next";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { Loader2 } from "lucide-react";

interface FileUploadProps {
  onSuccess: (res: IKUploadResponse) => void;
  onProgress: (progress: number) => void;
  fileType?: "image" | "video";
}


export default function FileUpload({
  onSuccess,
  onProgress,
  fileType = "image",
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onError = (err: { message: string }) => {
    console.log("Error", err);
    setError(err.message);
    setUploading(false);
  };

  const handleSuccess = (response: IKUploadResponse) => {
    console.log("Success", response);
    setUploading(false);
    setError(null);
    onSuccess(response);
  };

  const handleProgress = (evt: ProgressEvent) => {
    if (evt.lengthComputable && onProgress) {
      const percentComplete = (evt.loaded / evt.total) * 100;
      onProgress(Math.round(percentComplete));
    }
  };

  // ✅ Fix: Ensure the correct parameter structure
  const handleStartUpload = (evt: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Upload Started", evt);
    setUploading(true);
    setError(null);
  };

  const validateFile = (file: File) => {
    if (fileType === "video") {
     
      if (file.size > 100 * 1024 * 1024) {
        // 100MB
        setError("Video must be less than 100 MB");
        return false;
      }
    } else {
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setError("Please Upload an image file (JPEG, PNG, or WEBP)");
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB
        setError("Image must be less than 5 MB");
        return false;
      }
    }
    return true; // ✅ Fix: Return true when the file is valid
  };

  return (
    <div className="space-y-2">
      <IKUpload
        fileName={fileType === "video" ? "video" : "image"}
        useUniqueFileName={true}
        validateFile={validateFile}
        onError={onError}
        onSuccess={handleSuccess}
        onUploadProgress={handleProgress}
        onUploadStart={handleStartUpload}
        folder={fileType === "video" ? "/videos" : "/images"}
        transformation={{
          pre: "l-text,i-Imagekit,fs-50,l-end",
          post: [
            {
              type: "transformation",
              value: "w-100",
            },
          ],
        }}
      />
      {
        uploading&&(
            <div className="flex items-center gap-2 text-sm text-primary">
                <Loader2 className="animate-spin w-3 h-3"/>
                <span>Uploading...</span>
            </div>
        )
      }
      {
        error &&(
            <div className="text-error text-sm">
                {error}
            </div>
        )
      }
    </div>
  );
}
