import { createRoutes } from "@adebsa2401/routes-tree-builder";
export const ContractRoutes = createRoutes({
  index: "/dashboard/contract",
  contractsList: "/dashboard/contract/list",
  contractModels: (parentId?: string) => ({
    _basePath: parentId
      ? `/dashboard/contract/models/${parentId}`
      : "/dashboard/contract/models",
    index: "/",
  }),
  contractPage: (contractId?: string) => ({
    _basePath: `/dashboard/contract/${contractId}`,
    index: "/",
  }),
});
