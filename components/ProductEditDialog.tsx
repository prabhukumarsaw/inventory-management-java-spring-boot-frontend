'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

type Props = {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onSave: () => void;
};

export function ProductEditDialog({ product, open, onClose, onSave }: Props) {
  const [formData, setFormData] = useState(
    product || {
      id: 0,
      name: '',
      description: '',
      category: '',
      price: 0,
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' ? Number(value) : value,
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/products/${formData.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error('Update failed');
      onSave();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <Input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
        />
        <Input
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
        />
        <Input
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category"
        />
        <Input
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
        />
        <Button onClick={handleSubmit}>Save</Button>
      </DialogContent>
    </Dialog>
  );
}
