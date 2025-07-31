import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Camera, X, Flashlight } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';

export default function QRScannerScreen() {
  const { theme } = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);

  // Check if camera is available on web
  const isCameraAvailable = Platform.OS !== 'web';

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.permissionContainer}>
          <Camera size={64} color={theme.colors.textMuted} />
          <Text style={[styles.permissionTitle, { color: theme.colors.text }]}>Camera Permission Required</Text>
          <Text style={[styles.permissionText, { color: theme.colors.textMuted }]}>
            {Platform.OS === 'web' 
              ? 'Camera scanning is not available in web browsers. Please use the mobile app or manually enter the wallet address.'
              : 'We need camera access to scan QR codes for payments'
            }
          </Text>
          <TouchableOpacity 
            style={[styles.permissionButton, { backgroundColor: theme.colors.primary }]} 
            onPress={Platform.OS === 'web' ? () => router.back() : requestPermission}
          >
            <Text style={[styles.permissionButtonText, { color: theme.colors.white }]}>
              {Platform.OS === 'web' ? 'Go Back' : 'Grant Permission'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // If on web, show message that camera is not available
  if (Platform.OS === 'web') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.permissionContainer}>
          <Camera size={64} color={theme.colors.textMuted} />
          <Text style={[styles.permissionTitle, { color: theme.colors.text }]}>Scanner Not Available</Text>
          <Text style={[styles.permissionText, { color: theme.colors.textMuted }]}>
            QR code scanning is not available in web browsers. Please use the mobile app or manually enter the wallet address in the Send screen.
          </Text>
          <TouchableOpacity style={[styles.permissionButton, { backgroundColor: theme.colors.primary }]} onPress={() => router.back()}>
            <Text style={[styles.permissionButtonText, { color: theme.colors.white }]}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    
    setScanned(true);
    
    console.log('QR Code scanned:', data);
    
    // Basic validation for wallet address format
    const isValidAddress = data && (data.startsWith('lsk') || data.length > 20);
    
    if (isValidAddress) {
      Alert.alert(
        'QR Code Scanned Successfully',
        `Wallet Address: ${data.length > 30 ? data.substring(0, 30) + '...' : data}`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => setScanned(false),
          },
          {
            text: 'Send Payment',
            onPress: () => {
              // Navigate to send screen with the scanned address
              router.push({
                pathname: '/send',
                params: { recipientAddress: data }
              });
            },
          },
        ]
      );
    } else {
      Alert.alert(
        'Invalid QR Code',
        'This QR code does not contain a valid wallet address. Please scan a valid payment QR code.',
        [
          {
            text: 'Try Again',
            onPress: () => setScanned(false),
          },
        ]
      );
    }
  };

  const toggleFlash = () => {
    setFlashEnabled(!flashEnabled);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={[styles.closeButton, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]} 
          onPress={() => router.back()}
        >
          <X size={24} color={theme.colors.white} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.white }]}>Scan QR Code</Text>
        <TouchableOpacity 
          style={[
            styles.flashButton, 
            { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
            flashEnabled && { backgroundColor: 'rgba(255, 215, 0, 0.3)' }
          ]} 
          onPress={toggleFlash}
        >
          <Flashlight size={24} color={flashEnabled ? theme.colors.secondary : theme.colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          enableTorch={flashEnabled}
        >
          <View style={styles.overlay}>
            <View style={styles.scanArea}>
              <View style={[styles.corner, styles.topLeft, { borderColor: theme.colors.secondary }]} />
              <View style={[styles.corner, styles.topRight, { borderColor: theme.colors.secondary }]} />
              <View style={[styles.corner, styles.bottomLeft, { borderColor: theme.colors.secondary }]} />
              <View style={[styles.corner, styles.bottomRight, { borderColor: theme.colors.secondary }]} />
            </View>
          </View>
        </CameraView>
      </View>

      <View style={[styles.instructions, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.instructionTitle, { color: theme.colors.text }]}>Position QR code in the frame</Text>
        <Text style={[styles.instructionText, { color: theme.colors.textMuted }]}>
          Align the QR code within the square to scan the wallet address
        </Text>
        
        {scanned && (
          <TouchableOpacity 
            style={[styles.scanAgainButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => setScanned(false)}
          >
            <Text style={[styles.scanAgainText, { color: theme.colors.white }]}>Scan Again</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(0, 106, 78, 0.9)',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  flashButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  flashButtonActive: {
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  permissionTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  permissionButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  permissionButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  instructions: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
  },
  instructionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
  scanAgainButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  scanAgainText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});