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
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image // ← Make sure to import Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";
import API from "../utils/api";

// Add your API base URL here
const API_BASE_URL = " https://328cba2ecf5e.ngrok-free.app"; // ← REPLACE WITH YOUR ACTUAL IP AND PORT
// Example: const API_BASE_URL = "http://192.168.1.100:3000";

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

// Time ago function for comments
const timeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return "just now";
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  
  return date.toLocaleDateString();
};

const CommentItem = ({ comment }) => (
  <View style={styles.commentItem}>
    <View style={styles.avatar}>
      <Ionicons name="person" size={20} color="#3B82F6" />
    </View>
    <View style={styles.commentContent}>
      <View style={styles.commentHeader}>
        <Text style={styles.commentUsername}>{comment.user?.username || "Anonymous"}</Text>
        <Text style={styles.commentTime}>{timeAgo(comment.createdAt)}</Text>
      </View>
      <Text style={styles.commentText}>{comment.text}</Text>
      <View style={styles.commentActions}>
        <TouchableOpacity style={styles.commentAction}>
          <Ionicons name="heart-outline" size={14} color="#6B7280" />
          <Text style={styles.commentActionText}>Like</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.commentAction}>
          <Text style={styles.commentActionText}>Reply</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const FeedScreen = ({ navigation }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentModal, setCommentModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [commentsList, setCommentsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [postTitle, setPostTitle] = useState("");

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

  const searchPosts = async () => {
    if (!searchQuery.trim()) {
      fetchReports();
      return;
    }
    setLoading(true);
    try {
      const res = await API.get(`/posts/search?q=${encodeURIComponent(searchQuery)}`);
      setReports(res.data.posts || []);
    } catch (err) {
      console.error("❌ Error searching posts:", err.message);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    fetchReports();
  };

  const toggleLike = async (postId) => {
    try {
      await API.post(`/posts/${postId}/like`);
      fetchReports();
    } catch (err) {
      console.error("❌ Error liking post:", err.message);
    }
  };

  const addComment = async () => {
    if (!commentText.trim()) return;
    try {
      await API.post(`/posts/${selectedPost}/comment`, { text: commentText });
      setCommentText("");
      
      // Refresh comments after adding a new one
      const res = await API.get(`/posts/${selectedPost}`);
      setCommentsList(res.data.comments || []);
    } catch (err) {
      console.error("❌ Error adding comment:", err.message);
    }
  };

  const openCommentModal = async (postId, title) => {
    setSelectedPost(postId);
    setPostTitle(title || "Comments");
    try {
      const res = await API.get(`/posts/${postId}`);
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
        onBack={() => navigation.goBack()}
      />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
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
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={searchPosts}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#3B82F6"
          style={{ marginTop: 20 }}
        />
      ) : (
        <ScrollView
          style={styles.feedContainer}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {reports.length === 0 ? (
            <Text style={{ textAlign: "center", marginTop: 20, color: "#6B7280" }}>
              No posts found
            </Text>
          ) : (
            reports.map((report) => (
              <View key={report._id} style={styles.reportCard}>
                {/* Header */}
                <View style={styles.reportHeader}>
                  <View style={styles.userInfo}>
                    <View style={styles.avatar}>
                      <Ionicons name="person" size={20} color="#3B82F6" />
                    </View>
                    <View>
                      <Text style={styles.userName}>{report.user?.username || "Anonymous"}</Text>
                      <Text style={styles.timeAgo}>
                        {new Date(report.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.statusBadge, getStatusStyle("Pending")]}>
                    <Text style={styles.statusText}>Pending</Text>
                  </View>
                </View>

                {report.title && (
  <Text style={styles.postTitle}>{report.title}</Text>
)}

<Text style={styles.description}>{report.description || "No description"}</Text>
{/* Updated Image Display - Use API call URL */}
{report.media && report.media.length > 0 && (
  <View style={styles.imageContainer}>
    <Image
      source={{
        uri: `https://328cba2ecf5e.ngrok-free.app/${report.media[0]
          .split("/")
          .pop()}`, // ensures only filename is used
      }}
      style={styles.reportImage}
      resizeMode="cover"
      onError={(error) => console.log("Image loading error:", error.nativeEvent)}
    />
  </View>
)}


{/* Updated Location Display - Shows coordinates properly */}
<View style={styles.locationContainer}>
  <Ionicons name="location" size={12} color="#6B7280" />
  <Text style={styles.locationText}>
    {report.location?.coordinates ? 
      `Lat: ${report.location.coordinates[1]?.toFixed(4)}, Lng: ${report.location.coordinates[0]?.toFixed(4)}` 
      : "No location"
    }
  </Text>
</View>
                <View style={styles.actionsContainer}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => toggleLike(report._id)}
                  >
                    <Ionicons
                      name={report.isLikedByUser ? "heart" : "heart-outline"}
                      size={16}
                      color={report.isLikedByUser ? "#EF4444" : "#6B7280"}
                    />
                    <Text style={styles.actionText}>
                      {report.likesCount || 0}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => openCommentModal(report._id, report.title)}
                  >
                    <Ionicons
                      name="chatbubble-outline"
                      size={16}
                      color="#6B7280"
                    />
                    <Text style={styles.actionText}>
                      {report.commentsCount || 0}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity>
                    <Text style={styles.viewDetailsText}>View Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}

      {/* Instagram/YouTube Style Comment Modal */}
      <Modal visible={commentModal} animationType="slide" transparent={false}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={() => setCommentModal(false)}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{postTitle}</Text>
            <View style={{ width: 24 }} /> {/* Spacer for balance */}
          </View>

          {/* Comments List */}
          <FlatList
            data={commentsList}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <CommentItem comment={item} />}
            contentContainerStyle={styles.commentsList}
            ListEmptyComponent={
              <View style={styles.emptyComments}>
                <Ionicons name="chatbubble-outline" size={48} color="#E5E7EB" />
                <Text style={styles.emptyCommentsText}>No comments yet</Text>
                <Text style={styles.emptyCommentsSubtext}>
                  Be the first to comment
                </Text>
              </View>
            }
          />

          {/* Comment Input - Fixed at bottom */}
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.commentInputContainer}
          >
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.commentInput}
                placeholder="Add a comment..."
                placeholderTextColor="#9CA3AF"
                value={commentText}
                onChangeText={setCommentText}
                multiline
              />
              <TouchableOpacity 
                onPress={addComment}
                disabled={!commentText.trim()}
                style={[
                  styles.postButton,
                  !commentText.trim() && styles.postButtonDisabled
                ]}
              >
                <Text style={styles.postButtonText}>Post</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
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
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    backgroundColor: "white",
    paddingRight: 35,
  },
  searchIcon: { position: "absolute", left: 12, zIndex: 1 },
  clearButton: { position: "absolute", right: 10, zIndex: 1 },
  searchInput: {
    flex: 1,
    paddingLeft: 40,
    paddingVertical: 8,
    fontSize: 14,
    color: "#111827",
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
  postTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#1F2937",
  },
  description: {
    color: "#1F2937",
    marginBottom: 12,
    fontSize: 14,
    lineHeight: 20,
  },
  // Updated image styles
  imageContainer: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  reportImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
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
  
  // New comment modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  commentsList: {
    padding: 16,
    paddingBottom: 80, // Space for input
  },
  commentItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  commentContent: {
    flex: 1,
    marginLeft: 12,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  commentUsername: {
    fontWeight: "600",
    fontSize: 14,
    color: "#1F2937",
    marginRight: 8,
  },
  commentTime: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  commentText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
    marginBottom: 8,
  },
  commentActions: {
    flexDirection: "row",
  },
  commentAction: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  commentActionText: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 4,
  },
  emptyComments: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyCommentsText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 16,
  },
  emptyCommentsSubtext: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 4,
  },
  commentInputContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    padding: 16,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    color: "#1F2937",
    maxHeight: 100,
    marginRight: 8,
  },
  postButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  postButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  postButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default FeedScreen;