import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { Input } from '../../components/common/Input';
import { TextArea } from '../../components/common/TextArea';
import { Button } from '../../components/common/Button';
import { FilterChip } from '../../components/common/FilterChip';
import { Loader } from '../../components/common/Loader';
import { useVehicles } from '../../hooks/useVehicles';
import { useCamera } from '../../hooks/useCamera';
import { vehicleService } from '../../services/vehicle.service';
import { VEHICLE_TYPES, TRANSMISSION_TYPES, FUEL_TYPES, VEHICLE_FEATURES, SRI_LANKAN_CITIES } from '../../utils/constants';
import type { VehicleFormData } from '../../types/vehicle.types';

interface EditVehicleScreenProps {
  navigation: any;
  route: any;
}

const EditVehicleScreen: React.FC<EditVehicleScreenProps> = ({ navigation, route }) => {
  const { vehicleId } = route.params;
  const { selectedVehicle: vehicle, getDetail, isLoading: loadingDetail } = useVehicles();
  const { pickImage } = useCamera();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [form, setForm] = useState<Partial<VehicleFormData>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    getDetail(vehicleId);
  }, [vehicleId]);

  useEffect(() => {
    if (vehicle) {
      setForm({
        title: vehicle.title, description: vehicle.description, type: vehicle.type,
        brand: vehicle.brand, model: vehicle.model, year: vehicle.year,
        transmission: vehicle.transmission, fuelType: vehicle.fuelType,
        seats: vehicle.seats, dailyRate: vehicle.dailyRate,
        city: vehicle.location?.city, address: vehicle.location?.address,
        licensePlate: vehicle.licensePlate, insuranceExpiry: vehicle.insuranceExpiry,
      });
      setImages(vehicle.images || []);
      setSelectedFeatures(vehicle.features || []);
    }
  }, [vehicle]);

  const updateField = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev: any) => { const n = { ...prev }; delete n[key]; return n; });
  };

  const addImage = async () => {
    const uri = await pickImage();
    if (uri) setImages((prev: string[]) => [...prev, uri]);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await vehicleService.update(vehicleId, { ...form, images, features: selectedFeatures } as any);
      Alert.alert('Success', 'Vehicle updated', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to update');
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingDetail || !vehicle) return <Loader message="Loading vehicle..." />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Photos</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.imageRow}>
        {images.map((uri: string, i: number) => (
          <View key={i} style={styles.imageContainer}>
            <Image source={{ uri }} style={styles.image} resizeMode="cover" />
            <TouchableOpacity style={styles.removeImage} onPress={() => setImages((p: string[]) => p.filter((_: string, idx: number) => idx !== i))}>
              <Ionicons name="close-circle" size={22} color={colors.destructive} />
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity style={styles.addImage} onPress={addImage}>
          <Ionicons name="camera-outline" size={28} color={colors.primary} />
          <Text style={styles.addImageText}>Add</Text>
        </TouchableOpacity>
      </ScrollView>

      <Text style={styles.sectionTitle}>Details</Text>
      <Input label="Title" value={form.title || ''} onChangeText={(v: string) => updateField('title', v)} placeholder="Vehicle title" />
      <TextArea label="Description" value={form.description || ''} onChangeText={(v: string) => updateField('description', v)} placeholder="Describe..." maxLength={500} />

      <Text style={styles.label}>Type</Text>
      <View style={styles.chipWrap}>
        {(VEHICLE_TYPES as unknown as { value: string; label: string }[]).map((t) => (
          <FilterChip key={t.value} label={t.label} selected={form.type === t.value} onPress={() => updateField('type', t.value)} />
        ))}
      </View>

      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Input label="Brand" value={form.brand || ''} onChangeText={(v: string) => updateField('brand', v)} placeholder="Brand" />
        </View>
        <View style={{ flex: 1 }}>
          <Input label="Model" value={form.model || ''} onChangeText={(v: string) => updateField('model', v)} placeholder="Model" />
        </View>
      </View>

      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Input label="Daily Rate (Rs.)" value={form.dailyRate ? String(form.dailyRate) : ''} onChangeText={(v: string) => updateField('dailyRate', parseFloat(v) || 0)} keyboardType="numeric" placeholder="5000" />
        </View>
        <View style={{ flex: 1 }}>
          <Input label="Year" value={String(form.year || '')} onChangeText={(v: string) => updateField('year', parseInt(v) || 0)} keyboardType="numeric" placeholder="2024" />
        </View>
      </View>

      <Text style={styles.label}>Features</Text>
      <View style={styles.chipWrap}>
        {(VEHICLE_FEATURES as unknown as { value: string; label: string }[]).map((f) => (
          <FilterChip key={f.value} label={f.label} selected={selectedFeatures.includes(f.value)}
            onPress={() => setSelectedFeatures(selectedFeatures.includes(f.value) ? selectedFeatures.filter((v: string) => v !== f.value) : [...selectedFeatures, f.value])} />
        ))}
      </View>

      <Button title="Save Changes" variant="primary" size="lg" onPress={handleSubmit} loading={isLoading} style={styles.submitBtn} />
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing['4'] },
  sectionTitle: { ...typography.h4, color: colors.textPrimary, marginTop: spacing['4'], marginBottom: spacing['3'] },
  label: { ...typography.labelMedium, color: colors.textPrimary, marginBottom: spacing['2'], marginTop: spacing['3'] },
  row: { flexDirection: 'row', gap: spacing['3'] },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing['2'], marginBottom: spacing['2'] },
  imageRow: { gap: spacing['3'] },
  imageContainer: { position: 'relative' },
  image: { width: 120, height: 90, borderRadius: 10 },
  removeImage: { position: 'absolute', top: -6, right: -6 },
  addImage: { width: 120, height: 90, borderRadius: 10, borderWidth: 2, borderStyle: 'dashed', borderColor: colors.primary, alignItems: 'center', justifyContent: 'center', gap: 4 },
  addImageText: { ...typography.caption, color: colors.primary },
  submitBtn: { marginTop: spacing['6'] },
});

export default EditVehicleScreen;
export { EditVehicleScreen };
