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
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import { accounts } from "@/db/schema";
import { Skeleton } from "@/components/ui/skeleton";  
import { useBulkDeleteTransactions } from "@/features/transactions/api/use-bulk-delete-transactions";
import { error } from "console";
import { useState } from "react";
import { UploadButton } from "./upload-button";
import { ImportCard } from "./import-card";
import { transactions as transactionSchema } from "@/db/schema";
import { useSelectAccount } from "@/features/accounts/hooks/use-select-account";
import { toast } from "sonner";
import { useBulkCreateTransactions } from "@/features/transactions/api/use-bulk-create-transactions";


enum VARIANTS {
    LIST = "LIST",
    IMPORT = "IMPORT"
}

const INITIAL_IMPORT_RESULTS = {
    data: [],
    errors: [],
    meta: {},
}

const TransactionsPage = () => {
    const [AccountDialog, confirm] = useSelectAccount();
    const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
    const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS);

    const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
        setImportResults(results);
        setVariant(VARIANTS.IMPORT);
    }

    const onCancelImport = () => {
        setImportResults(INITIAL_IMPORT_RESULTS);
        setVariant(VARIANTS.LIST);
    }

    const newTransaction = useNewTransaction();
    const createTransactions = useBulkCreateTransactions();
    const transactionsQuery = useGetTransactions();
    const transactions = transactionsQuery.data || [];
    const deleteTransactions = useBulkDeleteTransactions();

    const isDisabled = transactionsQuery.isLoading || deleteTransactions.isPending;


    const onSubmitImport = async (
        values: typeof transactionSchema.$inferInsert[],
    ) => {
        const accountId = await confirm();

        if(!accountId) {
            return toast.error("Please Select an account to continue");
        }

        const data = values.map((value) => ({
            ...value,
            accountId:accountId as string,
        }));

        createTransactions.mutate(data, {
            onSuccess: () => {
                onCancelImport();
            },
        });
    };

    
    if(transactionsQuery.isLoading) {
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

    if(variant === VARIANTS.IMPORT){
        return(
            <>
                <AccountDialog />
                <ImportCard 
                data={importResults.data}
                onCancel={onCancelImport}
                onSubmit={onSubmitImport} />
            </>
        )
    }

    return (
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
                <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle className="text-xl line-clamp-1">Transaction History</CardTitle>
                    <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
                        <Button size="sm" onClick={newTransaction.onOpen}>
                            <Plus className="size-4 mr-2"></Plus>
                            Add New
                        </Button>
                        <UploadButton onUpload={onUpload} />
                    </div>
                </CardHeader>
                <CardContent>
                    <DataTable onDelete={(row) => {
                        const ids = row.map((r) => r.original.id);
                        deleteTransactions.mutate({ids});
                    }} filterKey="payee" columns={columns} data={transactions} disabled={isDisabled}/>
                </CardContent>
                </Card>
        </div>
    )
  }

  export default TransactionsPage;