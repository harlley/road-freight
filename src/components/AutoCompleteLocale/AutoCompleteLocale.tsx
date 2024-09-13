import { useState, useMemo } from "react";
import {
  TextField,
  Autocomplete,
  FormHelperText,
  useTheme,
} from "@mui/material";
import debounce from "lodash.debounce";
import { config } from "../../config";
import {
  UseFormRegister,
  FieldValues,
  Path,
  FieldError,
} from "react-hook-form";

interface Suggestion {
  label: string;
  id: string;
}

interface SuggestionItem {
  title: string;
  id: string;
}

interface AutoCompleteLocaleProps<T extends FieldValues> {
  onSelect: (value: Suggestion | null) => void;
  register: UseFormRegister<T>;
  name: Path<T>;
  errors: Partial<Record<string, FieldError>>;
  label: string;
}

export function AutoCompleteLocale<T extends FieldValues>({
  onSelect,
  register,
  name,
  errors,
  label,
}: AutoCompleteLocaleProps<T>) {
  const [options, setOptions] = useState<Suggestion[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const theme = useTheme();

  async function fetchSuggestions(query: string): Promise<void> {
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
  }

  const debouncedFetchSuggestions = useMemo(
    () => debounce(fetchSuggestions, 500),
    []
  );

  return (
    <>
      <Autocomplete
        freeSolo
        options={options}
        inputValue={inputValue}
        onInputChange={(_, value) => {
          setInputValue(value);
          debouncedFetchSuggestions(value);
        }}
        onChange={(_, newValue) => {
          if (onSelect) {
            onSelect(newValue as Suggestion);
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            {...register(name)}
            label="Destination"
            variant="outlined"
            error={!!errors[name]}
          />
        )}
      />
      {errors[name] && (
        <FormHelperText sx={{ color: theme.palette.error.main }}>
          {label} is required
        </FormHelperText>
      )}
    </>
  );
}
