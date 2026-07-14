import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export function useProductFilters(initialProducts) {
    const searchParams = useSearchParams()
    const urlSearch = searchParams.get('search') || ""
    
    const [search, setSearch] = useState(urlSearch)
    const [selectedCategories, setSelectedCategories] = useState([])
    const [priceRange, setPriceRange] = useState({ min: "", max: "" })
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

    // Sync URL search params with state if they change externally (e.g. from a header search bar)
    useEffect(() => {
        setSearch(urlSearch);
    }, [urlSearch]);
    
    const categories = useMemo(() => {
        const cats = new Set()
        initialProducts.forEach(p => {
            if (p.category) cats.add(p.category.toLowerCase())
        })
        return Array.from(cats)
    }, [initialProducts])
    
    const filteredProducts = useMemo(() => {
        return initialProducts.filter(product => {
            // Search filter
            if (search) {
                const searchLower = search.toLowerCase();
                const nameMatch = product.name?.toLowerCase().includes(searchLower);
                const descMatch = product.description?.toLowerCase().includes(searchLower);
                if (!nameMatch && !descMatch) {
                    return false;
                }
            }
            
            // Category filter
            if (selectedCategories.length > 0) {
                if (!product.category || !selectedCategories.includes(product.category.toLowerCase())) {
                    return false
                }
            }
            
            // Price filter
            const price = product.price
            if (priceRange.min && price < Number(priceRange.min)) return false
            if (priceRange.max && price > Number(priceRange.max)) return false
            
            return true
        })
    }, [initialProducts, search, selectedCategories, priceRange])
    
    const handleClearFilters = () => {
        setSearch("")
        setSelectedCategories([])
        setPriceRange({ min: "", max: "" })
    }
    
    return {
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
    }
}
