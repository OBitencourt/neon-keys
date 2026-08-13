"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { ProfileSidebar } from "@/src/components/profileSidebar";
import { OrderStatus } from "@/src/types/order";
import { mockOrders } from "@/src/utils/mockOrders";
import { FilterSelect } from "@/src/components/orders/filterSelect";
import { StatusBadge } from "@/src/components/orders/statusBadge";
import { StatCard } from "@/src/components/orders/statCard";


const ITEMS_PER_PAGE = 6;

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [page, setPage] = useState(1);

  const totalOrders = mockOrders.length;
  const totalCompleted = mockOrders.filter((o) => o.status === "completed").length;
  const totalSaved = mockOrders
    .filter((o) => o.status === "refunded")
    .reduce((sum, o) => sum + o.total, 0);

  const filteredOrders = useMemo(() => {
    return mockOrders.filter((order) => {
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        order.itemName.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ITEMS_PER_PAGE));

  const paginatedOrders = filteredOrders.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <main className="min-h-screen bg-black px-4 py-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-350 gap-8">

        <ProfileSidebar />

        <section className="min-w-0 flex-1">

          <header className="mb-8">

            <h1 className="text-4xl font-bold text-neon-white lg:text-5xl">
              Your orders
            </h1>

            <p className="mt-1 text-sm text-neon-gray lg:text-base">
              view and manage your complete purchase history
            </p>

          </header>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

            <StatCard
              label="TOTAL ORDERS"
              value={totalOrders.toString()}
              color="pink"
              iconSrc="/pink-paper.svg"
            />

            <StatCard
              label="TOTAL COMPLETED"
              value={totalCompleted.toString()}
              color="green"
              iconSrc="/green-check.svg"
            />

            <StatCard
              label="TOTAL SAVED"
              value={`R$ ${totalSaved.toFixed(2).replace(".", ",")}`}
              color="orange"
              iconSrc="/yellow-card.svg"
            />

          </div>


          <div className="mt-6 flex flex-col gap-3 sm:flex-row">

            <div className="relative flex-1">

              <Image
                src="/icons/search-icon.svg"
                alt=""
                width={16}
                height={16}
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="search by order number or game name"
                className="
                  h-11
                  w-full
                  rounded-md
                  border
                  border-neon-gray/40
                  bg-black
                  pl-10
                  pr-4
                  text-sm
                  text-neon-white
                  placeholder:text-neon-gray
                  outline-none
                  focus:border-neon-pink
                "
              />

            </div>

            <FilterSelect
              value={statusFilter}
              onChange={(value) => {
                setStatusFilter(value as "all" | OrderStatus);
                setPage(1);
              }}
              options={[
                { value: "all", label: "All statuses" },
                { value: "completed", label: "Completed" },
                { value: "pending", label: "Pending" },
                { value: "refunded", label: "Refunded" },
              ]}
            />

            <FilterSelect
              value={dateFilter}
              onChange={setDateFilter}
              options={[
                { value: "all", label: "All dates" },
                { value: "7d", label: "Last 7 days" },
                { value: "30d", label: "Last 30 days" },
                { value: "90d", label: "Last 90 days" },
              ]}
            />

          </div>

          <div className="mt-6 rounded-xl bg-neon-gradient p-[1.5px]">

            <div className="overflow-hidden rounded-xl bg-black">

              <div className="overflow-x-auto">

                <table className="w-full min-w-175 border-collapse text-left">

                  <thead>
                    <tr className="border-b border-neon-gray/30 text-xs font-bold tracking-wide text-neon-gray">
                      <th className="px-5 py-4">ORDER</th>
                      <th className="px-5 py-4">DATE</th>
                      <th className="px-5 py-4">ITEMS</th>
                      <th className="px-5 py-4">TOTAL</th>
                      <th className="px-5 py-4">STATUS</th>
                      <th className="px-5 py-4 text-right">ACTION</th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedOrders.length > 0 ? (
                      paginatedOrders.map((order, index) => (
                        <tr
                          key={order.id}
                          className={
                            index !== paginatedOrders.length - 1
                              ? "border-b border-neon-gray/10"
                              : ""
                          }
                        >

                          <td className="px-5 py-4 text-sm font-medium text-neon-white">
                            {order.orderNumber}
                          </td>

                          <td className="px-5 py-4 text-sm text-neon-gray">
                            {order.date}
                          </td>

                          <td className="px-5 py-4 text-sm text-neon-white">
                            {order.itemName}
                          </td>

                          <td className="px-5 py-4 text-sm font-medium text-neon-white">
                            R${order.total.toFixed(2).replace(".", ",")}
                          </td>

                          <td className="px-5 py-4">
                            <StatusBadge status={order.status} />
                          </td>

                          <td className="px-5 py-4 text-right">
                            <button
                              type="button"
                              className="
                                rounded-md
                                border
                                border-neon-pink
                                px-4
                                py-2
                                text-xs
                                font-bold
                                text-neon-pink
                                transition-colors
                                hover:bg-neon-pink/10
                              "
                            >
                              View details
                            </button>
                          </td>

                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-5 py-12 text-center text-sm text-neon-gray">
                          No orders match your search.
                        </td>
                      </tr>
                    )}
                  </tbody>

                </table>

              </div>

              <div className="flex items-center justify-end gap-2 border-t border-neon-gray/20 px-5 py-4">

                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-md
                    border
                    border-neon-pink
                    text-neon-pink
                    transition-colors
                    hover:bg-neon-pink/10
                    disabled:cursor-not-allowed
                    disabled:opacity-30
                    disabled:hover:bg-transparent
                  "
                >
                  ‹
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p)}
                    className={`
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-md
                      border
                      text-sm
                      font-bold
                      transition-colors
                      ${
                        p === page
                          ? "border-neon-pink bg-neon-gradient text-neon-white"
                          : "border-neon-gray/40 text-neon-gray hover:border-neon-pink hover:text-neon-white"
                      }
                    `}
                  >
                    {p}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-md
                    border
                    border-neon-pink
                    text-neon-pink
                    transition-colors
                    hover:bg-neon-pink/10
                    disabled:cursor-not-allowed
                    disabled:opacity-30
                    disabled:hover:bg-transparent
                  "
                >
                  ›
                </button>

              </div>

            </div>

          </div>
        </section>
      </div>
    </main>
  );
}
