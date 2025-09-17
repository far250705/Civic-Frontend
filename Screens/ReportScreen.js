// ReportScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";

const defaultCategories = [
  { id: 1, name: "Road", icon: "🛣️" },
  { id: 2, name: "Garbage", icon: "🗑️" },
  { id: 3, name: "Street Light", icon: "💡" },
];

const ReportScreen = ({ navigation }) => {
  const [categories] = useState(defaultCategories);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [reportText, setReportText] = useState("");
  const [imageUploaded, setImageUploaded] = useState(false);
  const location = "📍 Detecting location...";

  const handleImageUpload = () => {
    setImageUploaded(true); // Mock image upload
  };

  const handleSubmitReport = () => {
    if (!selectedCategory || !reportText) {
      alert("Please fill in all required fields!");
      return;
    }
    alert("✅ Report submitted successfully!");
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <Header title="Report Issue" showBack onBack={() => navigation.goBack()} />

      <ScrollView style={styles.content}>
        {/* Location */}
        <View style={styles.locationContainer}>
          <View style={styles.locationHeader}>
            <Ionicons name="location" size={20} color="#2563EB" />
            <Text style={styles.locationTitle}>Location</Text>
          </View>
          <Text style={styles.locationText}>{location}</Text>
        </View>

        {/* Category Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Select Category *</Text>
          <View style={styles.categoryGrid}>
            {(categories || []).map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => setSelectedCategory(category.id)}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.id
                    ? styles.categoryButtonSelected
                    : styles.categoryButtonDefault,
                ]}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Image Upload */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Add Photo</Text>
          <TouchableOpacity
            onPress={handleImageUpload}
            style={[
              styles.imageUploadButton,
              imageUploaded
                ? styles.imageUploadButtonSuccess
                : styles.imageUploadButtonDefault,
            ]}
          >
            <Ionicons
              name="camera"
              size={32}
              color={imageUploaded ? "#16A34A" : "#9CA3AF"}
              style={styles.cameraIcon}
            />
            <Text
              style={[
                styles.imageUploadText,
                imageUploaded
                  ? styles.imageUploadTextSuccess
                  : styles.imageUploadTextDefault,
              ]}
            >
              {imageUploaded
                ? "✓ Photo uploaded successfully"
                : "Tap to add photo"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Description *</Text>
          <TextInput
            value={reportText}
            onChangeText={setReportText}
            placeholder="Describe the issue in detail..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            style={styles.textArea}
            textAlignVertical="top"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity onPress={handleSubmitReport} style={styles.submitButton}>
          <Ionicons name="send" size={20} color="white" />
          <Text style={styles.submitButtonText}>Submit Report</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

// ... keep your styles same ...
const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: 'white' }, content: { flex: 1, padding: 16, }, locationContainer: { backgroundColor: '#EFF6FF', borderRadius: 12, padding: 16, marginBottom: 24, }, locationHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8, }, locationTitle: { fontWeight: '600', color: '#1F2937', fontSize: 16, }, locationText: { fontSize: 14, color: '#6B7280', marginLeft: 32, }, section: { marginBottom: 24, }, sectionLabel: { fontWeight: '600', color: '#1F2937', fontSize: 16, marginBottom: 12, }, categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between', }, categoryButton: { width: '47%', padding: 12, borderRadius: 12, borderWidth: 2, alignItems: 'center', justifyContent: 'center', minHeight: 80, }, categoryButtonDefault: { borderColor: '#E5E7EB', backgroundColor: 'white', }, categoryButtonSelected: { borderColor: '#3B82F6', backgroundColor: '#EFF6FF', }, categoryIcon: { fontSize: 24, marginBottom: 4, }, categoryName: { fontSize: 14, fontWeight: '500', color: '#374151', textAlign: 'center', }, imageUploadButton: { width: '100%', borderWidth: 2, borderStyle: 'dashed', borderRadius: 12, padding: 24, alignItems: 'center', justifyContent: 'center', }, imageUploadButtonDefault: { borderColor: '#D1D5DB', backgroundColor: '#F9FAFB', }, imageUploadButtonSuccess: { borderColor: '#BBF7D0', backgroundColor: '#F0FDF4', }, cameraIcon: { marginBottom: 8, }, imageUploadText: { fontSize: 14, textAlign: 'center', }, imageUploadTextDefault: { color: '#6B7280', }, imageUploadTextSuccess: { color: '#166534', }, textArea: { width: '100%', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, padding: 12, height: 96, fontSize: 16, color: '#1F2937', }, submitButton: { flexDirection: 'row', backgroundColor: '#2563EB', paddingVertical: 16, paddingHorizontal: 20, borderRadius: 12, alignItems: 'center', justifyContent: 'center', gap: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4, }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 6, marginBottom: 20, }, submitButtonText: { color: 'white', fontSize: 16, fontWeight: '600', }, });
export default ReportScreen;
