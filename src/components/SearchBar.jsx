export default function SearchBar({ value, onChange }) {
  return (
    <input
      className="search"
      placeholder="Search todos..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Search todos"
    />
  );
}
