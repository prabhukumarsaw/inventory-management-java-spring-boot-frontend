"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react"
import { createOrder, getProducts } from "@/lib/api-service"
import { ProductSelector } from "@/components/product-selector"

type Product = {
  id: number
  name: string
  description: string
  category: string
  price: number
}

type CartItem = {
  product: Product
  quantity: number
}

export function OrderCart() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [contactName, setContactName] = useState("")
  const [orderType, setOrderType] = useState<"SALE" | "PURCHASE">("SALE")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts()
        setProducts(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load products. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [])

  const addToCart = (product: Product) => {
    setCartItems((prevItems) => {
      // Check if product is already in cart
      const existingItemIndex = prevItems.findIndex((item) => item.product.id === product.id)

      if (existingItemIndex >= 0) {
        // Update quantity if product already exists
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        }
        return updatedItems
      } else {
        // Add new product to cart
        return [...prevItems, { product, quantity: 1 }]
      }
    })

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return

    setCartItems((prevItems) => {
      const updatedItems = [...prevItems]
      updatedItems[index] = {
        ...updatedItems[index],
        quantity: newQuantity,
      }
      return updatedItems
    })
  }

  const removeFromCart = (index: number) => {
    setCartItems((prevItems) => {
      const updatedItems = [...prevItems]
      updatedItems.splice(index, 1)
      return updatedItems
    })
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  const handleSubmitOrder = async () => {
    if (cartItems.length === 0) {
      toast({
        title: "Empty cart",
        description: "Please add at least one product to your cart.",
        variant: "destructive",
      })
      return
    }

    if (!contactName) {
      toast({
        title: "Missing information",
        description: "Please enter a contact name.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const orderData = {
        orderType,
        status: "PENDING",
        contactName,
        notes,
        orderItems: cartItems.map((item) => ({
          product: { id: item.product.id },
          quantity: item.quantity,
          unitPrice: item.product.price,
          totalPrice: item.product.price * item.quantity,
        })),
      }

      await createOrder(orderData)

      toast({
        title: "Order created",
        description: "Your order has been created successfully.",
      })

      // Clear cart and redirect
      setCartItems([])
      router.push("/orders")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Add Products</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductSelector products={products} onAddToCart={addToCart} isLoading={isLoading} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Cart Items</CardTitle>
            <div className="text-sm text-muted-foreground">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
            </div>
          </CardHeader>
          <CardContent>
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Your cart is empty</h3>
                <p className="text-sm text-muted-foreground mt-1">Add products to your cart to create an order</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-4">
                    <div className="flex-1">
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-sm text-muted-foreground">${item.product.price.toFixed(2)} each</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(index, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(index, Number.parseInt(e.target.value) || 1)}
                        className="h-8 w-16 text-center"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(index, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => removeFromCart(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="ml-4 text-right min-w-[80px]">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          {cartItems.length > 0 && (
            <CardFooter className="flex justify-between">
              <div className="text-lg font-semibold">Subtotal</div>
              <div className="text-lg font-semibold">${calculateSubtotal().toFixed(2)}</div>
            </CardFooter>
          )}
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orderType">Order Type</Label>
              <Select value={orderType} onValueChange={(value) => setOrderType(value as "SALE" | "PURCHASE")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select order type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SALE">Sale</SelectItem>
                  <SelectItem value="PURCHASE">Purchase</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactName">Contact Name</Label>
              <Input
                id="contactName"
                placeholder="Enter customer or supplier name"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Enter any additional notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleSubmitOrder} disabled={isSubmitting || cartItems.length === 0}>
              {isSubmitting ? "Creating Order..." : "Create Order"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
