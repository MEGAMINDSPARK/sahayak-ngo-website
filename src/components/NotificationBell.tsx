import React, { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Notification {
  id: string;
  icon: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface NotificationBellProps {
  recipientId: string;
}

const timeAgo = (dateValue: string) => {
  const now = new Date().getTime();
  const time = new Date(dateValue).getTime();
  if (Number.isNaN(time)) return 'just now';
  const diff = Math.max(now - time, 0);
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const NotificationBell: React.FC<NotificationBellProps> = ({ recipientId }) => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const fetchNotifications = useCallback(async () => {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('recipient_id', recipientId)
      .order('created_at', { ascending: false })
      .limit(30);
    setNotifications((data || []) as Notification[]);
  }, [recipientId]);

  useEffect(() => {
    fetchNotifications();
    const interval = window.setInterval(fetchNotifications, 15000);
    return () => window.clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handleOutside);
    return () => document.removeEventListener('click', handleOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markRead = async (id: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
  };

  const markAllRead = async () => {
    await supabase.from('notifications').update({ is_read: true }).eq('recipient_id', recipientId);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const clearAll = async () => {
    await supabase.from('notifications').delete().eq('recipient_id', recipientId);
    setNotifications([]);
  };

  return (
    <div className="notification-bell-container" ref={containerRef}>
      <button
        type="button"
        className="notification-bell"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Notifications"
      >
        <span className="notification-bell-icon">🔔</span>
        {unreadCount > 0 && <span className="notification-bell-badge">{unreadCount}</span>}
      </button>
      {open && (
        <div className="notification-panel">
          <div className="notification-panel-header">
            <div>
              <strong>Notifications</strong>
              <div className="notification-panel-sub">Latest updates</div>
            </div>
            <div className="notification-panel-actions">
              <button type="button" className="btn btn-sm btn-outline-secondary" onClick={markAllRead}>
                Mark all read
              </button>
              <button type="button" className="btn btn-sm btn-outline-danger" onClick={clearAll}>
                Clear all
              </button>
            </div>
          </div>
          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="notification-empty">No notifications yet.</div>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  className={`notification-item${notification.is_read ? '' : ' unread'}`}
                  onClick={() => markRead(notification.id)}
                >
                  <span className="notification-icon">{notification.icon || '🔔'}</span>
                  <span className="notification-text">
                    <span>{notification.message}</span>
                    <small>{timeAgo(notification.created_at)}</small>
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
