import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Upcoming Events</h1>
      <p className="text-center mb-5">Join us in our mission to make a difference</p>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : events.length === 0 ? (
        <div className="alert alert-info text-center">
          No upcoming events at the moment. Check back soon!
        </div>
      ) : (
        <div className="row">
          {events.map((event) => (
            <div key={event.id} className="col-md-6 mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title text-primary">{event.title}</h5>
                  <p className="card-text">{event.description}</p>
                  <div className="mt-3">
                    <p className="mb-1">
                      <strong>Date:</strong> {formatDate(event.event_date)}
                    </p>
                    <p className="mb-0">
                      <strong>Location:</strong> {event.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
