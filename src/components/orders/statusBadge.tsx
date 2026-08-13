import { OrderStatus } from "@/src/types/order";
import Image from "next/image";

export function StatusBadge({ status }: { status: OrderStatus }) {
  if (status === "completed") {
    return (
      <span className="flex items-center gap-1.5 text-sm font-medium text-neon-green">
        <Image src="/green-check.svg" alt="" width={16} height={16} />
        Completed
      </span>
    );
  }

  if (status === "pending") {
    return (
      <span className="flex items-center gap-1.5 text-sm font-medium text-yellow-400">
        <Image src="/yellow-clock.svg" alt="" width={16} height={16} />
        Pending
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1.5 text-sm font-medium text-red-500">
      <Image src="/red-refunded.svg" alt="" width={16} height={16} />
      Refunded
    </span>
  );
}