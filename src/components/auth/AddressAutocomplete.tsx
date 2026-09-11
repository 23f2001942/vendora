import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LocationData {
  address: string;
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

interface AddressAutocompleteProps {
  onLocationSelect: (location: LocationData) => void;
  label?: string;
  placeholder?: string;
  defaultValue?: string;
}

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
}

export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  onLocationSelect,
  label = "Location",
  placeholder = "Search for an address...",
  defaultValue = ""
}) => {
  const [inputValue, setInputValue] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = (query: string) => {
    if (query.length < 3) { setSuggestions([]); return; }
    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(query)}`,
      { headers: { 'Accept-Language': 'en' } }
    )
      .then(r => r.json())
      .then((data: NominatimResult[]) => { setSuggestions(data); setShowSuggestions(true); })
      .catch(() => setSuggestions([]));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 400);
  };

  const handleSelect = (result: NominatimResult) => {
    setInputValue(result.display_name);
    setShowSuggestions(false);
    setSuggestions([]);
    onLocationSelect({
      address: result.display_name,
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      city: result.address.city || result.address.town || result.address.village,
      state: result.address.state,
      postalCode: result.address.postcode,
      country: result.address.country,
    });
  };

  return (
    <div className="space-y-2" ref={wrapperRef}>
      <Label>{label}</Label>
      <div className="relative">
        <Input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          autoComplete="off"
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-50 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
            {suggestions.map((s, i) => (
              <li
                key={i}
                className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 border-b border-gray-100 last:border-0"
                onMouseDown={() => handleSelect(s)}
              >
                {s.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
