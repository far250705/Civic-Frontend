import React from 'react';
import { Bell, User } from 'lucide-react-native';

const Header = ({ title, onBack }) => (
  <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-3xl shadow-lg">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        {onBack && (
          <button onClick={onBack} className="p-1">←</button>
        )}
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
      <div className="flex items-center space-x-3">
        <Bell className="w-6 h-6" />
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-blue-600" />
        </div>
      </div>
    </div>
  </div>
);

export default Header;
