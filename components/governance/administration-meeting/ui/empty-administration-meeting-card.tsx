import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import AddAdministrationMeetingDialog from "@/components/governance/administration-meeting/modals/add-administration-meeting-dialog";
import { Button } from "@/components/ui/button";
import { FolderPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormattedMessage } from "react-intl";
export default function EmptyAdministrationMeetingCard({ className }) {
  return (
    <Card className={cn("max-w-96", className)}>
      <CardHeader>
        <CardTitle>
          <FormattedMessage id="sessionAdministrator.plan_meeting_card_title" />
        </CardTitle>
        <CardDescription>
          <FormattedMessage id="sessionAdministrator.plan_meeting_card_description" />
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Image
          src="/governance/administration-meeting/images/plan-session.svg"
          alt="Plan a session"
          width={200}
          height={200}
        />
      </CardContent>
      <CardFooter className="justify-center">
        <AddAdministrationMeetingDialog asChild>
          <Button className="gap-2">
            <FolderPlus />
            <FormattedMessage id="sessionAdministrator.plan_meeting_card_button" />
          </Button>
        </AddAdministrationMeetingDialog>
      </CardFooter>
    </Card>
  );
}
