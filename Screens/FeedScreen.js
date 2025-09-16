import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';

const FeedScreen = ({ setActiveScreen, mockReports, getStatusColor }) => {
  return (
    <View style={styles.container}>
      <Header 
        title="Community Feed" 
        showBack 
        onBack={() => setActiveScreen("home")} 
      />
      
      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchRow}>
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
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="filter" size={16} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Feed Items */}
      <ScrollView style={styles.feedContainer}>
        {mockReports.map((report) => (
          <View key={report.id} style={styles.reportCard}>
            {/* Header */}
            <View style={styles.reportHeader}>
              <View style={styles.userInfo}>
                <View style={styles.avatar}>
                  <Ionicons name="person" size={20} color="#3B82F6" />
                </View>
                <View>
                  <Text style={styles.userName}>{report.user}</Text>
                  <Text style={styles.timeAgo}>{report.timeAgo}</Text>
                </View>
              </View>
              <View style={[styles.statusBadge, getStatusColor(report.status)]}>
                <Text style={styles.statusText}>{report.status}</Text>
              </View>
            </View>

            {/* Category */}
            <View style={styles.categoryContainer}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{report.category}</Text>
              </View>
            </View>

            {/* Content */}
            <Text style={styles.description}>{report.description}</Text>

            {/* Image placeholder */}
            {report.image && (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="camera" size={32} color="#9CA3AF" />
              </View>
            )}

            {/* Location */}
            <View style={styles.locationContainer}>
              <Ionicons name="location" size={12} color="#6B7280" />
              <Text style={styles.locationText}>{report.location}</Text>
            </View>

            {/* Actions */}
            <View style={styles.actionsContainer}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="heart-outline" size={16} color="#6B7280" />
                <Text style={styles.actionText}>{report.likes}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="chatbubble-outline" size={16} color="#6B7280" />
                <Text style={styles.actionText}>{report.comments}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity>
                <Text style={styles.viewDetailsText}>View Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    maxWidth: 400,
    alignSelf: 'center',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchRow: {
    flexDirection: 'row',
    gap: 8,
  },
  searchInputContainer: {
    flex: 1,
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    paddingLeft: 40,
    paddingRight: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: 'white',
    fontSize: 14,
  },
  filterButton: {
    padding: 8,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedContainer: {
    flex: 1,
  },
  reportCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: '#DBEAFE',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontWeight: '600',
    fontSize: 14,
    color: '#1F2937',
  },
  timeAgo: {
    fontSize: 12,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  categoryContainer: {
    marginBottom: 8,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  description: {
    color: '#1F2937',
    marginBottom: 12,
    fontSize: 14,
    lineHeight: 20,
  },
  imagePlaceholder: {
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    height: 192,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#6B7280',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 14,
    color: '#6B7280',
  },
  viewDetailsText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default FeedScreen;