import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
  title: yup.string().required("Title is required").max(120),
  category: yup.string().required("Category required"),
  dueDate: yup.string().nullable(),
});

export default function AddTodoForm({ onAdd, categories = [], inputRef }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { title: "", category: "work", dueDate: "" },
  });

  // registration for title so we can attach our own ref to it (for programmatic focus)
  const titleReg = register("title");
  const { ref: titleRef, ...titleRest } = titleReg;

  const submit = (data) => {
    onAdd({
      title: data.title.trim(),
      category: data.category,
      dueDate: data.dueDate || null,
    });
    reset();
    if (inputRef && inputRef.current) inputRef.current.focus();
  };

  return (
    <form className="add-form" onSubmit={handleSubmit(submit)}>
      <div className="add-row">
        <input
          {...titleRest}
          ref={(el) => {
            titleRef(el);
            if (inputRef) inputRef.current = el;
          }}
          placeholder="Add a new todo (Ctrl+N to focus)"
          aria-label="New todo"
        />

        <select {...register("category")} aria-label="Category">
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <input type="date" {...register("dueDate")} aria-label="Due date" />

        <button type="submit" className="btn primary">
          Add
        </button>
      </div>

      <div className="form-errors">
        {errors.title && (
          <small className="error">{errors.title.message}</small>
        )}
      </div>
    </form>
  );
}
