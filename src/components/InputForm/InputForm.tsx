import {
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  OutlinedInputProps,
  useTheme,
} from "@mui/material";
import {
  FieldError,
  UseFormRegister,
  Path,
  FieldValues,
} from "react-hook-form";

type InputFormProps<T extends FieldValues> = {
  register: UseFormRegister<T>;
  errors: Partial<Record<Path<T>, FieldError>>;
  name: Path<T>;
  label: string;
  type?: OutlinedInputProps["type"];
};

export function InputForm<T extends FieldValues>({
  register,
  errors,
  name,
  label,
  type = "text",
}: InputFormProps<T>) {
  const theme = useTheme();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", mb: 2 }}>
      <FormControl>
        <InputLabel {...register(name)}>{label}</InputLabel>
        <OutlinedInput
          label={label}
          {...register(name, { required: true })}
          error={!!errors[name]}
          fullWidth
          inputProps={{ maxLength: 100 }}
          type={type}
        />
      </FormControl>
      {errors[name] && (
        <FormHelperText sx={{ color: theme.palette.error.main }}>
          {label} is required
        </FormHelperText>
      )}
    </Box>
  );
}
