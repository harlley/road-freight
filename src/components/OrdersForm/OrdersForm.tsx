import Typography from "@mui/material/Typography";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { postOrders } from "../../api/orders";
import { useForm, SubmitHandler } from "react-hook-form";
import { Order } from "../../types";
import styles from "./OrdersForm.module.css";

export function OrdersForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Order>({ shouldUseNativeValidation: false });

  const submitHandler: SubmitHandler<Order> = async (data) => {
    console.log(errors);
    await postOrders(data);
  };

  return (
    <Box className={styles.root}>
      <form onSubmit={handleSubmit(submitHandler)} noValidate>
        <Typography variant="h6" component="h2">
          Create Order
        </Typography>
        <FormControl sx={{ width: "100%" }}>
          <InputLabel {...register("invoiceNumber")}>Invoice Number</InputLabel>
          <OutlinedInput
            label="Invoice Number"
            fullWidth
            {...register("invoiceNumber", { required: true })}
            error={!!errors.invoiceNumber}
          />
          {errors.invoiceNumber && <FormHelperText>Error</FormHelperText>}
        </FormControl>

        <Button variant="contained" color="primary" type="submit">
          Save
        </Button>
      </form>
    </Box>
  );
}
