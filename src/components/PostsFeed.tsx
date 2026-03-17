import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/useAuth';

interface Post {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  event_date: string | null;
  location: string | null;
  created_at: string;
}

interface CommentItem {
  id: string;
  post_id: string;
  content: string;
  created_at: string;
  users?: { full_name: string }[] | null;
}

const PostsFeed: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [userLikes, setUserLikes] = useState<Record<string, boolean>>({});
  const [comments, setComments] = useState<Record<string, CommentItem[]>>({});
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});

  const canReact = useMemo(() => user?.role === 'donor' || user?.role === 'volunteer', [user]);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('posts')
      .select('*')
      .order('event_date', { ascending: true })
      .order('created_at', { ascending: false });

    const postsData = data || [];
    setPosts(postsData);

    const fetchLikes = async (postsDataValue: Post[]) => {
      const postIds = postsDataValue.map((post) => post.id);
      const { data: likesData } = await supabase
        .from('post_likes')
        .select('post_id, user_id')
        .in('post_id', postIds);

      const counts: Record<string, number> = {};
      const liked: Record<string, boolean> = {};

      (likesData || []).forEach((like) => {
        counts[like.post_id] = (counts[like.post_id] || 0) + 1;
        if (user && like.user_id === user.id) {
          liked[like.post_id] = true;
        }
      });

      setLikeCounts(counts);
      setUserLikes(liked);
    };

    const fetchComments = async (postsDataValue: Post[]) => {
      const postIds = postsDataValue.map((post) => post.id);
      const { data: commentsData } = await supabase
        .from('post_comments')
        .select('id, post_id, content, created_at, users(full_name)')
        .in('post_id', postIds)
        .order('created_at', { ascending: true });

      const grouped: Record<string, CommentItem[]> = {};
      (commentsData || []).forEach((comment) => {
        if (!grouped[comment.post_id]) grouped[comment.post_id] = [];
        grouped[comment.post_id].push(comment);
      });

      setComments(grouped);
    };

    if (postsData.length > 0) {
      await Promise.all([fetchLikes(postsData), fetchComments(postsData)]);
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const toggleLike = async (postId: string) => {
    if (!user || !canReact) return;

    if (userLikes[postId]) {
      await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', user.id);
      setUserLikes((prev) => ({ ...prev, [postId]: false }));
      setLikeCounts((prev) => ({ ...prev, [postId]: Math.max((prev[postId] || 1) - 1, 0) }));
      return;
    }

    const { error } = await supabase.from('post_likes').insert([
      {
        post_id: postId,
        user_id: user.id
      }
    ]);

    if (!error) {
      setUserLikes((prev) => ({ ...prev, [postId]: true }));
      setLikeCounts((prev) => ({ ...prev, [postId]: (prev[postId] || 0) + 1 }));
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!user || !canReact) return;
    const content = (commentDrafts[postId] || '').trim();
    if (!content) return;

    const { data, error } = await supabase
      .from('post_comments')
      .insert([
        {
          post_id: postId,
          user_id: user.id,
          content
        }
      ])
      .select('id, post_id, content, created_at, users(full_name)')
      .single();

    if (!error && data) {
      setComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), data]
      }));
      setCommentDrafts((prev) => ({ ...prev, [postId]: '' }));
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return <div className="alert alert-info">No updates posted yet.</div>;
  }

  return (
    <div className="row">
      {posts.map((post) => (
        <div key={post.id} className="col-lg-6 mb-4">
          <div className="card h-100 shadow-sm">
            {post.image_url && (
              <img
                src={post.image_url}
                alt={post.title}
                className="card-img-top"
                style={{ maxHeight: '240px', objectFit: 'cover' }}
              />
            )}
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <h5 className="card-title text-primary mb-1">{post.title}</h5>
                {post.event_date && (
                  <span className="badge bg-light text-dark">{formatDate(post.event_date)}</span>
                )}
              </div>
              {post.location && (
                <p className="text-muted mb-2">Location: {post.location}</p>
              )}
              {post.description && <p className="card-text">{post.description}</p>}

              <div className="d-flex align-items-center gap-2 mb-3">
                <button
                  className={`btn btn-sm ${userLikes[post.id] ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => toggleLike(post.id)}
                  disabled={!canReact}
                >
                  {userLikes[post.id] ? 'Liked' : 'Like'} ({likeCounts[post.id] || 0})
                </button>
                {!canReact && (
                  <small className="text-muted">Login as donor or volunteer to react</small>
                )}
              </div>

              <div>
                <h6 className="mb-2">Comments</h6>
                {(comments[post.id] || []).length === 0 ? (
                  <p className="text-muted">No comments yet.</p>
                ) : (
                  <ul className="list-unstyled">
                    {(comments[post.id] || []).map((comment) => (
                      <li key={comment.id} className="mb-2">
                        <strong>{comment.users?.[0]?.full_name || 'Member'}:</strong> {comment.content}
                      </li>
                    ))}
                  </ul>
                )}
                {canReact && (
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Write a comment..."
                      value={commentDrafts[post.id] || ''}
                      onChange={(e) =>
                        setCommentDrafts((prev) => ({ ...prev, [post.id]: e.target.value }))
                      }
                    />
                    <button className="btn btn-primary" onClick={() => handleAddComment(post.id)}>
                      Post
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostsFeed;
