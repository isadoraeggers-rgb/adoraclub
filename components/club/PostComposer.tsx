"use client";

import { useState, type FormEvent } from "react";

type Mode = "PROGRESS" | "REVIEW";

export function PostComposer({ onPosted }: { onPosted: () => void | Promise<void> }) {
  const [mode, setMode] = useState<Mode>("PROGRESS");
  const [bookTitle, setBookTitle] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const [content, setContent] = useState("");
  const [progressUnit, setProgressUnit] = useState<"PERCENT" | "PAGE">("PERCENT");
  const [progressValue, setProgressValue] = useState("");
  const [totalPages, setTotalPages] = useState("");
  const [rating, setRating] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function resetForm() {
    setBookTitle("");
    setBookAuthor("");
    setContent("");
    setProgressValue("");
    setTotalPages("");
    setRating(0);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (mode === "PROGRESS" && progressValue.trim() === "") {
      setError("Informe seu progresso.");
      return;
    }
    if (mode === "REVIEW" && content.trim() === "") {
      setError("Escreva sua resenha.");
      return;
    }

    setLoading(true);

    const payload =
      mode === "PROGRESS"
        ? {
            type: "PROGRESS" as const,
            bookTitle,
            bookAuthor,
            progressUnit,
            progressValue: Number(progressValue),
            totalPages: totalPages ? Number(totalPages) : undefined,
            content,
          }
        : {
            type: "REVIEW" as const,
            bookTitle,
            bookAuthor,
            content,
            rating: rating || undefined,
          };

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Não foi possível publicar.");
      return;
    }

    resetForm();
    await onPosted();
  }

  return (
    <div className="rounded-2xl border border-[#d8e0e4] bg-white p-5 shadow-sm">
      <div className="mb-4 flex gap-2">
        <TabButton active={mode === "PROGRESS"} onClick={() => setMode("PROGRESS")}>
          Estou lendo
        </TabButton>
        <TabButton active={mode === "REVIEW"} onClick={() => setMode("REVIEW")}>
          Resenha
        </TabButton>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            value={bookTitle}
            onChange={(e) => setBookTitle(e.target.value)}
            required
            placeholder="Título do livro"
            className="w-full rounded-lg border border-[#d8e0e4] px-3 py-2 text-sm outline-none focus:border-[#41525f]"
          />
          <input
            value={bookAuthor}
            onChange={(e) => setBookAuthor(e.target.value)}
            placeholder="Autor (opcional)"
            className="w-full rounded-lg border border-[#d8e0e4] px-3 py-2 text-sm outline-none focus:border-[#41525f]"
          />
        </div>

        {mode === "PROGRESS" ? (
          <div className="grid gap-3 sm:grid-cols-3">
            <select
              value={progressUnit}
              onChange={(e) => setProgressUnit(e.target.value as "PERCENT" | "PAGE")}
              className="rounded-lg border border-[#d8e0e4] px-3 py-2 text-sm outline-none focus:border-[#41525f]"
            >
              <option value="PERCENT">Porcentagem</option>
              <option value="PAGE">Página</option>
            </select>
            <input
              value={progressValue}
              onChange={(e) => setProgressValue(e.target.value)}
              type="number"
              min={0}
              required
              placeholder={progressUnit === "PERCENT" ? "% lido" : "Página atual"}
              className="w-full rounded-lg border border-[#d8e0e4] px-3 py-2 text-sm outline-none focus:border-[#41525f]"
            />
            {progressUnit === "PAGE" && (
              <input
                value={totalPages}
                onChange={(e) => setTotalPages(e.target.value)}
                type="number"
                min={1}
                placeholder="Total de páginas (opcional)"
                className="w-full rounded-lg border border-[#d8e0e4] px-3 py-2 text-sm outline-none focus:border-[#41525f]"
              />
            )}
          </div>
        ) : (
          <div>
            <span className="mb-1 block text-sm text-[#5c6a73]">Nota (opcional)</span>
            <StarPicker value={rating} onChange={setRating} />
          </div>
        )}

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          placeholder={
            mode === "PROGRESS"
              ? "Algum comentário sobre a leitura até agora? (opcional)"
              : "Escreva sua resenha..."
          }
          className="w-full resize-none rounded-lg border border-[#d8e0e4] px-3 py-2 text-sm outline-none focus:border-[#41525f]"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-[#41525f] px-5 py-2 text-sm font-medium text-[#f5f0af] transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Publicando..." : "Publicar"}
          </button>
        </div>
      </form>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
        active
          ? "bg-[#41525f] text-[#f5f0af]"
          : "bg-[#eef2f4] text-[#5c6a73] hover:bg-[#e3e9ec]"
      }`}
    >
      {children}
    </button>
  );
}

function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star === value ? 0 : star)}
          aria-label={`${star} estrelas`}
          className={`text-xl ${star <= value ? "text-[#c9a227]" : "text-[#d8e0e4]"}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
