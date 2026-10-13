
import {
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select
} from "@mui/material";

import type { SelectProps } from "@mui/material/Select";

import { useController } from "react-hook-form";
import type {
    FieldValues,
    UseControllerProps
} from "react-hook-form";

type Props<T extends FieldValues> =
    UseControllerProps<T> & {
        label: string;
        items: string[];
    } & Partial<SelectProps>;

export default function AppSelectInput<T extends FieldValues>(
    props: Props<T>
) {
    const {
        field,
        fieldState
    } = useController({
        control: props.control,
        name: props.name,
        rules: props.rules
    });

    return (
        <FormControl
            fullWidth
            error={!!fieldState.error}
        >
            <InputLabel>{props.label}</InputLabel>

            <Select
                value={field.value ?? ""}
                label={props.label}
                onChange={field.onChange}
            >
                {props.items.map((item: string, index: number) => (
                    <MenuItem
                        value={item}
                        key={index}
                    >
                        {item}
                    </MenuItem>
                ))}
            </Select>

            <FormHelperText>
                {fieldState.error?.message}
            </FormHelperText>
        </FormControl>
    );
}