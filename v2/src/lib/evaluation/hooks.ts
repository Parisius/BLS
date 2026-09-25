"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllEvaluations,
  getOneEvaluation,
  createEvaluation,
  updateEvaluation,
  forwardEvaluation,
  completeEvaluation,
  printEvaluation,
} from "./evaluations";
import {
  getAllEvaluationCriteria,
  createEvaluationCriteria,
  updateEvaluationCriteria,
  deleteEvaluationCriteria,
  type EvaluationCriteriaArgs,
} from "./criteria";
import {
  getAllCollaborators,
  createCollaborator,
  updateCollaborator,
  deleteCollaborator,
  type CollaboratorArgs,
} from "./collaborators";
import { getAllProfiles, createProfile, updateProfile, deleteProfile } from "./profiles";
import type { ScoreInput } from "@/lib/shared/scores";
import type { ForwardWorkflowTaskArgs } from "@/lib/shared/workflow-task";

const ROOT = ["evaluation"];
const EVALUATIONS_KEY = [...ROOT, "evaluations"];
const CRITERIA_KEY = [...ROOT, "criteria"];
const COLLABORATORS_KEY = [...ROOT, "collaborators"];
const PROFILES_KEY = [...ROOT, "profiles"];

export const useAllEvaluations = () => useQuery({ queryKey: EVALUATIONS_KEY, queryFn: getAllEvaluations });

export const useOneEvaluation = (evaluationId: string) =>
  useQuery({ queryKey: [...EVALUATIONS_KEY, evaluationId], queryFn: () => getOneEvaluation(evaluationId) });

export const useCreateEvaluation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEvaluation,
    onSettled: () => queryClient.invalidateQueries({ queryKey: EVALUATIONS_KEY }),
  });
};

// A change to an evaluation shows on its card (score/status) as well as on its own page.
const invalidateEvaluations = (queryClient: ReturnType<typeof useQueryClient>) =>
  queryClient.invalidateQueries({ queryKey: EVALUATIONS_KEY });

export const useUpdateEvaluation = (evaluationId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: { scores: ScoreInput[] }) => updateEvaluation(evaluationId, args),
    onSettled: () => invalidateEvaluations(queryClient),
  });
};

export const useForwardEvaluation = (evaluationId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: ForwardWorkflowTaskArgs) => forwardEvaluation(evaluationId, args),
    onSettled: () => invalidateEvaluations(queryClient),
  });
};

export const useCompleteEvaluation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: completeEvaluation,
    onSettled: () => invalidateEvaluations(queryClient),
  });
};

export const usePrintEvaluation = () => useMutation({ mutationFn: printEvaluation });

// ---- criteria ----

export const useAllEvaluationCriteria = (filter: { profileId?: string; collaboratorId?: string }) =>
  useQuery({
    queryKey: [...CRITERIA_KEY, filter.profileId ?? "", filter.collaboratorId ?? ""],
    queryFn: () => getAllEvaluationCriteria(filter),
    enabled: !!(filter.profileId || filter.collaboratorId),
  });

export const useCreateEvaluationCriteria = (profileId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: EvaluationCriteriaArgs) => createEvaluationCriteria(profileId, args),
    onSettled: () => queryClient.invalidateQueries({ queryKey: CRITERIA_KEY }),
  });
};

export const useUpdateEvaluationCriteria = (profileId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ criteriaId, args }: { criteriaId: string; args: EvaluationCriteriaArgs }) =>
      updateEvaluationCriteria(criteriaId, profileId, args),
    onSettled: () => queryClient.invalidateQueries({ queryKey: CRITERIA_KEY }),
  });
};

export const useDeleteEvaluationCriteria = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEvaluationCriteria,
    onSettled: () => queryClient.invalidateQueries({ queryKey: CRITERIA_KEY }),
  });
};

// ---- collaborators ----

export const useAllCollaborators = (profileId?: string) =>
  useQuery({
    queryKey: [...COLLABORATORS_KEY, profileId ?? "all"],
    queryFn: () => getAllCollaborators(profileId),
    enabled: !!profileId,
  });

export const useCreateCollaborator = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: CollaboratorArgs) => createCollaborator(args),
    onSettled: () => queryClient.invalidateQueries({ queryKey: COLLABORATORS_KEY }),
  });
};

export const useUpdateCollaborator = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ collaboratorId, args }: { collaboratorId: string; args: CollaboratorArgs }) =>
      updateCollaborator(collaboratorId, args),
    // Evaluations show the collaborator's name.
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: EVALUATIONS_KEY });
      return queryClient.invalidateQueries({ queryKey: COLLABORATORS_KEY });
    },
  });
};

export const useDeleteCollaborator = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCollaborator,
    onSettled: () => queryClient.invalidateQueries({ queryKey: COLLABORATORS_KEY }),
  });
};

// ---- profiles ----

export const useAllProfiles = () => useQuery({ queryKey: PROFILES_KEY, queryFn: getAllProfiles });

export const useCreateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProfile,
    onSettled: () => queryClient.invalidateQueries({ queryKey: PROFILES_KEY }),
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ profileId, title }: { profileId: string; title: string }) => updateProfile(profileId, { title }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: [...ROOT] }),
  });
};

export const useDeleteProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProfile,
    onSettled: () => queryClient.invalidateQueries({ queryKey: [...ROOT] }),
  });
};
