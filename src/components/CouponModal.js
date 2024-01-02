import axios from "axios";
import { useEffect, useState, useContext } from "react";
import {
  MessageContext,
  handleSuccessMessage,
  handleErrorMessage,
} from "../store/messageStore";

function CouponModal({ closeModal, getCoupons, type, tempCoupon }) {
  const [tempData, setTempData] = useState({
    title: "",
    is_enabled: 0,
    percent: 0,
    due_date: 0,
    code: "",
  });

  const [date, setDate] = useState(new Date());
  const [, dispatch] = useContext(MessageContext);

  useEffect(() => {
    if (type === "create") {
      setTempData({
        title: "",
        is_enabled: 0,
        percent: 0,
        due_date: 0,
        code: "",
      });
      setDate(new Date());
    } else if (type === "edit") {
      setTempData(tempCoupon);
      setDate(new Date(tempCoupon.due_date));
    }
  }, [type, tempCoupon]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (true) {
      case name === "percent":
        setTempData({ ...tempData, [name]: +value });
        break;
      case name === "is_enabled":
        setTempData({ ...tempData, [name]: +e.target.checked });
        break;
      default:
        setTempData({ ...tempData, [name]: value });
        break;
    }
  };

  const submit = async () => {
    try {
      let api = `/v2/api/${process.env.REACT_APP_API_PATH}/admin/coupon`;
      let method = "post";
      if (type === "edit") {
        api = `/v2/api/${process.env.REACT_APP_API_PATH}/admin/coupon/${tempData.id}`;
        method = "put";
      }
      const result = await axios[method](api, {
        data: {
          ...tempData,
          due_date: date.getTime(), // 轉換成 unix timestamp
        },
      });
      if (result.data.success) {
        handleSuccessMessage(dispatch, result);
        closeModal();
        getCoupons();
      } else {
        handleErrorMessage(dispatch, {
          response: {
            data: {
              message: result.data.message,
            },
          },
        });
      }
    } catch (error) {
      console.log(error);
      handleErrorMessage(dispatch, error);
    }
  };

  return (
    <div
      className="modal fade"
      id="couponModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              {type === "edit" ? `編輯 ${tempData.title}` : "建立新優惠券"}
            </h1>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={closeModal}
            />
          </div>
          <div className="modal-body">
            <div className="mb-2">
              <label className="w-100" htmlFor="title">
                標題
                <input
                  type="text"
                  id="title"
                  placeholder="請輸入標題"
                  name="title"
                  className="form-control mt-1"
                  onChange={handleChange}
                  value={tempData.title}
                />
              </label>
            </div>
            <div className="row">
              <div className="col-md-6 mb-2">
                <label className="w-100" htmlFor="percent">
                  折扣（%）
                  <input
                    type="number"
                    name="percent"
                    id="percent"
                    placeholder="請輸入折扣（%）"
                    className="form-control mt-1"
                    onChange={handleChange}
                    value={tempData.percent}
                  />
                </label>
              </div>
              <div className="col-md-6 mb-2">
                <label className="w-100" htmlFor="due_date">
                  到期日
                  <input
                    type="date"
                    id="due_date"
                    name="due_date"
                    placeholder="請輸入到期日"
                    className="form-control mt-1"
                    value={`${date.getFullYear().toString()}-${(
                      date.getMonth() + 1
                    )
                      .toString()
                      .padStart(2, 0)}-${date
                      .getDate()
                      .toString()
                      .padStart(2, 0)}`}
                    onChange={(e) => {
                      setDate(new Date(e.target.value));
                    }}
                  />
                </label>
              </div>
              <div className="col-md-6 mb-2">
                <label className="w-100" htmlFor="code">
                  優惠碼
                  <input
                    type="text"
                    id="code"
                    name="code"
                    placeholder="請輸入優惠碼"
                    className="form-control mt-1"
                    onChange={handleChange}
                    value={tempData.code}
                  />
                </label>
              </div>
            </div>
            <label className="form-check-label" htmlFor="is_enabled">
              <input
                className="form-check-input me-2"
                type="checkbox"
                id="is_enabled"
                name="is_enabled"
                onChange={handleChange}
                checked={!!tempData.is_enabled}
              />
              是否啟用
            </label>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={closeModal}
            >
              關閉
            </button>
            <button type="button" className="btn btn-primary" onClick={submit}>
              儲存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CouponModal;
