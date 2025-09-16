import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';

const MyReportsScreen = ({ setActiveScreen, mockReports, getStatusColor }) => {
  const allReports = [
    ...mockReports,
    {
      id: 4,
      category: "Water Supply",
      description: "Low water pressure in residential area",
      location: "Housing Colony, Ranchi",
      timeAgo: "3 days ago",
      status: "In Progress",
    }
  ];

  return (
    <View style={styles.container}>
      <Header 
        title="My Reports" 
        showBack 
        onBack={() => setActiveScreen("home")} 
      />

      <ScrollView style={styles.content}>
        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          
          <View style={[styles.statCard, styles.greenStatCard]}>
            <Text style={[styles.statNumber, styles.greenStatNumber]}>5</Text>
            <Text style={styles.statLabel}>Resolved</Text>
          </View>
          
          <View style={[styles.statCard, styles.orangeStatCard]}>
            <Text style={[styles.statNumber, styles.orangeStatNumber]}>3</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        {/* My Reports List */}
        <View style={styles.reportsList}>
          {allReports.map((report) => (
            <View key={report.id} style={styles.reportCard}>
              <View style={styles.reportHeader}>
                <Text style={styles.categoryText}>{report.category}</Text>
                <View style={[styles.statusBadge, getStatusColor(report.status)]}>
                  <Text style={styles.statusText}>{report.status}</Text>
                </View>
              </View>
              
              <Text style={styles.description}>{report.description}</Text>
              
              <View style={styles.reportFooter}>
                <View style={styles.locationContainer}>
                  <Ionicons name="location" size={12} color="#6B7280" />
                  <Text style={styles.footerText}>{report.location}</Text>
                </View>
                
                <View style={styles.timeContainer}>
                  <Ionicons name="time" size={12} color="#6B7280" />
                  <Text style={styles.footerText}>{report.timeAgo}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
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
  content: {
    flex: 1,
    padding: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  greenStatCard: {
    backgroundColor: '#F0FDF4',
  },
  orangeStatCard: {
    backgroundColor: '#FFF7ED',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 4,
  },
  greenStatNumber: {
    color: '#16A34A',
  },
  orangeStatNumber: {
    color: '#EA580C',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  reportsList: {
    gap: 12,
  },
  reportCard: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
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
  description: {
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 8,
    lineHeight: 20,
  },
  reportFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
  },
});

export default MyReportsScreen;