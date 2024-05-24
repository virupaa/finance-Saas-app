import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";

import { CategoryForm } from "./category-form";
import {z} from "zod"
import { insertCategorySchema } from "@/db/schema";
import { useOpenCategory } from "../hooks/use-open-category";
import { useGetCategory } from "../api/use-get-category";
import { Loader2 } from "lucide-react";
import { useEditCategory } from "../api/use-edit-category";
import { useDeleteCategory } from "../api/use-delete-category";
import { useConfirm } from "@/hooks/use-confirm";

const formSchema = insertCategorySchema.pick({
    name: true,
})

type FormValues = z.input<typeof formSchema>;

export const EditCategorySheet = () => {
    const { isOpen, onClose, id } = useOpenCategory();

    const [ConfirmationDialog, confirm] = useConfirm(
        "Are you sure?",
        "You are about to delete this category."
    )

    const categoryQuery = useGetCategory(id);

    const deleteMutation = useDeleteCategory(id);

    const editMutation = useEditCategory(id);


    const isPending = editMutation.isPending || deleteMutation.isPending;

    const isLoading = categoryQuery.isLoading;

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
    const defaultValues = categoryQuery.data ? {
        name: categoryQuery.data.name
    } : {
        name: "",
    };


    return (
        <>
        <ConfirmationDialog />
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent>
                <SheetHeader>
                <SheetTitle>Edit Category</SheetTitle>
                <SheetDescription>
                    Edit an exsisting category.
                </SheetDescription>
                </SheetHeader>
                {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="size-4 text-muted-foreground animate-spin"></Loader2>
                    </div>
                ) : <CategoryForm id={id} onDelete={onDelete} onSubmit={onSubmit} disabled={isPending} defaultValues={defaultValues}/> }
                
            </SheetContent>
        </Sheet>
        </>
    )
}