"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Pencil, Search, Trash } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { EditBankItemDialog } from "@/components/texts-bank/bank-item-dialogs";
import { useAllBankItems, useDeleteBankItem } from "@/lib/texts-bank/hooks";
import type { BankItem } from "@/lib/texts-bank/items";
import { KIND_KEY, type BankKind } from "@/lib/texts-bank/kinds";
import { useDictionary } from "@/lib/i18n/locale-provider";

export function BankItemsList({ kind }: { kind: BankKind }) {
  const { t } = useDictionary();
  const tk = t.textsBank.kinds[KIND_KEY[kind]];
  const tc = t.textsBank.common;
  const { data, isLoading, isError } = useAllBankItems(kind);
  const { mutateAsync: remove } = useDeleteBankItem(kind);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<BankItem | null>(null);
  const [deleting, setDeleting] = useState<BankItem | null>(null);
  const [removing, setRemoving] = useState(false);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!data || !query) return data ?? [];
    return data.filter((item) => item.title.toLowerCase().includes(query));
  }, [data, search]);

  const handleDelete = async () => {
    if (!deleting) return;
    setRemoving(true);
    try {
      await remove(deleting.id);
      toast.success(tk.deleteSuccess);
      setDeleting(null);
    } catch {
      toast.error(tk.deleteError);
    } finally {
      setRemoving(false);
    }
  };

  if (isError) return <p className="text-center text-lg italic text-destructive">{t.common.loadError}</p>;

  if (isLoading) {
    return (
      <div className="flex flex-wrap justify-center gap-10 md:gap-20">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-32 w-72 sm:w-80" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="relative mx-auto w-full max-w-md">
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={tc.search} className="pl-10" />
        <Search className="pointer-events-none absolute bottom-1/2 left-3 translate-y-1/2 text-foreground/50" />
      </div>
      {!data || data.length === 0 ? (
        <p className="text-center text-lg italic text-foreground/75">{tk.noItems}</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-lg italic text-foreground/75">{tc.noResults}</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-10 md:gap-20">
          {filtered.map((item) => {
            const href = kind === "links" ? item.link : item.fileUrl;
            return (
              <Card key={item.id} className="w-72 sm:w-80">
                <CardHeader className="pb-0">
                  <CardTitle className="line-clamp-2">{item.title}</CardTitle>
                  <CardDescription>
                    {href && (
                      <Button
                        variant="link"
                        className="gap-1 px-0 italic"
                        render={<a href={href} target="_blank" rel="noopener noreferrer" />}
                      >
                        {tk.open}
                        <ExternalLink size={14} />
                      </Button>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex items-center justify-end">
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={tc.edit}
                          className="rounded-full"
                          onClick={() => setEditing(item)}
                        />
                      }
                    >
                      <Pencil />
                    </TooltipTrigger>
                    <TooltipContent>{tc.edit}</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={tc.delete}
                          className="rounded-full text-destructive"
                          onClick={() => setDeleting(item)}
                        />
                      }
                    >
                      <Trash />
                    </TooltipTrigger>
                    <TooltipContent>{tc.delete}</TooltipContent>
                  </Tooltip>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
      <EditBankItemDialog kind={kind} item={editing} onOpenChange={(open) => !open && setEditing(null)} />
      <AlertDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{tk.deleteTitle}</AlertDialogTitle>
            <AlertDialogDescription>{tk.deleteDescription}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel type="button">{tc.cancel}</AlertDialogCancel>
            <Button variant="destructive" disabled={removing} onClick={() => void handleDelete()}>
              {removing ? "..." : tc.delete}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
