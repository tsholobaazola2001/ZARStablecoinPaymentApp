import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, QrCode, User } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { sendPayment } from '@/services/liskService';
import { sendWhatsAppNotification } from '@/services/whatsappService';
import { useLocalSearchParams } from 'expo-router';

export default function SendScreen() {
  const { theme } = useTheme();
  const params = useLocalSearchParams();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  // Set recipient address from QR scan if provided
  React.useEffect(() => {
    if (params.recipientAddress) {
      setRecipient(params.recipientAddress as string);
    }
  }, [params.recipientAddress]);

  const handleScanQR = () => {
    router.push('/scanner');
  };

  const handleSend = async () => {
    if (!recipient || !amount) {
      Alert.alert('Error', 'Please fill in recipient address and amount');
      return;
    }

    if (parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Amount must be greater than 0');
      return;
    }

    setLoading(true);
    try {
      // Send payment via blockchain
      const txHash = await sendPayment(recipient, amount);
      
      // Send WhatsApp notification
      await sendWhatsAppNotification(
        `Payment of R${amount} ZAR sent successfully! Transaction ID: ${txHash}`
      );

      Alert.alert(
        'Success',
        `Payment of R${amount} sent successfully!\nTransaction ID: ${txHash}`,
        [{ text: 'OK', onPress: () => {
          setRecipient('');
          setAmount('');
          setNote('');
          router.push('/');
        }}]
      );
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Error', 'Failed to send payment. Please try again.');
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Send size={32} color={theme.colors.primary} />
          <Text style={[styles.title, { color: theme.colors.text }]}>Send Payment</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>Transfer ZAR stablecoins instantly</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Recipient Address</Text>
            <View style={[styles.inputWrapper, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <User size={20} color={theme.colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                placeholder="Enter wallet address or scan QR"
                value={recipient}
                onChangeText={setRecipient}
                multiline
                placeholderTextColor={theme.colors.textMuted}
              />
              <TouchableOpacity style={[styles.scanButton, { backgroundColor: theme.colors.background }]} onPress={handleScanQR}>
                <QrCode size={20} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Amount (ZAR)</Text>
            <View style={[styles.amountWrapper, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Text style={[styles.currencySymbol, { color: theme.colors.primary }]}>R</Text>
              <TextInput
                style={[styles.amountInput, { color: theme.colors.text }]}
                placeholder="0.00"
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                placeholderTextColor={theme.colors.textMuted}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Note (Optional)</Text>
            <TextInput
              style={[styles.noteInput, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text }]}
              placeholder="Add a note for this transaction"
              value={note}
              onChangeText={setNote}
              multiline
              placeholderTextColor={theme.colors.textMuted}
            />
          </View>

          <TouchableOpacity 
            style={[
              styles.sendButton, 
              { backgroundColor: theme.colors.primary },
              loading && { backgroundColor: theme.colors.textMuted }
            ]}
            onPress={handleSend}
            disabled={loading}
          >
            <Send size={20} color={theme.colors.white} />
            <Text style={[styles.sendButtonText, { color: theme.colors.white }]}>
              {loading ? 'Sending...' : 'Send Payment'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
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
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    paddingVertical: 12,
    minHeight: 48,
  },
  scanButton: {
    padding: 8,
    borderRadius: 8,
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
    fontSize: 24,
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
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  sendButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginLeft: 8,
  },
});