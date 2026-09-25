"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Component } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllMeetings } from "@/lib/governance/administration-meeting/hooks";
import { formatDisplayDate } from "@/lib/shared/date-utils";
import { useDictionary } from "@/lib/i18n/locale-provider";

export default function AdministrationMeetingArchivesPage() {
  const { data, isLoading } = useAllMeetings("closed");
  const { t } = useDictionary();
  const tg = t.administrationMeeting;
  const [search, setSearch] = useState("");
  const [year, setYear] = useState<string>("all");

  const years = useMemo(() => {
    const set = new Set((data ?? []).map((m) => (m.meetingDate ? new Date(m.meetingDate).getFullYear() : null)));
    return [...set].filter((y): y is number => y != null).sort((a, b) => b - a);
  }, [data]);

  const filtered = (data ?? []).filter((meeting) => {
    const matchesSearch = meeting.title.toLowerCase().includes(search.toLowerCase());
    const matchesYear = year === "all" || (meeting.meetingDate && new Date(meeting.meetingDate).getFullYear() === Number(year));
    return matchesSearch && matchesYear;
  });

  return (
    <div className="container flex flex-1 flex-col gap-10 py-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/dashboard/modules" />}>
              <Component />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/dashboard/governance" />}>
              {tg.breadcrumb.governance}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/dashboard/governance/administration-meeting" />}>
              {tg.breadcrumb.administrationMeeting}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{tg.archivesPage.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-center text-2xl font-bold sm:text-3xl md:text-4xl">{tg.archivesPage.title}</h1>

      <div className="mx-auto flex w-full max-w-lg gap-2">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={tg.attendantsTable.search}
          className="h-12 flex-1"
        />
        <Select
          value={year}
          onValueChange={(next) => setYear(next ?? "all")}
          items={[
            { value: "all", label: tg.archivesPage.yearFilter },
            ...years.map((y) => ({ value: String(y), label: String(y) })),
          ]}
        >
          <SelectTrigger className="h-12 w-40">
            <SelectValue placeholder={tg.archivesPage.yearFilter} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{tg.archivesPage.yearFilter}</SelectItem>
            {years.map((y) => (
              <SelectItem key={y} value={String(y)}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading && <Skeleton className="h-40 w-full" />}

      {!isLoading && filtered.length === 0 && (
        <p className="text-center italic text-muted-foreground">
          {search ? tg.archivesPage.noArchivedResult : tg.archivesPage.noArchived}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
        {filtered.map((meeting) => (
          <Link href={`/dashboard/governance/administration-meeting/${meeting.id}`} key={meeting.id}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="line-clamp-2">{meeting.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {meeting.meetingDate ? formatDisplayDate(meeting.meetingDate) : "-"}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
