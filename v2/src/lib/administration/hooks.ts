"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllUsers, createUser, deleteUser, getCurrentUser } from "./users";
import { getAllRoles, createRole } from "./roles";
import { getAllSubsidiaries, createSubsidiary } from "./subsidiaries";
import { getAllPermissions } from "./permissions";

const USERS_KEY = ["administration", "users"];
const ROLES_KEY = ["administration", "roles"];
const SUBSIDIARIES_KEY = ["administration", "subsidiaries"];
const PERMISSIONS_KEY = ["administration", "permissions"];

export const useAllUsers = () =>
  useQuery({ queryKey: USERS_KEY, queryFn: getAllUsers });

export const useCurrentUser = () =>
  useQuery({ queryKey: ["administration", "currentUser"], queryFn: getCurrentUser });

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
    mutationFn: deleteUser,
    onSettled: () => queryClient.invalidateQueries({ queryKey: USERS_KEY }),
  });
};

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
