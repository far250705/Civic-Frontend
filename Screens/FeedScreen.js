import React from "react";
import { Search, Filter, Camera, MapPin, Heart, MessageCircle, User } from "lucide-react-native";
import Header from "../components/Header";

const FeedScreen = ({ setActiveScreen, mockReports, getStatusColor }) => (
  <div className="max-w-md mx-auto bg-white min-h-screen">
    <Header title="Community Feed" showBack onBack={() => setActiveScreen("home")} />

    {/* Search and Filter */}
    <div className="p-4 bg-gray-50 border-b">
      <div className="flex space-x-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search issues..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          />
        </div>
        <button className="p-2 bg-white border border-gray-300 rounded-lg">
          <Filter className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>

    {/* Feed Items */}
    <div className="divide-y divide-gray-100">
      {mockReports.map((report) => (
        <div key={report.id} className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-800">{report.user}</p>
                <p className="text-xs text-gray-500">{report.timeAgo}</p>
              </div>
            </div>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                report.status
              )}`}
            >
              {report.status}
            </span>
          </div>

          {/* Category */}
          <div className="mb-2">
            <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
              {report.category}
            </span>
          </div>

          {/* Content */}
          <p className="text-gray-800 mb-3 text-sm leading-relaxed">{report.description}</p>

          {/* Image placeholder */}
          {report.image && (
            <div className="bg-gray-200 rounded-xl h-48 mb-3 flex items-center justify-center">
              <Camera className="w-8 h-8 text-gray-400" />
            </div>
          )}

          {/* Location */}
          <p className="text-xs text-gray-600 mb-3 flex items-center">
            <MapPin className="w-3 h-3 mr-1" />
            {report.location}
          </p>

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <button className="flex items-center space-x-1 text-gray-600 hover:text-red-500">
              <Heart className="w-4 h-4" />
              <span className="text-sm">{report.likes}</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-500">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">{report.comments}</span>
            </button>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default FeedScreen;
