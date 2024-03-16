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
import { CaretSortIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Doc } from "@/convex/_generated/dataModel";
import {
  useMutationWithAuth,
  useQueryWithAuth,
} from "@convex-dev/convex-lucia-auth/react";
import { api } from "@/convex/_generated/api";

export default function Users() {
  type UserType = Omit<
    Doc<"user">,
    "speedBoost" | "botBoost" | "password" | "otpSecret" | "miningStartTime"
  >;
  const users = useQueryWithAuth(api.queries.fetchUsers, {});
  const deleteUser = useMutationWithAuth(api.mutations.deleteUserWithId);

  const columns: ColumnDef<UserType>[] = [
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
      accessorKey: "nickname",
      header: "Nickname",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("nickname")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "referralCode",
      header: "Referral Code",
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("referralCode")}</div>
      ),
    },
    {
      accessorKey: "referralCount",
      header: "Number of Referral",
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("referralCount")}</div>
      ),
    },
    {
      accessorKey: "xpCount",
      header: "XP Earned",
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("xpCount")}</div>
      ),
    },
    {
      accessorKey: "minedCount",
      header: () => <div className="text-right">Mined</div>,
      cell: ({ row }) => {
        const mined = parseFloat(row.getValue("minedCount"));

        // Format the amount as a dollar amount
        const formatted = `$EN ${mined}`;

        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "redeemableCount",
      header: () => <div className="text-right">Redeemable</div>,
      cell: ({ row }) => {
        const redeemable = parseFloat(row.getValue("redeemableCount"));

        // Format the amount as a dollar amount
        const formatted = `$EN ${redeemable}`;

        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              {/* <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(payment.id)}
              >
                Copy payment ID
              </DropdownMenuItem> */}
              <DropdownMenuSeparator />
              {/* <DropdownMenuItem>View customer</DropdownMenuItem> */}
              <DropdownMenuItem
                className="bg-red-500 hover:cursor-pointer"
                onClick={async (e) => {
                  await deleteUser({ userId: user._id });
                }}
              >
                Delete user{" "}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
              <h2 className="text-2xl font-bold tracking-tight">
                Welcome back!
              </h2>
              <p className="text-muted-foreground">
                Here&apos;s a list of all your users
              </p>
            </div>
            {/* <div className="flex items-center space-x-2">
                <UserNav />
              </div> */}
          </div>
          <DataTable data={users ?? []} columns={columns} />
        </div>
      </div>
    </MainLayout>
  );
}
