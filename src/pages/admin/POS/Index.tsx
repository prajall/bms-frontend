"use client";

import CustomerSelect from "@/components/formElements/CustomerSelect";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Customer } from "../customers/Index";
import Cart, { CartItem, Item } from "./Cart";
import { ItemGrid } from "./ItemsGrid";
import Bill from "./Bill";

export default function POSPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [partSearchQuery, setPartSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("products"); // Tabs: products or parts
  const [activeCategory, setActiveCategory] = useState("all");
  const [products, setProducts] = useState<Item[]>([]);
  const [parts, setParts] = useState<Item[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState(
    "67554286140992b96228ae97"
  );
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showBill, setShowBill] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/product/mini-list`
      );
      if (response.data && response.data.success) {
        setProducts(response.data.data.products);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    }
  };

  const fetchParts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/part/mini-list`
      );
      if (response.data && response.data.success) {
        console.log(response.data.data.parts);
        setParts(response.data.data.parts);
      }
    } catch (error) {
      console.error("Error fetching parts:", error);
      toast.error("Failed to fetch parts");
    }
  };

  const fetchCustomers = async (query: string = "") => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/customer`,
        {
          params: {
            search: query,
          },
        }
      );
      if (response.status === 200 && response.data.success) {
        const formattedData = response.data.data.customers
          .filter(
            (customer: any) => customer._id !== "67554286140992b96228ae97"
          )
          .map((customer: any) => ({
            id: customer._id,
            name: customer.name,
            gender: customer.gender,
            image: customer.image || "",
            address: `${customer.address.houseNo}, ${customer.address.addressLine}, ${customer.address.city}, ${customer.address.province}, ${customer.address.country}`,
            phoneNo: customer.mobileNo1,
          }));
        setCustomers(formattedData);
      }
    } catch (error) {
      console.error("Error fetching customer data:", error);
      toast.error("Failed to fetch customers");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchParts();
    fetchCustomers();
  }, []);

  const handleProductClick = (product: Item) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item._id === product._id && item.type === "product"
      );

      if (existingItem) {
        return prevItems.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevItems, { ...product, quantity: 1, type: "product" }];
    });
  };

  const handlePartClick = (part: Item) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item._id === part._id && item.type === "part"
      );

      if (existingItem) {
        return prevItems.map((item) =>
          item._id === part._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevItems, { ...part, quantity: 1, type: "part" }];
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
    "Refrigerator",
    "Air Conditioner",
    "Heater",
    "Aqua Water Purifier",
  ];

  return (
    <div className="min-h-[80vh] flex flex-col">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {/* Tabs for Products and Parts */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="flex justify-start">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="parts">Parts</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            {activeTab === "products" ? (
              <Input
                placeholder="Search Products..."
                value={productSearchQuery}
                onChange={(e) => setProductSearchQuery(e.target.value)}
                className="pl-10"
              />
            ) : (
              <Input
                placeholder="Search Parts..."
                value={partSearchQuery}
                onChange={(e) => setPartSearchQuery(e.target.value)}
                className="pl-10"
              />
            )}
          </div>

          {/* Grid for Products or Parts */}
          {activeTab === "products" && products.length > 0 && (
            <>
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
              <ItemGrid items={products} onItemClick={handleProductClick} />
            </>
          )}
          {activeTab === "parts" && parts.length > 0 && (
            <ItemGrid items={parts} onItemClick={handlePartClick} />
          )}
        </div>

        <div className="border-l pl-4">
          <div className="flex items-center gap-2 pb-2">
            <CustomerSelect
              selectedCustomer={selectedCustomer}
              loadingText="loading"
              showAddCustomerButton={true}
              onChange={setSelectedCustomer}
            ></CustomerSelect>
          </div>
          <Cart
            items={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onEmptyCart={handleEmptyCart}
            onPay={() => {
              console.log(cartItems);
              setShowBill(true);
            }}
          />
        </div>
      </div>
      {/* {showBill && (
        <Bill
          isOpen={true}
          onClose={() => {
            setShowBill(false);
          }}
          VATAmount={0.13}
          customerId={selectedCustomer}
          discount={0}
          items={cartItems}
        />
      )} */}
    </div>
  );
}
