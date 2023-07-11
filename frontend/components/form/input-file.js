import { forwardRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { storeFiles } from "../../lib/web3storage";
import { Input } from "../input";
import { v4 as uuidv4 } from "uuid";
import { renameFile } from "../../utils/classNames";

export const LabeledFileField = forwardRef(
  ({ label, outerProps, labelProps, name, ...props }, ref) => {
    const {
      register,
      formState: { isSubmitting, errors },
      setValue,
      set,
    } = useFormContext();
    const error = Array.isArray(errors[name])
      ? errors[name].join(", ")
      : errors[name]?.message || errors[name];

    const [UploadStatus, setUploadStatus] = useState("NOT_UPLOADED");

    return (
      <div {...outerProps}>
        <span>
          <label htmlFor={name} {...labelProps}>
            <h5>{label}</h5>
          </label>
          <Input
            {...props}
            onChange={async (e) => {
              try {
                console.log("Uploading...");
                setUploadStatus("UPLOADING");

                const filename =
                  name +
                  uuidv4() +
                  "." +
                  e.target.files[0].name.split(".").pop();

                const files = renameFile(e.target.files[0], filename);

                const id = await storeFiles([files]);

                const url = `https://${id}.ipfs.w3s.link/${filename}`;

                console.log(url);

                setValue(name, url);

                setUploadStatus("UPLOADED");
              } catch (error) {
                setUploadStatus("UPLOADED_FALIED");
              }
            }}
          />
          <input {...register(name)} className="hidden" />
        </span>

        {UploadStatus === "UPLOADING" && (
          <div role="alert" style={{ color: "red" }}>
            Uploading...
          </div>
        )}
        {UploadStatus === "UPLOADED_FALIED" && (
          <div role="alert" style={{ color: "red" }}>
            Failed to Upload, Try again
          </div>
        )}

        {error && (
          <div role="alert" style={{ color: "red" }}>
            {error}
          </div>
        )}
      </div>
    );
  }
);

LabeledFileField.displayName = "LabeledTextField";

export default LabeledFileField;
