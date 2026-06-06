import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Loader } from '@/components/common/Loader';
import { colors, typography, spacing, radii } from '@/theme';
import type { MainScreenProps } from '@/types/navigation.types';
import { formatCurrency, formatDate } from '@/utils/format';

type Props = MainScreenProps<'Tracking'>;

export const TrackingScreen: React.FC<Props> = ({ navigation, route }) => {
  const { sessionId } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [trackingSession, setTrackingSession] = useState({
    id: sessionId || '1',
    vehicleName: 'Toyota Prius',
    startDate: new Date().toISOString(),
    currentLocation: { lat: 6.9271, lng: 79.8612 },
    speed: 45,
    distance: 12.5,
    status: 'active',
  });

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Live Tracking</Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <Loader />
          </View>
        ) : (
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <TouchableOpacity
              style={styles.mapCard}
              onPress={() => navigation.navigate('Map', { sessionId: trackingSession.id })}
            >
              <View style={styles.mapPlaceholder}>
                <Ionicons name="map-outline" size={64} color={colors.primary} />
                <Text style={styles.mapText}>Tap to View Map</Text>
              </View>
            </TouchableOpacity>

            <Card style={styles.infoCard}>
              <View style={styles.statusHeader}>
                <Text style={styles.vehicleName}>{trackingSession.vehicleName}</Text>
                <Badge label="Active" variant="success" />
              </View>

              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Ionicons name="speedometer-outline" size={24} color={colors.primary} />
                  <Text style={styles.statValue}>{trackingSession.speed} km/h</Text>
                  <Text style={styles.statLabel}>Speed</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="navigate-outline" size={24} color={colors.primary} />
                  <Text style={styles.statValue}>{trackingSession.distance} km</Text>
                  <Text style={styles.statLabel}>Distance</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="time-outline" size={24} color={colors.primary} />
                  <Text style={styles.statValue}>{formatDate(trackingSession.startDate, 'time')}</Text>
                  <Text style={styles.statLabel}>Started</Text>
                </View>
              </View>
            </Card>

            <Card style={styles.locationCard}>
              <Text style={styles.sectionTitle}>Current Location</Text>
              <View style={styles.locationInfo}>
                <Ionicons name="location" size={24} color={colors.destructive} />
                <View style={styles.locationDetails}>
                  <Text style={styles.locationCoords}>
                    {trackingSession.currentLocation.lat.toFixed(4)}, {trackingSession.currentLocation.lng.toFixed(4)}
                  </Text>
                  <Text style={styles.locationAddress}>Colombo, Sri Lanka</Text>
                </View>
              </View>
            </Card>

            <View style={styles.actions}>
              <Button
                title="View Route History"
                variant="outline"
                icon={<Ionicons name="time-outline" size={20} color={colors.primary} />}
                onPress={() => navigation.navigate('RouteHistory', { sessionId: trackingSession.id })}
              />
              <Button
                title="End Tracking"
                variant="destructive"
                onPress={() => {
                  Alert.alert('End Tracking', 'Are you sure you want to end this tracking session?', [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'End', style: 'destructive' },
                  ]);
                }}
              />
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing['4'],
    gap: spacing['3'],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing['4'],
    gap: spacing['4'],
  },
  mapCard: {
    borderRadius: radii.lg,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: colors.backgroundPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing['2'],
  },
  mapText: {
    ...typography.labelLarge,
    color: colors.primary,
  },
  infoCard: {
    padding: spacing['4'],
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing['4'],
  },
  vehicleName: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing['3'],
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    padding: spacing['3'],
    backgroundColor: colors.background,
    borderRadius: radii.lg,
    gap: spacing['1'],
  },
  statValue: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  statLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  locationCard: {
    padding: spacing['4'],
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing['3'],
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['3'],
  },
  locationDetails: {
    flex: 1,
  },
  locationCoords: {
    ...typography.labelMedium,
    color: colors.textPrimary,
    marginBottom: spacing['0.5'],
  },
  locationAddress: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
  actions: {
    gap: spacing['3'],
  },
});
