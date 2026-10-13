
import { useState } from "react";

import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";

import { Delete, Edit } from "@mui/icons-material";

import { useAppDispatch, useAppSelector } from "../../app/store/store";
import { useFetchProductsQuery } from "../catalog/catalogApi";
import { setPageNumber } from "../catalog/catalogSlice";
import AppPagination from "../../app/shared/components/AppPagination";
import { currencyFormat } from "../../lib/util";
import ProductForm from "./ProductForm";

import type { Product } from "../../app/models/products";

import { useDeleteProductMutation } from "./adminApi";

export default function InventoryPage() {
    const [editMode, setEditMode] = useState(false);
    const [selectedProduct, setSelectedProduct] =
        useState<Product | null>(null);

    const productParams =
        useAppSelector(state => state.catalog);

    const { data, refetch } =
        useFetchProductsQuery(productParams);

    const [deleteProduct] =
        useDeleteProductMutation();

    const dispatch = useAppDispatch();

    const handleSelectProduct = (
        product: Product
    ) => {
        setSelectedProduct(product);
        setEditMode(true);
    };

    const handleDeleteProduct = async (
        id: number
    ) => {
        try {
            await deleteProduct(id).unwrap();
            refetch();
        } catch (error) {
            console.log(error);
        }
    };

    if (editMode) {
        return (
            <ProductForm
                setEditMode={setEditMode}
                product={selectedProduct}
                refetch={refetch}
                setSelectedProduct={
                    setSelectedProduct
                }
            />
        );
    }

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between"
                }}
            >
                <Typography
                    sx={{ padding: 2 }}
                    variant="h4"
                >
                    Inventory
                </Typography>

                <Button
                    sx={{ margin: 2 }}
                    size="large"
                    variant="contained"
                    onClick={() => {
                        setSelectedProduct(null);
                        setEditMode(true);
                    }}
                >
                    Create
                </Button>
            </Box>

            {data?.pagination &&
                data.items.length > 0 && (
                    <Box sx={{ p: 3 }}>
                        <AppPagination
                            metadata={data.pagination}
                            onPageChange={(
                                page: number
                            ) => {
                                dispatch(
                                    setPageNumber(page)
                                );
                            }}
                        />
                    </Box>
                )}

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell align="left">
                                Products
                            </TableCell>
                            <TableCell align="right">
                                Price
                            </TableCell>
                            <TableCell align="center">
                                Type
                            </TableCell>
                            <TableCell align="center">
                                Brand
                            </TableCell>
                            <TableCell align="center">
                                Quantity
                            </TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {data &&
                            data.items.map(
                                product => (
                                    <TableRow
                                        key={
                                            product.id
                                        }
                                        sx={{
                                            "&:last-child td, &:last-child th":
                                                {
                                                    border: 0
                                                }
                                        }}
                                    >
                                        <TableCell
                                            component="th"
                                            scope="row"
                                        >
                                            {
                                                product.id
                                            }
                                        </TableCell>

                                        <TableCell align="left">
                                            <Box
                                                sx={{
                                                    display:
                                                        "flex",
                                                    alignItems:
                                                        "center"
                                                }}
                                            >
                                                <img
                                                    src={
                                                        product.imageUrl
                                                    }
                                                    alt={
                                                        product.name
                                                    }
                                                    style={{
                                                        height: 50,
                                                        marginRight: 20
                                                    }}
                                                />

                                                <span>
                                                    {
                                                        product.name
                                                    }
                                                </span>
                                            </Box>
                                        </TableCell>

                                        <TableCell align="right">
                                            {currencyFormat(
                                                product.price
                                            )}
                                        </TableCell>

                                        <TableCell align="left">
                                            {
                                                product.type
                                            }
                                        </TableCell>

                                        <TableCell align="center">
                                            {
                                                product.brand
                                            }
                                        </TableCell>

                                        <TableCell align="center">
                                            {
                                                product.quantityInStock
                                            }
                                        </TableCell>

                                        <TableCell align="right">
                                            <Button
                                                onClick={() =>
                                                    handleSelectProduct(
                                                        product
                                                    )
                                                }
                                            >
                                                <Edit />
                                            </Button>

                                            <Button
                                                color="error"
                                                onClick={() =>
                                                    handleDeleteProduct(
                                                        product.id
                                                    )
                                                }
                                            >
                                                <Delete />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            )}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
