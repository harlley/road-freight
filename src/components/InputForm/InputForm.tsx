import {
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
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
};

export function InputForm<T extends FieldValues>({
  register,
  errors,
  name,
  label,
}: InputFormProps<T>) {
  return (
    <FormControl>
      <InputLabel {...register(name)}>{label}</InputLabel>
      <OutlinedInput
        label={label}
        {...register(name, { required: true })}
        error={!!errors[name]}
        fullWidth
      />
      {errors[name] && <FormHelperText>{label} is required</FormHelperText>}
    </FormControl>
  );
}
