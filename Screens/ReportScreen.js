import React from "react";
import { MapPin, Camera, Send } from "lucide-react-native";
import Header from "../components/Header";

const ReportScreen = ({
  setActiveScreen,
  categories,
  selectedCategory,
  setSelectedCategory,
  location,
  imageUploaded,
  handleImageUpload,
  reportText,
  setReportText,
  handleSubmitReport,
}) => (
  <div className="max-w-md mx-auto bg-white min-h-screen">
    <Header title="Report Issue" showBack onBack={() => setActiveScreen("home")} />

    <div className="p-4 space-y-6">
      {/* Location */}
      <div className="bg-blue-50 rounded-xl p-4">
        <div className="flex items-center space-x-3 mb-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          <span className="font-semibold text-gray-800">Location</span>
        </div>
        <p className="text-sm text-gray-600 ml-8">{location}</p>
      </div>

      {/* Category Selection */}
      <div>
        <label className="font-semibold text-gray-800 mb-3 block">Select Category *</label>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-3 rounded-xl border-2 transition-all ${
                selectedCategory === category.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="text-2xl mb-1">{category.icon}</div>
              <div className="text-sm font-medium text-gray-700">{category.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <label className="font-semibold text-gray-800 mb-3 block">Add Photo</label>
        <button
          onClick={handleImageUpload}
          className={`w-full border-2 border-dashed rounded-xl p-6 transition-all ${
            imageUploaded ? "border-green-300 bg-green-50" : "border-gray-300 bg-gray-50"
          }`}
        >
          <Camera
            className={`w-8 h-8 mx-auto mb-2 ${
              imageUploaded ? "text-green-600" : "text-gray-400"
            }`}
          />
          <p className={`text-sm ${imageUploaded ? "text-green-700" : "text-gray-600"}`}>
            {imageUploaded ? "✓ Photo uploaded successfully" : "Tap to add photo"}
          </p>
        </button>
      </div>

      {/* Description */}
      <div>
        <label className="font-semibold text-gray-800 mb-3 block">Description *</label>
        <textarea
          value={reportText}
          onChange={(e) => setReportText(e.target.value)}
          placeholder="Describe the issue in detail..."
          className="w-full border border-gray-300 rounded-xl p-3 h-24 resize-none focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmitReport}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-xl font-semibold flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all"
      >
        <Send className="w-5 h-5" />
        <span>Submit Report</span>
      </button>
    </div>
  </div>
);

export default ReportScreen;
