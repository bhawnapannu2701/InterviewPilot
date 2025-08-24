import { toast } from "sonner";

export function success(msg: string) {
  toast.success(msg, { duration: 2500 });
}

export function error(msg: string) {
  toast.error(msg, { duration: 3000 });
}

export function info(msg: string) {
  toast(msg, { duration: 2500 });
}

export function loading(msg: string) {
  toast.loading(msg);
}
