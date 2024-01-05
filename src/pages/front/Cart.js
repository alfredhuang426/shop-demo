import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { NavLink } from "react-router-dom";

function Cart() {
  const { cartData, getCart } = useOutletContext();
  const [loadingItems, setLoadingItems] = useState([]);

  const removeCartItem = async (id) => {
    try {
      const result = await axios.delete(
        `/v2/api/${process.env.REACT_APP_API_PATH}/cart/${id}`
      );
      getCart();
    } catch (error) {
      console.log(error);
    }
  };

  const updateCartItem = async (item, quantity) => {
    const data = {
      data: {
        product_id: item?.product_id,
        qty: quantity,
      },
    };
    try {
      setLoadingItems([...loadingItems, item?.id]);
      const result = await axios.put(
        `/v2/api/${process.env.REACT_APP_API_PATH}/cart/${item?.id}`,
        data
      );
      getCart();
      setLoadingItems(loadingItems.filter((itemId) => itemId !== item?.id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="container">
        <div className="row justify-content-center">
          <div
            className="col-md-6 bg-white py-5"
            style={{ minHeight: "calc(100vh - 56px - 76px)" }}
          >
            <div className="d-flex justify-content-between">
              <h2 className="mt-2">購物車內容</h2>
            </div>
            {cartData?.carts?.map((item) => {
              return (
                <div className="d-flex mt-4 bg-light" key={item?.id}>
                  <img
                    src={item?.product?.imageUrl}
                    alt="..."
                    className="object-cover"
                    style={{
                      width: "120px",
                    }}
                  />
                  <div className="w-100 p-3 position-relative">
                    <button
                      type="button"
                      className="position-absolute btn"
                      style={{ top: "8px", right: "16px" }}
                      onClick={() => removeCartItem(item?.id)}
                    >
                      <i className="bi bi-x-lg"></i>
                    </button>
                    <p className="mb-0 fw-bold">{item?.product?.title}</p>
                    <p className="mb-1 text-muted" style={{ fontSize: "14px" }}>
                      {item?.product?.content}
                    </p>
                    <div className="d-flex justify-content-between align-items-center w-100">
                      <div className="input-group w-50 align-items-center">
                        <select
                          name=""
                          className="form-select"
                          id=""
                          value={item?.qty}
                          disabled={loadingItems.includes(item?.id)}
                          onChange={(e) => {
                            updateCartItem(item, +e.target.value);
                          }}
                        >
                          {[...new Array(20)].map((_, index) => {
                            return (
                              <option value={index + 1} key={index}>
                                {index + 1}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      <p className="mb-0 ms-auto">NT${item?.final_total}</p>
                    </div>
                  </div>
                </div>
              );
            })}
            {/* 優惠券區塊 */}
            {/* <table className="table mt-4 text-muted">
              <tbody>
                <tr>
                  <th scope="row" className="border-0 px-0 font-weight-normal">
                    Lorem ipsum
                  </th>
                  <td className="text-end border-0 px-0">NT$24,000</td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="border-0 px-0 pt-0 font-weight-normal"
                  >
                    Lorem ipsum
                  </th>
                  <td className="text-end border-0 px-0 pt-0">NT$500</td>
                </tr>
              </tbody>
            </table> */}
            <div className="d-flex justify-content-between mt-4">
              <p className="mb-0 h4 fw-bold">總金額</p>
              <p className="mb-0 h4 fw-bold">NT${cartData?.final_total}</p>
            </div>
            <NavLink
              to="/checkout"
              className="btn btn-dark w-100 mt-4 rounded-0 py-3"
            >
              確認餐點正確
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
}

export default Cart;
