"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, updateDoc, doc, increment } from "firebase/firestore";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, MessageSquare, Share2, Heart, TrendingUp, Users, BookOpen, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<any[]>([]);
  const [postInput, setPostInput] = useState("");
  const [postImage, setPostImage] = useState<string | null>(null);

  // Fetch posts with live updates
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, snapshot => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleCreatePost = async () => {
    if (!profile) return toast({ title: "Sign in required", variant: "destructive" });
    if (!postInput.trim()) return;

    try {
      await addDoc(collection(db, "posts"), {
        authorName: `${profile.firstName} ${profile.lastName}`,
        avatarUrl: profile.avatarUrl,
        content: postInput,
        imageUrl: postImage || "",
        likes: 0,
        createdAt: serverTimestamp()
      });
      setPostInput("");
      setPostImage(null);
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const diff = (Date.now() - date.getTime()) / 1000;
    if (diff < 60) return `${Math.floor(diff)}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Top Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome back, {profile?.firstName || "Student"}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening in your campus community today.
          </p>
        </div>
        <Button className="rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 px-6" onClick={handleCreatePost}>
          <Plus className="mr-2 h-4 w-4" /> Post
        </Button>
      </div>

      {/* Main Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Create Post */}
          <Card className="border-none shadow-sm bg-card rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={profile?.avatarUrl} />
                  <AvatarFallback>{profile?.firstName?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-4">
                  <textarea
                    placeholder="What's on your mind?"
                    value={postInput}
                    onChange={(e) => setPostInput(e.target.value)}
                    className="w-full min-h-[100px] p-4 rounded-xl bg-background/50 border border-border focus:ring-2 focus:ring-primary outline-none transition-all resize-none text-sm"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="rounded-lg text-muted-foreground hover:bg-secondary/10">
                        <ImageIcon className="h-4 w-4 mr-2" /> Image
                      </Button>
                      <Button variant="ghost" size="sm" className="rounded-lg text-muted-foreground hover:bg-secondary/10">
                        <Users className="h-4 w-4 mr-2" /> Group
                      </Button>
                    </div>
                    <Button size="sm" className="rounded-xl px-6" onClick={handleCreatePost}>
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Posts Feed */}
          {posts.map(post => (
            <PostCard key={post.id} post={post} profile={profile} formatTime={formatTime} />
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Trending Card */}
          <Card className="border-none shadow-sm bg-card rounded-2xl p-6">
            <h3 className="font-bold text-foreground flex items-center gap-2 mb-4">
              <TrendingUp className="h-4 w-4 text-accent" /> Trending Topics
            </h3>
            <div className="space-y-4">
              {["#ComputerScience", "#CampusEvents", "#StudyHacks"].map((tag, i) => (
                <div key={i} className="group cursor-pointer">
                  <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{tag}</p>
                  <p className="text-xs text-muted-foreground">1000+ posts</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Resources */}
          <Card className="border-none shadow-sm bg-gradient-to-br from-primary to-secondary rounded-2xl p-6 text-primary-foreground">
            <BookOpen className="h-8 w-8 mb-4 opacity-80" />
            <h3 className="font-bold text-lg mb-2">Resource Center</h3>
            <p className="text-primary-foreground/80 text-sm mb-4">
              Access campus wide notes, past papers and study materials.
            </p>
            <Button variant="secondary" className="w-full rounded-xl bg-background text-primary hover:bg-background/90 border-none">
              Explore Assets
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

function PostCard({ post, profile, formatTime }: any) {
  const { toast } = useToast();
  const [comments, setComments] = useState<any[]>([]);
  const [commentInput, setCommentInput] = useState("");
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [likes, setLikes] = useState<number>(post.likes || 0);

  // Live comments
  useEffect(() => {
    const q = query(collection(db, "posts", post.id, "comments"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, snapshot => {
      setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [post.id]);

  const handleComment = async () => {
    if (!profile) return toast({ title: "Sign in required", variant: "destructive" });
    if (!commentInput.trim()) return;

    try {
      await addDoc(collection(db, "posts", post.id, "comments"), {
        content: commentInput,
        authorName: `${profile.firstName} ${profile.lastName}`,
        avatarUrl: profile.avatarUrl,
        likes: 0,
        createdAt: serverTimestamp()
      });
      setCommentInput("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleReply = async (commentId: string) => {
    if (!profile) return toast({ title: "Sign in required", variant: "destructive" });
    const content = replyInputs[commentId]?.trim();
    if (!content) return;

    try {
      await addDoc(collection(db, "posts", post.id, "comments", commentId, "replies"), {
        content,
        authorName: `${profile.firstName} ${profile.lastName}`,
        avatarUrl: profile.avatarUrl,
        likes: 0,
        createdAt: serverTimestamp()
      });
      setReplyInputs(prev => ({ ...prev, [commentId]: "" }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLikePost = async () => {
    const postRef = doc(db, "posts", post.id);
    await updateDoc(postRef, { likes: increment(1) });
    setLikes(prev => prev + 1);
  };

  const handleLikeComment = async (commentId: string, currentLikes: number) => {
    const commentRef = doc(db, "posts", post.id, "comments", commentId);
    await updateDoc(commentRef, { likes: increment(1) });
  };

  return (
    <Card className="border-none shadow-sm bg-card rounded-2xl overflow-hidden group">
      <CardContent className="p-6">
        {/* Post Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.avatarUrl} />
              <AvatarFallback>{post.authorName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="text-sm font-semibold text-foreground">{post.authorName}</h4>
              <p className="text-xs text-muted-foreground">{formatTime(post.createdAt)}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-red-50 dark:hover:bg-red-950/20" onClick={handleLikePost}>
            <Heart className="h-4 w-4 text-red-500" /> {likes}
          </Button>
        </div>

        {/* Post Content */}
        <p className="text-foreground/80 text-sm leading-relaxed mb-4">{post.content}</p>
        {post.imageUrl && <img src={post.imageUrl} className="mb-4 rounded-lg" />}

        {/* Comments Section */}
        <div className="space-y-3 mt-4">
          {comments.map(comment => (
            <div key={comment.id} className="space-y-1">
              <div className="flex items-start gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={comment.avatarUrl} />
                  <AvatarFallback>{comment.authorName[0]}</AvatarFallback>
                </Avatar>
                <div className="text-xs">
                  <p className="font-semibold text-foreground">{comment.authorName}</p>
                  <p className="text-foreground/90">{comment.content}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <button className="text-xs text-muted-foreground hover:text-red-500 transition-colors" onClick={() => handleLikeComment(comment.id, comment.likes)}>
                      <Heart className="h-3 w-3 text-red-500 inline mr-1" /> {comment.likes || 0}
                    </button>
                    <input
                      placeholder="Reply..."
                      value={replyInputs[comment.id] || ""}
                      onChange={e => setReplyInputs(prev => ({ ...prev, [comment.id]: e.target.value }))}
                      className="p-1 px-2 rounded-md border border-border text-xs bg-background/50 flex-1 outline-none focus:ring-1 focus:ring-primary"
                    />
                    <Button size="xs" onClick={() => handleReply(comment.id)}>Reply</Button>
                  </div>
                  {/* Replies */}
                  <Replies postId={post.id} commentId={comment.id} formatTime={formatTime} />
                </div>
              </div>
            </div>
          ))}

          {/* Add Comment */}
          <div className="flex items-center gap-2 mt-2">
            <input
              value={commentInput}
              onChange={e => setCommentInput(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 p-2 px-3 rounded-md border border-border text-xs bg-background/50 outline-none focus:ring-1 focus:ring-primary"
            />
            <Button size="xs" onClick={handleComment}>Comment</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Replies({ postId, commentId, formatTime }: any) {
  const [replies, setReplies] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, "posts", postId, "comments", commentId, "replies"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, snapshot => {
      setReplies(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [postId, commentId]);

  return (
    <div className="ml-8 mt-1 space-y-1">
      {replies.map(reply => (
        <div key={reply.id} className="flex items-start gap-2">
          <Avatar className="h-5 w-5">
            <AvatarImage src={reply.avatarUrl} />
            <AvatarFallback>{reply.authorName[0]}</AvatarFallback>
          </Avatar>
          <div className="text-xs">
            <p className="font-semibold">{reply.authorName}</p>
            <p>{reply.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
