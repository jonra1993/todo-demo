import type { User, AuthUser } from '@/types/user';
import type { Todo, CreateTodoInput, UpdateTodoInput } from '@/types/todo';

// In-memory storage
let users: User[] = [];
let todos: Todo[] = [];
let currentUserId: string | null = null;

// Initialize with demo users
const initializeDemoUsers = () => {
  if (users.length === 0) {
    const demoUsers: User[] = [
      {
        id: '1',
        email: 'demo@example.com',
        password: 'demo123',
        name: 'Usuario Demo',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        email: 'test@example.com',
        password: 'test123',
        name: 'Usuario Test',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    users = demoUsers;
  }
};

// Load from localStorage if available
const loadFromLocalStorage = () => {
  if (typeof window === 'undefined') return;
  
  try {
    const storedUsers = localStorage.getItem('memory_store_users');
    const storedTodos = localStorage.getItem('memory_store_todos');
    const storedUserId = localStorage.getItem('memory_store_current_user_id');
    
    if (storedUsers) {
      const parsed = JSON.parse(storedUsers);
      users = parsed.map((u: any) => ({
        ...u,
        createdAt: new Date(u.createdAt),
        updatedAt: new Date(u.updatedAt),
      }));
    }
    
    if (storedTodos) {
      const parsed = JSON.parse(storedTodos);
      todos = parsed.map((t: any) => ({
        ...t,
        createdAt: new Date(t.createdAt),
        updatedAt: new Date(t.updatedAt),
        dueDate: t.dueDate ? new Date(t.dueDate) : undefined,
      }));
    }
    
    if (storedUserId) {
      currentUserId = storedUserId;
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    initializeDemoUsers();
  }
  
  if (users.length === 0) {
    initializeDemoUsers();
  }
};

// Save to localStorage
const saveToLocalStorage = () => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('memory_store_users', JSON.stringify(users));
    localStorage.setItem('memory_store_todos', JSON.stringify(todos));
    if (currentUserId) {
      localStorage.setItem('memory_store_current_user_id', currentUserId);
    } else {
      localStorage.removeItem('memory_store_current_user_id');
    }
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Initialize on load
if (typeof window !== 'undefined') {
  loadFromLocalStorage();
} else {
  initializeDemoUsers();
}

// User operations
export const userStore = {
  findByEmail: (email: string): User | undefined => {
    return users.find((u) => u.email === email);
  },
  
  findById: (id: string): User | undefined => {
    return users.find((u) => u.id === id);
  },
  
  create: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    users.push(newUser);
    saveToLocalStorage();
    return newUser;
  },
  
  getAll: (): User[] => {
    return users;
  },
  
  getCurrentUser: (): User | null => {
    if (!currentUserId) return null;
    return userStore.findById(currentUserId) || null;
  },
  
  setCurrentUser: (userId: string | null): void => {
    currentUserId = userId;
    saveToLocalStorage();
  },
  
  getCurrentUserId: (): string | null => {
    return currentUserId;
  },
};

// Todo operations
export const todoStore = {
  getAll: (userId?: string): Todo[] => {
    if (userId) {
      return todos.filter((t) => t.userId === userId);
    }
    return todos;
  },
  
  findById: (id: string, userId?: string): Todo | undefined => {
    const todo = todos.find((t) => t.id === id);
    if (userId && todo && todo.userId !== userId) {
      return undefined; // Multi-tenant isolation
    }
    return todo;
  },
  
  create: (userId: string, todoData: CreateTodoInput): Todo => {
    const newTodo: Todo = {
      ...todoData,
      id: Date.now().toString(),
      completed: false,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    todos.push(newTodo);
    saveToLocalStorage();
    return newTodo;
  },
  
  update: (id: string, userId: string, updates: UpdateTodoInput): Todo | null => {
    const todo = todoStore.findById(id, userId);
    if (!todo) return null;
    
    const updatedTodo: Todo = {
      ...todo,
      ...updates,
      updatedAt: new Date(),
    };
    
    const index = todos.findIndex((t) => t.id === id);
    if (index !== -1) {
      todos[index] = updatedTodo;
      saveToLocalStorage();
      return updatedTodo;
    }
    
    return null;
  },
  
  delete: (id: string, userId: string): boolean => {
    const todo = todoStore.findById(id, userId);
    if (!todo) return false;
    
    const index = todos.findIndex((t) => t.id === id);
    if (index !== -1) {
      todos.splice(index, 1);
      saveToLocalStorage();
      return true;
    }
    
    return false;
  },
  
  // Helper methods for filtering
  getByStatus: (userId: string, completed: boolean): Todo[] => {
    return todos.filter((t) => t.userId === userId && t.completed === completed);
  },
  
  getByPriority: (userId: string, priority: TodoPriority): Todo[] => {
    return todos.filter((t) => t.userId === userId && t.priority === priority);
  },
  
  getOverdue: (userId: string): Todo[] => {
    const now = new Date();
    return todos.filter(
      (t) =>
        t.userId === userId &&
        !t.completed &&
        t.dueDate &&
        new Date(t.dueDate) < now
    );
  },
};

// Clear all data (for testing)
export const clearStore = (): void => {
  users = [];
  todos = [];
  currentUserId = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('memory_store_users');
    localStorage.removeItem('memory_store_todos');
    localStorage.removeItem('memory_store_current_user_id');
  }
  initializeDemoUsers();
};
