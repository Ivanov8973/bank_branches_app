import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

// Branch data structure from API
interface Branch {
  Identification: string;
  Name: string;
  PostalAddress: {
    StreetName: string;
    BuildingNumber?: string;
    TownName: string;
    PostCode?: string;
  };
  ContactInfo?: Array<{ ContactType: string; ContactContent: string }>;
  Availability?: {
    StandardAvailability?: {
      Day?: Array<{
        Name: string;
        OpeningHours?: Array<{ OpeningTime: string; ClosingTime: string }>;
      }>;
    };
  };
}

const API_URL = 'https://europe-west1-proto-rn-frbs-4242.cloudfunctions.net/dev_task/branches';

// Branch details screen - shows full information for a selected branch
export default function BranchDetailsScreen() {
  const { branchId } = useLocalSearchParams();
  const [branch, setBranch] = useState<Branch>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const router = useRouter();
  const colorScheme = useColorScheme();

  // Fetch branch details from API on component mount
  useEffect(() => {
    const fetchBranchDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_URL);

        // Find the branch matching the branchId from nested structure
        let foundBranch: Branch | null = null;
        response.data.data?.forEach((brandGroup: any) => {
          brandGroup.Brand?.forEach((brand: any) => {
            const match = brand.Branch?.find((b: Branch) => b.Identification === branchId);
            if (match) foundBranch = match;
          });
        });

        if (foundBranch) {
          setBranch(foundBranch);
          setError(undefined);
        } else {
          setError('Branch not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch branch details');
      } finally {
        setLoading(false);
      }
    };

    if (branchId) {
      fetchBranchDetails();
    }
  }, [branchId]);

  // Render working hours for each day
  const renderWorkingHours = () => {
    const days = branch?.Availability?.StandardAvailability?.Day || [];

    if (days.length === 0) {
      return <ThemedText style={styles.noData}>No working hours available</ThemedText>;
    }

    return (
      <View style={styles.hoursContainer}>
        {days.map((day, index) => {
          const hours = day.OpeningHours?.[0];
          const timeRange = hours ? `${hours.OpeningTime} - ${hours.ClosingTime}` : 'Closed';

          return (
            <View key={index} style={styles.hoursRow}>
              <ThemedText style={styles.dayLabel}>{day.Name}</ThemedText>
              <ThemedText style={styles.hoursValue}>{timeRange}</ThemedText>
            </View>
          );
        })}
      </View>
    );
  };

  // Show loading spinner
  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
        </View>
      </SafeAreaView>
    );
  }

  // Show error message
  if (error || !branch) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.centerContent}>
          <ThemedText style={styles.errorText}>Error: {error || 'Branch not found'}</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  // Main screen with branch details
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        {/* Header with back button */}
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol name="chevron.left" size={28} color="#60a5fa" />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Branch Details</ThemedText>
          <View style={styles.backButton} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Branch name section */}
          <View style={styles.headerSection}>
            <View style={styles.iconCircle}>
              <ThemedText style={styles.buildingIcon}>🏦</ThemedText>
            </View>
            <ThemedText style={styles.branchName} numberOfLines={3}>
              {branch.Name}
            </ThemedText>
          </View>

          {/* Address section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionIcon}>📍</ThemedText>
              <ThemedText style={styles.sectionTitle}>Address</ThemedText>
            </View>
            <ThemedText style={styles.sectionContent}>
              {branch.PostalAddress.StreetName}
              {branch.PostalAddress.BuildingNumber && ` ${branch.PostalAddress.BuildingNumber}`}
            </ThemedText>
            <ThemedText style={styles.sectionContent}>
              {branch.PostalAddress.TownName}
              {branch.PostalAddress.PostCode && ` ${branch.PostalAddress.PostCode}`}
            </ThemedText>
          </View>

          {/* Contact section (if available) */}
          {branch.ContactInfo && branch.ContactInfo.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <ThemedText style={styles.sectionIcon}>📞</ThemedText>
                <ThemedText style={styles.sectionTitle}>Contact</ThemedText>
              </View>
              {branch.ContactInfo.map((contact, index) => (
                <ThemedText key={index} style={styles.sectionContent}>
                  {contact.ContactType}: {contact.ContactContent}
                </ThemedText>
              ))}
            </View>
          )}

          {/* Working hours section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionIcon}>⏰</ThemedText>
              <ThemedText style={styles.sectionTitle}>Working Hours</ThemedText>
            </View>
            {renderWorkingHours()}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,
    backgroundColor: '#0a0e27', // Dark navy background
  },
  // Center content for loading/error states
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Header bar with back button and title
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#0f1535', // Slightly lighter navy
  },
  // Header title text
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
  },
  // Back button touch area
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Scroll view content padding
  scrollContent: {
    paddingBottom: 40,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  // Header section with branch name
  headerSection: {
    alignItems: 'center',
    marginBottom: 28,
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: '#0f1535', // Slightly lighter navy
  },
  // Icon circle background
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#1e3a5f', // Medium dark blue
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  // Building emoji icon
  buildingIcon: {
    fontSize: 38,
  },
  // Branch name heading
  branchName: {
    fontSize: 24,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 32,
  },
  // Content section card
  section: {
    marginBottom: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#1a2847', // Dark blue-gray
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6', // Blue accent
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  // Section header with icon and title
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  // Section emoji icon
  sectionIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  // Section title text
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  // Section content text
  sectionContent: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 6,
    fontWeight: '500',
    color: '#cbd5e1', // Light gray-blue
  },
  // Hours list container
  hoursContainer: {
    marginTop: 6,
  },
  // Single day/hours row
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#2d3e5f', // Dark divider
  },
  // Day name text
  dayLabel: {
    fontWeight: '600',
    flex: 1,
    fontSize: 13,
    color: '#ffffff',
  },
  // Hours time range text
  hoursValue: {
    flex: 1,
    textAlign: 'right',
    fontSize: 13,
    fontWeight: '600',
    color: '#93c5fd', // Light blue
  },
  // No data message
  noData: {
    color: '#94a3b8', // Gray
    fontStyle: 'italic',
    fontSize: 13,
    marginTop: 6,
  },
  // Error message text
  errorText: {
    color: '#ff6b6b', // Red
    textAlign: 'center',
    marginTop: 20,
    fontSize: 15,
    fontWeight: '600',
  },
});
