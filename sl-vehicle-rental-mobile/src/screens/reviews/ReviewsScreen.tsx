import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Card } from '@/components/common/Card';
import { Avatar } from '@/components/common/Avatar';
import { Button } from '@/components/common/Button';
import { colors, typography, spacing, radii } from '@/theme';
import type { MainScreenProps } from '@/types/navigation.types';
import { formatDate } from '@/utils/format';

type Props = MainScreenProps<'Reviews'>;

interface Review {
  id: string;
  reviewerName: string;
  reviewerAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  vehicleName?: string;
}

export const ReviewsScreen: React.FC<Props> = ({ navigation }) => {
  const [reviews] = useState<Review[]>([
    {
      id: '1',
      reviewerName: 'Kasun Perera',
      rating: 5,
      comment: 'Excellent vehicle! Very clean and well-maintained. Highly recommended.',
      date: new Date(Date.now() - 86400000 * 2).toISOString(),
      vehicleName: 'Toyota Prius',
    },
    {
      id: '2',
      reviewerName: 'Dilani Silva',
      rating: 4,
      comment: 'Good experience overall. Vehicle was as described.',
      date: new Date(Date.now() - 86400000 * 5).toISOString(),
      vehicleName: 'Honda Vezel',
    },
  ]);

  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? 'star' : 'star-outline'}
            size={16}
            color={colors.accent}
          />
        ))}
      </View>
    );
  };

  const renderReview = (review: Review) => (
    <Card key={review.id} style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewerInfo}>
          <Avatar name={review.reviewerName} uri={review.reviewerAvatar} size="md" />
          <View style={styles.reviewerDetails}>
            <Text style={styles.reviewerName}>{review.reviewerName}</Text>
            {review.vehicleName && (
              <Text style={styles.vehicleName}>{review.vehicleName}</Text>
            )}
          </View>
        </View>
        <Text style={styles.date}>{formatDate(review.date)}</Text>
      </View>

      {renderStars(review.rating)}

      <Text style={styles.comment}>{review.comment}</Text>
    </Card>
  );

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>My Reviews</Text>
        </View>

        <Card style={styles.summaryCard}>
          <Text style={styles.averageRating}>{averageRating}</Text>
          {renderStars(Math.round(Number(averageRating)))}
          <Text style={styles.reviewCount}>{reviews.length} reviews</Text>
        </Card>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {reviews.map(renderReview)}
        </ScrollView>
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
  summaryCard: {
    margin: spacing['4'],
    marginTop: 0,
    padding: spacing['6'],
    alignItems: 'center',
  },
  averageRating: {
    ...typography.displayLarge,
    color: colors.textPrimary,
    fontWeight: '700',
    marginBottom: spacing['2'],
  },
  starsContainer: {
    flexDirection: 'row',
    gap: spacing['1'],
    marginBottom: spacing['2'],
  },
  reviewCount: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing['4'],
    paddingTop: 0,
    gap: spacing['3'],
  },
  reviewCard: {
    padding: spacing['4'],
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing['3'],
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['3'],
  },
  reviewerDetails: {
    gap: spacing['0.5'],
  },
  reviewerName: {
    ...typography.labelMedium,
    color: colors.textPrimary,
  },
  vehicleName: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  date: {
    ...typography.bodySmall,
    color: colors.textTertiary,
  },
  comment: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    marginTop: spacing['2'],
    lineHeight: 22,
  },
});
