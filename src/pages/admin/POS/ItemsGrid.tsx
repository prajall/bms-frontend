import { Card, CardContent } from "@/components/ui/card";
import { Item } from "./Cart";

interface ItemGridProps {
  items: Item[];
  onItemClick: (item: Item) => void;
}

export function ItemGrid({ items, onItemClick }: ItemGridProps) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4  md:grid-cols-4 xl:grid-cols-6 gap-4">
      {items.map((item: any) => (
        <Card
          key={item._id}
          className="cursor-pointer hover:border-primary transition-colors text-sm"
          onClick={() => onItemClick(item)}
        >
          <CardContent className="p-1">
            <div className="relative aspect-square mb-2">
              {item.baseImage ? (
                <img
                  src={item.baseImage.medium}
                  alt={item.name}
                  className="object-cover rounded-md"
                />
              ) : (
                <div className="w-full h-full bg-muted rounded-md flex items-center justify-center">
                  No Image
                </div>
              )}
              {/* <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                92+
              </div> */}
            </div>
            <div className="space-y-1">
              <h3 className="text-xs line-clamp-1">{item.name}</h3>
              <div className="inline-block  text-gray-700 text-xs  py-0.5 rounded">
                NRP {item.sellingPrice.toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
