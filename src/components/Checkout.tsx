'use client';
import React, { useState, useEffect } from 'react';
import ReviewRating from './ReviewRatings';

// Mock data for valid discount codes and gift coupons
const discountCoupons = [
  { code: 'DISCOUNT10', discountValue: 10 }, // 10% discount
  { code: 'DISCOUNT20', discountValue: 20 }, // 20% discount
];

const giftCoupons = [
  { code: 'GIFT100', discountValue: 100 }, // $100 off
];

const CheckoutPage: React.FC = () => {
  const [cart, setCart] = useState<any[]>([]); // Store cart items
  const [total, setTotal] = useState<number>(0);
  const [voucherCode, setVoucherCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [error, setError] = useState('');

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
    const initialTotal = savedCart.reduce(
      (acc, product) => acc + product.price * (product.quantity || 1),
      0
    );
    setTotal(initialTotal);
  }, []); // Runs once when the component mounts

  // Handle input changes
  const handleVoucherCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVoucherCode(e.target.value);
  };

  // Apply discount or gift coupon
  const applyVoucher = () => {
    setError('');
    const isDiscountCode = discountCoupons.find(
      (coupon) => coupon.code === voucherCode
    );
    const isGiftCoupon = giftCoupons.find((coupon) => coupon.code === voucherCode);

    if (isDiscountCode) {
      // Apply discount
      const discountAmount = (total * isDiscountCode.discountValue) / 100;
      setTotal(total - discountAmount);
      setDiscountApplied(true);
      setError('');
    } else if (isGiftCoupon) {
      // Apply gift coupon
      setTotal(total - isGiftCoupon.discountValue);
      setDiscountApplied(true);
      setError('');
    } else {
      // Invalid coupon code
      setError('Invalid voucher code. Please try again.');
    }
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold mb-8">Checkout</h1>

      {/* Cart Summary */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Cart Summary</h2>
        <ul>
          {cart.map((product, index) => (
            <li key={index} className="flex justify-between py-2 border-b">
              <div className="flex items-center">
                {/* Product Image */}
                <img
                  src={product.image} // Ensure product.image contains the correct path
                  alt={product.name}
                  className="w-16 h-16 object-cover mr-4"
                />
                <div>
                  <span>{product.name}</span>
                  <span>
                    ${product.price} x {product.quantity || 1} = ${product.price * (product.quantity || 1)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex justify-between py-2 mt-4">
          <strong>Total:</strong>
          <span>${total}</span>
        </div>
      </div>

      {/* Voucher Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Apply Discount or Gift Coupon</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter Voucher Code"
            className="p-4 border w-full rounded-lg text-lg"
            value={voucherCode}
            onChange={handleVoucherCodeChange}
            disabled={discountApplied} // Disable input if a voucher is applied
          />
          <button
            onClick={applyVoucher}
            className="bg-blue-600 text-white p-4 rounded-lg w-full text-xl hover:bg-blue-700 transition-all"
            disabled={discountApplied} // Disable button if a voucher is applied
          >
            Apply Voucher
          </button>
          {discountApplied && (
            <p className="text-green-500 font-semibold">Voucher applied successfully!</p>
          )}
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </div>

      {/* Checkout Button */}
      <button className="bg-green-600 text-white p-4 rounded-lg w-full text-xl hover:bg-green-700 transition-all">
        Proceed to Payment
      </button>
      <ReviewRating />
    </div>
  );
};

export default CheckoutPage;
