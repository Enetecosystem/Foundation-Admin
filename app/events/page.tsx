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

type EventType = Doc<"events"> & { company: Doc<"company"> };
type Network = "twitter" | "discord" | "telegram" | "website";
type ActionType = "follow" | "post" | "join" | "visit";

export default function Events() {
  const events = useQueryWithAuth(api.queries.fetchEvents, {});
  const deleteEvent = useMutationWithAuth(api.mutations.deleteEventWithId);
  const createEvent = useMutationWithAuth(api.mutations.createEvent);

  // Add task state
  const [name, setName] = useState("");
  const [reward, setReward] = useState(0);
  const [network, setNetwork] = useState<Network>("twitter");
  const [actionType, setActionType] = useState<ActionType>("follow");
  const [link, setLink] = useState("");

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

  // const columns: ColumnDef<EventType>[] = [
  //   {
  //     id: "select",
  //     header: ({ table }) => (
  //       <Checkbox
  //         checked={
  //           table.getIsAllPageRowsSelected() ||
  //           (table.getIsSomePageRowsSelected() && "indeterminate")
  //         }
  //         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //         aria-label="Select all"
  //       />
  //     ),
  //     cell: ({ row }) => (
  //       <Checkbox
  //         checked={row.getIsSelected()}
  //         onCheckedChange={(value) => row.toggleSelected(!!value)}
  //         aria-label="Select row"
  //       />
  //     ),
  //     enableSorting: false,
  //     enableHiding: false,
  //   },
  //   {
  //     accessorKey: "name",
  //     header: "Name",
  //     cell: ({ row }) => (
  //       <div className="capitalize">{row.getValue("name")}</div>
  //     ),
  //   },
  //   {
  //     accessorKey: "reward",
  //     header: "Reward",
  //     cell: ({ row }) => {
  //       const reward: number = row.getValue("reward");
  //       return (
  //         <div className="uppercase">XP {reward.toLocaleString("en-US")}</div>
  //       );
  //     },
  //   },
  //   {
  //     accessorKey: "company",
  //     accessorFn: (ogRow, index) => ogRow.company,
  //     header: "Company",
  //     cell: ({ row }) => {
  //       // const action = row.getValue("action");
  //       const event = row.original;

  //       const getIcon = (url: string) => {
  //         return <img src={url} width={20} height={20} />;
  //       };

  //       return (
  //         <div className="flex items-center gap-2 capitalize">
  //           {getIcon(event?.company.logoUrl)}
  //           {event?.company.name}
  //         </div>
  //       );
  //     },
  //   },

  //   {
  //     id: "actions",
  //     enableHiding: false,
  //     cell: ({ row }) => {
  //       const event = row.original;

  //       return (
  //         <>
  //           <DropdownMenu>
  //             <DropdownMenuTrigger asChild>
  //               <Button variant="ghost" className="h-8 w-8 p-0">
  //                 <span className="sr-only">Open menu</span>
  //                 <DotsHorizontalIcon className="h-4 w-4" />
  //               </Button>
  //             </DropdownMenuTrigger>
  //             <DropdownMenuContent align="end">
  //               <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //               <DropdownMenuSeparator />

  //               <DropdownMenuItem
  //                 className="mb-1 hover:cursor-pointer"
  //                 onClick={() => {
  //                   // setEditableTaskIndex(row.index);
  //                   setEditableEvent(event);
  //                 }}
  //               >
  //                 Edit event
  //               </DropdownMenuItem>

  //               {/* <DropdownMenuItem>View customer</DropdownMenuItem> */}
  //               <DropdownMenuItem
  //                 className="bg-red-500 hover:cursor-pointer"
  //                 onClick={async () => {
  //                   await deleteEvent({ eventId: event._id });
  //                 }}
  //               >
  //                 Delete event
  //               </DropdownMenuItem>
  //             </DropdownMenuContent>
  //           </DropdownMenu>
  //         </>
  //       );
  //     },
  //   },
  // ];

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
          {/* <DataTable
            filterVisible={false}
            data={events ?? []}
            columns={columns}
            extra={
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-1">
                    <PlusIcon className="h-4 w-4 font-bold" /> Add event
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>Create a new task</DialogTitle>
                  <div className="grid w-full items-center justify-start gap-2">
                    <div>
                      <Label htmlFor="task_name">Task Name</Label>
                      <Input
                        name="task_name"
                        id="task_name"
                        placeholder="Task name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
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
                        onChange={(event) =>
                          setReward(event.target.valueAsNumber)
                        }
                        className="max-w-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="socials">Social Network</Label>
                      <ToggleGroup
                        id="socials"
                        type="single"
                        className="justify-start"
                        defaultValue={network}
                        value={network}
                        onValueChange={(value: Network) => {
                          setNetwork(value);
                          switch (value) {
                            case "twitter" as Network:
                              setActionType("follow");
                              break;
                            case "discord" as Network:
                            case "telegram" as Network:
                              setActionType("join");
                              break;
                            case "website" as Network:
                              setActionType("visit");
                              break;
                            default:
                              setActionType("follow");
                              break;
                          }
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
                        value={actionType}
                        onValueChange={(value: ActionType) =>
                          setActionType(value)
                        }
                      >
                        <SelectTrigger className="max-w-sm">
                          <SelectValue placeholder="Select a action type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Type</SelectLabel>
                            {network === "twitter" && (
                              <SelectItem value="follow">Follow</SelectItem>
                            )}
                            {network === "twitter" && (
                              <SelectItem value="post">Post</SelectItem>
                            )}
                            {(network === "discord" ||
                              network === "telegram") && (
                              <SelectItem value="join">Join</SelectItem>
                            )}
                            {network === "website" && (
                              <SelectItem value="visit">Visit</SelectItem>
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="link">
                        {network === "twitter" ? "Twitter entity" : "Link"}
                      </Label>
                      <Input
                        name="link"
                        id="link"
                        placeholder={
                          network === "twitter"
                            ? "Entity handle or URL"
                            : `${network} Link`
                        }
                        value={link}
                        onChange={(event) => setLink(event.target.value)}
                        className="max-w-sm"
                      />
                    </div>
                    <DialogClose asChild>
                      <Button
                        onClick={async () => {
                          // await addTask({
                          //   name,
                          //   reward,
                          //   action: {
                          //     socialNetwork: network,
                          //     link,
                          //     type: actionType,
                          //   },
                          // });
                        }}
                      >
                        Create
                      </Button>
                    </DialogClose>
                  </div>
                </DialogContent>
              </Dialog>
            }
          /> */}
        </div>
        <EditableTaskDialog
          open={open}
          event={editableEvent}
          onOpenChange={(open) => setOpen(open)}
        />
      </div>
    </MainLayout>
  );
}

