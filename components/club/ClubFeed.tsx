"use client";

import { useState } from "react";
import type { Feed, FeedPost } from "@/lib/posts";
import { PostComposer } from "./PostComposer";
import { PostCard } from "./PostCard";

export type CurrentUser = {
  id: string;
  username: string;
  name: string;
};

export function ClubFeed({
  initialPosts,
  currentUser,
  showComposer = true,
}: {
  initialPosts: Feed;
  currentUser: CurrentUser;
  showComposer?: boolean;
}) {
  const [posts, setPosts] = useState<Feed>(initialPosts);

  async function refreshFeed() {
    const res = await fetch("/api/posts");
    if (!res.ok) return;
    const data = await res.json();
    setPosts(data.posts as Feed);
  }

  function updatePost(id: string, updater: (post: FeedPost) => FeedPost) {
    setPosts((prev) => prev.map((post) => (post.id === id ? updater(post) : post)));
  }

  return (
    <div className="space-y-6">
      {showComposer && <PostComposer onPosted={refreshFeed} />}

      {posts.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-[#d8e0e4] bg-white p-8 text-center text-sm text-[#5c6a73]">
          Ainda não há posts no clube. Seja a primeira pessoa a contar o que está
          lendo!
        </p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUser={currentUser}
              onChange={(updater) => updatePost(post.id, updater)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
