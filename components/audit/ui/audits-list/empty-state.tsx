import { CalendarX } from "lucide-react";

export const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-10 flex-1 text-center">
    <CalendarX className="h-16 w-16 text-muted-foreground mb-4" />
    <h3 className="text-lg font-semibold">Aucun audit planifié</h3>
    <p className="text-sm text-muted-foreground mt-2">
      Il n&apos;y a actuellement aucun audit planifié à afficher.
    </p>
  </div>
);

export default EmptyState;
