"use client";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { AccountIncidentRoutes } from "@/config/routes";
import { cn, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import { useIntl } from "react-intl";

export default function AccountIncidentCard({
  incidentId,
  title,
  reference,
  category,
  completed,
  dateReceived,
  author,
}) {
  const intl = useIntl();

  return (
    <Card className="w-72 sm:w-96">
      <CardHeader className="gap-3">
        <div className="flex items-center gap-2">
          <CardTitle className="line-clamp-2">{title}</CardTitle>
          <Badge className="line-clamp-1 bg-muted text-muted-foreground hover:bg-muted/90">
            {category}
          </Badge>
        </div>
        <CardDescription>
          <span className="font-bold">
            {intl.formatMessage({ id: "incident.incident.reference" })}:
          </span>{" "}
          <span className="italic">{reference}</span>
        </CardDescription>
        <CardDescription>
          <span className="font-bold">
            {intl.formatMessage({ id: "incident.incident.personConcerned" })}:
          </span>{" "}
          <span className="italic">{author.name}</span>
        </CardDescription>
        <CardDescription>
          <span className="font-bold">
            {intl.formatMessage({ id: "incident.incident.receivedDate" })}:
          </span>{" "}
          <span className="italic">{formatDate(dateReceived)}</span>
        </CardDescription>
        <div className="flex items-center justify-between gap-2">
          <Badge
            className={cn({
              "bg-primary": !completed,
              "bg-muted": completed,
            })}
          >
            {completed
              ? intl.formatMessage({ id: "incident.incident.resolved" })
              : intl.formatMessage({ id: "incident.incident.inProgress" })}
          </Badge>
          <Button asChild variant="link" className="gap-2 px-0 italic">
            <Link
              href={AccountIncidentRoutes.accountIncidentPage(incidentId).index}
            >
              {intl.formatMessage({ id: "incident.incident.viewDetails" })}{" "}
              <MoveRight />
            </Link>
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}
