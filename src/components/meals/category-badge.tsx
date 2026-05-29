import type { MealCategory } from "@/types/database";

const categoryConfig: Record<MealCategory, { label: string; className: string }> = {
  breakfast: { label: "Breakfast", className: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200" },
  lunch: { label: "Lunch", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  dinner: { label: "Dinner", className: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200" },
  snack: { label: "Snack", className: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200" },
  drinks: { label: "Drinks", className: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
};

type CategoryBadgeProps = {
  category: MealCategory;
};

export function CategoryBadge({ category }: CategoryBadgeProps) {
  const config = categoryConfig[category];
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}
