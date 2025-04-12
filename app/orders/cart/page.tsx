import { DashboardHeader } from "@/components/dashboard-header"
import { OrderCart } from "@/components/order-cart"

export default function OrderCartPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader title="Order Cart" description="Create and manage your order" />

      <main className="flex-1 p-4 md:p-6 pt-16 lg:pt-6">
        <OrderCart />
      </main>
    </div>
  )
}
