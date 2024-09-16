import {
  TextField,
  Autocomplete,
  FormHelperText,
  useTheme,
} from "@mui/material";
import {
  UseFormRegister,
  FieldValues,
  Path,
  FieldError,
} from "react-hook-form";
import { Coordinates, Suggestion } from "../../types";
import { useState, useCallback, useEffect } from "react";
import { api } from "../../api";
import debounce from "lodash.debounce";

interface AutoCompleteLocaleProps<T extends FieldValues> {
  onSelect?: (value: Coordinates) => void;
  register: UseFormRegister<T>;
  name: Path<T>;
  errors: Partial<Record<string, FieldError>>;
  label: string;
}

export function AutoCompleteLocale<T extends FieldValues>({
  register,
  name,
  errors,
  label,
}: AutoCompleteLocaleProps<T>) {
  const [options, setOptions] = useState<Suggestion[]>([]);
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [locale, setLocale] = useState<Suggestion | null | string>(null);
  const [inputValue, setInputValue] = useState<string>("");

  const theme = useTheme();

  const onChangeHandler = (
    _: React.SyntheticEvent<Element, Event>,
    value: string | Suggestion | null,
  ) => {
    setLocale(value);
  };

  const fetchSuggestions = async (value: string) => {
    if (value) {
      const items = await api.here.getAutoComplete(value);
      setOptions(items || []);
    }
  };

  const debouncedFetchSuggestions = useCallback(
    debounce(fetchSuggestions, 500),
    [],
  );

  const onInputChangeHandler = (
    _: React.SyntheticEvent<Element, Event>,
    value: string,
  ) => {
    setInputValue(value);
    debouncedFetchSuggestions(value);
  };

  useEffect(() => {
    const fetchCoordinates = async () => {
      const { latitude, longitude } = await api.here.getLookup(
        (locale as Suggestion).id,
      );
      setLatitude(latitude);
      setLongitude(longitude);
    };
    fetchCoordinates();
  }, [locale]);

  return (
    <>
      <Autocomplete
        freeSolo
        options={options}
        inputValue={inputValue}
        filterOptions={(x) => x}
        onInputChange={onInputChangeHandler}
        onChange={onChangeHandler}
        renderInput={(params) => (
          <TextField
            {...params}
            {...register(name, { required: true })}
            label={label}
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
      {latitude && longitude && (
        <>
          <input
            type="hidden"
            {...register(`latitude` as Path<T>)}
            value={latitude}
          />
          <input
            type="hidden"
            {...register(`longitude` as Path<T>)}
            value={longitude}
          />
        </>
      )}
    </>
  );
}
