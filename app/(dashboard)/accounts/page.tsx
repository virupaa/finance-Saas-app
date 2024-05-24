"use client";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNewAccount } from "@/features/accounts/hooks/use-new-account";
import { ColumnDef } from "@tanstack/react-table";
import { columns } from "./columns";
import { DataTable } from "@/components/datatable";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { accounts } from "@/db/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { useBulkDeleteAccount } from "@/features/accounts/api/use-bulk-delete-accounts";   

const AccountsPage = () => {
    const newAccount = useNewAccount();
    const accountsQuery = useGetAccounts();
    const accounts = accountsQuery.data || [];
    const deleteAccount = useBulkDeleteAccount();

    const isDisabled = accountsQuery.isLoading || deleteAccount.isPending

    if(accountsQuery.isLoading) {
        return(
            <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
                <Card className="border-none drop-shadow-sm">
                    <CardHeader>
                        <Skeleton className="h-8 w-48"></Skeleton>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[500px] w-full flex items-center justify-center">
                            <Loader2 className="size-6 text-slate-300 animate-spin"></Loader2>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
                <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle className="text-xl line-clamp-1">Accounts page</CardTitle>
                    <Button size="sm" onClick={newAccount.onOpen}>
                        <Plus className="size-4 mr-2"></Plus>
                        Add New
                    </Button>
                </CardHeader>
                <CardContent>
                    <DataTable onDelete={(row) => {
                        const ids = row.map((r) => r.original.id);
                        deleteAccount.mutate({ids});
                    }} filterKey="name" columns={columns} data={accounts} disabled={isDisabled}/>
                </CardContent>
                </Card>
        </div>
    )
  }

  export default AccountsPage;