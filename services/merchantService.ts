// Merchant dashboard and business payment tracking
export interface MerchantTransaction {
  id: string;
  type: 'payment' | 'refund';
  amount: string;
  customerAddress: string;
  customerName?: string;
  productName?: string;
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed';
  txHash: string;
  note?: string;
}

export interface MerchantStats {
  todayRevenue: string;
  weeklyRevenue: string;
  monthlyRevenue: string;
  totalTransactions: number;
  averageTransaction: string;
  topProducts: Array<{
    name: string;
    sales: number;
    revenue: string;
  }>;
}

export async function getMerchantStats(): Promise<MerchantStats> {
  try {
    // In real implementation, fetch from database
    // const stats = await database.getMerchantStats();
    
    // Mock data for demo
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      todayRevenue: '2,450.75',
      weeklyRevenue: '18,320.50',
      monthlyRevenue: '75,680.25',
      totalTransactions: 156,
      averageTransaction: '485.26',
      topProducts: [
        { name: 'Coffee & Pastries', sales: 45, revenue: '1,350.00' },
        { name: 'Lunch Specials', sales: 32, revenue: '2,240.00' },
        { name: 'Beverages', sales: 28, revenue: '840.00' },
      ]
    };
  } catch (error) {
    console.error('Error fetching merchant stats:', error);
    throw error;
  }
}

export async function getMerchantTransactions(
  limit: number = 50,
  offset: number = 0
): Promise<MerchantTransaction[]> {
  try {
    // In real implementation, fetch from database
    // const transactions = await database.getMerchantTransactions(limit, offset);
    
    // Mock data for demo
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const mockTransactions: MerchantTransaction[] = [
      {
        id: 'merch_tx_001',
        type: 'payment',
        amount: '85.50',
        customerAddress: 'lsk24cd35u4jdq8szo3pnsqe5dsxwrnazyqqqg5eu',
        customerName: 'John Doe',
        productName: 'Coffee & Croissant',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        status: 'completed',
        txHash: 'tx_merchant_abc123',
        note: 'Table 5 - Morning order'
      },
      {
        id: 'merch_tx_002',
        type: 'payment',
        amount: '125.00',
        customerAddress: 'lsk98765432109876543210987654321098765432',
        customerName: 'Sarah Smith',
        productName: 'Lunch Special',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        status: 'completed',
        txHash: 'tx_merchant_def456',
        note: 'Takeaway order'
      },
      {
        id: 'merch_tx_003',
        type: 'refund',
        amount: '45.00',
        customerAddress: 'lsk11111111111111111111111111111111111111',
        customerName: 'Mike Johnson',
        productName: 'Sandwich',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        status: 'completed',
        txHash: 'tx_merchant_ghi789',
        note: 'Order cancelled - customer request'
      }
    ];
    
    return mockTransactions;
  } catch (error) {
    console.error('Error fetching merchant transactions:', error);
    throw error;
  }
}

export async function processRefund(
  originalTxId: string,
  refundAmount: string,
  reason: string
): Promise<string> {
  try {
    console.log(`Processing refund for transaction ${originalTxId}: R${refundAmount}`);
    
    // In real implementation, process blockchain refund
    // const refundTx = await sendPayment(customerAddress, refundAmount);
    
    // Mock refund processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const refundTxHash = 'refund_' + Math.random().toString(36).substr(2, 9);
    
    // Record refund transaction
    const refundTransaction: MerchantTransaction = {
      id: 'refund_' + Math.random().toString(36).substr(2, 9),
      type: 'refund',
      amount: refundAmount,
      customerAddress: 'lsk24cd35u4jdq8szo3pnsqe5dsxwrnazyqqqg5eu',
      timestamp: new Date(),
      status: 'completed',
      txHash: refundTxHash,
      note: `Refund: ${reason}`
    };
    
    // In real implementation, save to database
    // await database.saveMerchantTransaction(refundTransaction);
    
    console.log('Refund processed successfully:', refundTxHash);
    return refundTxHash;
  } catch (error) {
    console.error('Error processing refund:', error);
    throw error;
  }
}

export async function generateMerchantQR(
  amount: string,
  productName?: string,
  note?: string
): Promise<string> {
  try {
    // Generate merchant-specific payment QR
    const merchantAddress = 'lsk_merchant_address_here';
    
    const paymentData = {
      recipient: merchantAddress,
      amount,
      type: 'merchant_payment',
      ...(productName && { product: productName }),
      ...(note && { note })
    };
    
    return JSON.stringify(paymentData);
  } catch (error) {
    console.error('Error generating merchant QR:', error);
    throw error;
  }
}

export async function exportTransactionReport(
  startDate: Date,
  endDate: Date,
  format: 'csv' | 'pdf' = 'csv'
): Promise<string> {
  try {
    const transactions = await getMerchantTransactions(1000);
    
    // Filter transactions by date range
    const filteredTransactions = transactions.filter(tx => 
      tx.timestamp >= startDate && tx.timestamp <= endDate
    );
    
    if (format === 'csv') {
      const csvHeader = 'Date,Type,Amount,Customer,Product,Status,Transaction Hash,Note\n';
      const csvRows = filteredTransactions.map(tx => 
        `${tx.timestamp.toISOString()},${tx.type},${tx.amount},${tx.customerName || 'Unknown'},${tx.productName || 'N/A'},${tx.status},${tx.txHash},"${tx.note || ''}"`
      ).join('\n');
      
      return csvHeader + csvRows;
    } else {
      // For PDF, return formatted text (in real implementation, generate actual PDF)
      const report = `
MERCHANT TRANSACTION REPORT
Period: ${startDate.toDateString()} - ${endDate.toDateString()}

Total Transactions: ${filteredTransactions.length}
Total Revenue: R${filteredTransactions
  .filter(tx => tx.type === 'payment')
  .reduce((sum, tx) => sum + parseFloat(tx.amount), 0)
  .toFixed(2)}

TRANSACTION DETAILS:
${filteredTransactions.map(tx => 
  `${tx.timestamp.toLocaleString()} | ${tx.type.toUpperCase()} | R${tx.amount} | ${tx.customerName || 'Unknown'} | ${tx.status}`
).join('\n')}
      `.trim();
      
      return report;
    }
  } catch (error) {
    console.error('Error exporting transaction report:', error);
    throw error;
  }
}