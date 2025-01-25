import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { History, Pencil, Printer } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import UpdateContractDialog from "@/components/contract/modals/update-contract-dialog";
import DeleteContractButton from "@/components/contract/buttons/delete-contract-button";
import ContractForwardsDialog from "@/components/contract/modals/contract-forwards-dialog";
import PrintContractButton from "@/components/contract/buttons/print-contract-button";
import { useMemo } from "react";
import { useIntl } from "react-intl";

export function ContractDetailsTable({
  id,
  title,
  signatureDate,
  effectiveDate,
  expirationDate,
  renewalDate,
  category,
  categoryType,
  categorySubType,
  forwards,
}) {
  const intl = useIntl();

  const categoryLabel = useMemo(() => {
    if (categoryType) {
      return `${category} - ${categoryType}`;
    }
    if (categorySubType) {
      return `${category} - ${categoryType} - ${categorySubType}`;
    }
    return category;
  }, [category, categorySubType, categoryType]);

  return (
    <Table className="border">
      <TableHeader>
        <TableRow>
          <TableHead>
            {intl.formatMessage({ id: "contract.contract.detailsTable.title" })}
          </TableHead>
          <TableHead>
            {intl.formatMessage({
              id: "contract.contract.detailsTable.category",
            })}
          </TableHead>
          <TableHead>
            {intl.formatMessage({
              id: "contract.contract.detailsTable.signatureDate",
            })}
          </TableHead>
          <TableHead>
            {intl.formatMessage({
              id: "contract.contract.detailsTable.effectiveDate",
            })}
          </TableHead>
          <TableHead>
            {intl.formatMessage({
              id: "contract.contract.detailsTable.expirationDate",
            })}
          </TableHead>
          <TableHead>
            {intl.formatMessage({
              id: "contract.contract.detailsTable.renewalDate",
            })}
          </TableHead>
          <TableHead className="flex justify-center items-center">
            Actions
          </TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow className="bg-card">
          <TableCell>{title}</TableCell>
          <TableCell>
            <Badge className="bg-muted text-muted-foreground hover:bg-muted/90">
              {categoryLabel}
            </Badge>
          </TableCell>
          <TableCell>
            {signatureDate ? formatDate(signatureDate) : "-"}
          </TableCell>
          <TableCell>
            {effectiveDate ? formatDate(effectiveDate) : "-"}
          </TableCell>
          <TableCell>
            {expirationDate ? formatDate(expirationDate) : "-"}
          </TableCell>
          <TableCell>{renewalDate ? formatDate(renewalDate) : "-"}</TableCell>
          <TableCell className="text-nowrap">
            <Tooltip>
              <UpdateContractDialog asChild contractId={id}>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Pencil />
                  </Button>
                </TooltipTrigger>
              </UpdateContractDialog>
              <TooltipContent>
                {intl.formatMessage({
                  id: "contract.contract.detailsTable.edit",
                })}
              </TooltipContent>
            </Tooltip>

            <DeleteContractButton contractId={id} />

            <Tooltip>
              <TooltipTrigger asChild>
                <PrintContractButton
                  contractId={id}
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                >
                  <Printer />
                </PrintContractButton>
              </TooltipTrigger>
              <TooltipContent>
                {intl.formatMessage({
                  id: "contract.contract.detailsTable.print",
                })}
              </TooltipContent>
            </Tooltip>

            {forwards && forwards?.length > 0 && (
              <Tooltip>
                <ContractForwardsDialog asChild forwards={forwards}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <History />
                    </Button>
                  </TooltipTrigger>
                </ContractForwardsDialog>
                <TooltipContent>
                  {intl.formatMessage({
                    id: "contract.contract.detailsTable.transferHistory",
                  })}
                </TooltipContent>
              </Tooltip>
            )}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
