import { forwardRef } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "../input";

export const LabeledTextField = forwardRef(
  ({ label, outerProps, labelProps, name, ...props }, ref) => {
    const {
      register,
      formState: { isSubmitting, errors },
    } = useFormContext();
    const error = Array.isArray(errors[name])
      ? errors[name].join(", ")
      : errors[name]?.message || errors[name];

    return (
      <div {...outerProps}>
        <span>
          <label htmlFor={name} {...labelProps}>
            <h5>{label}</h5>
          </label>
          <Input
            {...register(name, {
              valueAsNumber: props.type === "number",
            })}
            {...props}
          />
        </span>

        {error && (
          <div role="alert" style={{ color: "red" }}>
            {error}
          </div>
        )}
      </div>
    );
  }
);

LabeledTextField.displayName = "LabeledTextField";

export default LabeledTextField;
