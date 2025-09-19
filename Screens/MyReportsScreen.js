import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";
import API from "../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MyReportsScreen = ({ navigation }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReport, setEditingReport] = useState(null);
  const [newDescription, setNewDescription] = useState("");
  
  // Review modal states
  const [reviewModal, setReviewModal] = useState(false);
  const [selectedReportForReview, setSelectedReportForReview] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Unauthorized", "Please log in again");
        setLoading(false);
        return;
      }

      const res = await API.get("posts/my/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setReports(res.data.posts || []);
    } catch (err) {
      console.error("Fetch reports error:", err.response?.data || err.message);
      Alert.alert("Error", err.response?.data?.msg || "Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const getMediaUrl = (path) => {
    if (!path) return null;
    return `https://16c1d075f31f.ngrok-free.app/${path.replace("\\", "/")}`;
  };

  const handleEditPost = async () => {
    if (!editingReport) return;

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return Alert.alert("Unauthorized", "Please log in again");

      const res = await API.put(
        `posts/${editingReport._id}`,
        { description: newDescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert("Success", res.data.msg);
      setEditingReport(null);
      setNewDescription("");
      fetchReports();
    } catch (err) {
      console.error("Edit error:", err.response?.data || err.message);
      Alert.alert("Error", err.response?.data?.msg || "Failed to edit report");
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewText.trim() || !selectedReportForReview) return;

    setSubmittingReview(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Unauthorized", "Please log in again");
        return;
      }

      const res = await API.post(
        `posts/${selectedReportForReview}/review`,
        { reviewText: reviewText.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert("Success", "Review submitted successfully!");
      
      // Update the local state to mark this report as reviewed
      setReports(prevReports =>
        prevReports.map(report =>
          report._id === selectedReportForReview
            ? { ...report, hasUserReviewed: true }
            : report
        )
      );

      // Close modal and reset state
      setReviewModal(false);
      setReviewText("");
      setSelectedReportForReview(null);

    } catch (err) {
      console.error("Submit review error:", err.response?.data || err.message);
      Alert.alert("Error", err.response?.data?.msg || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const openReviewModal = (reportId) => {
    setSelectedReportForReview(reportId);
    setReviewText("");
    setReviewModal(true);
  };

  const closeReviewModal = () => {
    setReviewModal(false);
    setReviewText("");
    setSelectedReportForReview(null);
  };

  const canEdit = (createdAt) => {
    const diffMinutes =
      (new Date() - new Date(createdAt)) / 1000 / 60;
    return diffMinutes <= 5;
  };

  return (
    <View style={styles.container}>
      <Header title="My Reports" showBack onBack={() => navigation.goBack()} />

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : (
        <ScrollView style={styles.content}>
          {reports.length === 0 ? (
            <Text style={styles.noReports}>
              You haven't created any reports yet
            </Text>
          ) : (
            <View style={styles.reportsList}>
              {reports.map((report) => (
                <View key={report._id} style={styles.reportCard}>
                  <Text style={styles.description}>{report.description}</Text>

                  {report.media && report.media.length > 0 && (
                    <Image
                      source={{ uri: getMediaUrl(report.media[0]) }}
                      style={styles.image}
                      resizeMode="cover"
                    />
                  )}

                  <View style={styles.reportFooter}>
                    <View style={styles.userContainer}>
                      <Ionicons name="person" size={12} color="#6B7280" />
                      <Text style={styles.footerText}>
                        {report.user?.username}
                      </Text>
                    </View>

                    <View style={styles.locationContainer}>
                      <Ionicons name="location" size={12} color="#6B7280" />
                      <Text style={styles.footerText}>
                        {report.location?.coordinates?.[1]},
                        {report.location?.coordinates?.[0]}
                      </Text>
                    </View>

                    <View style={styles.timeContainer}>
                      <Ionicons name="time" size={12} color="#6B7280" />
                      <Text style={styles.footerText}>
                        {new Date(report.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>

                  {/* Action Buttons Container */}
                  <View style={styles.actionButtonsContainer}>
                    {canEdit(report.createdAt) && (
                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => {
                          setEditingReport(report);
                          setNewDescription(report.description);
                        }}
                      >
                        <Ionicons name="create" size={16} color="white" />
                        <Text style={styles.editText}>Edit</Text>
                      </TouchableOpacity>
                    )}

                    {/* Review Button - Only show if user hasn't reviewed yet */}
                    {!report.hasUserReviewed && (
                      <TouchableOpacity
                        style={styles.reviewButton}
                        onPress={() => openReviewModal(report._id)}
                      >
                        <Ionicons name="star" size={16} color="white" />
                        <Text style={styles.reviewText}>Review</Text>
                      </TouchableOpacity>
                    )}

                    {/* Show "Reviewed" indicator if already reviewed */}
                    {report.hasUserReviewed && (
                      <View style={styles.reviewedIndicator}>
                        <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                        <Text style={styles.reviewedText}>Reviewed</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}

      {/* Edit Modal */}
      <Modal visible={!!editingReport} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Report</Text>
            <TextInput
              style={styles.input}
              value={newDescription}
              onChangeText={setNewDescription}
              multiline
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setEditingReport(null)}
              >
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleEditPost}
              >
                <Text style={styles.btnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Review Modal */}
      <Modal visible={reviewModal} animationType="slide" transparent={false}>
        <View style={styles.reviewModalContainer}>
          {/* Header */}
          <View style={styles.reviewModalHeader}>
            <TouchableOpacity 
              onPress={closeReviewModal}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.reviewModalTitle}>Write a Review</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Review Content */}
          <View style={styles.reviewContent}>
            <View style={styles.reviewPromptContainer}>
              <Ionicons name="star" size={48} color="#3B82F6" />
              <Text style={styles.reviewPromptTitle}>Share Your Feedback</Text>
              <Text style={styles.reviewPromptSubtext}>
                Help us improve by sharing your experience with this report
              </Text>
            </View>

            <View style={styles.reviewInputContainer}>
              <TextInput
                style={styles.reviewInput}
                placeholder="Write your review here..."
                placeholderTextColor="#9CA3AF"
                value={reviewText}
                onChangeText={setReviewText}
                multiline
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Submit Button - Fixed at bottom */}
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.reviewSubmitContainer}
          >
            <TouchableOpacity 
              onPress={handleSubmitReview}
              disabled={!reviewText.trim() || submittingReview}
              style={[
                styles.submitButton,
                (!reviewText.trim() || submittingReview) && styles.submitButtonDisabled
              ]}
            >
              {submittingReview ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <Ionicons name="send" size={16} color="white" />
                  <Text style={styles.submitButtonText}>Submit Review</Text>
                </>
              )}
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  content: { flex: 1, padding: 16 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  noReports: {
    textAlign: "center",
    marginTop: 20,
    color: "#6B7280",
    fontSize: 16,
  },
  reportsList: { gap: 12 },
  reportCard: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  description: {
    fontSize: 14,
    color: "#1F2937",
    marginBottom: 8,
    lineHeight: 20,
    fontWeight: "500",
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    marginBottom: 8,
  },
  reportFooter: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 8,
  },
  userContainer: { flexDirection: "row", alignItems: "center", gap: 4 },
  locationContainer: { flexDirection: "row", alignItems: "center", gap: 4 },
  timeContainer: { flexDirection: "row", alignItems: "center", gap: 4 },
  footerText: { fontSize: 12, color: "#6B7280" },
  
  // Action buttons container
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 12,
    gap: 8,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563EB",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 4,
  },
  editText: { 
    color: "white", 
    fontSize: 12, 
    fontWeight: "600" 
  },
  reviewButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3B82F6",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 4,
  },
  reviewText: { 
    color: "white", 
    fontSize: 12, 
    fontWeight: "600" 
  },
  reviewedIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  reviewedText: { 
    color: "#10B981", 
    fontSize: 12, 
    fontWeight: "600" 
  },
  
  // Edit modal styles (existing)
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    width: "85%",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    minHeight: 80,
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  cancelBtn: {
    backgroundColor: "#9CA3AF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  saveBtn: {
    backgroundColor: "#2563EB",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  btnText: { color: "white", fontWeight: "600" },

  // Review modal styles
  reviewModalContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  reviewModalHeader: {
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
  reviewModalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  reviewContent: {
    flex: 1,
    padding: 16,
  },
  reviewPromptContainer: {
    alignItems: "center",
    marginBottom: 32,
    paddingTop: 32,
  },
  reviewPromptTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937",
    marginTop: 16,
    marginBottom: 8,
  },
  reviewPromptSubtext: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
  reviewInputContainer: {
    flex: 1,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#1F2937",
    minHeight: 120,
    textAlignVertical: "top",
  },
  reviewSubmitContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  submitButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  submitButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default MyReportsScreen;