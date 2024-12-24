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
import AddContractDialog from "@/components/contract/modals/add-contract-dialog";
export default function CreateContractCard({
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
        <CardTitle>Initier un contrat</CardTitle>
        <CardDescription>Initier un nouveau contrat</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Image
          src="/contract/images/create-contract.svg"
          alt="Plan a session"
          width={200}
          height={200}
        />
      </CardContent>
      <CardFooter className="justify-center">
        <AddContractDialog asChild>
          <Button className="gap-2">
            <FolderPlus />
            Nouveau contrat
          </Button>
        </AddContractDialog>
      </CardFooter>
    </Card>
  );
}
