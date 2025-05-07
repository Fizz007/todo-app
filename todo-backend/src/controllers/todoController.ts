import { Request, Response } from 'express';
import Todo from '../models/Todo';

interface AuthRequest extends Request {
  user: {
    _id: string;
  };
}

export const getTodos = async (req: AuthRequest, res: Response) => {
  try {
    const todos = await Todo.find({ owner: req.user._id })

    res.json({ todos });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching todos' });
  }
};

export const createTodo = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, dueDate } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    if (!dueDate) {
      return res.status(400).json({ message: 'Due date is mandatory' });
    }

    const todo = new Todo({
      title,
      description,
      dueDate,
      owner: req.user._id,
    });

    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
};

export const updateTodo = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, status, dueDate } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    if (!dueDate) {
      return res.status(400).json({ message: 'Due date is mandatory' });
    }

    const todo = await Todo.findOne({ _id: id, owner: req.user._id });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    todo.title = title;
    todo.description = description || todo.description;
    todo.status = status || todo.status;
    todo.dueDate = dueDate;

    await todo.save();
    res.json(todo);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
};

export const deleteTodo = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findOneAndDelete({ _id: id, owner: req.user._id });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting todo' });
  }
}; 