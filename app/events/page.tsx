"use client";

import MainLayout from "@/components/layout/main";
import { DataTable } from "@/components/ui/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  CaretSortIcon,
  DotsHorizontalIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Doc, Id } from "@/convex/_generated/dataModel";
import {
  useMutationWithAuth,
  useQueryWithAuth,
} from "@convex-dev/convex-lucia-auth/react";
import { api } from "@/convex/_generated/api";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { FaXTwitter, FaDiscord, FaTelegram, FaGlobe } from "react-icons/fa6";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type EventType = Doc<"events">;
type Network = "twitter" | "discord" | "telegram" | "website";
type ActionType = "follow" | "post" | "join" | "visit";

export default function Events() {
  const events = useQueryWithAuth(api.queries.fetchEvents, {});
  const deleteEvent = useMutationWithAuth(api.mutations.deleteEventWithId);

  // Editable modal open state
  const [open, setOpen] = useState<boolean>(false);
  const [editableEvent, setEditableEvent] = useState<Doc<"events"> | null>(
    null,
  );

  useEffect(() => {
    if (editableEvent) {
      setOpen(true);
    }
  }, [editableEvent]);

  const columns: ColumnDef<EventType>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "reward",
      header: "Reward",
      cell: ({ row }) => {
        const reward: number = row.getValue("reward");
        return (
          <div className="uppercase">XP {reward.toLocaleString("en-US")}</div>
        );
      },
    },
    // {
    //   accessorKey: "company",
    //   accessorFn: (ogRow, index) => ogRow.company,
    //   header: "Company",
    //   cell: ({ row }) => {
    //     // const action = row.getValue("action");
    //     const event = row.original;

    //     const getIcon = (url: string) => {
    //       return <img src={url} width={20} height={20} />;
    //     };

    //     return (
    //       <div className="flex items-center gap-2 capitalize">
    //         {getIcon(event?.company.logoUrl)}
    //         {event?.company.name}
    //       </div>
    //     );
    //   },
    // },

    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const event = row.original;

        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <DotsHorizontalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="mb-1 hover:cursor-pointer"
                  onClick={() => {
                    // setEditableTaskIndex(row.index);
                    setEditableEvent(event);
                  }}
                >
                  Edit event
                </DropdownMenuItem>

                {/* <DropdownMenuItem>View customer</DropdownMenuItem> */}
                <DropdownMenuItem
                  className="bg-red-500 hover:cursor-pointer"
                  onClick={async () => {
                    await deleteEvent({ eventId: event._id });
                  }}
                >
                  Delete event
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
    },
  ];

  return (
    <MainLayout>
      <div className="mt-5 flex w-full flex-col gap-8">
        <div className="h-full w-full flex-1 flex-col space-y-8 p-8 md:flex">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Events</h2>
              <p className="text-muted-foreground">
                Here&apos;s a list of all events that will show up in the mobile
                app
              </p>
            </div>
          </div>
          <DataTable
            filterVisible={false}
            data={events ?? []}
            columns={columns}
            extra={
              <Button className="gap-1" onClick={() => setOpen(true)}>
                <PlusIcon className="h-4 w-4 font-bold" /> Add event
              </Button>
            }
          />
        </div>
        <EventDialog
          open={open}
          event={editableEvent}
          onOpenChange={(open) => setOpen(open)}
        />
      </div>
    </MainLayout>
  );
}