interface IEditableTaskProps {
  event: Doc<"events"> | undefined | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
function EditableTaskDialog({ event, open, onOpenChange }: IEditableTaskProps) {
  // Add task state
  const [nameEditable, setEditableName] = useState("");
  const [rewardEditable, setEditableReward] = useState(0);
  const [networkEditable, setEditableNetwork] = useState<Network>("twitter");
  const [actionTypeEditable, setEditableActionType] =
    useState<ActionType>("follow");
  const [linkEditable, setEditableLink] = useState("");

  const updateEvent = useMutationWithAuth(api.mutations.updateEvent);

  useEffect(() => {
    if (event) {
      setEditableName(event?.title);
      setEditableReward(event?.reward);
      // setEditableNetwork(event?.action?.socialNetwork);
      // setEditableActionType(event?.action?.type);
      // setEditableLink(event?.action?.link);
    }
  }, [event]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange} key={event?._id}>
      {/* <DialogTrigger asChild>{children}</DialogTrigger> */}
      <DialogContent>
        <DialogTitle>Edit a new task</DialogTitle>
        <div className="grid w-full items-center justify-start gap-2">
          <div>
            <Label htmlFor="task_name">Task Name</Label>
            <Input
              name="task_name"
              id="task_name"
              placeholder="Task name"
              value={nameEditable}
              onChange={(event) => setEditableName(event.target.value)}
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
              value={rewardEditable}
              onChange={(event) =>
                setEditableReward(event.target.valueAsNumber)
              }
              className="max-w-sm"
            />
          </div>
          <div>
            <Label htmlFor="socials">Social Network</Label>
            <ToggleGroup
              id="socials"
              type="single"
              className="justify-start"
              defaultValue={networkEditable}
              value={networkEditable}
              onValueChange={(value: Network) => {
                setEditableNetwork(value);
                switch (value) {
                  case "twitter":
                    setEditableActionType("follow");
                    break;
                  case "discord":
                  case "telegram":
                    setEditableActionType("join");
                    break;
                  case "website":
                    setEditableActionType("visit");
                    break;
                  default:
                    setEditableActionType("follow");
                    break;
                }
              }}
            >
              <ToggleGroupItem value="twitter" aria-label="Toggle twitter">
                <FaXTwitter className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="discord" aria-label="Toggle discord">
                <FaDiscord className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="telegram" aria-label="Toggle telegram">
                <FaTelegram className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="website" aria-label="Toggle website">
                <FaGlobe className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div>
            <Label htmlFor="type">Select action type</Label>
            <Select
              name="type"
              value={actionTypeEditable}
              onValueChange={(value: ActionType) =>
                setEditableActionType(value)
              }
            >
              <SelectTrigger className="max-w-sm">
                <SelectValue placeholder="Select a action type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Type</SelectLabel>
                  {networkEditable === "twitter" && (
                    <SelectItem value="follow">Follow</SelectItem>
                  )}
                  {networkEditable === "twitter" && (
                    <SelectItem value="post">Post</SelectItem>
                  )}
                  {(networkEditable === "discord" ||
                    networkEditable === "telegram") && (
                    <SelectItem value="join">Join</SelectItem>
                  )}
                  {networkEditable === "website" && (
                    <SelectItem value="visit">Visit</SelectItem>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="link">
              {networkEditable === "twitter" ? "Twitter entity" : "Link"}
            </Label>
            <Input
              name="link"
              id="link"
              placeholder={
                networkEditable === "twitter"
                  ? "Entity handle or URL"
                  : `${networkEditable} Link`
              }
              value={linkEditable}
              onChange={(event) => setEditableLink(event.target.value)}
              className="max-w-sm"
            />
          </div>
          <DialogClose asChild>
            <Button
              onClick={async () => {
                // await updateEvent({
                //   eventId: event?._id as Id<"events">,
                //   title: nameEditable,
                //   reward: rewardEditable,
                //   action: {
                //     socialNetwork: networkEditable,
                //     link: linkEditable,
                //     type: actionTypeEditable,
                //   },
                // });
              }}
            >
              Update
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
