"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Store, MapPin } from "lucide-react";

type ListingResult = {
  id: string;
  restaurant_name: string;
  location_name: string | null;
  photo_url: string | null;
  latitude: number | null;
  longitude: number | null;
};

type ListingLinkerProps = {
  value: string | null;
  onChange: (listingId: string | null) => void;
  location: { lat: number; lng: number } | null;
};

export function ListingLinker({ value, onChange, location }: ListingLinkerProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ListingResult[]>([]);
  const [nearby, setNearby] = useState<ListingResult[]>([]);
  const [selected, setSelected] = useState<ListingResult | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (!value) {
      setSelected(null);
    }
  }, [value]);

  // Nearby suggestions when location changes
  useEffect(() => {
    if (!location) {
      setNearby([]);
      return;
    }
    fetch(`/api/listings/search?lat=${location.lat}&lng=${location.lng}`)
      .then((r) => r.json())
      .then((data) => setNearby(data.results || []))
      .catch(() => setNearby([]));
  }, [location]);

  const searchListings = useCallback((searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      return;
    }
    fetch(`/api/listings/search?q=${encodeURIComponent(searchQuery)}`)
      .then((r) => r.json())
      .then((data) => setResults(data.results || []))
      .catch(() => setResults([]));
  }, []);

  function handleQueryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setQuery(val);
    setShowDropdown(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchListings(val), 400);
  }

  function handleSelect(listing: ListingResult) {
    setSelected(listing);
    onChange(listing.id);
    setQuery("");
    setResults([]);
    setShowDropdown(false);
  }

  function handleRemove() {
    setSelected(null);
    onChange(null);
  }

  if (selected) {
    return (
      <div className="space-y-2">
        <Label>Linked Business</Label>
        <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
          <Store className="h-5 w-5 text-primary shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {selected.restaurant_name}
            </p>
            {selected.location_name && (
              <p className="text-xs text-muted-foreground truncate">
                {selected.location_name}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="p-1 rounded-full hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    );
  }

  const displayResults = query.length >= 2 ? results : nearby;
  const showResults = showDropdown && displayResults.length > 0;

  return (
    <div className="space-y-2">
      <Label>Link to a featured restaurant</Label>
      <div className="relative">
        <Input
          placeholder="Search restaurants..."
          value={query}
          onChange={handleQueryChange}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        />
        {showResults && (
          <div className="absolute z-10 top-full mt-1 w-full border rounded-lg bg-background shadow-lg max-h-48 overflow-y-auto">
            {query.length < 2 && nearby.length > 0 && (
              <p className="px-3 py-1.5 text-xs text-muted-foreground border-b">
                Nearby restaurants
              </p>
            )}
            {displayResults.map((listing) => (
              <button
                key={listing.id}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(listing)}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted transition-colors text-left"
              >
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">
                    {listing.restaurant_name}
                  </p>
                  {listing.location_name && (
                    <p className="text-xs text-muted-foreground truncate">
                      {listing.location_name}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
