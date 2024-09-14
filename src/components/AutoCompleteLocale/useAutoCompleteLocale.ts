import { useState, useMemo, useEffect } from "react";
import debounce from "lodash.debounce";
import { config } from "../../config";
import { Coordinates, Suggestion, SuggestionItem } from "../../types";

export function useAutocompleteLocale(onSelect: (value: Coordinates) => void) {
  const [options, setOptions] = useState<Suggestion[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [locale, setLocale] = useState<Suggestion | null | string>(null);

  const fetchSuggestions = async (query: string) => {
    if (!query) return;

    const url = `${config.here.autocomplete}?q=${query}&apiKey=${config.here.apiKey}&limit=20`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await response.json();
      const suggestions: Suggestion[] = data.items.map(
        (item: SuggestionItem) => ({
          label: item.title,
          id: item.id,
        })
      );
      setOptions(suggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  // Debounced version of fetchSuggestions to avoid making too many requests
  const debouncedFetchSuggestions = useMemo(
    () => debounce(fetchSuggestions, 500),
    []
  );

  // Fetch coordinates whenever the selected locale changes
  useEffect(() => {
    const fetchCoordinates = async () => {
      if (!locale) return;

      try {
        const response = await fetch(
          `${config.here.lookup}?id=${(locale as Suggestion).id}&apiKey=${
            config.here.apiKey
          }`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch");
        }
        const data = await response.json();
        const latitude = data?.position.lat;
        const longitude = data?.position.lng;
        onSelect({ latitude, longitude });
      } catch (error) {
        console.error(error);
      }
    };
    fetchCoordinates();
  }, [locale, onSelect]);

  return {
    options,
    inputValue,
    setInputValue,
    setLocale,
    debouncedFetchSuggestions,
  };
}
