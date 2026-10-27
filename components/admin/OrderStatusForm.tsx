import { OrderStatus, PaymentStatus } from "@prisma/client";
import { useLanguage } from "@/context/LanguageContext";

type OrderStatusFormProps = {
  orderId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  action: (formData: FormData) => Promise<void>;
};

export default function OrderStatusForm({
  orderId,
  status,
  paymentStatus,
  action,
}: OrderStatusFormProps) {
  const { t } = useLanguage();

  return (
    <form action={action} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
      <input type="hidden" name="orderId" value={orderId} />

      <select
        name="status"
        defaultValue={status}
        className="border border-black px-3 py-2 text-sm"
      >
        {Object.values(OrderStatus).map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <select
        name="paymentStatus"
        defaultValue={paymentStatus}
        className="border border-black px-3 py-2 text-sm"
      >
        {Object.values(PaymentStatus).map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="border border-black px-4 py-2 text-sm font-semibold transition hover:bg-black hover:text-white"
      >
        {t("adminUpdate")}
      </button>
    </form>
  );
}
