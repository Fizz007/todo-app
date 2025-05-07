import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { TodoStatus } from "@/lib/types";

interface TaskFiltersProps {
  onFilterChange: (status: TodoStatus | "all") => void;
  onSearchChange: (search: string) => void;
  currentFilter: TodoStatus | "all";
}

export function TaskFilters({ 
  onFilterChange, 
  onSearchChange, 
  currentFilter 
}: TaskFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearchChange(value);
  };

  const filters: Array<{ label: string; value: TodoStatus | "all" }> = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "In Progress", value: "in-progress" },
    { label: "Completed", value: "completed" },
  ];

  return (
    <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Button
            key={filter.value}
            variant={currentFilter === filter.value ? "default" : "outline"}
            onClick={() => onFilterChange(filter.value)}
            className={cn(
              currentFilter === filter.value 
                ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800" 
                : "bg-white text-gray-700 dark:bg-gray-700 dark:text-gray-200"
            )}
          >
            {filter.label}
          </Button>
        ))}
      </div>
      
      {/* Search Input */}
      <div className="mt-4">
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
      </div>
    </div>
  );
}
