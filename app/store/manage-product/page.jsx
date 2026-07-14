"use client";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Loading from "@/components/Loading";
import { assets } from "@/assets/assets";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";

export default function StoreManageProducts() {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "R";

  const { getToken } = useAuth();
  const { user } = useUser();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/store/product", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(
        data.products.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        ),
      );
      setLoading(false);
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
      setLoading(false);
    }
  };

  const toggleStock = async (productId) => {
    try {
      // Logic to toggle the stock of a product
      const token = await getToken();

      const { data } = await axios.post(
        `/api/store/stock-toggle`,
        { productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId
            ? { ...product, inStock: !product.inStock }
            : product,
        ),
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    }
  };
  useEffect(() => {
    if (user) {
      fetchProducts();
    }
  }, [user]);

  if (loading) return <Loading />;

  return (
    <>
      <h1 className="text-2xl text-slate-500 mb-5">
        Manage <span className="text-slate-800 font-medium">Products</span>
      </h1>
      <table className="w-full max-w-4xl text-left  ring ring-slate-200  rounded overflow-hidden text-sm">
        <thead className="bg-slate-50 text-gray-700 uppercase tracking-wider">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3 hidden md:table-cell">Description</th>
            <th className="px-4 py-3 hidden md:table-cell">MRP</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="text-slate-700">
          {products.map((product) => (
            <tr
              key={product.id}
              className="border-t border-gray-200 hover:bg-gray-50"
            >
              <td className="px-4 py-3">
                <div className="flex gap-2 items-center">
                  <Image
                    width={40}
                    height={40}
                    className="p-1 shadow rounded cursor-pointer"
                    src={product.images[0] || assets.upload_area}
                    alt=""
                  />
                  {product.name}
                </div>
              </td>
              <td className="px-4 py-3 max-w-md text-slate-600 hidden md:table-cell truncate">
                {product.description}
              </td>
              <td className="px-4 py-3 hidden md:table-cell">
                {currency} {product.mrp.toLocaleString()}
              </td>
              <td className="px-4 py-3">
                {currency} {product.price.toLocaleString()}
              </td>
              <td className="px-4 py-3 text-center">
                <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    onChange={() =>
                      toast.promise(toggleStock(product.id), {
                        loading: "Updating stock…",
                      })
                    }
                    checked={product.inStock}
                  />
                  <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200"></div>
                  <span className="dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
