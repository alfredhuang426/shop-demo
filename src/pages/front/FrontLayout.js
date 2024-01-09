import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import MessageToast from "../../components/MessageToast";

function FrontLayout() {
  const [cartData, setCartData] = useState({});

  const getCart = async () => {
    try {
      const getCartResult = await axios.get(
        `/v2/api/${process.env.REACT_APP_API_PATH}/cart`
      );
      setCartData(getCartResult?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  return (
    <>
      <Navbar cartData={cartData}></Navbar>
      <MessageToast />
      <Outlet context={{ getCart, cartData }}></Outlet>
      <div className="bg-dark">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between text-white py-4">
            <p className="mb-0">© 2020 LOGO All Rights Reserved.</p>
            <ul className="d-flex list-unstyled mb-0 h4">
              <li>
                <a href="#" className="text-white mx-3">
                  <i className="fab fa-facebook"></i>
                </a>
              </li>
              <li>
                <a href="#" className="text-white mx-3">
                  <i className="fab fa-instagram"></i>
                </a>
              </li>
              <li>
                <a href="#" className="text-white ms-3">
                  <i className="fab fa-line"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default FrontLayout;
