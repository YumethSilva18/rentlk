import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

interface VehicleImageGalleryProps {
  images: string[];
  placeholderText?: string;
}

export const VehicleImageGallery: React.FC<VehicleImageGalleryProps> = ({ images, placeholderText = 'Vehicle' }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const width = Dimensions.get('window').width;

  if (!images || images.length === 0) {
    images = [`https://placehold.co/${width}x280?text=${placeholderText}`];
  }

  return (
    <View style={{ height: 280 }}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / width);
          setActiveIndex(idx);
        }}
      >
        {images.map((uri, i) => (
          <View key={i} style={{ width, height: 280 }}>
            {uri.startsWith('http') || uri.startsWith('file') ? (
              <View style={styles.imageContainer}>
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="image-outline" size={48} color={colors.textTertiary} />
                  <Text style={styles.imageText}>Image {i + 1}</Text>
                </View>
              </View>
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="camera-outline" size={48} color={colors.textTertiary} />
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      <View style={styles.pagination}>
        {images.map((_, i) => (
          <View key={i} style={[styles.dot, activeIndex === i && styles.activeDot]} />
        ))}
      </View>

      {images.length > 1 && (
        <View style={styles.counter}>
          <Text style={styles.counterText}>{activeIndex + 1}/{images.length}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: { width: '100%', height: '100%' },
  imagePlaceholder: {
    width: '100%', height: '100%', backgroundColor: colors.background,
    alignItems: 'center', justifyContent: 'center',
  },
  imageText: { ...typography.bodyMedium, color: colors.textTertiary, marginTop: 8 },
  pagination: {
    position: 'absolute', bottom: 16, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'center', gap: 6,
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.overlay },
  activeDot: { backgroundColor: colors.surface },
  counter: {
    position: 'absolute', bottom: 12, right: 12,
    backgroundColor: colors.overlay, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12,
  },
  counterText: { ...typography.caption, color: colors.white },
});

export default VehicleImageGallery;
