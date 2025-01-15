import { useNavigate } from "react-router-dom";
import { useAutoGetProductFromWarehouseMutation } from '../../redux/api/exportDetailApiSlice';
import { useGetProductListsForAutoSelectQuery } from '../../redux/api/productApiSlice';
import { useSelector } from "react-redux";
import { useState } from "react";
import { Modal, Select, message, Input, Button } from "antd";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

function AutoSelectModal({ isModalOpen, setIsModalOpen, onProductSelect }) {
    const navigate = useNavigate();

    const userInfo = useSelector((state) => state.auth);
    if (!userInfo) {
        navigate('/', { replace: true });
        return null;
    }

    const authToken = userInfo?.userInfo?.data?.token;
    const wid = userInfo?.userInfo?.data?.warehouseId;

    const [selectedProducts, setSelectedProducts] = useState([]);

    const {
        data: productListsForAutoSelectResponse,
        isFetching: isProductListsLoading,
        error: productListsError
    } = useGetProductListsForAutoSelectQuery({
        authToken: authToken,
        warehouseId: wid,
    });
    const [autoGetProductFromWarehouse, { data: autoSelectResponse, isLoading: isAutoSelecting }] = useAutoGetProductFromWarehouseMutation();

    const productListsForAutoSelectData = productListsForAutoSelectResponse?.data || [];

    console.log("productListsForAutoSelectData", productListsForAutoSelectData);

    const handleAddProduct = () => {
        setSelectedProducts([...selectedProducts, { id: null, name: "", quantity: 1, availableQuantity: 0 }]);
    };

    const handleProductChange = (value, index) => {
        const product = productListsForAutoSelectData.find((p) => p.id === value);
        const newSelectedProducts = [...selectedProducts];
        newSelectedProducts[index] = {
            id: product.id,
            name: product.name,
            quantity: 1,
            availableQuantity: product.availableQuantity
        };
        setSelectedProducts(newSelectedProducts);
    };

    const handleQuantityChange = (value, index) => {
        if (value > selectedProducts[index].availableQuantity) {
            message.warning("Please input in the range of available quantity")
            return
        }

        value = Math.min(value, selectedProducts[index].availableQuantity);

        const newSelectedProducts = [...selectedProducts];
        newSelectedProducts[index].quantity = value;
        setSelectedProducts(newSelectedProducts);
    };

    const handleRemoveProduct = (index) => {
        const newSelectedProducts = [...selectedProducts];
        newSelectedProducts.splice(index, 1);
        setSelectedProducts(newSelectedProducts);
    };

    const handleAutoTakeProduct = async () => {
        try {
            const data = selectedProducts.map((product) => ({
                productId: product?.id,
                quantity: product?.quantity,
                warehouseId: wid
            }));

            const response = await autoGetProductFromWarehouse({
                authToken,
                data
            }).unwrap();

            if (response && response.data) {
                onProductSelect(response.data);
                setSelectedProducts([]);
                setIsModalOpen(false);
                message.success("Auto select success")
            }
        } catch (error) {
            console.error("Failed to fetch product:", error);
            message.error("Failed to fetch product. Please try again.");
        }
    };

    const getFilteredProductLists = () => {
        const selectedProductIds = selectedProducts.map((product) => product.id);
        return productListsForAutoSelectData.filter((product) => !selectedProductIds.includes(product.id));
    };

    return (
        <Modal
            title="Choose Products"
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={
                <div className="flex justify-between items-center">
                    <Button size="large" onClick={handleAddProduct}>
                        <AddOutlinedIcon />
                    </Button>
                    <div className="flex justify-center items-center gap-2">
                        <Button size="large" type="default" onClick={() => setIsModalOpen(false)}>
                            Close
                        </Button>
                        <Button size="large" type="primary" onClick={handleAutoTakeProduct}>
                            Next
                        </Button>
                    </div>
                </div>
            }
            closable={false}
            width={800}
        >
            <div className="flex flex-col gap-4">
                {selectedProducts.map((product, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <Select
                            showSearch
                            size="large"
                            placeholder="Select a product"
                            value={product.name}
                            onChange={(value) => handleProductChange(value, index)}
                            style={{ width: "60%" }}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().includes(input.toLowerCase())
                            }
                            optionFilterProp="children"
                        >
                            {getFilteredProductLists().map((product) => (
                                <Select.Option key={product.id} value={product.id}>
                                    {product.name}
                                </Select.Option>
                            ))}
                        </Select>
                        <a className="mx-2 font-semibold text-md text-wrap">Available: {product.availableQuantity}</a>
                        <Input
                            type="number"
                            size="large"
                            placeholder="Quantity"
                            value={product.quantity}
                            onChange={(e) => handleQuantityChange(Number(e.target.value), index)}
                            style={{ width: "20%" }}
                        />
                        <Button type="text" icon={<DeleteOutlinedIcon />} onClick={() => handleRemoveProduct(index)} />
                    </div>
                ))}
            </div>
        </Modal>
    );
}

export default AutoSelectModal;
