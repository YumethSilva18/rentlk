// ============================================================================
// useCamera Hook - Camera and image picker
// ============================================================================

import { useState, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { requestCameraPermission, requestPhotoLibraryPermission } from '@/utils/permissions';

interface ImageResult {
  uri: string;
  width: number;
  height: number;
  type?: string;
}

export const useCamera = () => {
  const [images, setImages] = useState<ImageResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const takePhoto = useCallback(async (): Promise<ImageResult | null> => {
    setIsLoading(true);
    try {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) return null;

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const image: ImageResult = {
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          type: asset.type,
        };
        setImages((prev) => [...prev, image]);
        return image;
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const pickImage = useCallback(async (): Promise<ImageResult | null> => {
    setIsLoading(true);
    try {
      const hasPermission = await requestPhotoLibraryPermission();
      if (!hasPermission) return null;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const image: ImageResult = {
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          type: asset.type,
        };
        setImages((prev) => [...prev, image]);
        return image;
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const pickMultipleImages = useCallback(async (): Promise<ImageResult[]> => {
    setIsLoading(true);
    try {
      const hasPermission = await requestPhotoLibraryPermission();
      if (!hasPermission) return [];

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: 10,
      });

      if (!result.canceled && result.assets.length > 0) {
        const newImages: ImageResult[] = result.assets.map((asset) => ({
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          type: asset.type,
        }));
        setImages((prev) => [...prev, ...newImages]);
        return newImages;
      }
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeImage = useCallback((index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearImages = useCallback(() => {
    setImages([]);
  }, []);

  return { images, isLoading, takePhoto, pickImage, pickMultipleImages, removeImage, clearImages };
};
