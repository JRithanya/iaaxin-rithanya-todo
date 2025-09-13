import { useState, useMemo } from "react";

export default function useTodos() {
    const [todos, setTodos] = useState([]);
    const [statusFilter, setStatusFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [search, setSearch] = useState("");

    // ✅ Add Todo
    const addTodo = (todo) => {
        setTodos((prev) => [
            ...prev,
            { id: Date.now(), completed: false, ...todo },
        ]);
    };

    // ✅ Toggle Complete
    const toggleComplete = (id) => {
        setTodos((prev) =>
            prev.map((todo) =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
    };

    // ✅ Delete
    const deleteTodo = (id) => {
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
    };

    // ✅ Category list
    const categories = useMemo(() => {
        const cats = todos.map((t) => t.category);
        return [...new Set(cats)];
    }, [todos]);

    // ✅ Filtering
    const filtered = useMemo(() => {
        return todos
            .filter((todo) => {
                if (statusFilter === "active") return !todo.completed;
                if (statusFilter === "completed") return todo.completed;
                return true;
            })
            .filter((todo) => {
                if (categoryFilter === "all") return true;
                return todo.category === categoryFilter;
            })
            .filter((todo) =>
                todo.title.toLowerCase().includes(search.toLowerCase())
            );
    }, [todos, statusFilter, categoryFilter, search]);

    return {
        todos,
        filtered,
        categories,
        addTodo,
        toggleComplete,
        deleteTodo,
        statusFilter,
        setStatusFilter,
        categoryFilter,
        setCategoryFilter,
        search,
        setSearch,
    };
}
