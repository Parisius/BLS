import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import Link from "next/link";
import { ContractRoutes } from "@/config/routes";
import { useMemo } from "react";
import { useIntl } from "react-intl";

export default function ContractCard({
  contractId,
  title,
  category,
  categoryType,
  categorySubType,
}) {
  const intl = useIntl();

  const categoryLabel = useMemo(() => {
    if (categoryType) {
      return `${category} - ${categoryType}`;
    }
    if (categorySubType) {
      return `${category} - ${categoryType} - ${categorySubType}`;
    }
    return category;
  }, [category, categorySubType, categoryType]);

  return (
    <Card className="w-72 sm:w-80">
      <CardHeader>
        <CardTitle className="line-clamp-2">{title}</CardTitle>
        <Badge className="line-clamp-1 w-fit bg-muted text-muted-foreground hover:bg-muted/90">
          {categoryLabel}
        </Badge>
      </CardHeader>
      <CardFooter className="justify-end gap-2">
        <Button asChild variant="link" className="gap-2 px-0 italic">
          <Link href={ContractRoutes.contractPage(contractId).index}>
            {intl.formatMessage({ id: "contract.contract.card.viewDetails" })}{" "}
            <MoveRight />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
