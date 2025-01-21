'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaTrashAlt } from 'react-icons/fa';
import Image from 'next/image'; // Import Image from Next.js

// Define interface for the cart item
interface CartItem {
  productName: string;
  price: number;
  quantity?: number;
  image: string;
}

const CartPage = () => {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const updatedCart = savedCart.map((product: CartItem) => ({
      ...product,
      quantity: product.quantity || 1,  // Default to 1 if no quantity
    }));
    setCart(updatedCart);
  }, []);

  // Remove item from cart
  const removeFromCart = (product: CartItem) => {
    const updatedCart = cart.filter((item) => item.price !== product.price);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    alert(`${product.productName} removed from cart!`);
  };

  // Update quantity in cart
  const updateQuantity = (product: CartItem, newQuantity: number) => {
    const updatedCart = cart.map((item) =>
      item.price === product.price ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  if (cart.length === 0) return <p>Your cart is empty!</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      <ul className="space-y-6">
        {cart.map((product, index) => (
          <li key={index} className="border p-4 rounded-lg flex items-center justify-between shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center">
              <Image
                src={product.image}
                alt={product.productName}
                width={96} // Optimized width
                height={96} // Optimized height
                className="object-cover mr-6"
              />
              <div>
                <h2 className="text-xl font-semibold">{product.productName}</h2>
                <p className="text-gray-600 text-sm">${product.price}</p>
                <div className="flex items-center mt-2">
                  <input
                    type="number"
                    value={product.quantity || 1}
                    onChange={(e) => updateQuantity(product, parseInt(e.target.value))}
                    className="w-16 text-center border px-2 py-1 rounded-md"
                    min="1"
                  />
                  <button className="text-red-600 hover:text-red-800 ml-4" onClick={() => removeFromCart(product)}>
                    <FaTrashAlt size={20} />
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-6 text-right">
        <button
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-all"
          onClick={() => router.push('/checkout')}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;