interface IEventDialogProps {
  children?: React.ReactNode;
  event: Doc<"events"> | undefined | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
function EventDialog({
  children,
  event,
  open,
  onOpenChange,
}: IEventDialogProps) {
  // Add task state
  const [title, setTitle] = useState("");
  const [reward, setReward] = useState(0);
  const [companyId, setCompanyId] = useState<Id<"company">>();
  const [actions, setActions] = useState<
    { name: string; link: string; channel: Network; type: ActionType }[]
  >([]);

  const updateEvent = useMutationWithAuth(api.mutations.updateEvent);
  const createEvent = useMutationWithAuth(api.mutations.createEvent);
  const getCompanies = useQueryWithAuth(api.queries.fetchCompanies, {});

  useEffect(() => {
    if (event) {
      setTitle(event?.title);
      setReward(event?.reward);
      setCompanyId(event?.companyId);
      setActions(event?.actions);
    }
  }, [event]);

  // Action array dsipatch handler
  function set(key: string, at: number, value: any) {
    const newActions = actions?.map((action, i) => {
      if (i === at) {
        return {
          ...action,
          [key]: value,
          ...(key === "channel" && {
            type: (value === "website"
              ? "visit"
              : value === "twitter"
                ? "follow"
                : "join") as ActionType,
          }),
        };
      } else {
        return action;
      }
    });

    setActions(newActions);
  }

  // company dialog controls
  const [openCompanyDialog, setOpenCompanyDialog] = useState(false);
  useEffect(() => {
    if (companyId === "new") {
      setOpenCompanyDialog(true);
    }
  }, [companyId]);

  useEffect(() => console.log(actions), [actions]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange} key={event?._id}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent>
        <DialogTitle>{event ? "Edit event" : "Create a new event"}</DialogTitle>
        <div className="grid w-full items-center justify-start gap-2">
          <div>
            <Label htmlFor="title">Event Title</Label>
            <Input
              name="title"
              id="title"
              placeholder="Title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="max-w-sm"
            />
          </div>
          <div>
            <Label htmlFor="reward">Reward</Label>
            <Input
              name="reward"
              id="reward"
              type="number"
              placeholder="Reward"
              value={reward}
              onChange={(event) => setReward(event.target.valueAsNumber)}
              className="max-w-sm"
            />
          </div>
          <div>
            <Label htmlFor="type">Select company</Label>
            <Select
              name="type"
              value={companyId}
              onValueChange={(value: Id<"company">) => {
                setCompanyId(value);
              }}
            >
              <SelectTrigger className="max-w-sm">
                <SelectValue placeholder="Select a company" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Companies</SelectLabel>
                  {getCompanies?.map((company) => (
                    <SelectItem
                      disabled={!company?.isApproved}
                      key={company?._id}
                      value={company?._id}
                    >
                      {company?.name}
                    </SelectItem>
                  ))}

                  {/* Launch another modal and create new company, then return here and select it */}

                  <SelectItem value="new">Creat new company</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-10 grid w-full gap-2">
            <div className="flex items-center justify-between">
              <h1 className="font-medium">Actions</h1>
              <Button
                size="sm"
                onClick={() => {
                  setActions([
                    ...actions,
                    { name: "", link: "", channel: "discord", type: "join" },
                  ]);
                }}
              >
                Add action
              </Button>
            </div>
            {actions?.map((action, index) => {
              return (
                <div
                  key={index}
                  className="grid grid-cols-2 gap-3 rounded-lg border border-gray-600 p-3"
                >
                  <div>
                    <Label htmlFor="name">Action name</Label>
                    <Input
                      id="name"
                      placeholder="Enter name"
                      value={action?.name}
                      onChange={(e) => set("name", index, e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="socials">Channel</Label>
                    <ToggleGroup
                      id="socials"
                      type="single"
                      className="justify-start"
                      // defaultValue={action?.channel}
                      value={action?.channel}
                      onValueChange={(value: Network) => {
                        console.log(value, ":::Network");
                        // switch (value) {
                        //   case "twitter":
                        //     set("type", index, "follow");
                        //     break;
                        //   case "discord":
                        //   case "telegram":
                        //     set("type", index, "join");
                        //     break;
                        //   case "website":
                        //     set("type", index, "visit");
                        //     break;
                        //   default:
                        //     set("type", index, "follow");
                        //     break;
                        // }
                        set("channel", index, value);
                      }}
                    >
                      <ToggleGroupItem
                        value="twitter"
                        aria-label="Toggle twitter"
                      >
                        <FaXTwitter className="h-4 w-4" />
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="discord"
                        aria-label="Toggle discord"
                      >
                        <FaDiscord className="h-4 w-4" />
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="telegram"
                        aria-label="Toggle telegram"
                      >
                        <FaTelegram className="h-4 w-4" />
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="website"
                        aria-label="Toggle website"
                      >
                        <FaGlobe className="h-4 w-4" />
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                  <div>
                    <Label htmlFor="type">Select action type</Label>
                    <Select
                      name="type"
                      value={action?.type}
                      onValueChange={(value: ActionType) =>
                        set("type", index, value)
                      }
                    >
                      <SelectTrigger className="max-w-sm">
                        <SelectValue placeholder="Select a action type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Type</SelectLabel>
                          {action?.channel === "twitter" && (
                            <SelectItem value="follow">Follow</SelectItem>
                          )}
                          {action?.channel === "twitter" && (
                            <SelectItem value="post">Post</SelectItem>
                          )}
                          {(action?.channel === "discord" ||
                            action?.channel === "telegram") && (
                            <SelectItem value="join">Join</SelectItem>
                          )}
                          {action?.channel === "website" && (
                            <SelectItem value="visit">Visit</SelectItem>
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="link">
                      {action?.channel === "twitter"
                        ? "Twitter entity"
                        : "Link"}
                    </Label>
                    <Input
                      name="link"
                      id="link"
                      placeholder={
                        action?.channel === "twitter"
                          ? "Entity handle or URL"
                          : `${action?.channel} Link`
                      }
                      value={action?.link}
                      onChange={(event) =>
                        set("link", index, event.target.value)
                      }
                      className="max-w-sm"
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <DialogClose asChild>
            <Button
              onClick={async () => {
                if (event) {
                  await updateEvent({
                    eventId: event?._id as Id<"events">,
                    title,
                    reward,
                    companyId: companyId as Id<"company">,
                    actions: actions
                      ? actions.map(({ name, link, type, channel }) => ({
                          name,
                          link,
                          type,
                          channel,
                        }))
                      : [],
                  });
                } else {
                  if (!actions?.length) {
                    return alert("At least 1 action must be given");
                  }

                  await createEvent({
                    title,
                    reward,
                    companyId: companyId as Id<"company">,
                    actions: actions.map(({ name, link, type, channel }) => ({
                      name,
                      link,
                      type,
                      channel,
                    })),
                  });
                }
              }}
            >
              {event ? "Update" : "Create"}
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
      <CompanyCreateDialog
        open={openCompanyDialog}
        onOpenChange={(open) => setOpenCompanyDialog(open)}
      />
    </Dialog>
  );
}

interface ICompanyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // children: React.ReactNode;
}
function CompanyCreateDialog({
  open,
  onOpenChange,
  // children,
}: ICompanyDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* <DialogTrigger asChild>{children}</DialogTrigger>/ */}
      <DialogContent>
        <DialogTitle>Create a new company</DialogTitle>
        <div className="grid w-full items-center justify-start gap-2"></div>
      </DialogContent>
    </Dialog>
  );
}
