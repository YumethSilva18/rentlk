import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { useCamera } from '../../hooks/useCamera';
import { useKYC } from '../../hooks/useKYC';

interface KYCScreenProps {
  navigation: any;
}

const KYC_STEPS = [
  { id: 1, title: 'Personal Info', icon: 'person-outline' as const },
  { id: 2, title: 'ID Document', icon: 'card-outline' as const },
  { id: 3, title: 'Selfie', icon: 'camera-outline' as const },
  { id: 4, title: 'Review', icon: 'checkmark-circle-outline' as const },
];

export const KYCScreen: React.FC<KYCScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: '',
    nicNumber: '',
    address: '',
    dob: '',
  });
  const { takePhoto, pickImage, images, removeImage } = useCamera();
  const { submit: submitKYC, isLoading: loading } = useKYC();
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [selfie, setSelfie] = useState<string | null>(null);

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else navigation.goBack();
  };

  const handleCaptureID = async (side: 'front' | 'back') => {
    const result = await takePhoto();
    if (result) {
      if (side === 'front') setFrontImage(result.uri);
      else setBackImage(result.uri);
    }
  };

  const handleCaptureSelfie = async () => {
    const result = await takePhoto();
    if (result) setSelfie(result.uri);
  };

  const handleSubmit = async () => {
    if (!frontImage || !backImage || !selfie) {
      Alert.alert('Missing', 'Please complete all required uploads');
      return;
    }
    try {
      await submitKYC({
        fullName: form.fullName,
        nicNumber: form.nicNumber,
        address: form.address,
        dateOfBirth: form.dob,
        frontImage,
        backImage,
        selfie,
      });
      navigation.navigate('Login');
    } catch (err) {
      Alert.alert('Error', 'Failed to submit KYC. Please try again.');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View>
            <Text style={styles.stepTitle}>Personal Information</Text>
            <Text style={styles.stepDesc}>Please enter your details as per your NIC</Text>
            <Input label="Full Name" placeholder="As on NIC" value={form.fullName}
              onChangeText={(v: string) => setForm({ ...form, fullName: v })} required />
            <Input label="NIC Number" placeholder="e.g. 199012345678" value={form.nicNumber}
              onChangeText={(v: string) => setForm({ ...form, nicNumber: v })} required autoCapitalize="characters" />
            <Input label="Date of Birth" placeholder="YYYY-MM-DD" value={form.dob}
              onChangeText={(v: string) => setForm({ ...form, dob: v })} required />
            <Input label="Address" placeholder="Your permanent address" value={form.address}
              onChangeText={(v: string) => setForm({ ...form, address: v })} required multiline />
          </View>
        );
      case 2:
        return (
          <View>
            <Text style={styles.stepTitle}>ID Document</Text>
            <Text style={styles.stepDesc}>Upload clear photos of your NIC (front & back)</Text>
            <Card style={styles.uploadCard} onPress={() => handleCaptureID('front')}>
              <View style={styles.uploadContent}>
                <Ionicons name={frontImage ? 'checkmark-circle' : 'camera-outline'} size={32}
                  color={frontImage ? colors.success : colors.textTertiary} />
                <Text style={[styles.uploadLabel, frontImage ? styles.uploadDone : null]}>
                  {frontImage ? 'NIC Front Uploaded' : 'Capture NIC Front'}
                </Text>
              </View>
            </Card>
            <Card style={styles.uploadCard} onPress={() => handleCaptureID('back')}>
              <View style={styles.uploadContent}>
                <Ionicons name={backImage ? 'checkmark-circle' : 'camera-outline'} size={32}
                  color={backImage ? colors.success : colors.textTertiary} />
                <Text style={[styles.uploadLabel, backImage ? styles.uploadDone : null]}>
                  {backImage ? 'NIC Back Uploaded' : 'Capture NIC Back'}
                </Text>
              </View>
            </Card>
          </View>
        );
      case 3:
        return (
          <View style={styles.centered}>
            <Text style={styles.stepTitle}>Take a Selfie</Text>
            <Text style={styles.stepDesc}>We need a selfie to verify your identity</Text>
            <Card style={styles.selfieCard} onPress={handleCaptureSelfie}>
              <View style={styles.uploadContent}>
                <Ionicons name={selfie ? 'checkmark-circle' : 'person-circle-outline'} size={64}
                  color={selfie ? colors.success : colors.textTertiary} />
                <Text style={[styles.uploadLabel, selfie ? styles.uploadDone : null]}>
                  {selfie ? 'Selfie Captured' : 'Tap to Capture Selfie'}
                </Text>
              </View>
            </Card>
          </View>
        );
      case 4:
        return (
          <View>
            <Text style={styles.stepTitle}>Review & Submit</Text>
            <Text style={styles.stepDesc}>Please review your information before submitting</Text>
            <Card style={styles.reviewCard}>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Full Name</Text>
                <Text style={styles.reviewValue}>{form.fullName || '-'}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>NIC Number</Text>
                <Text style={styles.reviewValue}>{form.nicNumber || '-'}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>DOB</Text>
                <Text style={styles.reviewValue}>{form.dob || '-'}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>NIC Front</Text>
                <Badge label={frontImage ? 'Uploaded' : 'Missing'} variant={frontImage ? 'success' : 'destructive'} />
              </View>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>NIC Back</Text>
                <Badge label={backImage ? 'Uploaded' : 'Missing'} variant={backImage ? 'success' : 'destructive'} />
              </View>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Selfie</Text>
                <Badge label={selfie ? 'Uploaded' : 'Missing'} variant={selfie ? 'success' : 'destructive'} />
              </View>
            </Card>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>KYC Verification</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.stepper}>
        {KYC_STEPS.map((s, i) => (
          <View key={s.id} style={styles.stepItem}>
            <View style={[
              styles.stepCircle,
              step >= s.id ? styles.stepCircleActive : null,
              step > s.id ? styles.stepCircleDone : null,
            ]}>
              {step > s.id ? (
                <Ionicons name="checkmark" size={16} color={colors.surface} />
              ) : (
                <Ionicons name={s.icon} size={16} color={step >= s.id ? colors.surface : colors.textTertiary} />
              )}
            </View>
            {i < KYC_STEPS.length - 1 && (
              <View style={[styles.stepLine, step > s.id ? styles.stepLineActive : null]} />
            )}
          </View>
        ))}
      </View>

      <View style={styles.stepLabels}>
        {KYC_STEPS.map((s) => (
          <Text key={s.id} style={[styles.stepLabelText, step === s.id ? styles.stepLabelTextActive : null]}>
            {s.title}
          </Text>
        ))}
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        {renderStep()}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Button
          title={step === 1 ? 'Cancel' : 'Back'}
          variant="outline"
          onPress={handleBack}
          style={styles.footerBtn}
        />
        <Button
          title={step === 4 ? 'Submit KYC' : 'Next'}
          variant="primary"
          loading={step === 4 ? loading : false}
          onPress={step === 4 ? handleSubmit : handleNext}
          style={styles.footerBtn}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing['4'], paddingVertical: spacing['3'],
  },
  backBtn: { padding: spacing['1'] },
  headerTitle: { ...typography.h4, color: colors.textPrimary },
  headerRight: { width: 32 },
  stepper: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing['6'], marginBottom: spacing['2'] },
  stepItem: { flex: 1, alignItems: 'center', flexDirection: 'row' },
  stepCircle: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: colors.background,
    alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.border,
  },
  stepCircleActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  stepCircleDone: { backgroundColor: colors.success, borderColor: colors.success },
  stepLine: { flex: 1, height: 2, backgroundColor: colors.border, marginHorizontal: spacing['2'] },
  stepLineActive: { backgroundColor: colors.success },
  stepLabels: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: spacing['4'], marginBottom: spacing['4'] },
  stepLabelText: { ...typography.caption, color: colors.textTertiary, textAlign: 'center', flex: 1 },
  stepLabelTextActive: { color: colors.primary, fontWeight: '600' },
  body: { flex: 1 },
  bodyContent: { paddingHorizontal: spacing['5'], paddingBottom: spacing['4'] },
  stepTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing['2'] },
  stepDesc: { ...typography.bodyMedium, color: colors.textSecondary, marginBottom: spacing['5'] },
  centered: { alignItems: 'center' },
  uploadCard: { marginBottom: spacing['4'] },
  uploadContent: { alignItems: 'center', paddingVertical: spacing['3'], gap: spacing['2'] },
  uploadLabel: { ...typography.labelMedium, color: colors.textTertiary },
  uploadDone: { color: colors.success },
  selfieCard: { marginTop: spacing['4'], width: '100%' },
  reviewCard: { gap: spacing['3'] },
  reviewRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing['2'] },
  reviewLabel: { ...typography.bodyMedium, color: colors.textSecondary },
  reviewValue: { ...typography.bodyMedium, color: colors.textPrimary, fontWeight: '600' },
  footer: {
    flexDirection: 'row', gap: spacing['3'], paddingHorizontal: spacing['5'],
    paddingTop: spacing['3'], borderTopWidth: 1, borderTopColor: colors.border,
  },
  footerBtn: { flex: 1 },
});
