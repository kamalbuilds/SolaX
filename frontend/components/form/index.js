import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../Button";

export const FORM_ERROR = "FORM_ERROR";

export function Form({
  children,
  submitText,
  schema,
  initialValues,
  buttonClassName,
  buttonTextClassName,
  onSubmit,
  ...props
}) {
  const ctx = useForm({
    mode: "onBlur",
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues: initialValues,
  });
  const [formError, setFormError] = useState(null);

  return (
    <FormProvider {...ctx}>
      <form
        onSubmit={ctx.handleSubmit(async (values) => {
          setFormError("");
          const result = (await onSubmit(values)) || {};
          for (const [key, value] of Object.entries(result)) {
            console.log(key);
            if (key === FORM_ERROR) {
              setFormError(value);
            } else {
              ctx.setError(key, {
                type: "submit",
                message: value,
              });
            }
          }
        })}
        className="form"
        {...props}
      >
        {/* Form fields supplied as children are rendered here */}

        <div className="space-y-12">{children}</div>

        {formError && (
          <div
            className="max-w-sm text-center"
            role="alert"
            style={{ color: "red" }}
          >
            {formError}
          </div>
        )}

        {submitText && (
          <Button
            expand="block"
            className={buttonClassName}
            type="submit"
            disabled={ctx.formState.isSubmitting}
          >
            Submit
          </Button>
        )}
      </form>
    </FormProvider>
  );
}

export default Form;
