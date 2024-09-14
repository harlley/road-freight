import Typography from "@mui/material/Typography";
import { Box, Button } from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { InputForm } from "../InputForm";
import { Warehouse } from "../../types";
import styles from "../forms.module.css";
import { AutoCompleteLocale } from "../AutoCompleteLocale";

type WarehousesFormProps = {
  submitHandler: SubmitHandler<Warehouse>;
};

export function WarehousesForm({ submitHandler }: WarehousesFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Warehouse>();

  return (
    <Box className={styles.root}>
      <form onSubmit={handleSubmit(submitHandler)} noValidate>
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          New Warehouse
        </Typography>

        <InputForm
          register={register}
          errors={errors}
          name="name"
          label="Name"
        />

        <AutoCompleteLocale
          register={register}
          errors={errors}
          name="address"
          label="Address"
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
