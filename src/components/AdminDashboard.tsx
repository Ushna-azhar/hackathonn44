'use client';
import React, { useState } from 'react';
import { FaChartBar, FaBox, FaTags, FaGift, FaUpload } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { Bar } from 'react-chartjs-2';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Define interfaces for data types
interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

interface Discount {
  id: number;
  product: string;
  discount: number;
}

interface Coupon {
  id: number;
  code: string;
  discountValue: number;
  expiryDate: string;
}

// Bulk Upload Component
const BulkUpload: React.FC = () => {
  const [uploadedProducts, setUploadedProducts] = useState<Product[]>([]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: '.csv',
    onDrop: (acceptedFiles) => handleFileUpload(acceptedFiles),
  });

  const handleFileUpload = (files: File[]) => {
    const file = files[0];
    Papa.parse(file, {
      complete: (result) => {
        const productsData = result.data.map((item: string[]) => ({
          name: item[0],
          price: parseFloat(item[1]),
          stock: parseInt(item[2]),
        }));
        setUploadedProducts(productsData);
      },
      header: false,
    });
  };

  return (
    <div className="space-y-10">
      <h3 className="text-2xl md:text-4xl font-semibold text-gray-800">Bulk Upload Products</h3>
      <div {...getRootProps()} className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
        <input {...getInputProps()} />
        <p>Drag & drop a CSV file here, or click to select files</p>
      </div>
      {uploadedProducts.length > 0 && (
        <div className="mt-8 bg-white p-6 rounded-xl shadow-lg">
          <h4 className="text-2xl font-semibold">Uploaded Products</h4>
          <ul>
            {uploadedProducts.map((product, index) => (
              <li key={index} className="flex justify-between py-4 border-b">
                <span className="text-lg font-semibold">{product.name}</span>
                <span className="text-lg">${product.price}</span>
                <span className="text-lg">{product.stock} in stock</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  const { register, handleSubmit, reset } = useForm();

  const addProduct = (data: Product) => {
    setProducts([...products, { ...data, id: products.length + 1 }]);
    reset();
  };

  const addDiscount = (data: Discount) => {
    setDiscounts([...discounts, { ...data, id: discounts.length + 1 }]);
    reset();
  };

  const createCoupon = (data: Coupon) => {
    setCoupons([...coupons, { ...data, id: coupons.length + 1 }]);
    reset();
  };

  const chartData = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'Sales Data',
        data: [65, 59, 80, 81, 56],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 3,
        hoverBackgroundColor: 'rgba(75, 192, 192, 0.8)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Sales Insights',
        font: {
          size: 30,
          weight: 'bold',
        },
        color: '#333',
      },
      tooltip: {
        backgroundColor: '#333',
        titleColor: '#fff',
        bodyColor: '#fff',
      },
    },
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="bg-white p-6 md:p-10 rounded-lg shadow-lg">
            <h3 className="text-2xl md:text-4xl font-semibold text-gray-800 mb-8">Sales Overview</h3>
            <div className="relative h-64 md:h-96">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
        );
      case 'products':
        return (
          <div className="space-y-10">
            <h3 className="text-2xl md:text-4xl font-semibold text-gray-800">Manage Products</h3>
            <form onSubmit={handleSubmit(addProduct)} className="space-y-6 bg-white p-6 md:p-8 rounded-xl shadow-lg">
              <input {...register('name')} placeholder="Product Name" className="p-4 border w-full rounded-lg text-lg" required />
              <input type="number" {...register('price')} placeholder="Price" className="p-4 border w-full rounded-lg text-lg" required />
              <input type="number" {...register('stock')} placeholder="Stock" className="p-4 border w-full rounded-lg text-lg" required />
              <button type="submit" className="bg-blue-600 text-white p-4 rounded-lg w-full text-xl hover:bg-blue-700 transition-all">
                Add Product
              </button>
            </form>
            <div className="mt-8 bg-white p-6 rounded-xl shadow-lg">
              <h4 className="text-2xl font-semibold">Product List</h4>
              <ul>
                {products.map(product => (
                  <li key={product.id} className="flex justify-between py-4 border-b">
                    <span className="text-lg font-semibold">{product.name}</span>
                    <span className="text-lg">${product.price}</span>
                    <span className="text-lg">{product.stock} in stock</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      case 'discounts':
        return (
          <div className="space-y-10">
            <h3 className="text-2xl md:text-4xl font-semibold text-gray-800">Manage Discounts</h3>
            <form onSubmit={handleSubmit(addDiscount)} className="space-y-6 bg-white p-6 md:p-8 rounded-xl shadow-lg">
              <input {...register('product')} placeholder="Product Name" className="p-4 border w-full rounded-lg text-lg" required />
              <input type="number" {...register('discount')} placeholder="Discount (%)" className="p-4 border w-full rounded-lg text-lg" required />
              <button type="submit" className="bg-green-600 text-white p-4 rounded-lg w-full text-xl hover:bg-green-700 transition-all">
                Add Discount
              </button>
            </form>
            <div className="mt-8 bg-white p-6 rounded-xl shadow-lg">
              <h4 className="text-2xl font-semibold">Discount List</h4>
              <ul>
                {discounts.map(discount => (
                  <li key={discount.id} className="flex justify-between py-4 border-b">
                    <span className="text-lg">{discount.product}</span>
                    <span className="text-lg">{discount.discount}% off</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      case 'coupons':
        return (
          <div className="space-y-10">
            <h3 className="text-2xl md:text-4xl font-semibold text-gray-800">Manage Gift Coupons</h3>
            <form onSubmit={handleSubmit(createCoupon)} className="space-y-6 bg-white p-6 md:p-8 rounded-xl shadow-lg">
              <input {...register('code')} placeholder="Coupon Code" className="p-4 border w-full rounded-lg text-lg" required />
              <input type="number" {...register('discountValue')} placeholder="Discount Value" className="p-4 border w-full rounded-lg text-lg" required />
              <input type="date" {...register('expiryDate')} className="p-4 border w-full rounded-lg text-lg" required />
              <button type="submit" className="bg-purple-600 text-white p-4 rounded-lg w-full text-xl hover:bg-purple-700 transition-all">
                Create Coupon
              </button>
            </form>
            <div className="mt-8 bg-white p-6 rounded-xl shadow-lg">
              <h4 className="text-2xl font-semibold">Coupon List</h4>
              <ul>
                {coupons.map(coupon => (
                  <li key={coupon.id} className="flex justify-between py-4 border-b">
                    <span className="text-lg">{coupon.code}</span>
                    <span className="text-lg">{coupon.discountValue}% off</span>
                    <span className="text-lg">Expires: {coupon.expiryDate}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      case 'bulkUpload':
        return <BulkUpload />; // Add BulkUpload component here
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between">
        <div className="flex space-x-6">
          <button onClick={() => setActiveSection('dashboard')} className="text-xl font-semibold text-gray-800">
            <FaChartBar className="inline-block mr-2" /> Dashboard
          </button>
          <button onClick={() => setActiveSection('products')} className="text-xl font-semibold text-gray-800">
            <FaBox className="inline-block mr-2" /> Products
          </button>
          <button onClick={() => setActiveSection('discounts')} className="text-xl font-semibold text-gray-800">
            <FaTags className="inline-block mr-2" /> Discounts
          </button>
          <button onClick={() => setActiveSection('coupons')} className="text-xl font-semibold text-gray-800">
            <FaGift className="inline-block mr-2" /> Coupons
          </button>
        </div>
        <button onClick={() => setActiveSection('bulkUpload')} className="text-xl font-semibold text-blue-600">
          <FaUpload className="inline-block mr-2" /> Bulk Upload
        </button>
      </div>
      {renderContent()}
    </div>
  );
};

export default AdminDashboard;
