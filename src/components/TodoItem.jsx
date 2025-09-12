import React from "react";
import { format, parseISO, isValid } from "date-fns";

export default function TodoItem({ todo, onToggle, onDelete }) {
  let dueLabel = null;

  if (todo.dueDate) {
    const parsedDate = parseISO(todo.dueDate); // safer parsing
    if (isValid(parsedDate)) {
      dueLabel = format(parsedDate, "MMM d, yyyy");
    }
  }

  const isPast = todo.dueDate
    ? new Date(todo.dueDate) < new Date() && !todo.completed
    : false;

  return (
    <li className={`todo-item ${todo.completed ? "completed" : ""}`}>
      <div className="left">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
        <div className="meta-wrap">
          <div className="title">{todo.title}</div>
          <div className="meta">
            <span className="category">{todo.category}</span>
            {dueLabel && (
              <span className={`due ${isPast ? "past" : ""}`}>{dueLabel}</span>
            )}
          </div>
        </div>
      </div>

      <div className="right">
        <button
          className="btn link"
          onClick={() => onDelete(todo.id)}
          aria-label="Delete todo"
        >
          Delete
        </button>
      </div>
    </li>
  );
}
