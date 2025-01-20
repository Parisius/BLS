import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { formatStatus } from "@/lib/governance/administration-meeting";
import Link from "next/link";
import { AdministrationMeetingRoutes } from "@/config/routes";
import { FormattedMessage, useIntl } from "react-intl";
export default function AdministrationMeetingCard({
  meetingId,
  title,
  reference,
  meetingDate,
  status,
}) {
  const intl = useIntl();
  const { label: statusLabel, color } = formatStatus(status, intl);
  return (
    <Card className="w-72 sm:w-80">
      <CardHeader className="gap-2">
        <CardTitle className="line-clamp-2">{title}</CardTitle>
        <CardDescription>
          <span className="font-bold">
            <FormattedMessage id="sessionAdministrator.reference_label" />:
          </span>{" "}
          <span className="italic">{reference}</span>
        </CardDescription>
        <CardDescription>
          <span className="font-bold">
            <FormattedMessage id="sessionAdministrator.meeting_date_label" />:
          </span>{" "}
          <span className="italic">{formatDate(meetingDate)}</span>
        </CardDescription>
        <div className="flex items-center justify-between gap-2">
          <Badge style={{ backgroundColor: color }}>{statusLabel}</Badge>

          <Button asChild variant="link" className="gap-2 px-0 italic">
            <Link
              key={reference}
              href={AdministrationMeetingRoutes.session(meetingId).index}
            >
              <FormattedMessage id="sessionAdministrator.view_details" />:
              <MoveRight />
            </Link>
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}
