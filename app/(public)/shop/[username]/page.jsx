"use client";
import ProductCard from "@/components/ProductCard";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MailIcon, MapPinIcon, Filter, X } from "lucide-react";
import Loading from "@/components/Loading";
import Image from "next/image";
import toast from "react-hot-toast";
import axios from "axios";
import ShopSidebar from "@/components/ShopSidebar";
import { useProductFilters } from "@/hooks/useProductFilters";

export default function StoreShop() {
  const { username } = useParams();

  const [products, setProducts] = useState([]);
  const [storeInfo, setStoreInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStoreData = async () => {
    try {
      const { data } = await axios.get(`/api/store/data?username=${username}`);
      setStoreInfo(data);
      setProducts(data.Product);
    } catch (error) {
      toast.error(error?.response?.data?.error || "No store found");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStoreData();
  }, [username]);

  const {
      filteredProducts,
      categories,
      filterState: {
          search,
          setSearch,
          selectedCategories,
          setSelectedCategories,
          priceRange,
          setPriceRange,
          isMobileSidebarOpen,
          setIsMobileSidebarOpen,
      },
      handleClearFilters
  } = useProductFilters(products);

  return !loading ? (
    <div className="min-h-[70vh] mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      {/* Store Info Banner */}
      {storeInfo && (
        <div className="bg-white border border-slate-100 rounded-xl p-6 md:p-10 mt-6 flex flex-col md:flex-row items-center gap-6 shadow-sm overflow-hidden relative">
          {storeInfo.bannerImage && (
              <div className="absolute inset-0 z-0 opacity-10">
                  <Image src={storeInfo.bannerImage} alt="Banner" layout="fill" objectFit="cover" />
              </div>
          )}
          <Image
            src={storeInfo.logo}
            alt={storeInfo.name}
            className="size-32 sm:size-38 object-cover border border-slate-100 rounded-xl shadow-sm z-10 bg-white"
            width={200}
            height={200}
          />
          <div className="text-center md:text-left z-10">
            <h1 className="text-3xl font-semibold text-slate-800">
              {storeInfo.name}
            </h1>
            <p className="text-sm text-slate-600 mt-2 max-w-lg">
              {storeInfo.description}
            </p>
            <div className="text-xs text-slate-500 mt-4 space-y-1"></div>
            <div className="space-y-2 text-sm text-slate-500">
              <div className="flex items-center">
                <MapPinIcon className="w-4 h-4 text-gray-500 mr-2" />
                <span>{storeInfo.address}</span>
              </div>
              <div className="flex items-center">
                <MailIcon className="w-4 h-4 text-gray-500 mr-2" />
                <span>{storeInfo.email}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Section */}
      <div className="mb-40 mt-12">
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl text-slate-500 flex items-center gap-2">
                Store <span className="text-slate-800 font-medium">Products</span>
            </h1>
            
            {/* Mobile Filter Toggle */}
            <button 
                onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                className="lg:hidden flex items-center gap-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors"
            >
                <Filter size={16} />
                Filters
            </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
            {/* Mobile Sidebar Overlay */}
            {isMobileSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsMobileSidebarOpen(false)}
                />
            )}
            
            {/* Sidebar Container */}
            <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white overflow-y-auto transform transition-transform duration-300 lg:static lg:w-auto lg:bg-transparent lg:translate-x-0 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-4 lg:p-0">
                    {isMobileSidebarOpen && (
                        <div className="flex justify-between items-center mb-6 lg:hidden">
                            <span className="font-semibold text-lg">Filters</span>
                            <button onClick={() => setIsMobileSidebarOpen(false)} className="p-2 text-slate-500 hover:text-slate-800">
                                <X size={20} />
                            </button>
                        </div>
                    )}
                    <ShopSidebar 
                        categories={categories}
                        selectedCategories={selectedCategories}
                        setSelectedCategories={setSelectedCategories}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                        search={search}
                        setSearch={setSearch}
                        onClearFilters={handleClearFilters}
                    />
                </div>
            </div>

            {/* Main Product Grid */}
            <div className="flex-1">
                <div className="mb-6 flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                        Showing <span className="font-medium text-slate-800">{filteredProducts.length}</span> products
                    </p>
                </div>
                
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 pb-20">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-slate-50 rounded-xl border border-slate-100">
                        <h3 className="text-lg font-medium text-slate-800 mb-2">No products found</h3>
                        <p className="text-slate-500 mb-6">Try adjusting your filters or search term to find what you're looking for.</p>
                        <button 
                            onClick={handleClearFilters}
                            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
}
