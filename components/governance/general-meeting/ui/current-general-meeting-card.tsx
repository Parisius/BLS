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
} from "@/lib/governance/general-meeting";
import { Button } from "@/components/ui/button";
import { GeneralMeetingRoutes } from "@/config/routes";
import Link from "next/link";
import { MoveRight } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";
export default function CurrentGeneralMeetingCard({
  meetingId,
  title,
  reference,
  meetingDate,
  meetingType,
  status,
  nextTask,
  className,
}) {
  const intl = useIntl();
  const { label: statusLabel, color } = formatStatus(status, intl);
  const { label: meetingTypeLabel } = formatMeetingType(meetingType, intl);

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="gap-3">
        <CardDescription className="italic">
          <FormattedMessage id="generalMeeting.currentMeeting_ongoingPreparation" />
        </CardDescription>
        <div className="flex items-start gap-2">
          <CardTitle className="line-clamp-2">{title}</CardTitle>
          <Badge className="bg-muted text-muted-foreground hover:bg-muted/90">
            {meetingTypeLabel}
          </Badge>
        </div>
        <CardDescription>
          <span className="font-bold">
            <FormattedMessage id="generalMeeting.currentMeeting_reference" />:
          </span>{" "}
          <span className="italic">{reference}</span>
        </CardDescription>
        <CardDescription>
          <span className="font-bold">
            <FormattedMessage id="generalMeeting.currentMeeting_meetingDate" />:
          </span>{" "}
          <span className="italic">{formatDate(meetingDate)}</span>
        </CardDescription>
        <CardDescription>
          <span className={cn("font-bold", nextTask && "text-destructive")}>
            <FormattedMessage id="generalMeeting.currentMeeting_nextTask" />:
          </span>{" "}
          <span className="italic">
            {nextTask?.title ||
              intl.formatMessage({
                id: "generalMeeting.currentMeeting_noTaskPending",
              })}
          </span>
        </CardDescription>
        <CardDescription>
          <span className={cn("font-bold", nextTask && "text-destructive")}>
            <FormattedMessage id="generalMeeting.currentMeeting_nextDeadline" />
            :
          </span>
          <span className="italic">
            {nextTask?.dueDate
              ? formatDate(nextTask.dueDate)
              : intl.formatMessage({
                  id: "generalMeeting.currentMeeting_noDeadlinePending",
                })}
          </span>
        </CardDescription>
        <div className="flex items-center justify-between gap-2">
          <Badge style={{ backgroundColor: color }}>{statusLabel}</Badge>
          <Button asChild variant="link" className="gap-2 px-0 italic">
            <Link href={GeneralMeetingRoutes.session(meetingId).index}>
              <FormattedMessage id="generalMeeting.currentMeeting_seeDetails" />
              <MoveRight />
            </Link>
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}
