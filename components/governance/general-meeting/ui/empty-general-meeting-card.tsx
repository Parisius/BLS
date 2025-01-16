import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import AddGeneralMeetingDialog from "@/components/governance/general-meeting/modals/add-general-meeting-dialog";
import { Button } from "@/components/ui/button";
import { FolderPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormattedMessage } from "react-intl";
export default function EmptyGeneralMeetingCard({ className }) {
  return (
    <Card className={cn("max-w-96", className)}>
      <CardHeader>
        <CardTitle>
          <FormattedMessage id="generalMeeting.currentMeeting_ongoingPreparation_title" />
        </CardTitle>
        <CardDescription>
          <FormattedMessage id="generalMeeting.currentMeeting_ongoingPreparation" />
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Image
          src="/governance/general-meeting/images/plan-session.svg"
          alt="Plan a session"
          width={200}
          height={200}
        />
      </CardContent>
      <CardFooter className="justify-center">
        <AddGeneralMeetingDialog asChild>
          <Button className="gap-2">
            <FolderPlus />
            <FormattedMessage id="generalMeeting.currentMeeting_ongoingPreparation_cta" />
          </Button>
        </AddGeneralMeetingDialog>
      </CardFooter>
    </Card>
  );
}
