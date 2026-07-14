import { Search, X, Filter } from "lucide-react";

export default function ShopSidebar({
  categories = [],
  selectedCategories = [],
  setSelectedCategories,
  priceRange,
  setPriceRange,
  search,
  setSearch,
  onClearFilters,
}) {
  const handleCategoryToggle = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  return (
    <div className="w-full lg:w-64 flex-shrink-0">
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 sticky top-24">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Filter size={18} className="text-slate-500" />
            Filters
          </h2>
          <button
            onClick={onClearFilters}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center transition-colors"
          >
            Clear All
          </button>
        </div>

        {/* Search */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-slate-700 mb-3">Search</h3>
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-medium text-slate-700 mb-3">Categories</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {categories.map((category) => (
                <label
                  key={category}
                  className="flex items-center gap-3 group cursor-pointer"
                >
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                      className="peer appearance-none w-4 h-4 border border-slate-300 rounded bg-white checked:bg-blue-600 checked:border-blue-600 transition-colors cursor-pointer"
                    />
                    <svg
                      className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors capitalize">
                    {category}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Price Range */}
        <div>
          <h3 className="text-sm font-medium text-slate-700 mb-3">Price Range</h3>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                R
              </span>
              <input
                type="number"
                min="0"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) =>
                  setPriceRange({ ...priceRange, min: e.target.value })
                }
                className="w-full pl-6 pr-2 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <span className="text-slate-400">-</span>
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                R
              </span>
              <input
                type="number"
                min="0"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) =>
                  setPriceRange({ ...priceRange, max: e.target.value })
                }
                className="w-full pl-6 pr-2 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
