// ReportScreen.js
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Image,
  Animated,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import * as Location from "expo-location";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";
import API from "../utils/api";
import home from "./HomeScreen";

const defaultCategories = [
  { id: 1, name: "Road", icon: "🛣️" },
  { id: 2, name: "Garbage", icon: "🗑️" },
  { id: 3, name: "Street Light", icon: "💡" },
];

const ReportScreen = ({ navigation, setActiveScreen }) => {
  const [categories] = useState(defaultCategories);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [reportText, setReportText] = useState("");
  const [image, setImage] = useState(null);
  const [voiceMsg, setVoiceMsg] = useState(null);
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUri, setRecordedUri] = useState(null);
  const [recordedDuration, setRecordedDuration] = useState(0); // in ms
  const [currentDuration, setCurrentDuration] = useState(0);
  const progressWidth = useRef(new Animated.Value(0)).current;
  const recordingTimer = useRef(null);
  const [location, setLocation] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // ✅ Get location on mount
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Location permission is required!");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  // ✅ Pick an image
  const handleImageUpload = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.status !== "granted") {
      Alert.alert("Permission denied", "You need to allow gallery access!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // ✅ Pick a voice message
  // Voice recording feature
  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== "granted") {
        Alert.alert("Permission denied", "You need to allow microphone access!");
        return;
      }
      setIsRecording(true);
      setCurrentDuration(0);
      
      // Reset and start the progress animation
      progressWidth.setValue(0);
      Animated.timing(progressWidth, {
        toValue: 1,
        duration: 300000, // 5 minutes maximum
        useNativeDriver: false
      }).start();

      // Start the timer
      recordingTimer.current = setInterval(() => {
        setCurrentDuration(prev => prev + 1000);
      }, 1000);

      // Try to set file extension to mp3 (actual format is AAC/m4a unless using custom native module)
      const options = {
        ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
        android: {
          ...Audio.RecordingOptionsPresets.HIGH_QUALITY.android,
          extension: ".mp3", // This only changes the file name, not the encoding
        },
        ios: {
          ...Audio.RecordingOptionsPresets.HIGH_QUALITY.ios,
          extension: ".mp3", // This only changes the file name, not the encoding
        },
      };
      const { recording } = await Audio.Recording.createAsync(options);
      setRecording(recording);
    } catch (err) {
      Alert.alert("Recording error", err.message);
    }
  };

  const stopRecording = async () => {
    try {
  await recording.stopAndUnloadAsync();
  const uri = recording.getURI();
  const status = await recording.getStatusAsync();
  setRecordedUri(uri);
  setRecordedDuration(status.durationMillis || 0);
  // Name as .mp3 for upload, but actual format is AAC/m4a
  setVoiceMsg({ uri, name: "voice-message.mp3", type: "audio/mp3" });
  setRecording(null);
  setIsRecording(false);
    } catch (err) {
      Alert.alert("Stop recording error", err.message);
    }
  };

  // ✅ Submit Report
  const handleSubmitReport = async () => {
    if (!location) {
      Alert.alert("Location required", "Please wait until your location is detected.");
      return;
    }
    if (!selectedCategory || !reportText || !image) {
      Alert.alert("⚠️ Please fill in all required fields (category, description, image)!");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append(
        "category",
        defaultCategories.find((c) => c.id === selectedCategory).name
      );
      formData.append("description", reportText);
      formData.append("media", {
        uri: image,
        type: "image/jpeg",
        name: "report_photo.jpg",
      });
      if (voiceMsg) {
        formData.append("voiceMsg", {
          uri: voiceMsg.uri,
          type: "audio/mpeg",
          name: voiceMsg.name || "voice.mp3",
        });
      }
      formData.append("latitude", location.latitude.toString());
      formData.append("longitude", location.longitude.toString());

      const response = await API.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200 || response.status === 201) {
        Alert.alert(
          "✅ Report Submitted",
          `Report submitted successfully!\n\n📍 Location: ${location}\n\nStatus: ${response.status}\n\nResponse: ${JSON.stringify(response.data)}`
        );
        if (setActiveScreen) {
          setActiveScreen("home");
        }
      } else {
        throw new Error("Unexpected status: " + response.status);
      }
    } catch (err) {
      Alert.alert(
        `Report submission failed!\n\n📍 Location: ${location}\n\nError: ${err.message}`
      );
    } finally {
      setSubmitting(false);
    }
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
          <Text style={styles.locationText}>
            {location
              ? `📍 ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
              : "📍 Detecting location..."}
          </Text>
        </View>

        {/* Category */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Select Category *</Text>
          <View style={styles.categoryGrid}>
            {categories.map((category) => (
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
          <Text style={styles.sectionLabel}>Add Photo *</Text>
          <TouchableOpacity
            onPress={handleImageUpload}
            style={[
              styles.imageUploadButton,
              image
                ? styles.imageUploadButtonSuccess
                : styles.imageUploadButtonDefault,
            ]}
          >
            <Ionicons
              name="camera"
              size={32}
              color={image ? "#16A34A" : "#9CA3AF"}
              style={styles.cameraIcon}
            />
            <Text
              style={[
                styles.imageUploadText,
                image
                  ? styles.imageUploadTextSuccess
                  : styles.imageUploadTextDefault,
              ]}
            >
              {image ? "✓ Photo selected" : "Tap to add photo"}
            </Text>
          </TouchableOpacity>

          {image && (
            <Image
              source={{ uri: image }}
              style={{
                width: "100%",
                height: 200,
                marginTop: 12,
                borderRadius: 12,
              }}
            />
          )}
        </View>

        {/* Voice Recorder */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Record Voice Message (optional)</Text>
          <View style={styles.recorderContainer}>
            {!isRecording ? (
              <TouchableOpacity
                onPress={startRecording}
                style={styles.voiceUploadButton}
              >
                <Ionicons name="mic" size={24} color="#6B7280" />
                <Text style={{ marginLeft: 8, color: "#374151" }}>
                  {recordedUri ? "Re-record" : "Start Recording"}
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.recordingContainer}>
                <View style={styles.recordingContent}>
                  <View style={styles.recordingIndicator} />
                  <View style={styles.progressContainer}>
                    <Animated.View 
                      style={[
                        styles.progressBar,
                        {
                          width: progressWidth.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0%', '100%']
                          })
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.durationText}>
                    {Math.floor(currentDuration / 1000)}s
                  </Text>
                  <TouchableOpacity
                    onPress={stopRecording}
                    style={styles.stopButton}
                  >
                    <Ionicons name="stop" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {recordedUri && !isRecording && (
              <View style={styles.recordedContainer}>
                <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
                <Text style={styles.recordedText}>
                  Voice message recorded • {Math.round(recordedDuration / 1000)}s
                </Text>
              </View>
            )}
          </View>
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

        {/* Submit */}
        <TouchableOpacity
          onPress={handleSubmitReport}
          style={[styles.submitButton, submitting && { opacity: 0.7 }]}
          disabled={submitting}
        >
          {submitting ? (
            <>
              <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.submitButtonText}>Submitting...</Text>
            </>
          ) : (
            <>
              <Ionicons name="send" size={20} color="white" />
              <Text style={styles.submitButtonText}>Submit Report</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  content: { flex: 1, padding: 16 },
  locationContainer: {
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  recorderContainer: {
    flexDirection: 'column',
    gap: 12,
  },
  recordingContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 25,
    padding: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  recordingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 36,
  },
  recordingIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
    marginLeft: 8,
  },
  progressContainer: {
    flex: 1,
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2563eb',
  },
  durationText: {
    marginHorizontal: 8,
    color: '#1f2937',
    fontWeight: '500',
    fontSize: 14,
    minWidth: 30,
  },
  stopButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#dc2626',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  recordedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
    marginLeft: 4,
  },
  recordedText: {
    color: '#374151',
    fontSize: 14,
  },
  locationHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  locationTitle: { fontWeight: "600", color: "#1F2937", fontSize: 16, marginLeft: 8 },
  locationText: { fontSize: 14, color: "#6B7280", marginLeft: 28 },
  section: { marginBottom: 24 },
  sectionLabel: { fontWeight: "600", color: "#1F2937", fontSize: 16, marginBottom: 12 },
  categoryGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  categoryButton: {
    width: "47%",
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 80,
    marginBottom: 12,
  },
  categoryButtonDefault: { borderColor: "#E5E7EB", backgroundColor: "white" },
  categoryButtonSelected: { borderColor: "#3B82F6", backgroundColor: "#EFF6FF" },
  categoryIcon: { fontSize: 24, marginBottom: 4 },
  categoryName: { fontSize: 14, fontWeight: "500", color: "#374151", textAlign: "center" },
  imageUploadButton: {
    width: "100%",
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  imageUploadButtonDefault: { borderColor: "#D1D5DB", backgroundColor: "#F9FAFB" },
  imageUploadButtonSuccess: { borderColor: "#BBF7D0", backgroundColor: "#F0FDF4" },
  cameraIcon: { marginBottom: 8 },
  imageUploadText: { fontSize: 14, textAlign: "center" },
  imageUploadTextDefault: { color: "#6B7280" },
  imageUploadTextSuccess: { color: "#166534" },
  voiceUploadButton: {
    flexDirection: "row",
    padding: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    alignItems: "center",
  },
  textArea: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    padding: 12,
    height: 96,
    fontSize: 16,
    color: "#1F2937",
  },
  submitButton: {
    flexDirection: "row",
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 20,
  },
  submitButtonText: { color: "white", fontSize: 16, fontWeight: "600", marginLeft: 8 },
});

export default ReportScreen;
