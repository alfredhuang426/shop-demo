import { useSelector } from "react-redux";

function MessageToast() {
  const messages = useSelector((state) => state.message);
  console.log(messages);

  return (
    <div
      className="toast-container position-fixed"
      style={{ top: "64px", right: "15px" }}
    >
      {messages?.length &&
        messages?.map((message) => {
          return (
            <div
              key={message.id}
              className="toast show"
              role="alert"
              aria-live="assertive"
              aria-atomic="true"
              data-delay="3000"
            >
              <div className={`toast-header text-white bg-${message.type}`}>
                <strong className="me-auto">Message</strong>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="toast"
                  aria-label="Close"
                  // onClick={() => {
                  //   clearMessage(dispatch);
                  // }}
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
