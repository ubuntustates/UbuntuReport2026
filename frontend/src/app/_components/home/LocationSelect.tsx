// src\app\_components\home\LocationSelect.tsx

'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface Country {
  name: string;
  iso2: string;
  long: number;
  lat: number;
}

interface CountriesApiResponse {
  error: boolean;
  msg: string;
  data: Country[];
}

export function LocationSelect() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');
  const [countries, setCountries] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Fetch countries on mount
  React.useEffect(() => {
    async function fetchCountries() {
      try {
        const res = await fetch('https://countriesnow.space/api/v0.1/countries/positions');
        const data: CountriesApiResponse = await res.json();
        const countryNames = data.data
          .map((c) => c.name) // ✅ c is strongly typed now
          .sort((a, b) => a.localeCompare(b));
        setCountries(countryNames);
      } catch (err) {
        console.error('Failed to fetch countries', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCountries();
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full md:w-[333px] h-[46px] justify-between bg-white text-[#994D4D] text-[14px] rounded-[8px] border border-solid border-[#E8CFCF]"
        >
          {value || 'Select country'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[333px] p-0 max-h-[10rem]">
        <Command>
          <CommandInput placeholder="Search country..." />
          {loading ? (
            <CommandEmpty>Loading...</CommandEmpty>
          ) : (
            <>
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {countries.map((country) => (
                  <CommandItem
                    key={country}
                    value={country}
                    onSelect={(currentValue) => {
                      setValue(currentValue);
                      setOpen(false);
                    }}
                  >
                    {country}
                    {value === country && <Check className="ml-auto h-4 w-4" />}
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
