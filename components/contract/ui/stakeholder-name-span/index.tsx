import { StakeholderNameSpanComponent } from "./component";
import { StakeholderNameSpanErrorBoundary } from "./error";

interface StakeholderNameSpanProps {
  stakeholderId: string;
  className?: string;
  [key: string]: any;
}

export default function StakeholderNameSpan({
  stakeholderId,
  className,
  ...props
}: StakeholderNameSpanProps) {
  return (
    <StakeholderNameSpanErrorBoundary className={className}>
      <StakeholderNameSpanComponent
        stakeholderId={stakeholderId}
        className={className}
        {...props}
      />
    </StakeholderNameSpanErrorBoundary>
  );
}
