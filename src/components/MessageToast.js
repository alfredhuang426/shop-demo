import { useSelector, useDispatch } from "react-redux";
import { removeMessage } from "../slice/messageSlice"

function MessageToast() {
  const messages = useSelector((state) => state.message);
  const dispatch = useDispatch();

  const clearMessage = (id) => {
    dispatch(removeMessage(id))
  }

  return (
    <div
      className="toast-container position-fixed"
      style={{ top: "64px", right: "15px" }}
    >
      {!!messages?.length &&
        messages?.map((message) => {
          return (
            <div
              key={message?.id}
              className="toast show"
              role="alert"
              aria-live="assertive"
              aria-atomic="true"
              data-delay="3000"
            >
              <div className={`toast-header text-white bg-${message?.type}`}>
                <strong className="me-auto">{message?.title}</strong>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="toast"
                  aria-label="Close"
                  onClick={() => {
                    clearMessage(message?.id);
                  }}
                />
              </div>
              <div className="toast-body">{message.text}</div>
            </div>
          );
        })}
    </div>
  );
}

export default MessageToast;
