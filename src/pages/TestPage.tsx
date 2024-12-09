import { useTheme } from "@/utils/themes.utils";

const TestPage = () => {
  const { theme, setThemeColour, setTheme } = useTheme();
  console.log("Theme: ", theme);
  return (
    <div>
      <h1 className="text-primary">Test Page</h1>
      <button onClick={() => setThemeColour("green")}>Green</button>

      <button onClick={() => setThemeColour("blue")}>Blue</button>
      <button onClick={() => setTheme(!theme.includes("dark"))}>
        Toggle Dark Mode
      </button>
    </div>
  );
};

export default TestPage;
