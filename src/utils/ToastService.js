import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const toastConfig = {
	position: "top-right",
	autoClose: 1500,
	hideProgressBar: false,
	closeOnClick: true,
	pauseOnHover: true,
	draggable: true,
	progress: undefined,
	theme: "light",
};

export function toastInfo(messege) {
	toast.info(messege, toastConfig);
}

export function toastSuccess(messege) {
	toast.success(messege, toastConfig);
}

export function toastWarning(messege) {
	toast.warn(messege, toastConfig);
}

export function toastError(messege) {
	toast.error(messege, toastConfig);
}
