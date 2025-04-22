"use client"
import { Button } from "@/components/ui/button"
import { TrashIcon } from "@radix-ui/react-icons"

import { deleteBookmark } from "@/actions/bookmarks"
import { useActionState, useOptimistic } from "react"

type UserBookmark = {
    id: string;
    categoryName: string | null;
    questionText: string | null;
}

type BookmarkTableProps = {
    userBookmarks: UserBookmark[];
}

export function BookmarkTable({ userBookmarks }: BookmarkTableProps){
    const [state, deleteBookmarkAction, isDeleting] = useActionState(deleteBookmark, null);

    return (
        <div className="rounded-lg border">
            <div className="grid grid-cols-[1fr_2fr_auto] gap-4 bg-muted p-4 font-medium">
                <div>Category</div>
                <div>Question</div>
                <div></div>
            </div>
            
            <div className="divide-y">
                {userBookmarks.map((bookmark : any) => (
                    <div key={bookmark.id} className="grid grid-cols-[1fr_2fr_auto] gap-4 p-4">
                        <div className="text-sm">{bookmark.categoryName || 'Unknown Category'}</div>
                        <div className="text-sm">{bookmark.questionText || 'Unknown Question'}</div>
                        <form action={deleteBookmarkAction}>
                            <input type="hidden" name="id" value={bookmark.id} />
                            <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                type="submit"
                            >
                                <TrashIcon className="h-4 w-4" />
                            </Button>
                        </form>
                    </div>
                ))}
                {userBookmarks.length === 0 && (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                        No bookmarks yet
                    </div>)}
            </div>
        </div>
    )
}