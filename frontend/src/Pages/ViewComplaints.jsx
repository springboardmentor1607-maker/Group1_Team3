import React, { useEffect, useMemo, useState } from "react";
import API from "../api/axios";
import Swal from "sweetalert2";
import "./ViewComplaints.css";

const LOCAL_ENGAGEMENT_KEY = "complaint_engagement_store";

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

const parseEngagementStore = () => {
  try {
    const rawStore = localStorage.getItem(LOCAL_ENGAGEMENT_KEY);
    return rawStore ? JSON.parse(rawStore) : {};
  } catch {
    return {};
  }
};

const saveEngagementStore = (store) => {
  localStorage.setItem(LOCAL_ENGAGEMENT_KEY, JSON.stringify(store));
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
      (String(reporterId) === String(currentUser?._id) ? currentUser?.name : null) ||
      "Unknown reporter",
    assignedName:
      complaint.assigned_to && typeof complaint.assigned_to === "object"
        ? complaint.assigned_to.name || complaint.assigned_to.email
        : null,
    isMine: String(reporterId) === String(currentUser?._id),
  };
};

const ViewComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [engagement, setEngagement] = useState({});
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
    setEngagement(parseEngagementStore());
  }, []);

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

        const endpoint = isPrivilegedViewer ? "/complaints" : "/complaints/my-complaints";
        const response = await API.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const list = response.data?.complaints || [];
        setComplaints(list.map((item) => normalizeComplaint(item, user)));
      } catch (fetchError) {
        console.error("Error fetching complaints:", fetchError);
        const message =
          fetchError.response?.data?.message || "Failed to load complaints.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [isPrivilegedViewer, user]);

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

  const getComplaintEngagement = (complaintId) =>
    engagement[complaintId] || { upvotes: [], downvotes: [], comments: [] };

  const updateEngagement = (complaintId, updater) => {
    setEngagement((current) => {
      const next = { ...current };
      const existing = next[complaintId] || { upvotes: [], downvotes: [], comments: [] };
      next[complaintId] = updater(existing);
      saveEngagementStore(next);
      return next;
    });
  };

  const currentUserKey = String(user?._id || user?.id || user?.email || "guest");

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
  try {
    const token = localStorage.getItem("token");

    const res = await API.get(
      `/complaints/${complaint.id}/comments`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    

    setSelectedComplaintForComments({
      ...complaint,
      comments: res.data.comments,
    });

    setNewComment("");
    document.body.classList.add("modal-open");

  } catch (error) {
    console.error(error);
  }
};

  const closeComments = () => {
    setSelectedComplaintForComments(null);
    setNewComment("");
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
  try {
    const token = localStorage.getItem("token");

    if (type === "up") {
      await API.post(
        `/complaints/${complaintId}/upvote`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }

    if (type === "down") {
      await API.post(
        `/complaints/${complaintId}/downvote`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }

    Swal.fire({
      icon: "success",
      title: "Vote updated",
      timer: 1000,
      showConfirmButton: false,
    });

  } catch (error) {
    console.error(error);
    Swal.fire("Error", "Vote failed", "error");
  }
};

  const handleAddComment = async () => {
  const complaintId = selectedComplaintForComments?.id;
  const text = newComment.trim();

  if (!complaintId || !text) return;

  try {
    const token = localStorage.getItem("token");

    // Add comment
    await API.post(
      `/complaints/${complaintId}/comment`,
      { text },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    const commentRes = await API.get(
  `/complaints/${complaintId}/comments`,
  {
    headers: { Authorization: `Bearer ${token}` }
  }
);

setSelectedComplaintForComments({
  ...selectedComplaintForComments,
  comments: commentRes.data.comments
});

    // reload complaints
    const endpoint = isPrivilegedViewer
      ? "/complaints"
      : "/complaints/my-complaints";

    const res = await API.get(endpoint, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const list = res.data?.complaints || [];
    setComplaints(list.map((item) => normalizeComplaint(item, user)));

    setNewComment("");

  } catch (error) {
    console.error(error);
  }
};

  const handleDeleteComment = (complaintId, commentId) => {
    updateEngagement(complaintId, (existing) => ({
      ...existing,
      comments: (existing.comments || []).filter((comment) => comment.id !== commentId),
    }));
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
              {isPrivilegedViewer
                ? "Viewing complaint data from the backend complaint service."
                : "This backend currently exposes only your submitted complaints for user accounts."}
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
              {filteredComplaints.map((complaint) => {
                const priorityColor = priorityColors[complaint.priority] || "#6b7280";
                const statusColor = statusColors[complaint.status] || "#4b5563";
                const complaintEngagement = getComplaintEngagement(complaint.id);
                const upvotes = complaint.upvotes || 0;
                const downvotes = complaint.downvotes || 0;
                const commentsCount = complaint.comments ||0;
                const hasUpvoted = complaintEngagement.upvotes.includes(currentUserKey);
                const hasDownvoted = complaintEngagement.downvotes.includes(currentUserKey);

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
                            className={`action-btn btn-vote ${hasUpvoted ? "active-up" : ""}`}
                            onClick={(event) => {
                              event.stopPropagation();
                              handleVote(complaint.id, "up");
                            }}
                          >
                            <i className="bi bi-hand-thumbs-up" /> {upvotes}
                          </button>
                          <button
                            type="button"
                            className={`action-btn btn-vote ${hasDownvoted ? "active-down" : ""}`}
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
              })}
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
              {getComplaintEngagement(selectedComplaintForComments.id).comments.length > 0 ? (
                getComplaintEngagement(selectedComplaintForComments.id).comments.map((comment) => {
                  const isAuthor = comment.authorId === currentUserKey;

                  return (
                    <article key={comment.id} className="comment-card">
                      <div className="comment-top">
                        <strong>{comment.authorName}</strong>
                        <span>{formatDistanceToNow(comment.createdAt)}</span>
                      </div>
                      <p>{comment.text}</p>
                      {isAuthor ? (
                        <button
                          type="button"
                          className="comment-delete"
                          onClick={() =>
                            handleDeleteComment(selectedComplaintForComments.id, comment.id)
                          }
                        >
                          Delete
                        </button>
                      ) : null}
                    </article>
                  );
                })
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
