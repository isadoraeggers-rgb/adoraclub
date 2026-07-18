import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

const postWithRelations = {
  author: { select: { id: true, name: true, username: true } },
  likes: { select: { userId: true } },
  comments: {
    orderBy: { createdAt: "asc" as const },
    include: { author: { select: { id: true, name: true, username: true } } },
  },
} satisfies Prisma.PostInclude;

type RawPost = Prisma.PostGetPayload<{ include: typeof postWithRelations }>;

function serializePost(post: RawPost, currentUserId?: string) {
  return {
    id: post.id,
    type: post.type,
    bookTitle: post.bookTitle,
    bookAuthor: post.bookAuthor,
    content: post.content,
    rating: post.rating,
    progressUnit: post.progressUnit,
    progressValue: post.progressValue,
    totalPages: post.totalPages,
    createdAt: post.createdAt.toISOString(),
    author: post.author,
    likeCount: post.likes.length,
    likedByMe: currentUserId
      ? post.likes.some((like) => like.userId === currentUserId)
      : false,
    comments: post.comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
      author: comment.author,
    })),
  };
}

export async function getFeed(currentUserId?: string) {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: postWithRelations,
  });
  return posts.map((post) => serializePost(post, currentUserId));
}

export async function getUserFeed(authorId: string, currentUserId?: string) {
  const posts = await prisma.post.findMany({
    where: { authorId },
    orderBy: { createdAt: "desc" },
    include: postWithRelations,
  });
  return posts.map((post) => serializePost(post, currentUserId));
}

export type Feed = Awaited<ReturnType<typeof getFeed>>;
export type FeedPost = Feed[number];
