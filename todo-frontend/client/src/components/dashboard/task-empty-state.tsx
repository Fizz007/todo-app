import { Button } from "@/components/ui/button";
import { PlusCircle, FileText } from "lucide-react";

interface TaskEmptyStateProps {
  onCreateNewTask: () => void;
}

export function TaskEmptyState({ onCreateNewTask }: TaskEmptyStateProps) {
  return (
    <div className="text-center py-12">
      <FileText className="h-12 w-12 mx-auto text-gray-400" />
      <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No tasks found</h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Get started by creating your first task or try adjusting your filters.
      </p>
      <div className="mt-6">
        <Button
          onClick={onCreateNewTask}
          className="inline-flex items-center"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Create New Task
        </Button>
      </div>
    </div>
  );
}
