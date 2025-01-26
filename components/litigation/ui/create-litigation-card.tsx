"use client";
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
import AddLitigationDialog from "@/components/litigation/modals/add-litigation-dialog";
import { FormattedMessage } from "react-intl";

export default function CreateLitigationCard({
  className,
}: {
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "max-w-96 self-center sm:min-w-96 sm:max-w-[50%]",
        className
      )}
    >
      <CardHeader>
        <CardTitle>
          <FormattedMessage id="litigation.litigation.createLitigationCard.title" />
        </CardTitle>
        <CardDescription>
          <FormattedMessage id="litigation.litigation.createLitigationCard.description" />
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Image
          src="/litigation/images/create-litigation.svg"
          alt="Plan a session"
          width={200}
          height={200}
        />
      </CardContent>
      <CardFooter className="justify-center">
        <AddLitigationDialog asChild>
          <Button className="gap-2">
            <FolderPlus />
            <FormattedMessage id="litigation.litigation.createLitigationCard.button" />
          </Button>
        </AddLitigationDialog>
      </CardFooter>
    </Card>
  );
}
