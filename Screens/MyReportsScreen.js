import React from "react";
import { MapPin, Clock } from "lucide-react-native";
import Header from "../components/Header";

const MyReportsScreen = ({ setActiveScreen, mockReports, getStatusColor }) => (
  <div className="max-w-md mx-auto bg-white min-h-screen">
    <Header title="My Reports" showBack onBack={() => setActiveScreen("home")} />

    <div className="p-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-blue-50 rounded-xl p-3 text-center">
          <div className="text-lg font-bold text-blue-600">8</div>
          <div className="text-xs text-gray-600">Total</div>
        </div>
        <div className="bg-green-50 rounded-xl p-3 text-center">
          <div className="text-lg font-bold text-green-600">5</div>
          <div className="text-xs text-gray-600">Resolved</div>
        </div>
        <div className="bg-orange-50 rounded-xl p-3 text-center">
          <div className="text-lg font-bold text-orange-600">3</div>
          <div className="text-xs text-gray-600">Pending</div>
        </div>
      </div>

      {/* My Reports List */}
      <div className="space-y-3">
        {[...mockReports, {
          id: 4,
          category: "Water Supply",
          description: "Low water pressure in residential area",
          location: "Housing Colony, Ranchi",
          timeAgo: "3 days ago",
          status: "In Progress",
        }].map((report) => (
          <div key={report.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-gray-700">{report.category}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                {report.status}
              </span>
            </div>
            <p className="text-sm text-gray-800 mb-2">{report.description}</p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                {report.location}
              </span>
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {report.timeAgo}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default MyReportsScreen;
