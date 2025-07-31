import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Wallet, TrendingUp, Activity, RefreshCw } from 'lucide-react-native';
import TransactionItem from '@/components/TransactionItem';
import ThemeToggle from '@/components/ThemeToggle';
import { useTheme } from '@/contexts/ThemeContext';
import { getLiskBalance, getTransactionHistory } from '@/services/liskService';

export default function HomeScreen() {
  const { theme } = useTheme();
  const [balance, setBalance] = useState('2,450.75');
  const [transactions, setTransactions] = useState([
    {
      id: '1',
      type: 'received',
      amount: '150.00',
      from: 'John Doe',
      timestamp: '2 hours ago',
      status: 'completed'
    },
    {
      id: '2',
      type: 'sent',
      amount: '75.50',
      to: 'Sarah Smith',
      timestamp: '1 day ago',
      status: 'completed'
    },
    {
      id: '3',
      type: 'received',
      amount: '300.00',
      from: 'Mike Johnson',
      timestamp: '2 days ago',
      status: 'completed'
    }
  ]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // In real app, fetch from blockchain
      // const newBalance = await getLiskBalance();
      // const newTransactions = await getTransactionHistory();
      // setBalance(newBalance);
      // setTransactions(newTransactions);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.colors.textMuted }]}>Good morning!</Text>
            <Text style={[styles.username, { color: theme.colors.text }]}>ZAR Wallet</Text>
          </View>
          <View style={styles.headerActions}>
            <ThemeToggle />
            <TouchableOpacity 
              style={[styles.refreshButton, { backgroundColor: theme.colors.surface }]} 
              onPress={onRefresh}
            >
              <RefreshCw size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Balance Card */}
        <View style={[styles.balanceCard, { backgroundColor: theme.colors.primary }]}>
          <View style={styles.balanceHeader}>
            <Wallet size={32} color={theme.colors.secondary} />
            <Text style={[styles.balanceLabel, { color: theme.colors.white }]}>Total Balance</Text>
          </View>
          <Text style={[styles.balanceAmount, { color: theme.colors.white }]}>R {balance}</Text>
          <Text style={[styles.balanceSubtext, { color: theme.colors.secondary }]}>ZAR Stablecoin</Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
            <TrendingUp size={24} color={theme.colors.success} />
            <Text style={[styles.statValue, { color: theme.colors.text }]}>+5.2%</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>This week</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
            <Activity size={24} color={theme.colors.accent} />
            <Text style={[styles.statValue, { color: theme.colors.text }]}>8</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>Transactions</Text>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.transactionsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Recent Transactions</Text>
          {transactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  greeting: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  username: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginTop: 4,
  },
  refreshButton: {
    padding: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceCard: {
    marginHorizontal: 20,
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 12,
  },
  balanceAmount: {
    fontSize: 48,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  balanceSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  transactionsSection: {
    paddingHorizontal: 20,
    marginTop: 32,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
  },
});