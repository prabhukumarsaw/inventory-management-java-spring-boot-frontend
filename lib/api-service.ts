// This service handles API calls to the backend
// It provides a clean interface for components to interact with the API

const API_BASE_URL = "http://localhost:8080/api"

export type Product = {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  createdAt: string;
  updatedAt: string;
};

export type InventoryItem = {
  id: number;
  product: Product;
  quantityAvailable: number;
  lastUpdated: string | null;
};

// Product API
export async function getProducts() {
  const response = await fetch(`${API_BASE_URL}/products`)
  if (!response.ok) {
    throw new Error("Failed to fetch products")
  }
  return response.json()
}

export async function getProduct(id: number) {
  const response = await fetch(`${API_BASE_URL}/products/${id}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch product with id ${id}`)
  }
  return response.json()
}


export async function createProduct(productData: {
  name: string
  description: string
  category: string
  price: number
}) {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData), 
  })

  if (!response.ok) {
    throw new Error("Failed to create product")
  }
  return response.json()
}

// NOTE: updateProduct via inventory
// export async function updateProduct(
//   id: number,
//   productData: {
//     name: string
//     description: string
//     category: string
//     price: number
//     quantityAvailable: number
//   }
// ) {
//   const response = await fetch(`${API_BASE_URL}/inventory/${id}`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       product: {
//         id,
//         name: productData.name,
//         description: productData.description,
//         category: productData.category,
//         price: productData.price,
//       },
//       quantityAvailable: productData.quantityAvailable,
//     }),
//   })

//   if (!response.ok) {
//     throw new Error(`Failed to update product with id ${id}`)
//   }
//   return response.json()
// }

export async function deleteProduct(id: number) {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error(`Failed to delete product with id ${id}`)
  }
  return true
}

// Inventory API
export async function getInventory() {
  const response = await fetch(`${API_BASE_URL}/inventory`)
  if (!response.ok) {
    throw new Error("Failed to fetch inventory")
  }
  return response.json()
}

export async function createInventory(data: {
  product: { id: number };
  quantityAvailable: number;
}) {
  const res = await fetch(`${API_BASE_URL}/inventory`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create inventory');
  return res.json();
}

export async function getInventoryByProductId(productId: number) {
  const res = await fetch(`${API_BASE_URL}/inventory/product/${productId}`);
  if (!res.ok) return null;
  return res.json();
}

export async function updateInventoryQuantity(id: number, quantity: number) {
  const response = await fetch(`${API_BASE_URL}/inventory/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ quantityAvailable: quantity }),
  })
  if (!response.ok) {
    throw new Error(`Failed to update inventory quantity for id ${id}`)
  }
  return response.json()
}

export async function deleteInventory(id: number) {
  const response = await fetch(`${API_BASE_URL}/inventory/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Failed to delete inventory item with id ${id}`);
  }
}


export async function updateStock(
  productId: number,
  quantityChange: number
) {
  const response = await fetch(
    `${API_BASE_URL}/inventory/update-stock?productId=${productId}&quantityChange=${quantityChange}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error('Failed to update stock');
  }
  return response.json();
}

// Orders API
export async function getOrders() {
  const response = await fetch(`${API_BASE_URL}/orders`)
  if (!response.ok) {
    throw new Error("Failed to fetch orders")
  }
  return response.json()
}

export async function getOrder(id: number) {
  const response = await fetch(`${API_BASE_URL}/orders/${id}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch order with id ${id}`)
  }
  return response.json()
}

export async function createOrder(orderData: any) {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  })
  if (!response.ok) {
    throw new Error("Failed to create order")
  }
  return response.json()
}

export async function updateOrderStatus(id: number, status: string) {
  const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  })
  if (!response.ok) {
    throw new Error(`Failed to update order status for id ${id}`)
  }
  return response.json()
}
