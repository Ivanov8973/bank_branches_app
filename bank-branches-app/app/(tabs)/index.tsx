import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
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

// API endpoint for fetching bank branches
const API_URL = 'https://europe-west1-proto-rn-frbs-4242.cloudfunctions.net/dev_task/branches';

// Main screen - displays list of bank branches
export default function BranchesScreen() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const router = useRouter();
  const colorScheme = useColorScheme();

  // Fetch branches from API on component mount
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_URL);

        // Flatten nested API structure: data.data[].Brand[].Branch[]
        const allBranches: Branch[] = [];
        response.data.data?.forEach((brandGroup: any) => {
          brandGroup.Brand?.forEach((brand: any) => {
            brand.Branch?.forEach((branch: any) => {
              allBranches.push(branch);
            });
          });
        });

        setBranches(allBranches);
        setError(undefined);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch branches');
        setBranches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  // Render each branch card item
  const renderBranchItem = ({ item }: { item: Branch }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => router.push({
        pathname: '/branch_details',
        params: { branchId: item.Identification },
      })}
      style={styles.branchItemContainer}
    >
      <View style={styles.branchCard}>
        <View style={styles.branchInfoWrapper}>
          <ThemedText style={styles.branchName} numberOfLines={2}>
            {item.Name}
          </ThemedText>
          <ThemedText style={styles.branchCity} numberOfLines={1}>
            📍 {item.PostalAddress.TownName}
          </ThemedText>
          <ThemedText style={styles.branchAddress} numberOfLines={2}>
            {item.PostalAddress.StreetName}
            {item.PostalAddress.BuildingNumber && ` ${item.PostalAddress.BuildingNumber}`}
          </ThemedText>
        </View>
        <ThemedText style={styles.arrowIcon}>→</ThemedText>
      </View>
    </TouchableOpacity>
  );

  // Show loading spinner
  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <ThemedView style={styles.centerContent}>
          <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
        </ThemedView>
      </SafeAreaView>
    );
  }

  // Show error message
  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <ThemedView style={styles.centerContent}>
          <ThemedText style={styles.errorText}>Error: {error}</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  // Main screen with branches list
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Bank Branches</ThemedText>
      </View>

      <FlatList
        data={branches}
        renderItem={renderBranchItem}
        keyExtractor={(item) => item.Identification}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <ThemedText style={styles.emptyText}>No branches found</ThemedText>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,
    backgroundColor: '#0a0e27', // Dark navy background
    paddingTop: 60,
  },
  // Center content for loading/error states
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Header section with title
  header: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    paddingBottom: 24,
    backgroundColor: '#0f1535', // Slightly lighter navy
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#3b82f6', // Blue accent line
  },
  // Title text
  headerTitle: {
    fontSize: 25,
    fontWeight: '900',
    color: '#ffffff',
  },
  // List container padding
  listContent: {
    paddingBottom: 32,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  // Branch card container with shadow
  branchItemContainer: {
    marginVertical: 12,
    marginHorizontal: 0,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  // Branch card content
  branchCard: {
    padding: 18,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a2847', // Dark blue-gray
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6', // Blue accent
  },
  // Branch info section
  branchInfoWrapper: {
    flex: 1,
    marginRight: 12,
  },
  // Branch name text
  branchName: {
    marginBottom: 8,
    fontWeight: '700',
    fontSize: 16,
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  // City/location text
  branchCity: {
    fontSize: 13,
    marginBottom: 4,
    fontWeight: '600',
    color: '#93c5fd', // Light blue
  },
  // Address text
  branchAddress: {
    fontSize: 12,
    color: '#cbd5e1', // Light gray-blue
    lineHeight: 18,
    fontWeight: '400',
  },
  // Arrow icon
  arrowIcon: {
    fontSize: 20,
    fontWeight: '300',
    color: '#60a5fa', // Medium blue
    marginLeft: 16,
  },
  // Error message text
  errorText: {
    color: '#ff6b6b', // Red
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    fontWeight: '600',
  },
  // Empty state text
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#94a3b8', // Gray
    fontSize: 16,
    fontWeight: '500',
  },
});
