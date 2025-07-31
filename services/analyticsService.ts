// Analytics and AI Assistant service for spending insights
export interface SpendingCategory {
  name: string;
  amount: string;
  percentage: number;
  color: string;
}

export interface SpendingAnalytics {
  totalSpent: string;
  categories: SpendingCategory[];
  monthlyTrend: string;
  weeklySpending: string;
}

export async function getSpendingAnalytics(): Promise<SpendingAnalytics> {
  try {
    // In real implementation, fetch from database
    // const analytics = await database.getSpendingAnalytics();
    
    // Mock data for demo
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      totalSpent: '1,250.75',
      categories: [
        { name: 'Food & Dining', amount: '450.25', percentage: 36, color: '#FF6B6B' },
        { name: 'Transport', amount: '320.50', percentage: 26, color: '#4ECDC4' },
        { name: 'Shopping', amount: '280.00', percentage: 22, color: '#45B7D1' },
        { name: 'Utilities', amount: '200.00', percentage: 16, color: '#96CEB4' },
      ],
      monthlyTrend: '+12.5%',
      weeklySpending: '285.30'
    };
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
}

export async function askAIAssistant(question: string): Promise<string> {
  try {
    console.log('AI Question:', question);
    
    // In real implementation, integrate with OpenAI or similar AI service
    // const response = await openai.chat.completions.create({
    //   model: "gpt-3.5-turbo",
    //   messages: [
    //     {
    //       role: "system",
    //       content: "You are a financial assistant helping users understand their spending patterns. Analyze their transaction history and provide helpful insights."
    //     },
    //     {
    //       role: "user",
    //       content: question
    //     }
    //   ]
    // });
    
    // Mock AI responses for demo
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const responses: { [key: string]: string } = {
      'food': 'Based on your transaction history, you spent R450.25 on food and dining this month. This represents 36% of your total spending. Your average daily food spending is R15.01.',
      'transport': 'Your transport expenses totaled R320.50 this month, which is 26% of your spending. This includes ride-sharing services and public transport.',
      'biggest': 'Your biggest expense category is Food & Dining at R450.25 (36% of total spending), followed by Transport at R320.50 (26%).',
      'week': 'This week you spent R285.30 across 7 transactions. Your daily average was R40.76.',
      'trend': 'Your spending has increased by 12.5% compared to last month. The main drivers are increased food delivery orders and transport costs.'
    };
    
    // Simple keyword matching for demo
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('food') || lowerQuestion.includes('dining')) {
      return responses.food;
    } else if (lowerQuestion.includes('transport')) {
      return responses.transport;
    } else if (lowerQuestion.includes('biggest') || lowerQuestion.includes('most')) {
      return responses.biggest;
    } else if (lowerQuestion.includes('week')) {
      return responses.week;
    } else if (lowerQuestion.includes('trend')) {
      return responses.trend;
    } else {
      return `I analyzed your spending patterns for "${question}". Based on your recent transactions, you've been spending an average of R41.69 per day. Your top categories are Food & Dining (36%) and Transport (26%). Would you like me to provide more specific insights about any particular category?`;
    }
  } catch (error) {
    console.error('AI Assistant error:', error);
    throw new Error('Unable to process your question at the moment. Please try again.');
  }
}

export async function categorizeTransaction(description: string, amount: number): Promise<string> {
  try {
    // In real implementation, use AI to categorize transactions
    // const category = await openai.categorize(description, amount);
    
    // Simple rule-based categorization for demo
    const desc = description.toLowerCase();
    
    if (desc.includes('uber') || desc.includes('taxi') || desc.includes('transport')) {
      return 'Transport';
    } else if (desc.includes('food') || desc.includes('restaurant') || desc.includes('cafe')) {
      return 'Food & Dining';
    } else if (desc.includes('shop') || desc.includes('store') || desc.includes('mall')) {
      return 'Shopping';
    } else if (desc.includes('electricity') || desc.includes('water') || desc.includes('utility')) {
      return 'Utilities';
    } else {
      return 'Other';
    }
  } catch (error) {
    console.error('Categorization error:', error);
    return 'Other';
  }
}

export async function generateSpendingReport(period: 'week' | 'month' | 'year'): Promise<string> {
  try {
    const analytics = await getSpendingAnalytics();
    
    const report = `
# Spending Report - ${period.charAt(0).toUpperCase() + period.slice(1)}

## Summary
- Total Spent: R${analytics.totalSpent}
- Trend: ${analytics.monthlyTrend}
- Average Daily: R${(parseFloat(analytics.totalSpent.replace(',', '')) / 30).toFixed(2)}

## Top Categories
${analytics.categories.map(cat => 
  `- ${cat.name}: R${cat.amount} (${cat.percentage}%)`
).join('\n')}

## Insights
- Your biggest expense category is ${analytics.categories[0].name}
- Consider setting a budget for categories over 25% of spending
- Your spending trend is ${analytics.monthlyTrend} compared to last ${period}
    `.trim();
    
    return report;
  } catch (error) {
    console.error('Report generation error:', error);
    throw error;
  }
}