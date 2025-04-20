"use client"

import Link from "next/link"
import { useState } from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface HistoryClientProps {
    userHistory: {
        categoryName: string | null;
        songTitle: string | null;
        questionText: string | null;
        selectedAnswer: string;
    }[];
    categories: {
        id: string;
        name: string;
    }[];
}

export function HistoryClient({ userHistory, categories }: HistoryClientProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    const filteredHistory = selectedCategory === "all" 
        ? userHistory 
        : userHistory.filter(h => h.categoryName === selectedCategory);

    return (
        <>
            <div className="mb-4">
                <Select 
                    value={selectedCategory} 
                    onValueChange={setSelectedCategory}
                >
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                            <SelectItem value={category.name}>
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="rounded-lg border">
                <div className="grid grid-cols-4 gap-4 border-b bg-muted p-4 font-medium">
                    <div>Category</div>
                    <div>Title</div>
                    <div>Question</div>
                    <div>Response</div>
                </div>
                
                <div className="divide-y">
                    {filteredHistory.map((history, index) => (
                        <div key={index} className="grid grid-cols-4 gap-4 p-4">
                            <div className="text-sm">{history.categoryName || 'Unknown Category'}</div>
                            <div className="text-sm">{history.songTitle || 'Unknown Song'}</div>
                            <div className="text-sm">{history.questionText || 'Unknown Question'}</div>
                            <div className="text-sm">{history.selectedAnswer}</div>
                        </div>
                    ))}

                    {filteredHistory.length === 0 && (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            No history found
                        </div>
                    )}
                </div>
            </div>
        </>
    )
} 