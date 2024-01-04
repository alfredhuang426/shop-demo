import axios from "axios";
import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";

function ProductDetail() {
  const [product, setProduct] = useState({});
  const { id } = useParams();
  const [cartQuantity, setCartQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  // 取得父層傳來的function <Outlet context={{ getCart }}></Outlet>
  const { getCart } = useOutletContext();

  const getProduct = async (id) => {
    try {
      const productResult = await axios.get(
        `/v2/api/${process.env.REACT_APP_API_PATH}/product/${id}`
      );
      setProduct(productResult.data.product);
    } catch (error) {
      console.log(error);
    }
  };

  const addToCart = async () => {
    try {
      setIsLoading(true);
      const addToCartResult = await axios.post(
        `/v2/api/${process.env.REACT_APP_API_PATH}/cart`,
        {
          data: {
            product_id: product?.id,
            qty: cartQuantity,
          },
        }
      );
      console.log(addToCartResult);
      setIsLoading(false);
      getCart();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProduct(id);
  }, [id]);
  return (
    <>
      <div className="container">
        <div
          style={{
            minHeight: "400px",
            backgroundImage: `url(${product?.imageUrl})`,
            backgroundPosition: "center center",
          }}
        ></div>
        <div className="row justify-content-between mt-4 mb-7">
          <div className="col-md-7">
            <h2 className="mb-0">{product?.title}</h2>
            <p className="fw-bold">{product?.price}</p>
            <p>{product?.content}</p>
            <div className="my-4">
              <img src={product?.imageUrl} alt="" className="img-fluid mt-4" />
            </div>
          </div>
          <div className="col-md-4">
            <div className="input-group mb-3 border mt-3">
              <div className="input-group-prepend">
                <button
                  className="btn btn-outline-dark rounded-0 border-0 py-3"
                  type="button"
                  id="button-addon1"
                  onClick={() => {
                    setCartQuantity((pre) => (pre === 1 ? pre : pre - 1));
                  }}
                >
                  <i className="bi bi-dash"></i>
                </button>
              </div>
              <input
                type="number"
                className="form-control border-0 text-center my-auto shadow-none"
                placeholder=""
                aria-label="Example text with button addon"
                aria-describedby="button-addon1"
                value={cartQuantity}
                readOnly
              />
              <div className="input-group-append">
                <button
                  className="btn btn-outline-dark rounded-0 border-0 py-3"
                  type="button"
                  id="button-addon2"
                  onClick={() => {
                    setCartQuantity((pre) => pre + 1);
                  }}
                >
                  <i className="bi bi-plus"></i>
                </button>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-dark w-100 rounded-0 py-3"
              onClick={addToCart}
              disabled={isLoading}
            >
              加入購物車
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetail;
