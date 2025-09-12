export default function Footer({ name = "Your Name", githubUrl = "#" }) {
  return (
    <footer className="footer">
      <div>
        Made by <strong>{name}</strong> —{" "}
        <a href={githubUrl} target="_blank" rel="noreferrer">
          GitHub
        </a>
      </div>
      <div className="hint">
        Tip: press <kbd>Ctrl/Cmd + N</kbd> to focus the add-box,{" "}
        <kbd>Ctrl/Cmd + D</kbd> to toggle theme.
      </div>
    </footer>
  );
}
