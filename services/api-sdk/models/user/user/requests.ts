"use server";
import { ApiError } from "@/services/api-sdk/errors";
import { fetchService } from "@/services/api-sdk/init";
import { redirect } from "next/navigation";
import { AuthRoutes } from "@/config/routes";
/**
 * Fetches all users from the server.
 * @returns A promise that resolves to an array of users.
 * @throws {ApiError} if the request fails.
 */
export const getAllUsers = async () => {
  const response = await fetchService.get("/users");
  if (response.ok) {
    const data = await response.json();
    return data.data
      .map((item) => {
        try {
          return {
            id: item.id,
            firstname: item.firstname,
            lastname: item.lastname,
            email: item.email,
            username: item.username,
          };
        } catch (e) {
          return null;
        }
      })
      .filter((user) => user !== null);
  }
  throw new ApiError("Failed to fetch all users");
};
/**
 * Fetches the current user from the server.
 * @returns A promise that resolves to the current user.
 */
export const getCurrentUser = async () => {
  const response = await fetchService.get("/current-user");
  if (response.ok) {
    const { data: item } = await response.json();
    try {
      return {
        id: item.id,
        firstname: item.firstname,
        lastname: item.lastname,
        email: item.email,
        username: item.username,
      };
    } catch (e) {
      throw new ApiError("Failed to parse current user");
    }
  }
  return redirect(AuthRoutes.logout);
};
/**
 * Logs in the user with the given credentials.
 * @param {LoginArgs} args The login arguments.
 * @returns A promise that resolves to the access token.
 */
export const login = async (args) => {
  const response = await fetchService.post(
    "/login",
    JSON.stringify({
      username: args.username,
      password: args.password,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (response.ok) {
    const { data: item } = await response.json();
    console.log(item.access_token);

    return item.access_token;
  }
  return null;
};
