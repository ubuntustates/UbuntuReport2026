// src\store\UseLanguageStore.ts
import { create } from "zustand";

interface LanguageState {
    language: string,
    setLanguage: (lang: string) => void
}

export const UseLanguageStore = create<LanguageState>((set) => (
    {
        language: 'en',
        setLanguage: (lang) => set({ language: lang })
    }
))