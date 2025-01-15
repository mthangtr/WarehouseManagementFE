import Breadcrumbs from "../../utils/Breadcumbs";
import { useState } from "react";
import { useSelector } from "react-redux";
import {
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useAddCategoryMutation,
} from "../../redux/api/categoryApiSlice";
import CategoryTable from "../../components/Data/Category/CategoryTable";
import CategoryModal from "../../components/Data/Category/CategoryModal";
import AddCategoryModal from "../../components/Data/Category/AddCategoryModal";
import { Button, message, Form } from "antd";
import Loading from "../../utils/Loading";
import Error500 from "../../utils/Error500";
import '../../assets/styles/MainDash.css';
import useDocumentTitle from "../../utils/UseDocumentTitle";

const DataCategory = () => {
  useDocumentTitle('Categories');
  const userInfo = useSelector((state) => state.auth);
  const authToken = userInfo.userInfo.data.token;
  const { data: categories, isLoading, error } = useGetCategoriesQuery(authToken);
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [addCategory] = useAddCategoryMutation();
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [form] = Form.useForm();
  const [formAdd] = Form.useForm();
  const [addNewVisible, setAddNewVisible] = useState(false);

  const showModal = (categoryId) => {
    const category = categories.data.find((c) => c.id === categoryId);
    setSelectedCategory(category);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    const values = await form.validateFields();
    console.log(values);
    const data = { ...values, id: selectedCategory.id };
    console.log(selectedCategory.id);
    const response = await updateCategory({ categoryId: selectedCategory.id, updatedCategory: values, authToken });
    console.log(response);
    message.info(response.data.message)
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setSelectedCategory(null)
    setIsModalVisible(false);
  };

  const handleDelete = async () => {
    try {
      const response = await deleteCategory({ categoryId: selectedCategory.id, authToken });
      setIsModalVisible(false);
      // message.success("Category deleted successfully");
      message.info(response.data.message);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleOkAdd = async () => {
    const values = await formAdd.validateFields();
    const data = { ...values };
    try {
      await addCategory({ newCategory: data, authToken });
      setAddNewVisible(false);
      formAdd.resetFields();
      // message.success("Added category")
    } catch (error) {
      console.log(error);
      message.error(error.message);
    }
  };

  const handleCancelAdd = () => {
    setAddNewVisible(false);
  };

  if (isLoading) {
    return (
      <div className="">
        <Loading />
      </div>
    );
  }

  if (error) {
    return <Error500 />;
  }

  return (
    <div className="">
      <Breadcrumbs />
      <div
        className="flex justify-between"
        style={{ paddingLeft: "3rem", paddingTop: "1rem" }}
      >
      <h1 class="mb-2 text-2xl font-semibold text-dark">Categories</h1>
        <Button
          type="primary"
          style={{ background: "#40A578" }}
          onClick={() => setAddNewVisible(true)}
        >
          Add new category
        </Button></div>
      <AddCategoryModal
        addNewVisible={addNewVisible}
        handleOkAdd={handleOkAdd}
        handleCancelAdd={handleCancelAdd}
        formAdd={formAdd}
      />
      <CategoryTable
        categoryList={categories.data}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        showModal={showModal}
      />
      <CategoryModal
        isModalVisible={isModalVisible}
        handleOk={handleOk}
        handleCancel={handleCancel}
        handleDelete={handleDelete}
        selectedCategory={selectedCategory}
        form={form}
      />
    </div>
  );
};

export default DataCategory;
