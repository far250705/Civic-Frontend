import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";
import API from "../utils/api";

const getStatusStyle = (status) => {
  switch (status) {
    case "Resolved":
      return { backgroundColor: "#DCFCE7" };
    case "In Progress":
      return { backgroundColor: "#FFEDD5" };
    case "Pending":
      return { backgroundColor: "#FEF3C7" };
    default:
      return { backgroundColor: "#E5E7EB" };
  }
};

const FeedScreen = ({ navigation }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentModal, setCommentModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [commentsList, setCommentsList] = useState([]);

  const fetchReports = async () => {
    try {
      const res = await API.get("/posts/paginated");
      setReports(res.data.posts || []);
    } catch (err) {
      console.error("❌ Error fetching reports:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (postId) => {
    try {
      await API.post(`/posts/${postId}/like`);
      fetchReports(); // refresh after like/unlike
    } catch (err) {
      console.error("❌ Error liking post:", err.message);
    }
  };

  const addComment = async () => {
    if (!commentText.trim()) return;

    try {
      await API.post(`/posts/${selectedPost}/comment`, { text: commentText });
      setCommentText("");
      setCommentModal(false);
      fetchReports(); // refresh after comment
    } catch (err) {
      console.error("❌ Error adding comment:", err.message);
    }
  };

  const openCommentModal = async (postId) => {
    setSelectedPost(postId);
    try {
      const res = await API.get(`/posts/${postId}`); // fetch single post with comments
      setCommentsList(res.data.comments || []);
    } catch (err) {
      console.error("❌ Error fetching comments:", err.message);
    } finally {
      setCommentModal(true);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <View style={styles.container}>
      <Header
        title="Community Feed"
        showBack
        onBack={() => navigation.navigate("Home")}
      />

      {/* Search & Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchRow}>
          <View style={styles.searchInputContainer}>
            <Ionicons
              name="search"
              size={16}
              color="#9CA3AF"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search issues..."
              placeholderTextColor="#9CA3AF"
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="filter" size={16} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Loading */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#3B82F6"
          style={{ marginTop: 20 }}
        />
      ) : (
        <ScrollView style={styles.feedContainer}>
          {reports.map((report) => (
            <View key={report._id} style={styles.reportCard}>
              {/* Header */}
              <View style={styles.reportHeader}>
                <View style={styles.userInfo}>
                  <View style={styles.avatar}>
                    <Ionicons name="person" size={20} color="#3B82F6" />
                  </View>
                  <View>
                    <Text style={styles.userName}>
                      {report.user?.username}
                    </Text>
                    <Text style={styles.timeAgo}>
                      {new Date(report.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
                <View style={[styles.statusBadge, getStatusStyle("Pending")]}>
                  <Text style={styles.statusText}>Pending</Text>
                </View>
              </View>

              {/* Category */}
              <View style={styles.categoryContainer}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>
                    {report.category || "General"}
                  </Text>
                </View>
              </View>

              {/* Content */}
              <Text style={styles.description}>{report.description}</Text>

              {/* Image */}
              {report.media && report.media.length > 0 && (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="camera" size={32} color="#9CA3AF" />
                  <Text style={{ fontSize: 12, color: "#6B7280" }}>
                    {report.media[0]}
                  </Text>
                </View>
              )}

              {/* Location */}
              <View style={styles.locationContainer}>
                <Ionicons name="location" size={12} color="#6B7280" />
                <Text style={styles.locationText}>
                  {report.location?.coordinates?.join(", ")}
                </Text>
              </View>

              {/* Actions */}
              <View style={styles.actionsContainer}>
                {/* Like */}
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => toggleLike(report._id)}
                >
                  <Ionicons
                    name={report.isLikedByUser ? "heart" : "heart-outline"}
                    size={16}
                    color={report.isLikedByUser ? "#EF4444" : "#6B7280"}
                  />
                  <Text style={styles.actionText}>{report.likesCount || 0}</Text>
                </TouchableOpacity>

                {/* Comment */}
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => openCommentModal(report._id)}
                >
                  <Ionicons name="chatbubble-outline" size={16} color="#6B7280" />
                  <Text style={styles.actionText}>
                    {report.commentsCount || 0}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity>
                  <Text style={styles.viewDetailsText}>View Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Comment Modal */}
      <Modal visible={commentModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{ fontWeight: "600", marginBottom: 10 }}>
              Comments
            </Text>

            <ScrollView style={{ maxHeight: 200, marginBottom: 12 }}>
              {commentsList.length === 0 ? (
                <Text style={{ color: "#6B7280" }}>No comments yet</Text>
              ) : (
                commentsList.map((comment) => (
                  <View
                    key={comment._id}
                    style={{
                      paddingVertical: 6,
                      borderBottomWidth: 1,
                      borderBottomColor: "#E5E7EB",
                    }}
                  >
                    <Text style={{ fontWeight: "600" }}>
                      {comment.user?.username || "Unknown"}
                    </Text>
                    <Text style={{ color: "#374151" }}>{comment.text}</Text>
                  </View>
                ))
              )}
            </ScrollView>

            <TextInput
              style={styles.commentInput}
              placeholder="Write your comment..."
              value={commentText}
              onChangeText={setCommentText}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => setCommentModal(false)}
                style={styles.cancelButton}
              >
                <Text style={{ color: "#6B7280" }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={addComment} style={styles.postButton}>
                <Text style={{ color: "white" }}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  searchContainer: {
    padding: 16,
    backgroundColor: "#F9FAFB",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  searchRow: { flexDirection: "row", gap: 8 },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  searchIcon: { position: "absolute", left: 12, zIndex: 1 },
  searchInput: {
    flex: 1,
    paddingLeft: 40,
    paddingRight: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    backgroundColor: "white",
    fontSize: 14,
  },
  filterButton: {
    padding: 8,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  feedContainer: { flex: 1 },
  reportCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  userInfo: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: "#DBEAFE",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  userName: { fontWeight: "600", fontSize: 14, color: "#1F2937" },
  timeAgo: { fontSize: 12, color: "#6B7280" },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: "500", color: "#1F2937" },
  categoryContainer: { marginBottom: 8 },
  categoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
  },
  categoryText: { fontSize: 12, fontWeight: "500", color: "#374151" },
  description: {
    color: "#1F2937",
    marginBottom: 12,
    fontSize: 14,
    lineHeight: 20,
  },
  imagePlaceholder: {
    backgroundColor: "#E5E7EB",
    borderRadius: 12,
    height: 120,
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 4,
  },
  locationText: { fontSize: 12, color: "#6B7280" },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  actionButton: { flexDirection: "row", alignItems: "center", gap: 4 },
  actionText: { fontSize: 14, color: "#6B7280" },
  viewDetailsText: { color: "#3B82F6", fontSize: 14, fontWeight: "500" },

  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    width: "90%",
  },
  commentInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
  },
  cancelButton: { padding: 8 },
  postButton: {
    padding: 8,
    backgroundColor: "#3B82F6",
    borderRadius: 8,
    alignItems: "center",
  },
});

export default FeedScreen;
