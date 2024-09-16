import { config } from "../config";
import { Suggestion, SuggestionItem } from "../types";

export const getAutoComplete = async (query: string) => {
  if (!query) return;

  const response = await fetch(
    `${config.here.autocomplete}?q=${query}&apiKey=${config.here.apiKey}&limit=20`,
  );

  const data = await response.json();

  const suggestions: Suggestion[] = data.items.map((item: SuggestionItem) => ({
    label: item.title,
    id: item.id,
  }));

  return suggestions;
};

export const getLookup = async (id: string) => {
  const response = await fetch(
    `${config.here.lookup}?id=${id}&apiKey=${config.here.apiKey}`,
  );

  const data = await response.json();

  return {
    latitude: data.position.lat,
    longitude: data.position.lng,
  };
};
