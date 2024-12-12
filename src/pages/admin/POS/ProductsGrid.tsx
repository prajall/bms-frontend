import { Card, CardContent } from "@/components/ui/card";
import { Product } from "./Cart";

interface ProductGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

export function ProductGrid({ products, onProductClick }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <Card
          key={product._id}
          className="cursor-pointer hover:border-primary transition-colors"
          onClick={() => onProductClick(product)}
        >
          <CardContent className="p-3">
            <div className="relative aspect-square mb-2">
              {product.baseImage ? (
                <img
                  src={product.baseImage.medium}
                  alt={product.name}
                  className="object-cover rounded-md"
                />
              ) : (
                <div className="w-full h-full bg-muted rounded-md flex items-center justify-center">
                  No Image
                </div>
              )}
              <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                92+
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="font-medium line-clamp-1">{product.name}</h3>
              <div className="inline-block  text-gray-700 text-sm  py-0.5 rounded">
                NRP {product.sellingPrice.toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
