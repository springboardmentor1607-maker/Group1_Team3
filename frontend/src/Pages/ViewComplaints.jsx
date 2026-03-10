import React, { useEffect, useMemo, useState } from "react";
import API from "../api/axios";
import Swal from "sweetalert2";
import "./ViewComplaints.css";

const formatDistanceToNow = (dateValue) => {
  if (!dateValue) return "Unknown time";

  const seconds = Math.floor((Date.now() - new Date(dateValue).getTime()) / 1000);
  if (Number.isNaN(seconds) || seconds < 0) return "Unknown time";

  const units = [
    { label: "year", value: 31536000 },
    { label: "month", value: 2592000 },
    { label: "day", value: 86400 },
    { label: "hour", value: 3600 },
    { label: "minute", value: 60 },
  ];

  for (const unit of units) {
    const interval = Math.floor(seconds / unit.value);
    if (interval >= 1) {
      return `${interval} ${unit.label}${interval > 1 ? "s" : ""} ago`;
    }
  }

  return "Just now";
};

const priorityRank = { high: 0, medium: 1, low: 2 };
const statusRank = { received: 0, assigned: 1, in_progress: 2, resolved: 3 };

const priorityColors = {
  high: "#d62828",
  medium: "#f4a261",
  low: "#2a9d8f",
};

const statusColors = {
  received: "#5b5fef",
  assigned: "#264653",
  in_progress: "#1d7ddc",
  resolved: "#2b9348",
};

const parseStoredUser = () => {
  try {
    const rawUser = localStorage.getItem("user");
    return rawUser ? JSON.parse(rawUser) : null;
  } catch {
    return null;
  }
};

const normalizeComplaint = (complaint, currentUser) => {
  const reporter =
    complaint.user_id && typeof complaint.user_id === "object"
      ? complaint.user_id
      : null;
  const reporterId = reporter?._id || complaint.user_id || null;

  return {
    ...complaint,
    id: complaint._id,
    createdAt: complaint.created_at,
    imageUrls: complaint.images || [],
    reporterName:
      reporter?.name ||
      reporter?.email ||
      (String(reporterId) === String(currentUser?._id || currentUser?.id)
        ? currentUser?.name
        : null) ||
      "Unknown reporter",
    assignedName:
      complaint.assigned_to && typeof complaint.assigned_to === "object"
        ? complaint.assigned_to.name || complaint.assigned_to.email
        : null,
  };
};

const ViewComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [commentCounts, setCommentCounts] = useState({});
  const [comments, setComments] = useState([]);
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [selectedComplaintForComments, setSelectedComplaintForComments] = useState(null);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = useMemo(parseStoredUser, []);
  const isPrivilegedViewer = user?.role === "admin" || user?.role === "volunteer";

  useEffect(() => {
    const fetchComplaints = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You need to log in to view complaints.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const endpoint = "/complaints";
        const response = await API.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const list = response.data?.complaints || [];
        setComplaints(list.map((item) => normalizeComplaint(item, user)));
      } catch (fetchError) {
        console.error("Error fetching complaints:", fetchError);
        setError(fetchError.response?.data?.message || "Failed to load complaints.");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [isPrivilegedViewer, user]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || complaints.length === 0) {
      setCommentCounts({});
      return;
    }

    const fetchCommentCounts = async () => {
      try {
        const entries = await Promise.all(
          complaints.map(async (complaint) => {
            const response = await API.get(`/complaints/${complaint.id}/comments`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            return [complaint.id, response.data?.comments?.length || 0];
          }),
        );

        setCommentCounts(Object.fromEntries(entries));
      } catch (countError) {
        console.error("Error fetching comment counts:", countError);
      }
    };

    fetchCommentCounts();
  }, [complaints]);

  const filteredComplaints = useMemo(() => {
    const next = complaints.filter((complaint) => {
      const matchesPriority =
        filterPriority === "all" || complaint.priority === filterPriority;
      const matchesStatus = filterStatus === "all" || complaint.status === filterStatus;
      return matchesPriority && matchesStatus;
    });

    next.sort((a, b) => {
      if (sortBy === "priority") {
        return (
          (priorityRank[a.priority] ?? 99) - (priorityRank[b.priority] ?? 99) ||
          new Date(b.createdAt) - new Date(a.createdAt)
        );
      }

      if (sortBy === "status") {
        return (
          (statusRank[a.status] ?? 99) - (statusRank[b.status] ?? 99) ||
          new Date(b.createdAt) - new Date(a.createdAt)
        );
      }

      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }

      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return next;
  }, [complaints, filterPriority, filterStatus, sortBy]);

  const stats = useMemo(
    () => ({
      total: complaints.length,
      received: complaints.filter((item) => item.status === "received").length,
      inProgress: complaints.filter((item) => item.status === "in_progress").length,
      resolved: complaints.filter((item) => item.status === "resolved").length,
    }),
    [complaints],
  );

  const refreshComplaints = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const endpoint ="/complaints";
      const response = await API.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const list = response.data?.complaints || [];
      setComplaints(list.map((item) => normalizeComplaint(item, user)));
    } catch (refreshError) {
      console.error("Error refreshing complaints:", refreshError);
    }
  };

  const refreshComments = async (complaintId) => {
    const token = localStorage.getItem("token");
    if (!token || !complaintId) return;

    try {
      const response = await API.get(`/complaints/${complaintId}/comments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const nextComments = response.data?.comments || [];
      setComments(nextComments);
      setCommentCounts((current) => ({
        ...current,
        [complaintId]: nextComments.length,
      }));
    } catch (commentError) {
      console.error("Error fetching comments:", commentError);
      setComments([]);
    }
  };

  const openDetails = (complaint) => {
    setSelectedComplaint(complaint);
    setModalImageIndex(0);
    document.body.classList.add("modal-open");
  };

  const closeDetails = () => {
    setSelectedComplaint(null);
    setModalImageIndex(0);
    document.body.classList.remove("modal-open");
  };

  const openComments = async (complaint) => {
    setSelectedComplaintForComments(complaint);
    setNewComment("");
    document.body.classList.add("modal-open");
    await refreshComments(complaint.id);
  };

  const closeComments = () => {
    setSelectedComplaintForComments(null);
    setNewComment("");
    setComments([]);
    document.body.classList.remove("modal-open");
  };

  const openLocationInMaps = (complaint) => {
    const query =
      complaint.address ||
      [complaint.location_coords?.lat, complaint.location_coords?.lng]
        .filter(Boolean)
        .join(", ");

    if (!query) {
      Swal.fire({
        icon: "info",
        title: "Location unavailable",
        text: "This complaint does not include a mappable location yet.",
      });
      return;
    }

    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const previousImage = () => {
    if (!selectedComplaint?.imageUrls?.length) return;
    setModalImageIndex((current) =>
      (current - 1 + selectedComplaint.imageUrls.length) %
      selectedComplaint.imageUrls.length,
    );
  };

  const nextImage = () => {
    if (!selectedComplaint?.imageUrls?.length) return;
    setModalImageIndex((current) => (current + 1) % selectedComplaint.imageUrls.length);
  };

  const handleVote = async (complaintId, type) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const endpoint =
        type === "up"
          ? `/complaints/${complaintId}/upvote`
          : `/complaints/${complaintId}/downvote`;

      const response = await API.post(
        endpoint,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const updatedComplaint = response.data?.complaint;
      if (!updatedComplaint) return;

      const normalized = normalizeComplaint(updatedComplaint, user);
      setComplaints((current) =>
        current.map((complaint) => (complaint.id === complaintId ? normalized : complaint)),
      );

      if (selectedComplaint?.id === complaintId) {
        setSelectedComplaint(normalized);
      }
    } catch (voteError) {
      console.error(`Error submitting ${type}vote:`, voteError);
      Swal.fire("Error", "Vote failed", "error");
    }
  };

  const handleAddComment = async () => {
    const complaintId = selectedComplaintForComments?.id;
    const text = newComment.trim();
    const token = localStorage.getItem("token");

    if (!token || !complaintId || !text) return;

    try {
      await API.post(
        `/complaints/${complaintId}/comment`,
        { text },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setNewComment("");
      await refreshComments(complaintId);
      await refreshComplaints();
    } catch (commentError) {
      console.error("Error adding comment:", commentError);
      Swal.fire("Error", "Comment failed", "error");
    }
  };

  const renderComplaintCard = (complaint) => {
    const priorityColor = priorityColors[complaint.priority] || "#6b7280";
    const statusColor = statusColors[complaint.status] || "#4b5563";
    const upvotes = Number(complaint.upvotes || 0);
    const downvotes = Number(complaint.downvotes || 0);
    const commentsCount = commentCounts[complaint.id] || 0;

    return (
      <article
        key={complaint.id}
        className="complaint-card"
        onClick={() => openDetails(complaint)}
      >
        <div className="card-image-wrapper">
          <img
            src={complaint.imageUrls[0] || "https://placehold.co/800x600?text=No+Image"}
            alt={complaint.title}
            className="complaint-image"
          />
          <div className="card-badges">
            <span className="badge" style={{ backgroundColor: priorityColor }}>
              {complaint.priority || "unknown"}
            </span>
            <span className="badge" style={{ backgroundColor: statusColor }}>
              {(complaint.status || "unknown").replace(/_/g, " ")}
            </span>
          </div>
        </div>

        <div className="complaint-content">
          <div className="complaint-meta">
            <span>{complaint.issueType}</span>
            <span>{formatDistanceToNow(complaint.createdAt)}</span>
          </div>

          <h2 className="complaint-title">{complaint.title}</h2>
          <p className="complaint-description">
            {complaint.description || "No description available."}
          </p>

          <div className="complaint-footer">
            <span>{complaint.reporterName}</span>
            <div className="footer-actions">
              <button
                type="button"
                className="action-btn btn-vote"
                onClick={(event) => {
                  event.stopPropagation();
                  handleVote(complaint.id, "up");
                }}
              >
                <i className="bi bi-hand-thumbs-up" /> {upvotes}
              </button>
              <button
                type="button"
                className="action-btn btn-vote"
                onClick={(event) => {
                  event.stopPropagation();
                  handleVote(complaint.id, "down");
                }}
              >
                <i className="bi bi-hand-thumbs-down" /> {downvotes}
              </button>
              <button
                type="button"
                className="action-btn btn-comment"
                onClick={(event) => {
                  event.stopPropagation();
                  openComments(complaint);
                }}
              >
                <i className="bi bi-chat-left-text" /> {commentsCount}
              </button>
              <button
                type="button"
                className="action-btn btn-view"
                onClick={(event) => {
                  event.stopPropagation();
                  openDetails(complaint);
                }}
              >
                View details
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className="view-complaints-page">
      <div className="complaints-shell">
        <header className="complaints-page-header">
          <div>
            <p className="eyebrow">
              {isPrivilegedViewer ? "Operations feed" : "Your reports"}
            </p>
            <h1>Complaints</h1>
            <p className="header-copy">
              Viewing complaint data, votes, and comments from the backend complaint service.
            </p>
          </div>

          <div className="header-controls">
            <label className="filter-group">
              <span>Priority</span>
              <select
                className="modern-select"
                value={filterPriority}
                onChange={(event) => setFilterPriority(event.target.value)}
              >
                <option value="all">All</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </label>

            <label className="filter-group">
              <span>Status</span>
              <select
                className="modern-select"
                value={filterStatus}
                onChange={(event) => setFilterStatus(event.target.value)}
              >
                <option value="all">All</option>
                <option value="received">Received</option>
                <option value="assigned">Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </label>

            <label className="filter-group">
              <span>Sort</span>
              <select
                className="modern-select"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
              >
                <option value="newest">Newest</option>
                <option value="priority">Priority</option>
                <option value="status">Status</option>
                <option value="title">Title</option>
              </select>
            </label>
          </div>
        </header>

        <section className="complaints-stats">
          <article className="stat-card">
            <span>Total</span>
            <strong>{stats.total}</strong>
          </article>
          <article className="stat-card">
            <span>Received</span>
            <strong>{stats.received}</strong>
          </article>
          <article className="stat-card">
            <span>In Progress</span>
            <strong>{stats.inProgress}</strong>
          </article>
          <article className="stat-card">
            <span>Resolved</span>
            <strong>{stats.resolved}</strong>
          </article>
        </section>

        {loading ? <p className="state-message">Loading complaints...</p> : null}
        {!loading && error ? <p className="state-message error">{error}</p> : null}

        {!loading && !error ? (
          filteredComplaints.length > 0 ? (
            <section className="complaints-grid" aria-label="Complaint list">
              {filteredComplaints.map(renderComplaintCard)}
            </section>
          ) : (
            <p className="state-message">No complaints match the selected filters.</p>
          )
        ) : null}
      </div>

      {selectedComplaint ? (
        <div className="modal-overlay" onClick={closeDetails}>
          <div className="modal-box" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div>
                <p className="eyebrow">Complaint details</p>
                <h2>{selectedComplaint.title}</h2>
              </div>
              <button type="button" className="icon-btn" onClick={closeDetails}>
                <i className="bi bi-x-lg" />
              </button>
            </div>

            <div className="modal-image-container">
              {selectedComplaint.imageUrls.length > 0 ? (
                <>
                  <img
                    src={selectedComplaint.imageUrls[modalImageIndex]}
                    alt={selectedComplaint.title}
                    className="modal-image"
                  />
                  {selectedComplaint.imageUrls.length > 1 ? (
                    <>
                      <button type="button" className="carousel-btn left" onClick={previousImage}>
                        <i className="bi bi-chevron-left" />
                      </button>
                      <button type="button" className="carousel-btn right" onClick={nextImage}>
                        <i className="bi bi-chevron-right" />
                      </button>
                    </>
                  ) : null}
                </>
              ) : (
                <div className="image-empty">No evidence images uploaded.</div>
              )}
            </div>

            <div className="modal-grid">
              <div className="info-card">
                <span className="info-label">Reporter</span>
                <strong>{selectedComplaint.reporterName}</strong>
              </div>
              <div className="info-card">
                <span className="info-label">Assigned To</span>
                <strong>{selectedComplaint.assignedName || "Not assigned"}</strong>
              </div>
              <div className="info-card">
                <span className="info-label">Priority</span>
                <strong>{selectedComplaint.priority || "N/A"}</strong>
              </div>
              <div className="info-card">
                <span className="info-label">Status</span>
                <strong>{(selectedComplaint.status || "N/A").replace(/_/g, " ")}</strong>
              </div>
            </div>

            <div className="modal-body">
              <p>{selectedComplaint.description || "No description provided."}</p>

              <div className="location-row">
                <div>
                  <span className="info-label">Address</span>
                  <strong>{selectedComplaint.address || "No address provided"}</strong>
                  {selectedComplaint.landmark ? (
                    <span className="subtle-text">Landmark: {selectedComplaint.landmark}</span>
                  ) : null}
                </div>

                <button
                  type="button"
                  className="action-btn btn-map"
                  onClick={() => openLocationInMaps(selectedComplaint)}
                >
                  Open in Maps
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {selectedComplaintForComments ? (
        <div className="modal-overlay" onClick={closeComments}>
          <div className="modal-box comments-modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div>
                <p className="eyebrow">Discussion</p>
                <h2>{selectedComplaintForComments.title}</h2>
              </div>
              <button type="button" className="icon-btn" onClick={closeComments}>
                <i className="bi bi-x-lg" />
              </button>
            </div>

            <div className="comment-composer">
              <textarea
                className="comment-input"
                rows="3"
                value={newComment}
                placeholder="Write a comment..."
                onChange={(event) => setNewComment(event.target.value)}
              />
              <button type="button" className="action-btn btn-view" onClick={handleAddComment}>
                Post
              </button>
            </div>

            <div className="comments-list">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <article key={comment._id || comment.id} className="comment-card">
                    <div className="comment-top">
                      <strong>{comment.user_id?.name || comment.user_id?.email || "User"}</strong>
                      <span>{formatDistanceToNow(comment.createdAt)}</span>
                    </div>
                    <p>{comment.text}</p>
                  </article>
                ))
              ) : (
                <p className="state-message">No comments yet.</p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ViewComplaints;
