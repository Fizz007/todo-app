import { useState, useEffect, useMemo } from "react";
import { Todo, TodoStatus } from "@/lib/types";
import { TaskItem } from "./task-item";
import { TaskEmptyState } from "./task-empty-state";
import { Pagination } from "@/components/ui/pagination";
import { Loader2 } from "lucide-react";
import { log } from "console";

interface TaskListProps {
  tasks: Todo[] | undefined;
  isLoading: boolean;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, completed: boolean) => void;
  filter: TodoStatus | "all";
  searchTerm: string;
  onCreateNewTask: () => void;
}

export function TaskList({
  tasks,
  isLoading,
  onEdit,
  onDelete,
  onStatusChange,
  filter,
  searchTerm,
  onCreateNewTask
}: TaskListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Reset pagination when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm]);

  const filteredTasks = useMemo(() => {
    if (!tasks) return [];

    return tasks.filter(task => {
      // Filter by status
      const statusMatch = filter === "all" || task.status === filter;

      // Filter by search term
      const searchMatch =
        !searchTerm ||
        task.title.toLowerCase().includes(searchTerm.toLowerCase())

      return statusMatch && searchMatch;
    });
  }, [tasks, filter, searchTerm]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);

  // Get current page items
  const currentTasks = useMemo(() => {
    const indexOfLastItem = (currentPage) * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredTasks.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredTasks, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
      </div>
    );
  }

  if (filteredTasks.length === 0) {
    return <TaskEmptyState onCreateNewTask={onCreateNewTask} />;
  }

  return (
    <div>
      <div className="space-y-4">
        {currentTasks?.map((task) => (
          <TaskItem
            key={task._id}
            task={task}
            onEdit={() => onEdit(task._id)}
            onDelete={() => onDelete(task._id)}
            onStatusChange={(completed) => onStatusChange(task._id, completed)}
          />
        ))}
      </div>

      <Pagination
        page={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

    </div>
  );
}
