import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowUpRight, ArrowDownLeft, Clock, CircleCheck as CheckCircle } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface Transaction {
  id: string;
  type: 'sent' | 'received';
  amount: string;
  from?: string;
  to?: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
}

interface TransactionItemProps {
  transaction: Transaction;
}

export default function TransactionItem({ transaction }: TransactionItemProps) {
  const { theme } = useTheme();
  const isSent = transaction.type === 'sent';
  const contact = isSent ? transaction.to : transaction.from;
  
  const getStatusIcon = () => {
    switch (transaction.status) {
      case 'completed':
        return <CheckCircle size={16} color={theme.colors.success} />;
      case 'pending':
        return <Clock size={16} color={theme.colors.warning} />;
      case 'failed':
        return <CheckCircle size={16} color={theme.colors.error} />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (transaction.status) {
      case 'completed':
        return theme.colors.success;
      case 'pending':
        return theme.colors.warning;
      case 'failed':
        return theme.colors.error;
      default:
        return theme.colors.textMuted;
    }
  };

  return (
    <TouchableOpacity style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.leftSection}>
        <View style={[styles.iconContainer, isSent ? styles.sentIcon : styles.receivedIcon]}>
          {isSent ? (
            <ArrowUpRight size={20} color={theme.colors.white} />
          ) : (
            <ArrowDownLeft size={20} color={theme.colors.white} />
          )}
        </View>
        
        <View style={styles.details}>
          <Text style={[styles.type, { color: theme.colors.textMuted }]}>
            {isSent ? 'Sent to' : 'Received from'}
          </Text>
          <Text style={[styles.contact, { color: theme.colors.text }]}>{contact}</Text>
          <View style={styles.statusRow}>
            {getStatusIcon()}
            <Text style={[styles.status, { color: getStatusColor() }]}>
              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.rightSection}>
        <Text style={[styles.amount, isSent ? styles.sentAmount : styles.receivedAmount]}>
          {isSent ? '-' : '+'}R{transaction.amount}
        </Text>
        <Text style={[styles.timestamp, { color: theme.colors.textMuted }]}>{transaction.timestamp}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sentIcon: {
    backgroundColor: '#EF4444',
  },
  receivedIcon: {
    backgroundColor: '#10B981',
  },
  details: {
    flex: 1,
  },
  type: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  contact: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginTop: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  status: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginLeft: 4,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  sentAmount: {
    color: '#EF4444',
  },
  receivedAmount: {
    color: '#10B981',
  },
  timestamp: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
});