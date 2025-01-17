"use client";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate } from "@/lib/utils";
import {
  formatMeetingType,
  formatStatus,
} from "@/lib/governance/administration-meeting";
import { Button } from "@/components/ui/button";
import { AdministrationMeetingRoutes } from "@/config/routes";
import Link from "next/link";
import { MoveRight } from "lucide-react";
export default function CurrentAdministrationMeetingCard({
  meetingId,
  title,
  reference,
  meetingDate,
  meetingType,
  status,
  nextTask,
  className,
}) {
  const { label: statusLabel, color } = formatStatus(status);
  const { label: meetingTypeLabel } = formatMeetingType(meetingType);
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="gap-3">
        <CardDescription className="italic">
          Vous avez une session de CA en cours de préparation
        </CardDescription>
        <div className="flex items-center gap-2">
          <CardTitle className="line-clamp-2">{title}</CardTitle>
          <Badge className="bg-muted text-muted-foreground hover:bg-muted/90">
            {meetingTypeLabel}
          </Badge>
        </div>
        <CardDescription>
          <span className="font-bold">Ref:</span>{" "}
          <span className="italic">{reference}</span>
        </CardDescription>
        <CardDescription>
          <span className="font-bold">Date de tenue:</span>{" "}
          <span className="italic">{formatDate(meetingDate)}</span>
        </CardDescription>
        <CardDescription>
          <span className={cn("font-bold", nextTask && "text-destructive")}>
            Prochaine tâche:
          </span>{" "}
          <span className="italic">
            {nextTask?.title || "Aucune tâche en attente"}
          </span>
        </CardDescription>
        <CardDescription>
          <span className={cn("font-bold", nextTask && "text-destructive")}>
            Prochaine échéance:{" "}
          </span>
          <span className="italic">
            {nextTask?.dueDate
              ? formatDate(nextTask.dueDate)
              : "Aucune échéance en attente"}
          </span>
        </CardDescription>
        <div className="flex items-center justify-between gap-2">
          <Badge style={{ backgroundColor: color }}>{statusLabel}</Badge>
          <Button asChild variant="link" className="gap-2 px-0 italic">
            <Link href={AdministrationMeetingRoutes.session(meetingId).index}>
              Voir details <MoveRight />
            </Link>
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}
