import axios from "axios";
import { useEffect, useRef, useState } from "react";
import ProductModal from "../../components/ProductModal";
import DeleteModal from "../../components/DeleteModal";
import Pagination from "../../components/Pagination";
import { Modal } from "bootstrap";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  // type: 決定modal展開的用途，新增or編輯
  const [type, setType] = useState("create");
  const [tempProducts, setTempProducts] = useState({});

  const productModal = useRef(null);
  const deleteModal = useRef(null);
  const openModal = (type, tempProducts) => {
    setType(type);
    setTempProducts(tempProducts);
    productModal.current.show();
  };
  const closeModal = () => {
    productModal.current.hide();
  };
  const openDeleteModal = (tempProducts) => {
    setTempProducts(tempProducts);
    deleteModal.current.show();
  };
  const closeDeleteModal = () => {
    deleteModal.current.hide();
  };
  const deleteProduct = async (id) => {
    try {
      const result = await axios.delete(
        `/v2/api/${process.env.REACT_APP_API_PATH}/admin/product/${id}`
      );
      if (result.data.success) {
        closeDeleteModal();
        getProducts();
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    productModal.current = new Modal("#productModal", {
      backdrop: "static",
    });
    deleteModal.current = new Modal("#deleteModal", {
      backdrop: "static",
    });
    getProducts();
  }, []);

  const getProducts = async (page = 1) => {
    try {
      const productsResult = await axios.get(
        `/v2/api/${process.env.REACT_APP_API_PATH}/admin/products?page=${page}`
      );
      setProducts(productsResult.data.products);
      setPagination(productsResult.data.pagination);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <ProductModal
        closeModal={closeModal}
        getProducts={getProducts}
        type={type}
        tempProducts={tempProducts}
      />
      <DeleteModal
        closeModal={closeDeleteModal}
        handleDelete={deleteProduct}
        text={tempProducts.title}
        id={tempProducts.id}
      />
      <div className="p-3">
        <h3>產品列表</h3>
        <hr />
        <div className="text-end">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => openModal("create", {})}
          >
            建立新商品
          </button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">分類</th>
              <th scope="col">名稱</th>
              <th scope="col">售價</th>
              <th scope="col">啟用狀態</th>
              <th scope="col">編輯</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => {
              return (
                <tr key={product?.id}>
                  <td>{product?.category}</td>
                  <td>{product?.title}</td>
                  <td>{product?.price}</td>
                  <td>{product?.is_enabled ? "啟用" : "未啟用"}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => openModal("edit", product)}
                    >
                      編輯
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm ms-2"
                      onClick={() => openDeleteModal(product)}
                    >
                      刪除
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <Pagination pagination={pagination} changePage={getProducts} />
      </div>
    </>
  );
}

export default AdminProducts;
