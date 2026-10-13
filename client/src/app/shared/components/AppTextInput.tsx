
import { TextField } from "@mui/material";
import { useController } from "react-hook-form";
import type {
    FieldValues,
    UseControllerProps
} from "react-hook-form";

type Props<T extends FieldValues> =
    UseControllerProps<T> & {
        label: string;
        multiline?: boolean;
        rows?: number;
        type?: string;
    };

export default function AppTextInput<T extends FieldValues>(
    props: Props<T>
) {
    const {
        field,
        fieldState
    } = useController({ ...props });

    return (
        <TextField
            {...props}
            {...field}
            multiline={props.multiline}
            rows={props.rows}
            type={props.type}
            fullWidth
            variant="outlined"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            value={field.value ?? ""}
        />
    );
}
