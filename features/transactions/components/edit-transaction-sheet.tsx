import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { TransactionForm } from "./transaction-form";
import { z } from "zod";
import { insertTransactionSchema } from "@/db/schema";
import { useOpenTransaction } from "../hooks/use-open-transaction";
import { useGetTransaction } from "../api/use-get-transaction";
import { Loader2 } from "lucide-react";
import { useEditTransaction } from "../api/use-edit-transaction";
import { useDeleteTransaction } from "../api/use-delete-transaction";
import { useConfirm } from "@/hooks/use-confirm";
import { useCreateCategory } from "@/features/categories/api/use-create-category";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useCreateAccount } from "@/features/accounts/api/use-create-accounts";
import { convertAmountFromMiliunits } from "@/lib/utils";

const formSchema = insertTransactionSchema.omit({
    id: true,
});

type FormValues = z.input<typeof formSchema>;

export const EditTransactionSheet = () => {
    const { isOpen, onClose, id } = useOpenTransaction();

    const [ConfirmationDialog, confirm] = useConfirm(
        "Are you sure?",
        "You are about to delete this transaction."
    );

    const transactionQuery = useGetTransaction(id);

    const deleteMutation = useDeleteTransaction(id);
    const editMutation = useEditTransaction(id);

    const categoryQuery = useGetCategories();
    const categoryMutation = useCreateCategory();
    const onCreateCategory = (name: string) => categoryMutation.mutate({ name });

    const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
        label: category.name,
        value: category.id,
    }));

    const accountQuery = useGetAccounts();
    const accountMutation = useCreateAccount();
    const onCreateAccount = (name: string) => accountMutation.mutate({ name });

    const accountOptions = (accountQuery.data ?? []).map((account) => ({
        label: account.name,
        value: account.id,
    }));

    const isPending = editMutation.isPending ||
        deleteMutation.isPending ||
        transactionQuery.isLoading ||
        categoryMutation.isPending ||
        accountMutation.isPending;

    const isLoading = transactionQuery.isLoading || categoryQuery.isLoading || accountQuery.isLoading;

    const onSubmit = (values: FormValues) => {
        editMutation.mutate(values, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    const onDelete = async () => {
        const ok = await confirm();
        if (ok) {
            deleteMutation.mutate(undefined, {
                onSuccess: () => {
                    onClose();
                },
            });
        }
    };

    // Convert amount only if transactionQuery.data exists
    const convertedTransactionData = transactionQuery.data
        ? {
              ...transactionQuery.data,
              amount: convertAmountFromMiliunits(transactionQuery.data.amount),
          }
        : null;

    const defaultValues = convertedTransactionData
        ? {
              accountId: convertedTransactionData.accountId,
              categoryId: convertedTransactionData.categoryId,
              amount: convertedTransactionData.amount.toString(), // Ensure amount is a string
              date: convertedTransactionData.date ? new Date(convertedTransactionData.date) : new Date(),
              payee: convertedTransactionData.payee,
              notes: convertedTransactionData.notes,
          }
        : {
              accountId: "",
              categoryId: "",
              amount: "",
              date: new Date(),
              payee: "",
              notes: "",
          };

    // Debugging logs
    console.log("Transaction data:", transactionQuery.data);
    console.log("Converted transaction data:", convertedTransactionData);
    console.log("Converted default values:", defaultValues);

    return (
        <>
            <ConfirmationDialog />
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Edit Transaction</SheetTitle>
                        <SheetDescription>Edit an existing transaction.</SheetDescription>
                    </SheetHeader>
                    {isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="size-4 text-muted-foreground animate-spin"></Loader2>
                        </div>
                    ) : (
                        <TransactionForm
                            id={id}
                            onSubmit={onSubmit}
                            defaultValues={defaultValues}
                            disabled={isPending}
                            onDelete={onDelete}
                            categoryOptions={categoryOptions}
                            onCreateCategory={onCreateCategory}
                            accountOptions={accountOptions}
                            onCreateAccount={onCreateAccount}
                        />
                    )}
                </SheetContent>
            </Sheet>
        </>
    );
};
