"use client";

import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Heart, MessageCircle } from "lucide-react";
import PostForm from "@/components/ui/PostForm";

type PostType = "text" | "image" | "audio" | "document";

type ReactionType = "❤️" | "😂" | "😮" | "😢" | "😡";

interface Reply {
  id: string;
  text: string;
}

interface Comment {
  id: string;
  text: string;
  replies: Reply[];
}

interface FeedItem {
  id: string;
  author: string;
  avatarUrl?: string;
  content: string;
  timestamp: string;
  reactions: Record<ReactionType, number>;
  comments: Comment[];
  anonymous: boolean;
  type: PostType;
  attachmentUrl?: string;
}

import { communityFeed, FeedItem as PlaceholderFeedItem } from "@/lib/placeholder-data";

export default function CommunityFeedPage() {
  // Map placeholder data to local feed item structure if needed, or unify types.
  // The local FeedItem interface has 'reactions' which placeholder might not have perfectly aligned.
  // Let's align the types or map the data.

  const initialPosts: FeedItem[] = communityFeed.map(p => ({
    id: p.id,
    author: p.author,
    avatarUrl: p.avatarUrl,
    content: p.content,
    timestamp: p.timestamp,
    reactions: { "❤️": p.likes, "😂": 0, "😮": 0, "😢": 0, "😡": 0 }, // Map likes to hearts
    comments: [], // Placeholder comments are numbers, we need array. ignoring for now or creating dummies.
    anonymous: p.anonymous,
    type: "text" as PostType, // Default to text
  }));

  const [posts, setPosts] = useState<FeedItem[]>(initialPosts);

  const handleAddPost = (data: Partial<FeedItem>) => {
    const newPost: FeedItem = {
      id: Date.now().toString(),
      author: data.anonymous ? "Anonymous" : "Current User",
      avatarUrl: data.anonymous
        ? undefined
        : `https://api.dicebear.com/7.x/avataaars/svg?seed=user`,
      content: data.content || "",
      timestamp: "Just now",
      reactions: { "❤️": 0, "😂": 0, "😮": 0, "😢": 0, "😡": 0 },
      comments: [],
      type: data.type || "text",
      ...data,
    } as FeedItem;

    setPosts([newPost, ...posts]);
  };

  const handleReact = (id: string, emoji: ReactionType) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
            ...p,
            reactions: { ...p.reactions, [emoji]: p.reactions[emoji] + 1 },
          }
          : p
      )
    );
  };

  const handleAddComment = (postId: string, text: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
            ...p,
            comments: [
              ...p.comments,
              { id: Date.now().toString(), text, replies: [] },
            ],
          }
          : p
      )
    );
  };

  const handleAddReply = (postId: string, commentId: string, text: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
            ...p,
            comments: p.comments.map((c) =>
              c.id === commentId
                ? {
                  ...c,
                  replies: [
                    ...c.replies,
                    { id: Date.now().toString(), text },
                  ],
                }
                : c
            ),
          }
          : p
      )
    );
  };

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold">Campus Feed</h1>
      <PostForm onPostAction={handleAddPost} />

      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onReact={handleReact}
            onComment={handleAddComment}
            onReply={handleAddReply}
          />
        ))}
      </div>
    </div>
  );
}

function PostCard({
  post,
  onReact,
  onComment,
  onReply,
}: {
  post: FeedItem;
  onReact: (id: string, emoji: ReactionType) => void;
  onComment: (postId: string, text: string) => void;
  onReply: (postId: string, commentId: string, text: string) => void;
}) {
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState<Record<string, string>>({});

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={post.avatarUrl} />
            <AvatarFallback>{post.anonymous ? "?" : "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-bold">{post.author}</p>
            <p className="text-xs text-muted-foreground">{post.timestamp}</p>
          </div>
        </div>

        <p className="text-sm">{post.content}</p>

        {post.type === "image" && post.attachmentUrl && (
          <img
            src={post.attachmentUrl}
            className="rounded-lg w-full max-h-80 object-cover"
          />
        )}

        {post.type === "audio" && post.attachmentUrl && (
          <audio controls className="w-full">
            <source src={post.attachmentUrl} />
          </audio>
        )}

        <div className="flex gap-2">
          {(["❤️", "😂", "😮", "😢", "😡"] as ReactionType[]).map((emoji) => (
            <Button
              key={emoji}
              size="sm"
              variant="ghost"
              onClick={() => onReact(post.id, emoji)}
            >
              {emoji} {post.reactions[emoji]}
            </Button>
          ))}
        </div>

        <div className="space-y-2">
          {post.comments.map((c) => (
            <div key={c.id} className="pl-2 border-l space-y-1">
              <p className="text-xs bg-muted p-2 rounded">{c.text}</p>

              {c.replies.map((r) => (
                <p
                  key={r.id}
                  className="ml-4 text-[11px] bg-muted/50 p-2 rounded"
                >
                  ↳ {r.text}
                </p>
              ))}

              <div className="flex gap-2 ml-4">
                <Input
                  value={replyText[c.id] || ""}
                  onChange={(e) =>
                    setReplyText({ ...replyText, [c.id]: e.target.value })
                  }
                  placeholder="Reply..."
                  className="h-7 text-xs"
                />
                <Button
                  size="sm"
                  onClick={() => {
                    if (!replyText[c.id]) return;
                    onReply(post.id, c.id, replyText[c.id]);
                    setReplyText({ ...replyText, [c.id]: "" });
                  }}
                >
                  ↳
                </Button>
              </div>
            </div>
          ))}

          <div className="flex gap-2">
            <Input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="h-8 text-xs"
            />
            <Button
              size="sm"
              onClick={() => {
                if (!commentText) return;
                onComment(post.id, commentText);
                setCommentText("");
              }}
            >
              Send
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
