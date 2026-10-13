import {
    Box,
    Button,
    Paper,
    Typography
} from "@mui/material";

import Grid from "@mui/material/Grid";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import AppTextInput from "../../app/shared/components/AppTextInput";
import AppSelectInput from "../../app/shared/components/AppSelectInput";
import AppDropZone from "../../app/shared/components/AppDropZone";

import {
    createProductSchema,
    type CreateProductSchema
} from "../../lib/schemas/CreateProductSchema";

import { useFetchFiltersQuery } from "../catalog/catalogApi";

import {
    useCreateProductMutation,
    useUpdateProductMutation
} from "./adminApi";

import type { Product } from "../../app/models/products";

import { handleApiError } from "../../lib/util";

type Props = {
    setEditMode: (value: boolean) => void;
    product: Product | null;
    refetch: () => void;
    setSelectedProduct: (value: Product | null) => void;
};

type FileWithPreview = File & {
    preview: string;
};

export default function ProductForm({
    setEditMode,
    product,
    refetch,
    setSelectedProduct
}: Props) {
    const { data } = useFetchFiltersQuery();

    const [createProduct] = useCreateProductMutation();
    const [updateProduct] = useUpdateProductMutation();

    const {
        control,
        handleSubmit,
        watch,
        reset,
        setError
    } = useForm<
        z.input<typeof createProductSchema>,
        any,
        CreateProductSchema
    >({
        mode: "onTouched",
        resolver: zodResolver(createProductSchema)
    });

    const watchFile = watch("file") as FileWithPreview | undefined;

    // 1) Populate the form ONLY when the product changes
    useEffect(() => {
        if (product) {
            reset({
                ...product,
                quantity: product.quantityInStock,
                pictureUrl: product.imageUrl
            });
        }
    }, [product, reset]);

    // 2) Clean up the preview URL ONLY when the selected file changes
    useEffect(() => {
        return () => {
            if (watchFile?.preview) {
                URL.revokeObjectURL(watchFile.preview);
            }
        };
    }, [watchFile]);

    const createFormData = (items: FieldValues) => {
        const formData = new FormData();

        for (const key in items) {
            if (key !== "file" && items[key] != null) {
                formData.append(key, items[key]);
            }
        }

        return formData;
    };

    const onSubmit = async (data: CreateProductSchema) => {
        const formData = createFormData(data);

        if (data.file) {
            formData.append("file", data.file);
        }

        try {
            if (product) {
                await updateProduct({
                    id: product.id,
                    data: formData
                }).unwrap();
            } else {
                await createProduct(formData).unwrap();
            }

            setEditMode(false);
            setSelectedProduct(null);
            refetch();
        } catch (error) {
            console.log(error);

            handleApiError(error, setError, [
                "brand",
                "description",
                "file",
                "name",
                "pictureUrl",
                "price",
                "quantity"
            ]);
        }
    };

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                {product ? "Edit Product" : "Create Product"}
            </Typography>

            <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{ mt: 2 }}
            >
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <AppTextInput
                            control={control}
                            name="name"
                            label="Product name"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>
                        <AppSelectInput
                            control={control}
                            name="brand"
                            label="Brand"
                            items={data?.brands ?? []}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>
                        <AppSelectInput
                            control={control}
                            name="type"
                            label="Type"
                            items={data?.types ?? []}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <AppTextInput
                            control={control}
                            name="price"
                            label="Price"
                            type="number"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <AppTextInput
                            control={control}
                            name="quantity"
                            label="Quantity"
                            type="number"
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <AppTextInput
                            control={control}
                            name="description"
                            label="Description"
                            multiline
                            rows={4}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <AppDropZone control={control} name="file" />

                        {product?.imageUrl && !watchFile && (
                            <Box sx={{ mt: 2 }}>
                                <Typography>Current image:</Typography>
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    style={{ maxWidth: 200, maxHeight: 200 }}
                                />
                            </Box>
                        )}

                        {watchFile && (
                            <Box sx={{ mt: 2 }}>
                                <img
                                    src={watchFile.preview}
                                    alt="Preview"
                                    style={{ maxWidth: 200, maxHeight: 200 }}
                                />
                            </Box>
                        )}
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Box
                            sx={{
                                display: "flex",
                                gap: 2,
                                justifyContent: "flex-end"
                            }}
                        >
                            <Button
                                type="button"
                                variant="outlined"
                                onClick={() => setEditMode(false)}
                            >
                                Cancel
                            </Button>

                            <Button type="submit" variant="contained">
                                Submit
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
}