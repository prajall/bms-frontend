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
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/Model";
import InstallationForm from "./InstallationForm";

export default function POSPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [partSearchQuery, setPartSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("products"); // Tabs: products or parts
  const [activeCategory, setActiveCategory] = useState("all");
  const [products, setProducts] = useState<Item[]>([]);
  const [parts, setParts] = useState<Item[]>([]);
  const [discount, setDiscount] = useState<number>(0);
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

  const submitOrder = async () => {
    if (cartItems.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    console.log(cartItems);
    // const products = cartItems.filter((item) => (item.type = "product"));
    // const parts = cartItems.filter((item) => (item.type = "part"));
     const products = cartItems
      .filter((item) => item.type === "product")
      .map((product) => ({
        product: product._id,
        quantity: product.quantity,
        price: product.sellingPrice,
      }));

    const parts = cartItems
      .filter((item) => item.type === "part")
      .map((part) => ({
        part: part._id,
        quantity: part.quantity,
        price: part.sellingPrice,
    }));
    const data = {
      // products: products.map((product) => {
      //   return {
      //     product: product._id,
      //     quantity: product.quantity,
      //     price: product.sellingPrice,
      //   };
      // }),
      // parts: parts.map((part) => {
      //   return {
      //     part: part._id,
      //     quantity: part.quantity,
      //     price: part.sellingPrice,
      //   };
      // }),
      products,
      parts,
      customerType:
        selectedCustomer === "67554286140992b96228ae97"
          ? "walking"
          : "registered",
      customer: selectedCustomer,
      subTotal,
      discount,
      tax: TAX_RATE * 100,
      totalPrice: total,
    };
    console.log("Data: ", data);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/pos`,
        data
      );
      if (response.status === 201 && response.data.success) {
        toast.success("Order Created Successfully");
        handleEmptyCart();
        setShowBill(false);
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const categories = [
    "All",
    "Refrigerator",
    "Air Conditioner",
    "Heater",
    "Aqua Water Purifier",
  ];

  const TAX_RATE = 0.13;
  const subTotal = cartItems.reduce(
    (sum, item) => sum + item.sellingPrice * item.quantity,
    0
  );
  const discountAmount = (discount * subTotal) / 100 || 0;
  const tax = (subTotal - discountAmount) * TAX_RATE;
  const total = subTotal - discountAmount + tax;

  return (
    <div className="min-h-[80vh] flex flex-col">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {/* Tabs for Products and Parts */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="flex justify-start">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="parts">Parts</TabsTrigger>
              {/* <TabsTrigger value="installation">Installation</TabsTrigger> */}
            </TabsList>
          </Tabs>

          {/* Search Bar */}
          <div className="relative">
            {(activeTab === "products" || activeTab === "parts") && (
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            )}
            {activeTab === "products" && (
              <Input
                placeholder="Search Products..."
                value={productSearchQuery}
                onChange={(e) => setProductSearchQuery(e.target.value)}
                className="pl-10"
              />
            )}
            {activeTab === "parts" && (
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
          {activeTab === "installation" && <InstallationForm />}
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
          <div>
            <Cart
              items={cartItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onEmptyCart={handleEmptyCart}
              onPay={() => {
                setShowBill(true);
              }}
            />
            <div className="border-t p-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Sub-Total:</span>
                  <span>NRP {subTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount:</span>
                  <div>
                    <input
                      min={0}
                      value={discount}
                      onChange={(e) => setDiscount(parseInt(e.target.value))}
                      type="number"
                      className="border px-2 w-16 rounded"
                    />{" "}
                    %
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>Tax (13%):</span>
                  <span>NRP {tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>NRP {total.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-2 border-t pt-4 justify-end">
                {/* <Button variant="destructive" className="w-32" onClick={onEmptyCart}>
            Empty Cart
          </Button> */}
                <Button className="w-32" onClick={() => setShowBill(true)}>
                  Pay Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showBill && (
        <Modal
          isOpen={true}
          onClose={() => {
            setShowBill(false);
          }}
          title="Bill Detail"
          size="4xl"
        >
          <Bill
            subTotal={subTotal}
            discount={discount}
            discountAmount={discountAmount}
            TAX_RATE={TAX_RATE}
            customerId={selectedCustomer}
            items={cartItems}
            tax={tax}
            total={total}
          />
          <div className="mt-4 flex justify-end">
            <Button onClick={submitOrder}>Place Order</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
