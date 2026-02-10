// src\app\_components\home\CategorySelect.tsx
'use client';

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useState } from "react";

export function CategorySelectAbout(){
    const [language, setLanguage] = useState("")
    return(
        <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger
                className="w-full h-[46px] min-h-[46px] focus:outline-none !ring-0 !border-[#E8CFCF] 
                        focus:ring-0 focus:border-transparent bg-[#FFFFFF] rounded-[8px] text-[14px] "
            >
                <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="Politics">Politics</SelectItem>
                <SelectItem value="Health">Health</SelectItem>
                <SelectItem value="Entertainment">Entertainment</SelectItem>
            </SelectContent>
        </Select>

    )
}


