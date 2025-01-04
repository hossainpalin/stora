"use server";

import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { ID, Query } from "node-appwrite";
import { parseStringify } from "@/lib/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect";

interface CreateAccountParams {
  fullName?: string | undefined;
  email: string;
}

// Handle errors
function handleError(error: unknown, message: string) {
  console.error(error, message);
  throw error;
}

// Get user by email address
export async function getUserByEmail(email: string) {
  const { databases } = await createAdminClient();

  const user = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    [Query.equal("email", [email])]
  );

  return user.total > 0 ? user.documents[0] : null;
}

// Send an email OTP to the user
export async function sendEmailOTP(email: string) {
  const { account } = await createAdminClient();

  try {
    const session = await account.createEmailToken(ID.unique(), email);
    return session.userId;
  } catch (error) {
    handleError(error, "Failed to send email OTP");
  }
}

// Create a new user account
export async function createAccount({
  fullName,
  email
}: CreateAccountParams): Promise<{
  accountId: string | null;
  error: string | null;
}> {
  const existingUser = await getUserByEmail(email);
  const accountId = await sendEmailOTP(email);

  if (!accountId) {
    return parseStringify({ accountId: null, error: "Failed to send an OTP" });
  }

  if (!existingUser) {
    const { databases } = await createAdminClient();

    try {
      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        ID.unique(),
        {
          email,
          fullName,
          accountId,
          avatar: "https://avatar.iran.liara.run/public/1"
        }
      );
    } catch (error) {
      if (isRedirectError(error)) throw error;
      console.error(error);
      return parseStringify({
        accountId: null,
        error: "Failed to create a new user account"
      });
    }
  }

  return parseStringify({ accountId, error: null });
}

interface VerifyOTPParams {
  accountId: string;
  password: string;
}

// Verify the OTP
export async function verifyOTP({ accountId, password }: VerifyOTPParams) {
  try {
    const { account } = await createAdminClient();
    const session = await account.createSession(accountId, password);

    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true
    });

    return parseStringify(session.$id);
  } catch (error) {
    handleError(error, "Failed to verify OTP");
  }
}

// get current user
export async function getCurrentUser() {
  try {
    const { account, databases } = await createSessionClient();

    const user = await account.get();

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("accountId", [user.$id])]
    );

    if (currentUser.total <= 0) return null;

    return parseStringify(currentUser.documents[0]);
  } catch (error) {
    handleError(error, "Failed to get current user");
  }
}

// Sign out the user
export async function signOutUser() {
  try {
    const { account } = await createSessionClient();
    await account.deleteSession("current");

    (await cookies()).delete("appwrite-session");
  } catch (error) {
    handleError(error, "Failed to sign out user");
  } finally {
    redirect("/sign-in");
  }
}

// Sign in the user
export async function signInUser({
  email
}: {
  email: string;
}): Promise<{ accountId: string | null; error: string | null }> {
  try {
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      await sendEmailOTP(email);
      return parseStringify({ accountId: existingUser.accountId, error: null });
    }

    return parseStringify({ accountId: null, error: "User not found" });
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return parseStringify({ accountId: null, error: "Failed to sign in user" });
  }
}
