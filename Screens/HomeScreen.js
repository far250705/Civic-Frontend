import React from "react";
import { Plus, List, User, MapPin } from "lucide-react-native";
import Header from "../components/Header";

const HomeScreen = ({ setActiveScreen, mockReports, getStatusColor }) => (
  <div className="max-w-md mx-auto bg-white min-h-screen">
    <Header title="Civic Reporter" />

    {/* Quick Stats */}
    <div className="p-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-xl p-3 shadow-sm text-center">
          <div className="text-2xl font-bold text-blue-600">247</div>
          <div className="text-xs text-gray-600">Total Reports</div>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm text-center">
          <div className="text-2xl font-bold text-green-600">189</div>
          <div className="text-xs text-gray-600">Resolved</div>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm text-center">
          <div className="text-2xl font-bold text-orange-600">58</div>
          <div className="text-xs text-gray-600">In Progress</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <button
          onClick={() => setActiveScreen("report")}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-xl flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="w-6 h-6" />
          <span className="font-semibold">Report New Issue</span>
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setActiveScreen("feed")}
            className="bg-white border border-gray-200 p-3 rounded-xl flex items-center justify-center space-x-2 hover:bg-gray-50"
          >
            <List className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-700">View Feed</span>
          </button>
          <button
            onClick={() => setActiveScreen("my-reports")}
            className="bg-white border border-gray-200 p-3 rounded-xl flex items-center justify-center space-x-2 hover:bg-gray-50"
          >
            <User className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-700">My Reports</span>
          </button>
        </div>
      </div>
    </div>

    {/* Recent Activity */}
    <div className="p-4">
      <h2 className="font-bold text-lg mb-3 text-gray-800">Recent in Your Area</h2>
      <div className="space-y-3">
        {mockReports.slice(0, 2).map((report) => (
          <div key={report.id} className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  report.status
                )}`}
              >
                {report.status}
              </span>
              <span className="text-xs text-gray-500">{report.timeAgo}</span>
            </div>
            <p className="font-medium text-gray-800 mb-1">{report.description}</p>
            <p className="text-xs text-gray-600 flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              {report.location}
            </p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default HomeScreen;
