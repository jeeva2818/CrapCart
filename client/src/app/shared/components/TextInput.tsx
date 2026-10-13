
import { TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import type {
    Control,
    FieldValues,
    Path
} from "react-hook-form";

type Props<T extends FieldValues> = {
    control: Control<T>;
    name: Path<T>;
    label: string;
    multiline?: boolean;
    rows?: number;
    type?: string;
};

export default function TextInput<T extends FieldValues>({
    control,
    name,
    label,
    multiline,
    rows,
    type = "text"
}: Props<T>) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <TextField
                    {...field}
                    label={label}
                    type={type}
                    multiline={multiline}
                    rows={rows}
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                />
            )}
        />
    );
}
