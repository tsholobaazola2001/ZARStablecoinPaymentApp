import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { QrCode, Copy, Share2, Wallet, DollarSign } from 'lucide-react-native';
import QRCode from 'react-native-qrcode-svg';
import { useTheme } from '@/contexts/ThemeContext';
import * as Clipboard from 'expo-clipboard';

export default function ReceiveScreen() {
  const { theme } = useTheme();
  const [walletAddress] = useState('lsk24cd35u4jdq8szo3pnsqe5dsxwrnazyqqqg5eu');
  const [showPaymentRequest, setShowPaymentRequest] = useState(false);
  const [requestAmount, setRequestAmount] = useState('');
  const [requestNote, setRequestNote] = useState('');

  const qrData = showPaymentRequest 
    ? JSON.stringify({
        address: walletAddress,
        amount: requestAmount,
        note: requestNote,
        currency: 'ZAR'
      })
    : walletAddress;

  const handleCopy = async () => {
    try {
      await Clipboard.setStringAsync(showPaymentRequest ? qrData : walletAddress);
      Alert.alert('Copied!', 'Address copied to clipboard');
    } catch (error) {
      Alert.alert('Error', 'Failed to copy to clipboard');
    }
  };

  const handleShare = async () => {
    try {
      const shareContent = showPaymentRequest 
        ? `Payment Request\nAmount: R${requestAmount} ZAR\nAddress: ${walletAddress}${requestNote ? `\nNote: ${requestNote}` : ''}`
        : `My Wallet Address: ${walletAddress}`;
        
      await Share.share({
        message: shareContent,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <QrCode size={32} color={theme.colors.primary} />
          <Text style={[styles.title, { color: theme.colors.text }]}>Receive Payment</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>Share your wallet address or create a payment request</Text>
        </View>

        {/* Toggle Buttons */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
              !showPaymentRequest && { backgroundColor: theme.colors.primary }
            ]}
            onPress={() => setShowPaymentRequest(false)}
          >
            <Wallet size={20} color={!showPaymentRequest ? theme.colors.white : theme.colors.textMuted} />
            <Text style={[
              styles.toggleText,
              { color: theme.colors.textMuted },
              !showPaymentRequest && { color: theme.colors.white }
            ]}>
              My Address
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.toggleButton,
              { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
              showPaymentRequest && { backgroundColor: theme.colors.primary }
            ]}
            onPress={() => setShowPaymentRequest(true)}
          >
            <DollarSign size={20} color={showPaymentRequest ? theme.colors.white : theme.colors.textMuted} />
            <Text style={[
              styles.toggleText,
              { color: theme.colors.textMuted },
              showPaymentRequest && { color: theme.colors.white }
            ]}>
              Request Payment
            </Text>
          </TouchableOpacity>
        </View>

        {/* Payment Request Form */}
        {showPaymentRequest && (
          <View style={styles.paymentRequestForm}>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Amount (ZAR)</Text>
              <View style={[styles.amountWrapper, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <Text style={[styles.currencySymbol, { color: theme.colors.primary }]}>R</Text>
                <TextInput
                  style={[styles.amountInput, { color: theme.colors.text }]}
                  placeholder="0.00"
                  value={requestAmount}
                  onChangeText={setRequestAmount}
                  keyboardType="decimal-pad"
                  placeholderTextColor={theme.colors.textMuted}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Note (Optional)</Text>
              <TextInput
                style={[styles.noteInput, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text }]}
                placeholder="What's this payment for?"
                value={requestNote}
                onChangeText={setRequestNote}
                multiline
                placeholderTextColor={theme.colors.textMuted}
              />
            </View>
          </View>
        )}

        {/* QR Code Display */}
        <View style={[styles.qrContainer, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.qrCodeWrapper}>
            <QRCode
              value={qrData}
              size={200}
              backgroundColor={theme.colors.surface}
              color={theme.colors.text}
              logoSize={40}
              logoMargin={8}
              logoBorderRadius={8}
            />
          </View>
          
          <Text style={[styles.qrLabel, { color: theme.colors.textMuted }]}>
            {showPaymentRequest ? 'Payment Request QR Code' : 'Wallet Address QR Code'}
          </Text>
          
          {showPaymentRequest && requestAmount && (
            <Text style={[styles.requestDetails, { color: theme.colors.text }]}>
              Amount: R{requestAmount} ZAR
              {requestNote && `\nNote: ${requestNote}`}
            </Text>
          )}
        </View>

        {/* Address Display */}
        <View style={[styles.addressContainer, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.addressLabel, { color: theme.colors.textMuted }]}>
            {showPaymentRequest ? 'Payment Request Data' : 'Wallet Address'}
          </Text>
          <Text style={[styles.addressText, { color: theme.colors.text }]}>
            {showPaymentRequest ? qrData : walletAddress}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.copyButton, { backgroundColor: theme.colors.surface }]}
            onPress={handleCopy}
          >
            <Copy size={20} color={theme.colors.primary} />
            <Text style={[styles.copyButtonText, { color: theme.colors.primary }]}>Copy</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.shareButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleShare}
          >
            <Share2 size={20} color={theme.colors.white} />
            <Text style={[styles.shareButtonText, { color: theme.colors.white }]}>Share</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginTop: 8,
    textAlign: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  toggleText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
  paymentRequestForm: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  amountWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  currencySymbol: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    paddingVertical: 16,
  },
  noteInput: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  qrContainer: {
    marginHorizontal: 20,
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  qrCodeWrapper: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
  },
  qrLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
    marginBottom: 8,
  },
  requestDetails: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
  addressContainer: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addressLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  addressText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  copyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  copyButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginLeft: 8,
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  shareButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginLeft: 8,
  },
});