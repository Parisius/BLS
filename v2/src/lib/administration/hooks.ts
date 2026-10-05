"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { unwrapResult } from "@/lib/api/result";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  setUserActive,
  resetUserPassword,
  getCurrentUser,
  type CreateUserArgs,
} from "./users";
import { getAllRoles, createRole, updateRole, deleteRole, type UpdateRoleArgs } from "./roles";
import {
  getAllSubsidiaries,
  createSubsidiary,
  updateSubsidiary,
  deleteSubsidiary,
  type CreateSubsidiaryArgs,
} from "./subsidiaries";
import { getAllPermissions } from "./permissions";

const USERS_KEY = ["administration", "users"];
const ROLES_KEY = ["administration", "roles"];
const SUBSIDIARIES_KEY = ["administration", "subsidiaries"];
const PERMISSIONS_KEY = ["administration", "permissions"];
const CURRENT_USER_KEY = ["administration", "currentUser"];

export const useAllUsers = () =>
  useQuery({ queryKey: USERS_KEY, queryFn: getAllUsers });

export const useCurrentUser = () =>
  useQuery({ queryKey: CURRENT_USER_KEY, queryFn: getCurrentUser });

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSettled: () => queryClient.invalidateQueries({ queryKey: USERS_KEY }),
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => unwrapResult(await deleteUser(userId)),
    onSettled: () => queryClient.invalidateQueries({ queryKey: USERS_KEY }),
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, args }: { userId: string; args: CreateUserArgs }) =>
      unwrapResult(await updateUser(userId, args)),
    // Editing yourself changes what the app lets you do.
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CURRENT_USER_KEY });
      return queryClient.invalidateQueries({ queryKey: USERS_KEY });
    },
  });
};

export const useSetUserActive = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, active }: { userId: string; active: boolean }) =>
      unwrapResult(await setUserActive(userId, active)),
    onSettled: () => queryClient.invalidateQueries({ queryKey: USERS_KEY }),
  });
};

export const useResetUserPassword = () =>
  useMutation({ mutationFn: async (userId: string) => unwrapResult(await resetUserPassword(userId)) });

export const useAllRoles = () =>
  useQuery({ queryKey: ROLES_KEY, queryFn: getAllRoles });

export const useCreateRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRole,
    onSettled: () => queryClient.invalidateQueries({ queryKey: ROLES_KEY }),
  });
};

export const useAllSubsidiaries = () =>
  useQuery({ queryKey: SUBSIDIARIES_KEY, queryFn: getAllSubsidiaries });

export const useCreateSubsidiary = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSubsidiary,
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: SUBSIDIARIES_KEY }),
  });
};

export const useAllPermissions = () =>
  useQuery({ queryKey: PERMISSIONS_KEY, queryFn: getAllPermissions });

export const useUpdateRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ roleId, args }: { roleId: string; args: UpdateRoleArgs }) =>
      unwrapResult(await updateRole(roleId, args)),
    // A role edit changes the signed-in user's own permissions when it is their role.
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CURRENT_USER_KEY });
      queryClient.invalidateQueries({ queryKey: USERS_KEY });
      return queryClient.invalidateQueries({ queryKey: ROLES_KEY });
    },
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (roleId: string) => unwrapResult(await deleteRole(roleId)),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ROLES_KEY }),
  });
};

export const useUpdateSubsidiary = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ subsidiaryId, args }: { subsidiaryId: string; args: CreateSubsidiaryArgs }) =>
      unwrapResult(await updateSubsidiary(subsidiaryId, args)),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: USERS_KEY });
      return queryClient.invalidateQueries({ queryKey: SUBSIDIARIES_KEY });
    },
  });
};

export const useDeleteSubsidiary = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (subsidiaryId: string) => unwrapResult(await deleteSubsidiary(subsidiaryId)),
    onSettled: () => queryClient.invalidateQueries({ queryKey: SUBSIDIARIES_KEY }),
  });
};
