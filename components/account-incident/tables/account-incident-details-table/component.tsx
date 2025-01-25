import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Printer } from "lucide-react";
import PrintAccountIncidentButton from "@/components/account-incident/buttons/print-account-incident-button";
import { useIntl } from "react-intl";

export function AccountIncidentDetailsTable({
  incidentId,
  title,
  reference,
  dateReceived,
  isClient,
  isCompleted,
  category,
  author,
  currentTask,
}) {
  const intl = useIntl();

  return (
    <Table className="border">
      <TableHeader>
        <TableRow>
          <TableHead>
            {intl.formatMessage({ id: "incident.table.title" })}
          </TableHead>
          <TableHead>
            {intl.formatMessage({ id: "incident.table.reference" })}
          </TableHead>
          <TableHead>
            {intl.formatMessage({ id: "incident.table.category" })}
          </TableHead>
          <TableHead>
            {intl.formatMessage({ id: "incident.table.personConcerned" })}
          </TableHead>
          <TableHead>
            {intl.formatMessage({ id: "incident.table.isClient" })}
          </TableHead>
          <TableHead>
            {intl.formatMessage({ id: "incident.table.dateReceived" })}
          </TableHead>
          <TableHead className={cn(currentTask && "text-destructive")}>
            {intl.formatMessage({ id: "incident.table.nextTask" })}
          </TableHead>
          <TableHead>
            {intl.formatMessage({ id: "incident.table.status" })}
          </TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow className="bg-card">
          <TableCell>{title}</TableCell>
          <TableCell>{reference}</TableCell>
          <TableCell>
            <Badge className="text-nowrap bg-muted text-muted-foreground">
              {category}
            </Badge>
          </TableCell>
          <TableCell>{author.name}</TableCell>
          <TableCell>
            <Badge className="text-nowrap bg-muted text-muted-foreground">
              {isClient
                ? intl.formatMessage({ id: "incident.table.yes" })
                : intl.formatMessage({ id: "incident.table.no" })}
            </Badge>
          </TableCell>
          <TableCell>{formatDate(dateReceived)}</TableCell>
          <TableCell className={cn(currentTask && "text-destructive")}>
            {currentTask?.title ??
              intl.formatMessage({ id: "incident.table.noTask" })}
          </TableCell>
          <TableCell>
            <Badge
              className={cn("text-nowrap", {
                "bg-primary": !isCompleted,
                "bg-muted text-muted-foreground hover:bg-muted/90": isCompleted,
              })}
            >
              {isCompleted
                ? intl.formatMessage({ id: "incident.incident.resolved" })
                : intl.formatMessage({ id: "incident.incident.inProgress" })}
            </Badge>
          </TableCell>
          <TableCell>
            <Tooltip>
              <TooltipTrigger asChild>
                <PrintAccountIncidentButton
                  incidentId={incidentId}
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                >
                  <Printer />
                </PrintAccountIncidentButton>
              </TooltipTrigger>
              <TooltipContent>
                {intl.formatMessage({ id: "incident.table.print" })}
              </TooltipContent>
            </Tooltip>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
