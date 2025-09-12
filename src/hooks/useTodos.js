import { useState, useEffect, useMemo, useCallback } from "react";

const STORAGE_KEY = "enhanced-todo.v1";

export default function useTodos() {
    // Todos state with localStorage initial load
    const [todos, setTodos] = useState(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (err) {
            console.error("Failed to load todos:", err);
            return [];
        }
    });

    const [statusFilter, setStatusFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [search, setSearch] = useState("");

    // Persist todos to localStorage
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
        } catch (err) {
            console.error("Failed to save todos:", err);
        }
    }, [todos]);

    const addTodo = useCallback(({ title, category, dueDate }) => {
        if (!title || !title.trim()) return;
        const newTodo = {
            id: Date.now().toString(),
            title: title.trim(),
            category: category || "work",
            dueDate: dueDate || null,
            completed: false,
            createdAt: new Date().toISOString(),
        };
        setTodos((prev) => [newTodo, ...prev]);
    }, []);

    const toggleTodo = useCallback((id) => {
        setTodos((prev) =>
            prev.map((todo) =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
    }, []);

    const deleteTodo = useCallback((id) => {
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
    }, []);

    const editTodo = useCallback((id, updates) => {
        setTodos((prev) =>
            prev.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo))
        );
    }, []);

    const categories = useMemo(() => {
        const defaultList = ["work", "personal", "shopping"];
        const found = Array.from(
            new Set(todos.map((t) => t.category).filter(Boolean))
        );
        return Array.from(new Set([...defaultList, ...found]));
    }, [todos]);

    const filtered = useMemo(() => {
        return todos.filter((todo) => {
            if (statusFilter === "active" && todo.completed) return false;
            if (statusFilter === "completed" && !todo.completed) return false;
            if (categoryFilter !== "all" && todo.category !== categoryFilter) return false;
            if (search && !todo.title.toLowerCase().includes(search.toLowerCase())) return false;
            return true;
        });
    }, [todos, statusFilter, categoryFilter, search]);

    return {
        todos,
        filtered,
        categories,
        addTodo,
        toggleTodo,
        deleteTodo,
        editTodo,
        statusFilter,
        setStatusFilter,
        categoryFilter,
        setCategoryFilter,
        search,
        setSearch,
        setTodos,
    };
}
