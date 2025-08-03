import React from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { showToastMessage } from "../../features/common/uiSlice";
import "react-toastify/dist/ReactToastify.css";

const ToastMessage = () => {
  const dispatch = useDispatch();
  const { toastMessage } = useSelector((state) => state.ui);

  useEffect(() => {
    if (toastMessage) {
      const { message, status } = toastMessage;
      if (message !== "" && status !== "") {
        toast[status](message, { theme: "colored" });

        // 토스트 표시 후 상태 초기화
        dispatch(showToastMessage({ message: "", status: "" }));
      }
    }
  }, [toastMessage, dispatch]);
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  );
};

export default ToastMessage;
