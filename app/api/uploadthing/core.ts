import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";
import { auth } from "@/lib/auth"; // Your Better Auth instance
import { headers } from "next/headers";

const f = createUploadthing();
const utapi = new UTApi();

export const ourFileRouter = {
  imageUploader: f({ 
    image: { 
      maxFileSize: "4MB", 
      maxFileCount: 1 
    } 
  })
    .middleware(async ({ req }) => {
      // Get session from Better Auth
      const session = await auth.api.getSession({
        headers: await headers()
      });

      if (!session) {
        throw new UploadThingError("Unauthorized");
      }

      return { 
        userId: session.user.id,
        userEmail: session.user.email 
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for user:", metadata.userId);
      console.log("File URL:", file.url);
      console.log("File key:", file.key); // Important for deletion
      
      return { 
        uploadedBy: metadata.userId,
        url: file.url,
        key: file.key // Return the key for deletion
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
