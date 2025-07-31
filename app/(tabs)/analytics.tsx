import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChartBar as BarChart3, ChartPie as PieChart, TrendingUp, MessageCircle, Calendar, Receipt } from 'lucide-react-native';
import { getSpendingAnalytics, askAIAssistant } from '@/services/analyticsService';
import { useTheme } from '@/contexts/ThemeContext';

export default function AnalyticsScreen() {
  const { theme } = useTheme();
  const [analytics, setAnalytics] = useState({
    totalSpent: '1,250.75',
    categories: [
      { name: 'Food & Dining', amount: '450.25', percentage: 36, color: '#FF6B6B' },
      { name: 'Transport', amount: '320.50', percentage: 26, color: '#4ECDC4' },
      { name: 'Shopping', amount: '280.00', percentage: 22, color: '#45B7D1' },
      { name: 'Utilities', amount: '200.00', percentage: 16, color: '#96CEB4' },
    ],
    monthlyTrend: '+12.5%',
    weeklySpending: '285.30'
  });
  
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAIQuestion = async () => {
    if (!aiQuestion.trim()) return;
    
    setLoading(true);
    try {
      const response = await askAIAssistant(aiQuestion);
      setAiResponse(response);
    } catch (error) {
      Alert.alert('Error', 'Failed to get AI response');
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <BarChart3 size={32} color={theme.colors.primary} />
          <Text style={[styles.title, { color: theme.colors.text }]}>Analytics & Insights</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>Track your spending patterns</Text>
        </View>

        {/* Overview Cards */}
        <View style={styles.overviewContainer}>
          <View style={[styles.overviewCard, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.overviewLabel, { color: theme.colors.textMuted }]}>This Month</Text>
            <Text style={[styles.overviewAmount, { color: theme.colors.text }]}>R {analytics.totalSpent}</Text>
            <View style={styles.trendContainer}>
              <TrendingUp size={16} color={theme.colors.success} />
              <Text style={[styles.trendText, { color: theme.colors.success }]}>{analytics.monthlyTrend}</Text>
            </View>
          </View>
          
          <View style={[styles.overviewCard, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.overviewLabel, { color: theme.colors.textMuted }]}>This Week</Text>
            <Text style={[styles.overviewAmount, { color: theme.colors.text }]}>R {analytics.weeklySpending}</Text>
            <Text style={[styles.overviewSubtext, { color: theme.colors.textMuted }]}>7 transactions</Text>
          </View>
        </View>

        {/* Spending Categories */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Spending by Category</Text>
          <View style={[styles.categoriesContainer, { backgroundColor: theme.colors.surface }]}>
            {analytics.categories.map((category, index) => (
              <View key={index} style={styles.categoryItem}>
                <View style={styles.categoryHeader}>
                  <View style={[styles.categoryColor, { backgroundColor: category.color }]} />
                  <Text style={[styles.categoryName, { color: theme.colors.text }]}>{category.name}</Text>
                  <Text style={[styles.categoryAmount, { color: theme.colors.text }]}>R {category.amount}</Text>
                </View>
                <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${category.percentage}%`, backgroundColor: category.color }
                    ]} 
                  />
                </View>
                <Text style={[styles.categoryPercentage, { color: theme.colors.textMuted }]}>{category.percentage}%</Text>
              </View>
            ))}
          </View>
        </View>

        {/* AI Assistant */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>AI Spending Assistant</Text>
          <View style={[styles.aiContainer, { backgroundColor: theme.colors.surface }]}>
            <View style={[styles.aiInputContainer, { backgroundColor: theme.colors.background }]}>
              <MessageCircle size={20} color={theme.colors.textMuted} style={styles.aiIcon} />
              <TextInput
                style={[styles.aiInput, { color: theme.colors.text }]}
                placeholder="Ask about your spending..."
                value={aiQuestion}
                onChangeText={setAiQuestion}
                placeholderTextColor={theme.colors.textMuted}
              />
              <TouchableOpacity 
                style={[styles.aiButton, { backgroundColor: theme.colors.primary }]} 
                onPress={handleAIQuestion}
                disabled={loading}
              >
                <Text style={[styles.aiButtonText, { color: theme.colors.white }]}>
                  {loading ? 'Thinking...' : 'Ask'}
                </Text>
              </TouchableOpacity>
            </View>
            
            {aiResponse ? (
              <View style={[styles.aiResponse, { backgroundColor: theme.isDark ? 'rgba(16, 185, 129, 0.1)' : '#F0FDF4', borderLeftColor: theme.colors.success }]}>
                <Text style={[styles.aiResponseText, { color: theme.isDark ? theme.colors.success : '#047857' }]}>{aiResponse}</Text>
              </View>
            ) : null}
            
            <View style={styles.aiSuggestions}>
              <Text style={[styles.aiSuggestionsTitle, { color: theme.colors.textMuted }]}>Try asking:</Text>
              {[
                "How much did I spend on food this week?",
                "What's my biggest expense category?",
                "Show me my transport spending trend"
              ].map((suggestion, index) => (
                <TouchableOpacity 
                  key={index}
                  style={[styles.aiSuggestion, { backgroundColor: theme.colors.background }]}
                  onPress={() => setAiQuestion(suggestion)}
                >
                  <Text style={[styles.aiSuggestionText, { color: theme.colors.textSecondary }]}>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={[styles.quickAction, { backgroundColor: theme.colors.surface }]}>
              <Calendar size={24} color={theme.colors.primary} />
              <Text style={[styles.quickActionText, { color: theme.colors.text }]}>Schedule Payment</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.quickAction, { backgroundColor: theme.colors.surface }]}>
              <Receipt size={24} color={theme.colors.primary} />
              <Text style={[styles.quickActionText, { color: theme.colors.text }]}>Generate Receipt</Text>
            </TouchableOpacity>
          </View>
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
  overviewContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 32,
  },
  overviewCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  overviewLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
  },
  overviewAmount: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 4,
  },
  overviewSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
  },
  categoriesContainer: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryItem: {
    marginBottom: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryName: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  categoryAmount: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  categoryPercentage: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'right',
  },
  aiContainer: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  aiInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  aiIcon: {
    marginRight: 12,
  },
  aiInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    paddingVertical: 12,
  },
  aiButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  aiButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  aiResponse: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
  },
  aiResponseText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
  },
  aiSuggestions: {
    marginTop: 8,
  },
  aiSuggestionsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  aiSuggestion: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  aiSuggestionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  quickAction: {
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
  quickActionText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginTop: 8,
    textAlign: 'center',
  },
});