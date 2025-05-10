import { useState, useEffect, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { Plus } from "lucide-react";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { TaskFilters } from "@/components/dashboard/task-filters";
import { TaskList } from "@/components/dashboard/task-list";
import { TaskModal } from "@/components/dashboard/task-modal";
import { DeleteConfirmationModal } from "@/components/dashboard/delete-confirmation-modal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { Todo, TodoFormData, TodoStatus } from "@/lib/types";
import { handleApiError } from "@/lib/utils";
import { SessionExpiredModal } from "@/components/common/session-expired-modal";
import { Pagination } from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 5;

export default function Dashboard() {
  const { toast } = useToast();
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<TodoStatus | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Todo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch all todos
  const { 
    data: todos,
    isLoading: isLoadingTodos,
    error: todosError
  } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      return await apiRequest("GET", "http://localhost:5000/api/todos");
    ;
    },
    retry: 1,
    gcTime: 0,
    staleTime: 0,
  });

  // Filter and paginate todos on the frontend
  const filteredAndPaginatedTodos = useMemo(() => {
    if (!todos?.todos) return { todos: [], totalPages: 0, totalItems: 0 };

    // Apply search filter
    let filtered = todos.todos;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((todo: Todo) => 
        todo.title.toLowerCase().includes(searchLower) ||
        todo.description?.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (filter !== "all") {
      filtered = filtered.filter((todo: Todo) => todo.status === filter);
    }

    // Calculate pagination
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedTodos = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return {
      todos: paginatedTodos,
      totalPages,
      totalItems: filtered.length
    };
  }, [todos?.todos, filter, searchTerm, currentPage]);

  // Handle query errors
  useEffect(() => {
    if (todosError) {
      const error = todosError as Error;
      if (error.message.includes("401")) {
        setSessionExpired(true);
      } else {
        toast({
          title: "Error fetching tasks",
          description: handleApiError(error),
          variant: "destructive"
        });
      }
    }
  }, [todosError, toast]);

  // Reset to first page when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm]);

  // Create new todo
  const createTodoMutation = useMutation({
    mutationFn: async (todoData: TodoFormData) => {
      const res = await apiRequest("POST", "http://localhost:5000/api/todos", todoData);
      return res ;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast({
        title: "Task created",
        description: "Your task has been created successfully.",
      });
      setIsTaskModalOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error creating task",
        description: handleApiError(error),
        variant: "destructive"
      });
    }
  });

  // Update todo
  const updateTodoMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: TodoFormData }) => {
      const res = await apiRequest("PUT", `http://localhost:5000/api/todos/${id}`, data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully.",
      });
      setIsTaskModalOpen(false);
      setSelectedTask(null);
    },
    onError: (error) => {
      toast({
        title: "Error updating task",
        description: handleApiError(error),
        variant: "destructive"
      });
    }
  });

  // Delete todo
  const deleteTodoMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `http://localhost:5000/api/todos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast({
        title: "Task deleted",
        description: "Your task has been deleted successfully.",
      });
      setIsDeleteModalOpen(false);
      setSelectedTask(null);
    },
    onError: (error) => {
      toast({
        title: "Error deleting task",
        description: handleApiError(error),
        variant: "destructive"
      });
    }
  });

  // Handle filter changes
  const handleFilterChange = (newFilter: TodoStatus | "all") => {
    setFilter(newFilter);
  };

  // Handle search changes
  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
  };

  // Handle creating/editing tasks
  const openTaskModal = (task?: Todo) => {
    if (task) {
      setSelectedTask(task);
    } else {
      setSelectedTask(null);
    }
    setIsTaskModalOpen(true);
  };

  // Handle task submission
  const handleSaveTask = (data: TodoFormData) => {
    if (selectedTask) {
      updateTodoMutation.mutate({ id: selectedTask._id, data });
    } else {
      createTodoMutation.mutate(data);
    }
  };

  // Handle status change
  const handleStatusChange = (taskId: string, completed: boolean) => {
    const taskToUpdate = todos?.todos?.find((t: Todo) => t._id === taskId);
    if (!taskToUpdate) return;
    
    const newStatus: TodoStatus = completed ? "completed" : "pending";
    
    updateTodoMutation.mutate({
      id: taskId,
      data: {
        title: taskToUpdate.title,
        description: taskToUpdate.description || "",
        dueDate: taskToUpdate.dueDate || "",
        status: newStatus
      }
    });
  };

  // Handle delete confirmation
  const openDeleteModal = (task: Todo) => {
    setSelectedTask(task);
    setIsDeleteModalOpen(true);
  };

  // Get tasks stats
  const getTasksStats = () => {
    if (!todos?.todos) return { active: 0, completed: 0 };
    
    const active = todos.todos.filter((t: Todo) => t.status !== "completed").length;
    const completed = todos.todos.filter((t: Todo) => t.status === "completed").length;
    
    return { active, completed };
  };

  const { active, completed } = getTasksStats();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <Helmet>
        <title>Dashboard | ToDo</title>
        <meta name="description" content="Manage your tasks efficiently with ToDo. Create, edit, and track your to-do items in one place." />
      </Helmet>
      
      <DashboardLayout>
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white">Your Tasks</h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                You have {active} active {active === 1 ? "task" : "tasks"} and {completed} completed {completed === 1 ? "task" : "tasks"}.
              </p>
            </div>
            
            <Button
              onClick={() => openTaskModal()}
              className="mt-4 sm:mt-0"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Task
            </Button>
          </div>
          
          <TaskFilters
            onFilterChange={handleFilterChange}
            onSearchChange={handleSearchChange}
            currentFilter={filter}
          />
          
          <TaskList
            tasks={todos?.todos || []}
            isLoading={isLoadingTodos}
            onEdit={(taskId) => {
              const task = todos?.todos?.find((t: Todo) => t._id === taskId);
              if (task) openTaskModal(task);
            }}
            onDelete={(taskId) => {
              const task = todos?.todos?.find((t: Todo) => t._id === taskId);
              if (task) openDeleteModal(task);
            }}
            onStatusChange={handleStatusChange}
            filter={filter}
            searchTerm={searchTerm}
            onCreateNewTask={() => openTaskModal()}
          />
        </div>
        
        <TaskModal
          isOpen={isTaskModalOpen}
          task={selectedTask || undefined}
          onClose={() => {
            setIsTaskModalOpen(false);
            setSelectedTask(null);
          }}
          onSave={handleSaveTask}
          isSubmitting={createTodoMutation.isPending || updateTodoMutation.isPending}
        />
        
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          taskTitle={selectedTask?.title || ""}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedTask(null);
          }}
          onConfirm={() => {
            if (selectedTask) deleteTodoMutation.mutate(selectedTask._id);
          }}
          isDeleting={deleteTodoMutation.isPending}
        />
        
        <SessionExpiredModal
          isOpen={sessionExpired}
          onLogin={logout}
        />
      </DashboardLayout>
    </>
  );
}
