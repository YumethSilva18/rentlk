import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { Input } from '../../components/common/Input';
import { TextArea } from '../../components/common/TextArea';
import { Button } from '../../components/common/Button';
import { FilterChip } from '../../components/common/FilterChip';
import { useVehicles } from '../../hooks/useVehicles';
import { useCamera } from '../../hooks/useCamera';
import { vehicleService } from '../../services/vehicle.service';
import { VEHICLE_TYPES, TRANSMISSION_TYPES, FUEL_TYPES, SEATS_OPTIONS, VEHICLE_FEATURES, SRI_LANKAN_CITIES } from '../../utils/constants';
import type { VehicleFormData } from '../../types/vehicle.types';

interface AddVehicleScreenProps {
  navigation: any;
}

const AddVehicleScreen: React.FC<AddVehicleScreenProps> = ({ navigation }) => {
  const { takePhoto, pickImage } = useCamera();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [form, setForm] = useState<Partial<VehicleFormData>>({
    title: '', description: '', type: 'car', brand: '', model: '',
    year: new Date().getFullYear(), transmission: 'automatic', fuelType: 'petrol',
    seats: 5, dailyRate: 0, city: 'Colombo', address: '', licensePlate: '',
    insuranceExpiry: '', features: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
  };

  const addImage = async () => {
    const uri = await pickImage();
    if (uri) setImages((prev) => [...prev, uri]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.title?.trim()) newErrors.title = 'Title is required';
    if (!form.brand?.trim()) newErrors.brand = 'Brand is required';
    if (!form.model?.trim()) newErrors.model = 'Model is required';
    if (!form.dailyRate || form.dailyRate <= 0) newErrors.dailyRate = 'Valid price required';
    if (!form.licensePlate?.trim()) newErrors.licensePlate = 'License plate required';
    if (images.length === 0) newErrors.images = 'At least one image required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      await vehicleService.create({ ...form, images, features: selectedFeatures } as any);
      Alert.alert('Success', 'Vehicle submitted for review', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to add vehicle');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Images */}
      <Text style={styles.sectionTitle}>Photos</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.imageRow}>
        {images.map((uri, i) => (
          <View key={i} style={styles.imageContainer}>
            <Image source={{ uri }} style={styles.image} resizeMode="cover" />
            <TouchableOpacity style={styles.removeImage} onPress={() => removeImage(i)}>
              <Ionicons name="close-circle" size={22} color={colors.destructive} />
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity style={styles.addImage} onPress={addImage}>
          <Ionicons name="camera-outline" size={28} color={colors.primary} />
          <Text style={styles.addImageText}>Add Photo</Text>
        </TouchableOpacity>
      </ScrollView>
      {errors.images && <Text style={styles.errorText}>{errors.images}</Text>}

      {/* Basic Info */}
      <Text style={styles.sectionTitle}>Basic Information</Text>
      <Input label="Title" value={form.title || ''} onChangeText={(v) => updateField('title', v)}
        placeholder="e.g. Toyota Prius 2022" error={errors.title} />
      <TextArea label="Description" value={form.description || ''} onChangeText={(v) => updateField('description', v)}
        placeholder="Describe your vehicle..." maxLength={500} />

      {/* Type */}
      <Text style={styles.label}>Vehicle Type</Text>
      <View style={styles.chipWrap}>
        {(VEHICLE_TYPES as unknown as { value: string; label: string }[]).map((t) => (
          <FilterChip key={t.value} label={t.label} selected={form.type === t.value}
            onPress={() => updateField('type', t.value)} />
        ))}
      </View>

      {/* Brand / Model */}
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Input label="Brand" value={form.brand || ''} onChangeText={(v) => updateField('brand', v)}
            placeholder="Toyota" error={errors.brand} />
        </View>
        <View style={{ flex: 1 }}>
          <Input label="Model" value={form.model || ''} onChangeText={(v) => updateField('model', v)}
            placeholder="Prius" error={errors.model} />
        </View>
      </View>

      {/* Year / Seats */}
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Input label="Year" value={String(form.year || '')} onChangeText={(v) => updateField('year', parseInt(v) || 0)}
            placeholder="2024" keyboardType="numeric" />
        </View>
        <View style={{ flex: 1 }}>
          <Input label="Seats" value={String(form.seats || '')} onChangeText={(v) => updateField('seats', parseInt(v) || 0)}
            placeholder="5" keyboardType="numeric" />
        </View>
      </View>

      {/* Transmission */}
      <Text style={styles.label}>Transmission</Text>
      <View style={styles.chipWrap}>
        {(TRANSMISSION_TYPES as unknown as { value: string; label: string }[]).map((t) => (
          <FilterChip key={t.value} label={t.label} selected={form.transmission === t.value}
            onPress={() => updateField('transmission', t.value)} />
        ))}
      </View>

      {/* Fuel */}
      <Text style={styles.label}>Fuel Type</Text>
      <View style={styles.chipWrap}>
        {(FUEL_TYPES as unknown as { value: string; label: string }[]).map((t) => (
          <FilterChip key={t.value} label={t.label} selected={form.fuelType === t.value}
            onPress={() => updateField('fuelType', t.value)} />
        ))}
      </View>

      {/* Price */}
      <Input label="Daily Rate (Rs.)" value={form.dailyRate ? String(form.dailyRate) : ''}
        onChangeText={(v) => updateField('dailyRate', parseFloat(v) || 0)}
        placeholder="5000" keyboardType="numeric" error={errors.dailyRate} />

      {/* Location */}
      <Text style={styles.sectionTitle}>Location</Text>
      <Text style={styles.label}>City</Text>
      <View style={styles.chipWrap}>
        {SRI_LANKAN_CITIES.slice(0, 6).map((city) => (
          <FilterChip key={city} label={city} selected={form.city === city}
            onPress={() => updateField('city', city)} />
        ))}
      </View>
      <Input label="Address" value={form.address || ''} onChangeText={(v) => updateField('address', v)}
        placeholder="Full address" />

      {/* License & Insurance */}
      <Text style={styles.sectionTitle}>Legal</Text>
      <Input label="License Plate" value={form.licensePlate || ''} onChangeText={(v) => updateField('licensePlate', v)}
        placeholder="ABC-1234" error={errors.licensePlate} />
      <Input label="Insurance Expiry" value={form.insuranceExpiry || ''} onChangeText={(v) => updateField('insuranceExpiry', v)}
        placeholder="2025-12-31" />

      {/* Features */}
      <Text style={styles.sectionTitle}>Features</Text>
      <View style={styles.chipWrap}>
        {(VEHICLE_FEATURES as unknown as { value: string; label: string }[]).map((f) => (
          <FilterChip key={f.value} label={f.label} selected={selectedFeatures.includes(f.value)}
            onPress={() => setSelectedFeatures(selectedFeatures.includes(f.value)
              ? selectedFeatures.filter((v) => v !== f.value) : [...selectedFeatures, f.value])} />
        ))}
      </View>

      {/* Submit */}
      <Button title="Add Vehicle" variant="primary" size="lg" onPress={handleSubmit}
        loading={isLoading} style={styles.submitBtn} />
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing['4'] },
  sectionTitle: { ...typography.h4, color: colors.textPrimary, marginTop: spacing['5'], marginBottom: spacing['3'] },
  label: { ...typography.labelMedium, color: colors.textPrimary, marginBottom: spacing['2'], marginTop: spacing['3'] },
  row: { flexDirection: 'row', gap: spacing['3'] },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing['2'], marginBottom: spacing['2'] },
  imageRow: { gap: spacing['3'] },
  imageContainer: { position: 'relative' },
  image: { width: 120, height: 90, borderRadius: 10 },
  removeImage: { position: 'absolute', top: -6, right: -6 },
  addImage: {
    width: 120, height: 90, borderRadius: 10, borderWidth: 2, borderStyle: 'dashed',
    borderColor: colors.primary, alignItems: 'center', justifyContent: 'center', gap: 4,
  },
  addImageText: { ...typography.caption, color: colors.primary },
  errorText: { ...typography.bodySmall, color: colors.destructive, marginTop: 4 },
  submitBtn: { marginTop: spacing['6'] },
});

export default AddVehicleScreen;
export { AddVehicleScreen };
