import axios from "axios";
import { useEffect, useState } from "react";
import Pagination from "../../components/Pagination";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading";

function Products() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [isLoading, setLoading] = useState(false);

  const getProducts = async (page = 1) => {
    setLoading(true);
    try {
      const productsResult = await axios.get(
        `/v2/api/${process.env.REACT_APP_API_PATH}/products?page=${page}`
      );
      setProducts(productsResult.data.products);
      setPagination(productsResult.data.pagination);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light justify-content-center border border-start-0 border-end-0 border-top border-bottom">
        <div className="navbar-nav flex-row overflow-auto navbar-custom-scroll">
          <a className="nav-item nav-link text-nowrap px-2" href="#">
            Lorem ipsum
          </a>
          <a className="nav-item nav-link text-nowrap px-2" href="#">
            Lorem ipsum
          </a>
          <a className="nav-item nav-link text-nowrap px-2 active" href="#">
            Lorem ipsum <span className="sr-only">(current)</span>
          </a>
          <a className="nav-item nav-link text-nowrap px-2" href="#">
            Lorem ipsum
          </a>
          <a className="nav-item nav-link text-nowrap px-2" href="#">
            Lorem ipsum
          </a>
        </div>
      </nav>
      <div className="container mt-md-5 mt-3 mb-7">
        <Loading isLoading={isLoading} />
        <div className="row">
          {products.map((product) => {
            return (
              <div className="col-md-3" key={product?.id}>
                <div className="card border-0 mb-4 position-relative position-relative">
                  <img
                    src={product?.imageUrl}
                    className="card-img-top rounded-0 object-cover"
                    alt="..."
                    height={300}
                  />
                  <div className="card-body p-0">
                    <h4 className="mb-0 mt-3">
                      <Link to={`/product/${product?.id}`}>
                        {product?.title}
                      </Link>
                    </h4>
                    <p className="card-text text-muted mb-0">
                      {product?.description}
                    </p>
                    <p className="text-muted mt-3">{product?.price}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <nav className="d-flex justify-content-center">
          <Pagination pagination={pagination} changePage={getProducts} />
        </nav>
      </div>
    </>
  );
}

export default Products;
