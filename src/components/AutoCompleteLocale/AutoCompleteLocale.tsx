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
import { useAutocompleteLocale } from "./useAutoCompleteLocale";
import { Coordinates, Suggestion } from "../../types";

interface AutoCompleteLocaleProps<T extends FieldValues> {
  onSelect: (value: Coordinates) => void;
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
  const theme = useTheme();

  const {
    options,
    inputValue,
    setInputValue,
    setLocale,
    debouncedFetchSuggestions,
  } = useAutocompleteLocale(onSelect);

  const onChangeHandler = (
    _: React.SyntheticEvent<Element, Event>,
    value: string | Suggestion | null
  ) => {
    setLocale(value);
  };

  const onInputChangeHandler = (
    _: React.SyntheticEvent<Element, Event>,
    value: string
  ) => {
    setInputValue(value);
    debouncedFetchSuggestions(value);
  };

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
    </>
  );
}
