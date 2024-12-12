"use client";

import Cart, { CartItem } from "./Cart";
import { ProductGrid } from "./ProductsGrid";
import { Input } from "@/components/ui/input";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product } from "./Cart";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "react-toastify";
import axios from "axios";

// Sample data

export default function POSPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/product/mini-list`
      );
      console.log(response.data);
      if (response.data && response.data.success) {
        setProducts(response.data.data.products);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleProductClick = (product: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item._id === product._id);

      if (existingItem) {
        return prevItems.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item._id !== itemId)
    );
  };

  const handleEmptyCart = () => {
    setCartItems([]);
  };

  const categories = [
    "All",
    "Refregenerator",
    "Air Conditioner",
    "Heater",
    "Aqua Water Purifier",
  ];

  return (
    <div className="min-h-[80vh] flex flex-col">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 ">
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search Products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="w-full justify-start">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.toLowerCase()}
                  value={category.toLowerCase()}
                  className="flex-1"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {products.length > 0 && (
            <ProductGrid
              products={products}
              onProductClick={handleProductClick}
            />
          )}
        </div>

        <div className="border rounded-lg">
          <Cart
            items={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onEmptyCart={handleEmptyCart}
          />
        </div>
      </div>
    </div>
  );
}
