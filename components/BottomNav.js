import React from "react";
import { Home, Plus, List, User } from "lucide-react-native";

const BottomNav = ({ activeScreen, setActiveScreen }) => (
  <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 px-4 py-2">
    <div className="flex justify-around">
      {[
        { id: "home", icon: Home, label: "Home" },
        { id: "report", icon: Plus, label: "Report" },
        { id: "feed", icon: List, label: "Feed" },
        { id: "my-reports", icon: User, label: "My Reports" },
      ].map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveScreen(item.id)}
          className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
            activeScreen === item.id
              ? "text-blue-600 bg-blue-50"
              : "text-gray-600"
          }`}
        >
          <item.icon className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">{item.label}</span>
        </button>
      ))}
    </div>
  </div>
);

export default BottomNav;
