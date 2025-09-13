import React, { useState } from "react";
import ThemeToggle from "./components/ThemeToggle";
import useTodos from "./hooks/useTodos";
import { FaTrash } from "react-icons/fa";
import "./index.css";

export default function App() {
  const {
    filtered: todos,
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
  } = useTodos();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [todoText, setTodoText] = useState("");
  const [todoCategory, setTodoCategory] = useState("");
  const [todoDate, setTodoDate] = useState("");
  const [errors, setErrors] = useState({});

  // ✅ Default categories
  const defaultCategories = ["personal", "work", "shopping", "others"];

  // ✅ Merge defaults with dynamic categories (avoid duplicates)
  const allCategories = [...new Set([...defaultCategories, ...categories])];

  // ✅ Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!todoText.trim()) {
      newErrors.text = "Todo text is required.";
    }

    if (!todoCategory || todoCategory.trim() === "") {
      newErrors.category = "Please select a category.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddTodo = () => {
    if (!validateForm()) return;

    addTodo({
      title: todoText,
      category: todoCategory,
      dueDate: todoDate || null,
    });

    // Reset fields
    setTodoText("");
    setTodoCategory("");
    setTodoDate("");
    setErrors({});
    setIsModalOpen(false);
  };

  return (
    <div className="app">
      {/* Header */}
      <div className="header">
        <h1>Todo App ✏️</h1>
        <div className="header-actions">
          <ThemeToggle />
          <button className="btn primary" onClick={() => setIsModalOpen(true)}>
            + Add Todo
          </button>
        </div>
      </div>

      {/* 🔎 Search & Category Filter */}
      <div className="search-categories">
        <input
          type="text"
          className="search"
          placeholder="Search todos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          {allCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Status Filter */}
      <div className="status-filter">
        <button
          className={statusFilter === "all" ? "active" : ""}
          onClick={() => setStatusFilter("all")}
        >
          All
        </button>
        <button
          className={statusFilter === "active" ? "active" : ""}
          onClick={() => setStatusFilter("active")}
        >
          Active
        </button>
        <button
          className={statusFilter === "completed" ? "active" : ""}
          onClick={() => setStatusFilter("completed")}
        >
          Completed
        </button>
      </div>

      {/* Todo List */}
      <div className="list-wrap">
        {todos.length === 0 ? (
          <div className="empty">No todos found</div>
        ) : (
          <ul className="todo-list">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className={`todo-item ${todo.completed ? "completed" : ""}`}
              >
                <div className="todo-left">
                  <input
                    type="checkbox"
                    className="todo-checkbox"
                    checked={todo.completed}
                    onChange={() => toggleComplete(todo.id)}
                  />
                  <div className="todo-content">
                    <div className="todo-title">{todo.title}</div>
                    <div className="todo-meta">
                      <span className="todo-category">
                        {todo.category.charAt(0).toUpperCase() +
                          todo.category.slice(1)}
                      </span>
                      {todo.dueDate && (
                        <span className="todo-date">
                          📅{" "}
                          {new Date(todo.dueDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* ✅ Delete Button */}
                <button
                  className="delete-btn"
                  onClick={() => deleteTodo(todo.id)}
                  aria-label="Delete Todo"
                >
                  <FaTrash />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h2>Add Todo</h2>
              <button
                className="close-icon"
                onClick={() => setIsModalOpen(false)}
              >
                ✖
              </button>
            </div>

            {/* Todo Text */}
            <label>Todo Text</label>
            <input
              type="text"
              placeholder="What needs to be done?"
              value={todoText}
              onChange={(e) => {
                setTodoText(e.target.value);
                if (errors.text) {
                  setErrors((prev) => ({ ...prev, text: "" }));
                }
              }}
              className={errors.text ? "input-error" : ""}
            />
            {errors.text && <p className="error">{errors.text}</p>}

            {/* Category + Due Date */}
            <div className="modal-row">
              <div className="field">
                <label>Category</label>
                <select
                  value={todoCategory}
                  onChange={(e) => {
                    setTodoCategory(e.target.value);
                    if (errors.category) {
                      setErrors((prev) => ({ ...prev, category: "" }));
                    }
                  }}
                  className={errors.category ? "input-error" : ""}
                >
                  <option value="">-- Select Category --</option>
                  {allCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="error">{errors.category}</p>}
              </div>

              <div className="field">
                <label>Due Date (optional)</label>
                <input
                  type="date"
                  value={todoDate}
                  onChange={(e) => setTodoDate(e.target.value)}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button className="add-todo-btn" onClick={handleAddTodo}>
                Add Todo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="footer">
        <span>{todos.filter((t) => !t.completed).length} items left</span>
        <span>
          <a
            href="https://github.com/JRithanya/iaaxin-rithanya-todo"
            target="_blank"
            rel="noopener noreferrer"
          >
            Rithanya | Source Code
          </a>
        </span>
      </div>
    </div>
  );
}
