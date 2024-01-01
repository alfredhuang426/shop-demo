import axios from "axios";
import { useEffect, useRef, useState } from "react";
import CouponModal from "../../components/CouponModal";
import DeleteModal from "../../components/DeleteModal";
import Pagination from "../../components/Pagination";
import { Modal } from "bootstrap";

function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [pagination, setPagination] = useState({});
  // type: 決定modal展開的用途，新增or編輯
  const [type, setType] = useState("create");
  const [tempCoupon, setTempCoupon] = useState({});

  const couponModal = useRef(null);
  const deleteModal = useRef(null);
  const openModal = (type, tempCoupon) => {
    setType(type);
    setTempCoupon(tempCoupon);
    couponModal.current.show();
  };
  const closeModal = () => {
    couponModal.current.hide();
  };
  const openDeleteModal = (tempCoupon) => {
    setTempCoupon(tempCoupon);
    deleteModal.current.show();
  };
  const closeDeleteModal = () => {
    deleteModal.current.hide();
  };
  const deleteCoupon = async (id) => {
    try {
      const result = await axios.delete(
        `/v2/api/${process.env.REACT_APP_API_PATH}/admin/coupon/${id}`
      );
      if (result.data.success) {
        closeDeleteModal();
        getCoupons();
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    couponModal.current = new Modal("#couponModal", {
      backdrop: "static",
    });
    deleteModal.current = new Modal("#deleteModal", {
      backdrop: "static",
    });
    getCoupons();
  }, []);

  const getCoupons = async (page = 1) => {
    try {
      const couponsResult = await axios.get(
        `/v2/api/${process.env.REACT_APP_API_PATH}/admin/coupons?page=${page}`
      );
      setCoupons(couponsResult.data.coupons);
      setPagination(couponsResult.data.pagination);
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (date) => {
    let d = new Date(date),
      month = ("" + (d.getMonth() + 1)).padStart(2, 0),
      day = ("" + d.getDate()).padStart(2, 0),
      year = d.getFullYear();

    return [year, month, day].join("-");
  };

  return (
    <>
      <CouponModal
        closeModal={closeModal}
        getCoupons={getCoupons}
        type={type}
        tempCoupon={tempCoupon}
      />
      <DeleteModal
        closeModal={closeDeleteModal}
        handleDelete={deleteCoupon}
        text={tempCoupon.title}
        id={tempCoupon.id}
      />
      <div className="p-3">
        <h3>優惠券列表</h3>
        <hr />
        <div className="text-end">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => openModal("create", {})}
          >
            建立新優惠券
          </button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">標題</th>
              <th scope="col">折扣</th>
              <th scope="col">到期日</th>
              <th scope="col">優惠碼</th>
              <th scope="col">啟用狀態</th>
              <th scope="col">編輯</th>
            </tr>
          </thead>
          <tbody>
            {coupons?.map((coupon) => {
              return (
                <tr key={coupon?.id}>
                  <td>{coupon?.title}</td>
                  <td>{coupon?.percent}</td>
                  <td>{formatDate(coupon.due_date)}</td>
                  <td>{coupon?.code}</td>
                  <td>{coupon?.is_enabled ? "啟用" : "未啟用"}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => openModal("edit", coupon)}
                    >
                      編輯
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm ms-2"
                      onClick={() => openDeleteModal(coupon)}
                    >
                      刪除
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <Pagination pagination={pagination} changePage={getCoupons} />
      </div>
    </>
  );
}

export default AdminCoupons;
