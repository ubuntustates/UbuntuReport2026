// src/app/_components/LanguageSelect.tsx
'use client';

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { UseLanguageStore } from "@/store/UseLanguageStore";

export function LanguageSelect(){
    const language = UseLanguageStore((state)=> state.language)
    const setLanguage = UseLanguageStore((state)=> state.setLanguage)
    return(
        <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger
                className="w-[7rem] focus:outline-none !ring-0 !border-transparent 
                        focus:ring-0 focus:border-transparent bg-[#F2E8E8] rounded-[8px] text-[14px] font-semibold"
            >
                <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="sw">Swahili</SelectItem>
            </SelectContent>
        </Select>

    )
}


