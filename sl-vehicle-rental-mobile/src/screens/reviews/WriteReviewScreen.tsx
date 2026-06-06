import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Button } from '@/components/common/Button';
import { TextArea } from '@/components/common/TextArea';
import { colors, typography, spacing, radii } from '@/theme';
import type { MainScreenProps } from '@/types/navigation.types';

type Props = MainScreenProps<'WriteReview'>;

export const WriteReviewScreen: React.FC<Props> = ({ navigation, route }) => {
  const { bookingId } = route.params;
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }
    if (!comment.trim()) {
      Alert.alert('Error', 'Please write a review comment');
      return;
    }

    setLoading(true);
    try {
      // TODO: Call API to submit review
      Alert.alert('Success', 'Review submitted successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
          >
            <Ionicons
              name={star <= rating ? 'star' : 'star-outline'}
              size={40}
              color={star <= rating ? colors.accent : colors.border}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Write Review</Text>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.ratingSection}>
            <Text style={styles.sectionTitle}>How was your experience?</Text>
            {renderStars()}
            <Text style={styles.ratingLabel}>
              {rating > 0 ? `${rating} out of 5 stars` : 'Tap to rate'}
            </Text>
          </View>

          <View style={styles.form}>
            <TextArea
              label="Your Review"
              placeholder="Share details of your experience..."
              value={comment}
              onChangeText={setComment}
              numberOfLines={6}
              maxLength={500}
            />
            <Text style={styles.charCount}>{comment.length}/500</Text>
          </View>

          <View style={styles.tipsCard}>
            <Ionicons name="information-circle-outline" size={24} color={colors.info} />
            <View style={styles.tipsContent}>
              <Text style={styles.tipsTitle}>Review Tips</Text>
              <Text style={styles.tipsText}>
                • Be specific about what you liked or didn't like{'\n'}
                • Mention the vehicle condition and owner communication{'\n'}
                • Keep it honest and helpful for other users
              </Text>
            </View>
          </View>

          <Button
            title="Submit Review"
            onPress={handleSubmit}
            loading={loading}
            disabled={rating === 0 || !comment.trim()}
          />
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing['4'],
    gap: spacing['6'],
  },
  ratingSection: {
    alignItems: 'center',
    gap: spacing['3'],
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: spacing['2'],
  },
  ratingLabel: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
  },
  form: {
    gap: spacing['2'],
  },
  charCount: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    textAlign: 'right',
  },
  tipsCard: {
    flexDirection: 'row',
    gap: spacing['3'],
    padding: spacing['4'],
    backgroundColor: colors.backgroundInfo,
    borderRadius: radii.lg,
  },
  tipsContent: {
    flex: 1,
  },
  tipsTitle: {
    ...typography.labelLarge,
    color: colors.info,
    marginBottom: spacing['2'],
  },
  tipsText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    lineHeight: 22,
  },
});
