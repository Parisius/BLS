"use client";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { LitigationRoutes } from "@/config/routes";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import { FormattedMessage } from "react-intl";

export default function LitigationCard({
  litigationId,
  title,
  caseNumber,
  reference,
  nature,
  jurisdiction,
  isArchived,
  className,
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="line-clamp-2 flex-1">{title}</CardTitle>
          {isArchived && (
            <Badge className="line-clamp-1 w-fit bg-muted text-muted-foreground hover:bg-muted/90">
              <FormattedMessage id="litigation.litigation.card.archived" />
            </Badge>
          )}
        </div>
        <CardDescription>
          <span className="font-bold">
            <FormattedMessage id="litigation.litigation.card.caseNumber" />
          </span>{" "}
          <span className="italic">{caseNumber}</span>
        </CardDescription>
        <CardDescription>
          <span className="font-bold">
            <FormattedMessage id="litigation.litigation.card.reference" />
          </span>{" "}
          <span className="italic">{reference}</span>
        </CardDescription>
        <CardDescription>
          <span className="font-bold">
            <FormattedMessage id="litigation.litigation.card.nature" />
          </span>{" "}
          <span className="italic">{nature}</span>
        </CardDescription>
        <CardDescription>
          <span className="font-bold">
            <FormattedMessage id="litigation.litigation.card.jurisdiction" />
          </span>{" "}
          <span className="italic">{jurisdiction}</span>
        </CardDescription>
        <div className="flex justify-end gap-2">
          <Button asChild variant="link" className="gap-2 px-0 italic">
            <Link href={LitigationRoutes.litigationPage(litigationId).index}>
              <FormattedMessage id="litigation.litigation.card.viewDetails" />
              <MoveRight />
            </Link>
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}
