import Typography from "@mui/material/Typography";
import { Box, Button, FormHelperText, useTheme } from "@mui/material";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { InputForm } from "../InputForm";
import { Order } from "../../types";
import styles from "../forms.module.css";
import { AutoCompleteLocale } from "../AutoCompleteLocale";
// import { useState } from "react";

type OrdersFormProps = {
  submitHandler: SubmitHandler<Order>;
};

export function OrdersForm({ submitHandler }: OrdersFormProps) {
  // const [latitude, setLatitude] = useState<string>("");
  // const [longitude, setLongitude] = useState<string>("");

  const theme = useTheme();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Order>();

  return (
    <Box className={styles.root}>
      <form onSubmit={handleSubmit(submitHandler)} noValidate>
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Create Order
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", mb: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
              name="date"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <DatePicker
                  inputRef={field.ref}
                  label="Date"
                  onChange={(date) => {
                    field.onChange(date?.format("YYYY-MM-DD"));
                  }}
                  slotProps={{
                    textField: {
                      error: !!errors["date"],
                    },
                  }}
                />
              )}
            />
            {errors["date"] && (
              <FormHelperText sx={{ color: theme.palette.error.main }}>
                Date is required
              </FormHelperText>
            )}
          </LocalizationProvider>
        </Box>

        <InputForm
          register={register}
          errors={errors}
          name="invoice"
          label="Invoice"
        />

        <InputForm
          register={register}
          errors={errors}
          name="weight"
          label="Weight"
          type="number"
        />

        <AutoCompleteLocale
          register={register}
          errors={errors}
          name="destination"
          label="Destination"
        />

        <Button
          variant="contained"
          color="primary"
          type="submit"
          sx={{ mt: 2 }}
        >
          Save
        </Button>
      </form>
    </Box>
  );
}
