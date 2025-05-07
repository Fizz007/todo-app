import { Todo } from "@/lib/types";
import { formatDate, getStatusColor, getStatusDisplay } from "@/lib/utils";
import { Calendar, Edit, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  task: Todo;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (completed: boolean) => void;
}

export function TaskItem({ task, onEdit, onDelete, onStatusChange }: TaskItemProps) {
  const isCompleted = task.status === "completed";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <Checkbox
              checked={isCompleted}
              onCheckedChange={(checked) => onStatusChange(checked as boolean)}
              className="mt-1"
            />
            
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                "text-sm font-medium",
                isCompleted ? "text-gray-500 line-through" : "text-gray-900 dark:text-white"
              )}>
                {task.title}
              </h3>
              
              {task.description && (
                <p className={cn(
                  "mt-1 text-sm",
                  isCompleted ? "text-gray-400" : "text-gray-500 dark:text-gray-400"
                )}>
                  {task.description}
                </p>
              )}
              
              <div className="mt-2 flex items-center space-x-4">
                {task.dueDate && (
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Due: {formatDate(task.dueDate)}</span>
                  </div>
                )}
                
                <span className={cn(
                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                  getStatusColor(task.status)
                )}>
                  {getStatusDisplay(task.status)}
                </span>
              </div>
            </div>
          </div>
          
          {/* Task Actions */}
          <div className="flex space-x-2">
            <button 
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
              onClick={onEdit}
              aria-label="Edit task"
            >
              <Edit className="h-5 w-5" />
            </button>
            <button 
              className="p-1 text-gray-500 hover:text-red-700 dark:text-gray-400 dark:hover:text-red-400 focus:outline-none"
              onClick={onDelete}
              aria-label="Delete task"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
