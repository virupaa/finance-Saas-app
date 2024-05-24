import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";

import { AccountForm } from "./account-form";
import {z} from "zod"
import { insertAccountSchema } from "@/db/schema";
import { useOpenAccount } from "../hooks/use-open-account";
import { useGetAccount } from "../api/use-get-account";
import { Loader2 } from "lucide-react";
import { useEditAccount } from "../api/use-edit-account";
import { useDeleteAccount } from "../api/use-delete-account";
import { useConfirm } from "@/hooks/use-confirm";

const formSchema = insertAccountSchema.pick({
    name: true,
})

type FormValues = z.input<typeof formSchema>;

export const EditAccountSheet = () => {
    const { isOpen, onClose, id } = useOpenAccount();

    const [ConfirmationDialog, confirm] = useConfirm(
        "Are you sure?",
        "You are about to delete this account."
    )

    const accountQuery = useGetAccount(id);

    const deleteMutation = useDeleteAccount(id);

    const editMutation = useEditAccount(id);


    const isPending = editMutation.isPending || deleteMutation.isPending;

    const isLoading = accountQuery.isLoading;

    const onSubmit = (values : FormValues) => {
        editMutation.mutate(values, {
            onSuccess:() => {
                onClose();
            }
        });
    };

    const onDelete = async () => {
        const ok = await confirm();

        if(ok) {
            deleteMutation.mutate(undefined, {
                onSuccess: () => {
                    onClose();
                }
            });
        }

    }
    const defaultValues = accountQuery.data ? {
        name: accountQuery.data.name
    } : {
        name: "",
    };


    return (
        <>
        <ConfirmationDialog />
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent>
                <SheetHeader>
                <SheetTitle>Edit Account</SheetTitle>
                <SheetDescription>
                    Edit an exsisting account.
                </SheetDescription>
                </SheetHeader>
                {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="size-4 text-muted-foreground animate-spin"></Loader2>
                    </div>
                ) : <AccountForm id={id} onDelete={onDelete} onSubmit={onSubmit} disabled={isPending} defaultValues={defaultValues}/> }
                
            </SheetContent>
        </Sheet>
        </>
    )
}