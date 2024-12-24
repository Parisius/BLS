import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FolderPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import AddAccountIncidentDialog from "@/components/account-incident/modals/add-account-incident-dialog";
export default function CreateAccountIncidentCard({
  className,
}: {
  className?: any;
}) {
  return (
    <Card
      className={cn(
        "max-w-96 self-center sm:min-w-96 sm:max-w-[50%]",
        className
      )}
    >
      <CardHeader>
        <CardTitle>Imputer un incident</CardTitle>
        <CardDescription>Imputer un nouvel incident</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Image
          src="/account-incident/images/create-incident.svg"
          alt="Plan a session"
          width={200}
          height={200}
        />
      </CardContent>
      <CardFooter className="justify-center">
        <AddAccountIncidentDialog asChild>
          <Button className="gap-2">
            <FolderPlus />
            Nouvel incident
          </Button>
        </AddAccountIncidentDialog>
      </CardFooter>
    </Card>
  );
}
