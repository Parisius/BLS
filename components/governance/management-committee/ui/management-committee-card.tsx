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
import { formatSt, formatStatus } from "@/lib/governance/management-committee";
import Link from "next/link";
import { ManagementCommitteeRoutes } from "@/config/routes";
import { FormattedMessage, useIntl } from "react-intl";

export default function ManagementCommitteeCard({
  meetingId,
  title,
  reference,
  meetingDate,
  status,
}) {
  const intl = useIntl();
  const { label: statusLabel, color } = formatSt(status, intl);

  return (
    <Card className="w-72 sm:w-80">
      <CardHeader className="gap-2">
        <CardTitle className="line-clamp-2">{title}</CardTitle>
        <CardDescription>
          <span className="font-bold">
            <FormattedMessage id="managementCommittee.referenceLabel" />
          </span>{" "}
          <span className="italic">{reference}</span>
        </CardDescription>
        <CardDescription>
          <span className="font-bold">
            <FormattedMessage id="managementCommittee.meetingDateLabel" />
          </span>{" "}
          <span className="italic">{formatDate(meetingDate)}</span>
        </CardDescription>
        <div className="flex items-center justify-between gap-2">
          <Badge style={{ backgroundColor: color }}>{statusLabel}</Badge>

          <Button asChild variant="link" className="gap-2 px-0 italic">
            <Link
              key={reference}
              href={ManagementCommitteeRoutes.session(meetingId).index}
            >
              <FormattedMessage id="managementCommittee.viewDetails" />{" "}
              <MoveRight />
            </Link>
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}
