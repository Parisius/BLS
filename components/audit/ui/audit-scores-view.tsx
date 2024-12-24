import { Tag, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Fragment } from "react";

interface AuditScoresViewProps {
  label: string;
  globalScore: string;
  scores: any;
  className?: string;
}

export default function AuditScoresView({
  label,
  globalScore,
  scores,
  className,
}: AuditScoresViewProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col gap-5 rounded-xl border-2 p-5",
        className
      )}
    >
      {label && (
        <span className="absolute left-3 top-0 -translate-y-1/2 bg-background px-2 text-sm font-semibold">
          {label}
        </span>
      )}
      {globalScore && (
        <span className="absolute right-3 top-0 -translate-y-1/2 bg-background px-2 text-sm font-semibold">
          Note globale: {globalScore}
        </span>
      )}
      <div className="grid grid-cols-3 gap-5">
        <span className="col-span-2">Critère</span>
        <span>Note</span>

        {scores.map(({ criteria, score }) => (
          <Fragment key={criteria.id}>
            <div className="col-span-2 flex items-center gap-2">
              <User className="flex-shrink-0" />
              <span>{criteria.title}</span>
            </div>

            <div className="flex items-center gap-2">
              <Tag />
              <span>
                {score} / {criteria.maxScore}
              </span>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
