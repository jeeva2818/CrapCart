
import {
    FormControl,
    FormHelperText,
    Typography
} from "@mui/material";

import UploadFileIcon from "@mui/icons-material/UploadFile";

import { useDropzone } from "react-dropzone";
import { useCallback } from "react";

import { useController } from "react-hook-form";    
import type {
    FieldValues,
    UseControllerProps
} from "react-hook-form";

import type { CSSProperties } from "react";

type Props<T extends FieldValues> =
    UseControllerProps<T>;

export default function AppDropZone<T extends FieldValues>(
    props: Props<T>
) {
    const {
        field,
        fieldState
    } = useController({ ...props });

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles.length > 0) {
                const fileWithPreview = Object.assign(
                    acceptedFiles[0],
                    {
                        preview: URL.createObjectURL(
                            acceptedFiles[0]
                        )
                    }
                );

                field.onChange(fileWithPreview);
            }
        },
        [field]
    );

    const {
        getRootProps,
        getInputProps,
        isDragActive
    } = useDropzone({
        onDrop
    });

    const dsStyles: CSSProperties = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        border: "2px dashed #767676",
        borderRadius: "5px",
        paddingTop: "30px",
        height: "200px",
        width: "500px",
        cursor: "pointer"
    };

    const dsActive: CSSProperties = {
        borderColor: "green"
    };

    return (
        <FormControl
            fullWidth
            error={!!fieldState.error}
        >
            <div
                {...getRootProps()}
                style={{
                    ...dsStyles,
                    ...(isDragActive
                        ? dsActive
                        : {})
                }}
            >
                <input {...getInputProps()} />

                <UploadFileIcon
                    sx={{
                        fontSize: 100
                    }}
                />

                <Typography variant="h4">
                    Drop image here
                </Typography>
            </div>

            <FormHelperText>
                {fieldState.error?.message}
            </FormHelperText>
        </FormControl>
    );
}

