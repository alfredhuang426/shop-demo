import axios from "axios";
import { useOutletContext, Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Input, CheckboxRadio } from "../../components/FormElements";
function Checkout() {
  const { cartData, getCart } = useOutletContext();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      payment: "ATM",
    },
  });

  const watchPayment = watch("payment", "ATM");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    console.log(data);
    const { name, email, tel, address } = data;
    const form = {
      data: {
        user: {
          name,
          email,
          tel,
          address,
        },
      },
    };
    try {
      const res = await axios.post(
        `/v2/api/${process.env.REACT_APP_API_PATH}/order`,
        form
      );
      console.log(res);
      navigate(`/success/${res.data.orderId}`);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="bg-light pt-5 pb-7">
        <div className="container">
          <div className="row justify-content-center flex-md-row flex-column-reverse">
            <div className="col-md-6">
              <div className="bg-white p-4">
                <h4 className="fw-bold">1. Contact Form</h4>
                <p className="mt-4">Contact information</p>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-2">
                    <Input
                      id="email"
                      labelText="Email"
                      type="email"
                      errors={errors}
                      register={register}
                      rules={{
                        required: "Email 為必填",
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: "Email 格式不正確",
                        },
                      }}
                    ></Input>
                  </div>
                  <div className="mb-2">
                    <Input
                      id="name"
                      type="text"
                      errors={errors}
                      labelText="使用者名稱"
                      register={register}
                      rules={{
                        required: "使用者名稱為必填",
                        maxLength: {
                          value: 10,
                          message: "使用者名稱長度不超過 10",
                        },
                      }}
                    ></Input>
                  </div>
                  <div className="mb-2">
                    <Input
                      id="tel"
                      labelText="電話"
                      type="tel"
                      errors={errors}
                      register={register}
                      rules={{
                        required: "電話為必填",
                        minLength: {
                          value: 6,
                          message: "電話不少於 6 碼",
                        },
                        maxLength: {
                          value: 12,
                          message: "電話不超過 12 碼",
                        },
                      }}
                    ></Input>
                  </div>
                  <div className="mb-2">
                    <Input
                      id="address"
                      labelText="地址"
                      type="address"
                      errors={errors}
                      register={register}
                      rules={{
                        required: "地址為必填",
                      }}
                    ></Input>
                  </div>
                  <div className="mb-2">
                    <p className="mt-4 mb-2">付款方式</p>
                    <CheckboxRadio
                      id="webATM"
                      labelText="WebATM"
                      register={register}
                      errors={errors}
                      type="radio"
                      name="payment"
                      value="WebATM"
                      rules={{
                        required: "付款方式為必填",
                      }}
                    ></CheckboxRadio>
                    <CheckboxRadio
                      id="ATM"
                      labelText="ATM"
                      register={register}
                      errors={errors}
                      type="radio"
                      name="payment"
                      value="ATM"
                      rules={{
                        required: "付款方式為必填",
                      }}
                    ></CheckboxRadio>
                    <CheckboxRadio
                      id="applePay"
                      labelText="ApplePay"
                      register={register}
                      errors={errors}
                      type="radio"
                      name="payment"
                      value="ApplePay"
                      rules={{
                        required: "付款方式為必填",
                      }}
                    ></CheckboxRadio>
                  </div>
                  <div className="d-flex flex-column-reverse flex-md-row mt-4 justify-content-between align-items-md-center align-items-end w-100">
                    <Link className="text-dark mt-md-0 mt-3" to="/cart">
                      <i className="bi bi-chevron-left me-2"></i> 繼續點餐
                    </Link>
                    <button
                      type="submit"
                      className="btn btn-dark py-3 px-7 rounded-0"
                    >
                      送出表單
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="col-md-4">
              <div className="border p-4 mb-4">
                <h4 className="mb-4">Order Detail</h4>
                {cartData?.carts?.map((item) => {
                  return (
                    <div className="d-flex mb-2" key={item?.id}>
                      <img
                        src={item?.product?.imageUrl}
                        alt="..."
                        className="me-2 object-cover"
                        style={{
                          width: "48px",
                        }}
                      />
                      <div className="w-100">
                        <div className="d-flex justify-content-between fw-bold">
                          <p className="mb-0">{item?.product?.title}</p>
                          <p className="mb-0">x{item?.qty}</p>
                        </div>
                        <div className="d-flex justify-content-between">
                          <p className="text-muted mb-0">
                            <small>{item?.product?.price}</small>
                          </p>
                          <p className="mb-0">NT${item?.total}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <table className="table mt-4 border-top border-bottom text-muted">
                  <tbody>
                    <tr>
                      <th
                        scope="row"
                        className="border-0 px-0 pt-0 pb-4 font-weight-normal"
                      >
                        Payment
                      </th>
                      <td className="text-end border-0 px-0 pt-0 pb-4">
                        {watchPayment}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="d-flex justify-content-between mt-4">
                  <p className="mb-0 h4 fw-bold">Total</p>
                  <p className="mb-0 h4 fw-bold">NT${cartData?.final_total}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Checkout;
