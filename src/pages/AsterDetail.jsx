import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getAsterById } from "../services/AsteriumServices";
import { Button } from "@heroui/react";

const AsterDetail = () => {
  const { id } = useParams();
  const [aster, setAster] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAsterById(id);
        setAster(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10">Error: {error.message}</div>;
  if (!aster) return <div className="text-center py-10">Post not found</div>;

  return (
    <div className="min-h-screen bg-background dark:bg-background text-text-primary dark:text-text-primary font-display transition-colors duration-300">

      <div className="flex justify-end p-4">
        <Button
          color="primary"
          variant="flat"
          onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </Button>
      </div>

      <main className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <article>
          <header className="mb-8 text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              {aster.title}
            </h1>
            <p className="text-sm text-text-secondary">
              By {aster.author || "Unknown"} |{" "}
              <time dateTime={aster.published_at}>
                {new Date(aster.published_at).toLocaleDateString()}
              </time>
            </p>
          </header>

          {aster.image && (
            <div className="mb-8">
              <img
                src={aster.image}
                alt={aster.title}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          )}

          <div className="prose prose-lg dark:prose-invert max-w-none leading-relaxed">
            <p>{aster.content_md}</p>
          </div>
        </article>
      </main>
    </div>
  );
};

export default AsterDetail;
