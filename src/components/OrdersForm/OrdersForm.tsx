import Typography from "@mui/material/Typography";
import { Box, Button } from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { InputForm } from "../InputForm";
import { Order } from "../../types";
import styles from "../forms.module.css";

type OrdersFormProps = {
  submitHandler: SubmitHandler<Order>;
};

export function OrdersForm({ submitHandler }: OrdersFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Order>();

  return (
    <Box className={styles.root}>
      <form onSubmit={handleSubmit(submitHandler)} noValidate>
        <Typography variant="h6" component="h2">
          Create Order
        </Typography>

        <InputForm
          register={register}
          errors={errors}
          name="date"
          label="Date"
        />

        <InputForm
          register={register}
          errors={errors}
          name="invoiceNumber"
          label="Invoice Number"
        />

        <InputForm
          register={register}
          errors={errors}
          name="weight"
          label="Weight"
        />

        <InputForm
          register={register}
          errors={errors}
          name="destination"
          label="Destination"
        />

        <Button variant="contained" color="primary" type="submit">
          Save
        </Button>
      </form>
    </Box>
  );
}
