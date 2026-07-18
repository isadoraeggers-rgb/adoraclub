"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import type { FeedPost } from "@/lib/posts";
import type { CurrentUser } from "./ClubFeed";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function PostCard({
  post,
  currentUser,
  onChange,
}: {
  post: FeedPost;
  currentUser: CurrentUser;
  onChange: (updater: (post: FeedPost) => FeedPost) => void;
}) {
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);

  async function toggleLike() {
    if (likeLoading) return;
    setLikeLoading(true);
    const res = await fetch(`/api/posts/${post.id}/like`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      onChange((p) => ({ ...p, likedByMe: data.liked, likeCount: data.likeCount }));
    }
    setLikeLoading(false);
  }

  async function submitComment(event: FormEvent) {
    event.preventDefault();
    if (!commentText.trim() || commentLoading) return;
    setCommentLoading(true);
    const res = await fetch(`/api/posts/${post.id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: commentText }),
    });
    if (res.ok) {
      const data = await res.json();
      onChange((p) => ({ ...p, comments: [...p.comments, data.comment] }));
      setCommentText("");
      setShowComments(true);
    }
    setCommentLoading(false);
  }

  const progressPercent =
    post.type === "PROGRESS"
      ? post.progressUnit === "PERCENT"
        ? Math.min(100, post.progressValue ?? 0)
        : post.totalPages
          ? Math.min(100, Math.round(((post.progressValue ?? 0) / post.totalPages) * 100))
          : null
      : null;

  return (
    <article className="rounded-2xl border border-[#d8e0e4] bg-white p-5 shadow-sm">
      <header className="flex items-center justify-between">
        <Link
          href={`/perfil/${post.author.username}`}
          className="font-medium text-[#2c3640] hover:underline"
        >
          {post.author.name}{" "}
          <span className="font-normal text-[#8a97a0]">@{post.author.username}</span>
        </Link>
        <time className="text-xs text-[#8a97a0]">{formatDate(post.createdAt)}</time>
      </header>

      <div className="mt-3">
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
            post.type === "REVIEW"
              ? "bg-[#f5f0af] text-[#6b5f10]"
              : "bg-[#dde8ee] text-[#2f5266]"
          }`}
        >
          {post.type === "REVIEW" ? "Resenha" : "Progresso de leitura"}
        </span>

        <h3 className="mt-2 text-lg font-semibold text-[#2c3640]">
          {post.bookTitle}
          {post.bookAuthor && (
            <span className="ml-1 text-sm font-normal text-[#8a97a0]">
              — {post.bookAuthor}
            </span>
          )}
        </h3>

        {post.type === "PROGRESS" && (
          <div className="mt-2">
            <div className="flex items-center justify-between text-sm text-[#5c6a73]">
              <span>
                {post.progressUnit === "PERCENT"
                  ? `${post.progressValue}% lido`
                  : `Página ${post.progressValue}${
                      post.totalPages ? ` de ${post.totalPages}` : ""
                    }`}
              </span>
              {progressPercent !== null && <span>{progressPercent}%</span>}
            </div>
            {progressPercent !== null && (
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-[#eef2f4]">
                <div
                  className="h-full rounded-full bg-[#41525f]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            )}
          </div>
        )}

        {post.type === "REVIEW" && post.rating && (
          <div className="mt-1 text-[#c9a227]">
            {"★".repeat(post.rating)}
            <span className="text-[#d8e0e4]">{"★".repeat(5 - post.rating)}</span>
          </div>
        )}

        {post.content && (
          <p className="mt-2 whitespace-pre-wrap text-sm text-[#3f4a52]">{post.content}</p>
        )}
      </div>

      <div className="mt-4 flex items-center gap-4 border-t border-[#eef2f4] pt-3 text-sm">
        <button
          type="button"
          onClick={toggleLike}
          disabled={likeLoading}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1 transition ${
            post.likedByMe
              ? "bg-[#f5f0af] text-[#6b5f10]"
              : "text-[#5c6a73] hover:bg-[#eef2f4]"
          }`}
        >
          <span>{post.likedByMe ? "♥" : "♡"}</span>
          <span>{post.likeCount}</span>
        </button>
        <button
          type="button"
          onClick={() => setShowComments((v) => !v)}
          className="rounded-full px-3 py-1 text-[#5c6a73] transition hover:bg-[#eef2f4]"
        >
          {post.comments.length} comentário{post.comments.length === 1 ? "" : "s"}
        </button>
      </div>

      {showComments && (
        <div className="mt-3 space-y-2 border-t border-[#eef2f4] pt-3">
          {post.comments.map((comment) => (
            <div key={comment.id} className="rounded-lg bg-[#f7f9fa] px-3 py-2 text-sm">
              <span className="font-medium text-[#2c3640]">{comment.author.name}</span>{" "}
              <span className="text-[#3f4a52]">{comment.content}</span>
            </div>
          ))}

          <form onSubmit={submitComment} className="flex gap-2">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={`Comentar como ${currentUser.name}...`}
              className="flex-1 rounded-full border border-[#d8e0e4] px-3 py-1.5 text-sm outline-none focus:border-[#41525f]"
            />
            <button
              type="submit"
              disabled={commentLoading}
              className="rounded-full bg-[#41525f] px-4 py-1.5 text-sm font-medium text-[#f5f0af] transition hover:opacity-90 disabled:opacity-60"
            >
              Enviar
            </button>
          </form>
        </div>
      )}
    </article>
  );
}
