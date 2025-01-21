'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

const Page = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('https://template-03-api.vercel.app/api/products');
      const data = await response.json();

      const fetchedProducts = data.data;
      const customProducts = [
        {
          id: 'manual1',
          productName: 'Handmade Wooden Bracelet',
          price: 15.99,
          category: 'Accessories',
          image: '/path/to/image.jpg',
          description: 'A beautifully crafted wooden bracelet.',
          colors: ['brown', 'beige'],
        },
        {
          id: 'manual2',
          productName: 'Ceramic Mug',
          price: 9.99,
          category: 'Kitchenware',
          image: '/path/to/image.jpg',
          description: 'A unique ceramic mug perfect for your coffee.',
          colors: ['white', 'blue'],
        },
      ];

      const allProducts = [...fetchedProducts, ...customProducts];
      setProducts(allProducts);
      setFilteredProducts(allProducts);

      const uniqueCategories = [...new Set(allProducts.map((product) => product.category))];
      setCategories(uniqueCategories);

      const uniqueColors = [...new Set(allProducts.flatMap((product) => product.colors))];
      setColors(uniqueColors);
    };

    fetchProducts();
  }, []);

  const filteredData = useMemo(() => {
    return filteredProducts.filter((product) => {
      const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
      const matchesColor = selectedColor ? product.colors.includes(selectedColor) : true;
      const matchesPrice = product.price >= minPrice && product.price <= maxPrice;

      return matchesCategory && matchesColor && matchesPrice;
    });
  }, [filteredProducts, selectedCategory, selectedColor, minPrice, maxPrice]);

  const paginatedData = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredData.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredData, currentPage]);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">Product Listings</h1>

      <div className="mb-6">
        <div>
          <label htmlFor="category" className="block font-semibold mb-2">Category</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4">
          <label htmlFor="color" className="block font-semibold mb-2">Color</label>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-8 h-8 rounded-full border-2 ${selectedColor === color ? 'border-indigo-500' : 'border-gray-300'}`}
                style={{ backgroundColor: color }}
              ></button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <label className="block font-semibold mb-2">Price Range</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              placeholder="Min Price"
              className="w-1/2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              placeholder="Max Price"
              className="w-1/2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedData.map((product) => (
          <div
            key={`${product.category}-${product.productName}-${product.price}-${Math.random()}`}
            className="border rounded-md p-4"
          >
            <img src={product.image} alt={product.productName} className="w-full h-48 object-cover mb-4" />
            <h3 className="text-lg font-semibold">{product.productName}</h3>
            <p className="text-sm text-gray-500">{product.category}</p>
            <p className="text-xl font-bold">${product.price}</p>
            <p className="text-sm text-gray-600">{product.description}</p>
            <Link href={`/products/price/${product.price}-${product.productName}`} className="text-blue-500 mt-2 block">
              View Details
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-lg">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Page;
