import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { 
  Laptop, 
  Shirt, 
  UtensilsCrossed, 
  Home, 
  Sparkles, 
  Dumbbell, 
  Book, 
  Gamepad2, 
  LayoutGrid 
} from "lucide-react";

const categories = [
  { id: "all", label: "All", icon: LayoutGrid },
  { id: "electronics", label: "Electronics", icon: Laptop },
  { id: "clothing", label: "Clothing", icon: Shirt },
  { id: "food", label: "Food", icon: UtensilsCrossed },
  { id: "home", label: "Home", icon: Home },
  { id: "beauty", label: "Beauty", icon: Sparkles },
  { id: "sports", label: "Sports", icon: Dumbbell },
  { id: "books", label: "Books", icon: Book },
  { id: "toys", label: "Toys", icon: Gamepad2 },
];

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryFilter = ({ selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-2 py-2 px-1">
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id;
          
          return (
            <Button
              key={category.id}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(category.id)}
              className={`flex items-center gap-2 rounded-full px-4 ${
                isSelected ? "" : "hover:bg-accent"
              }`}
            >
              <Icon className="h-4 w-4" />
              {category.label}
            </Button>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
