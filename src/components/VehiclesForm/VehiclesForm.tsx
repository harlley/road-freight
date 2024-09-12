import Typography from "@mui/material/Typography";
import { Box, Button } from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { InputForm } from "../InputForm";
import { Vehicle } from "../../types";
import styles from "../forms.module.css";

type VehiclesFormProps = {
  submitHandler: SubmitHandler<Vehicle>;
};

export function VehiclesForm({ submitHandler }: VehiclesFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Vehicle>();

  return (
    <Box className={styles.root}>
      <form onSubmit={handleSubmit(submitHandler)} noValidate>
        <Typography variant="h6" component="h2">
          New Vehicle
        </Typography>

        <InputForm
          register={register}
          errors={errors}
          name="numberPlate"
          label="Number Plate"
        />

        <InputForm
          register={register}
          errors={errors}
          name="weightCapacity"
          label="Weight Capacity"
          type="number"
        />

        <Button variant="contained" color="primary" type="submit">
          Save
        </Button>
      </form>
    </Box>
  );
}
