"use client";
import { assets } from "@/assets/assets";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function StoreAddProduct() {
  const categories = [
    "Electronics",
    "Clothing",
    "Home & Kitchen",
    "Beauty & Health",
    "Toys & Games",
    "Sports & Outdoors",
    "Books & Media",
    "Food & Drink",
    "Hobbies & Crafts",
    "Others",
  ];

  const [images, setImages] = useState({ 1: null, 2: null, 3: null, 4: null });
  const [productInfo, setProductInfo] = useState({
    name: "",
    description: "",
    mrp: 0,
    price: 0,
    category: "",
  });
  const [loading, setLoading] = useState(false);
  const [aiUsed, setAiUsed] = useState(false);

  const { getToken } = useAuth();

  const onChangeHandler = (e) => {
    setProductInfo({ ...productInfo, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (key, file) => {
    setImages((prev) => ({ ...prev, [key]: file }));
    if (key === "1" && file && !aiUsed) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = async () => {
        const base64Image = reader.result.split(",")[1];
        const mimeType = file.type;
        const token = await getToken();

        try {
          await toast.promise(
            axios.post(
              "/api/store/ai",
              { base64Image, mimeType },
              { headers: { Authorization: `Bearer ${token}` } },
            ),
            {
              loading: "Analyzing image with ai...",
              success: (res) => {
                const data = res.data;
                if (data.name && data.description) {
                  setProductInfo((prev) => ({
                    ...prev,
                    name: data.name,
                    description: data.description,
                  }));
                  setAiUsed(true);
                  return "Product data added.";
                } else {
                  return "AI could not generate product data.";
                }
              },
              error: "Failed to analyze image.",
            },
          );
        } catch (error) {
          toast.error("Failed to generate product data from AI.");
        }
      };
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      // if no images are uploaded then return
      if (!images[1] && !images[2] && !images[3] && !images[4]) {
        toast.error("Please upload at least 1 image");
        return;
      }

      if (
        !productInfo.name ||
        !productInfo.description ||
        !productInfo.price ||
        !productInfo.mrp ||
        !productInfo.category
      ) {
        toast.error("Please fill all the fields");
        return;
      }

      setLoading(true);
      const token = await getToken();
      const formData = new FormData();
      formData.append("name", productInfo.name);
      formData.append("description", productInfo.description);
      formData.append("mrp", productInfo.mrp);
      formData.append("price", productInfo.price);
      formData.append("category", productInfo.category);

      //adding images to form data
      Object.keys(images).forEach((key) => {
        images[key] && formData.append("images", images[key]);
      });

      const { data } = await axios.post("/api/store/product", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(data.message);
      setProductInfo({
        name: "",
        description: "",
        mrp: 0,
        price: 0,
        category: "",
      });
      setImages({ 1: null, 2: null, 3: null, 4: null });
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={(e) =>
        toast.promise(onSubmitHandler(e), { loading: "Adding Product..." })
      }
      className="text-slate-500 mb-28"
    >
      <h1 className="text-2xl">
        Add New <span className="text-slate-800 font-medium">Products</span>
      </h1>
      <p className="mt-7">Product Images</p>

      <div htmlFor="" className="flex gap-3 mt-4">
        {Object.keys(images).map((key) => (
          <label key={key} htmlFor={`images${key}`}>
            <Image
              width={300}
              height={300}
              className="h-15 w-auto border border-slate-200 rounded cursor-pointer"
              src={
                images[key]
                  ? URL.createObjectURL(images[key])
                  : assets.upload_area
              }
              alt=""
            />
            <input
              type="file"
              accept="image/*"
              id={`images${key}`}
              onChange={(e) => handleImageUpload(key, e.target.files[0])}
              hidden
            />
          </label>
        ))}
      </div>

      <label htmlFor="" className="flex flex-col gap-2 my-6 ">
        Name
        <input
          type="text"
          name="name"
          onChange={onChangeHandler}
          value={productInfo.name}
          placeholder="Enter product name"
          className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded"
          required
        />
      </label>

      <label htmlFor="" className="flex flex-col gap-2 my-6 ">
        Description
        <textarea
          name="description"
          onChange={onChangeHandler}
          value={productInfo.description}
          placeholder="Enter product description"
          rows={5}
          className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded resize-none"
          required
        />
      </label>

      <div className="flex gap-5">
        <label htmlFor="" className="flex flex-col gap-2 ">
          Actual Price ($)
          <input
            type="number"
            name="mrp"
            onChange={onChangeHandler}
            value={productInfo.mrp}
            placeholder="0"
            rows={5}
            className="w-full max-w-45 p-2 px-4 outline-none border border-slate-200 rounded resize-none"
            required
          />
        </label>
        <label htmlFor="" className="flex flex-col gap-2 ">
          Offer Price ($)
          <input
            type="number"
            name="price"
            onChange={onChangeHandler}
            value={productInfo.price}
            placeholder="0"
            rows={5}
            className="w-full max-w-45 p-2 px-4 outline-none border border-slate-200 rounded resize-none"
            required
          />
        </label>
      </div>

      <select
        onChange={(e) =>
          setProductInfo({ ...productInfo, category: e.target.value })
        }
        value={productInfo.category}
        className="w-full max-w-sm p-2 px-4 my-6 outline-none border border-slate-200 rounded"
        required
      >
        <option value="">Select a category</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <br />

      <button
        disabled={loading}
        className="bg-slate-800 text-white px-6 mt-7 py-2 hover:bg-slate-900 rounded transition"
      >
        Add Product
      </button>
    </form>
  );
}
