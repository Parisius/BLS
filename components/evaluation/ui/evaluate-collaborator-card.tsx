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
import { Scale } from "lucide-react";
import { cn } from "@/lib/utils";
import AddEvaluationDialog from "@/components/evaluation/modals/add-evaluation-dialog";
export default function EvaluateCollaboratorCard({
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
        <CardTitle>Evaluer</CardTitle>
        <CardDescription>Evaluer un collaborateur</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Image
          src="/evaluation/images/create-evaluation.svg"
          alt="Evaluer"
          width={200}
          height={200}
        />
      </CardContent>
      <CardFooter className="justify-center">
        <AddEvaluationDialog asChild>
          <Button className="gap-2">
            <Scale />
            Evaluer un collaborateur
          </Button>
        </AddEvaluationDialog>
      </CardFooter>
    </Card>
  );
}
