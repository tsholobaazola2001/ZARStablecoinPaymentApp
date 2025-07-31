// Scheduled and recurring payment service
export interface ScheduledPayment {
  id: string;
  recipient: string;
  recipientName: string;
  amount: string;
  frequency: 'once' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  nextPaymentDate: Date;
  lastPaymentDate?: Date;
  note?: string;
  isActive: boolean;
  createdAt: Date;
  endDate?: Date;
}

export async function createScheduledPayment(
  recipient: string,
  recipientName: string,
  amount: string,
  frequency: ScheduledPayment['frequency'],
  startDate: Date,
  note?: string,
  endDate?: Date
): Promise<ScheduledPayment> {
  try {
    const scheduledPayment: ScheduledPayment = {
      id: 'sched_' + Math.random().toString(36).substr(2, 9),
      recipient,
      recipientName,
      amount,
      frequency,
      nextPaymentDate: startDate,
      note,
      isActive: true,
      createdAt: new Date(),
      endDate
    };

    // In real implementation, save to database
    // await database.saveScheduledPayment(scheduledPayment);
    
    console.log('Scheduled payment created:', scheduledPayment);
    return scheduledPayment;
  } catch (error) {
    console.error('Error creating scheduled payment:', error);
    throw error;
  }
}

export async function getScheduledPayments(): Promise<ScheduledPayment[]> {
  try {
    // In real implementation, fetch from database
    // const payments = await database.getScheduledPayments();
    
    // Mock data for demo
    const mockPayments: ScheduledPayment[] = [
      {
        id: 'sched_rent001',
        recipient: 'lsk24cd35u4jdq8szo3pnsqe5dsxwrnazyqqqg5eu',
        recipientName: 'Landlord - Monthly Rent',
        amount: '8500.00',
        frequency: 'monthly',
        nextPaymentDate: new Date(2025, 1, 1), // Feb 1, 2025
        lastPaymentDate: new Date(2025, 0, 1), // Jan 1, 2025
        note: 'Monthly rent payment',
        isActive: true,
        createdAt: new Date(2024, 11, 1)
      },
      {
        id: 'sched_coffee001',
        recipient: 'lsk98765432109876543210987654321098765432',
        recipientName: 'Daily Coffee Subscription',
        amount: '45.00',
        frequency: 'daily',
        nextPaymentDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        lastPaymentDate: new Date(),
        note: 'Morning coffee subscription',
        isActive: true,
        createdAt: new Date(2024, 11, 15)
      }
    ];
    
    return mockPayments;
  } catch (error) {
    console.error('Error fetching scheduled payments:', error);
    throw error;
  }
}

export async function executeScheduledPayment(paymentId: string): Promise<string> {
  try {
    // In real implementation, fetch payment details and execute
    // const payment = await database.getScheduledPayment(paymentId);
    // const txHash = await sendPayment(payment.recipient, payment.amount);
    
    // Mock execution
    console.log('Executing scheduled payment:', paymentId);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const txHash = 'tx_sched_' + Math.random().toString(36).substr(2, 9);
    
    // Update next payment date
    await updateNextPaymentDate(paymentId);
    
    return txHash;
  } catch (error) {
    console.error('Error executing scheduled payment:', error);
    throw error;
  }
}

export async function updateNextPaymentDate(paymentId: string): Promise<void> {
  try {
    // In real implementation, calculate and update next payment date
    // const payment = await database.getScheduledPayment(paymentId);
    // const nextDate = calculateNextPaymentDate(payment.frequency, payment.nextPaymentDate);
    // await database.updateScheduledPayment(paymentId, { nextPaymentDate: nextDate, lastPaymentDate: new Date() });
    
    console.log('Updated next payment date for:', paymentId);
  } catch (error) {
    console.error('Error updating next payment date:', error);
    throw error;
  }
}

export function calculateNextPaymentDate(frequency: ScheduledPayment['frequency'], currentDate: Date): Date {
  const nextDate = new Date(currentDate);
  
  switch (frequency) {
    case 'daily':
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case 'yearly':
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
    case 'once':
      // One-time payment, don't update
      break;
  }
  
  return nextDate;
}

export async function cancelScheduledPayment(paymentId: string): Promise<void> {
  try {
    // In real implementation, update database
    // await database.updateScheduledPayment(paymentId, { isActive: false });
    
    console.log('Cancelled scheduled payment:', paymentId);
  } catch (error) {
    console.error('Error cancelling scheduled payment:', error);
    throw error;
  }
}

export async function checkDuePayments(): Promise<ScheduledPayment[]> {
  try {
    const allPayments = await getScheduledPayments();
    const now = new Date();
    
    return allPayments.filter(payment => 
      payment.isActive && 
      payment.nextPaymentDate <= now &&
      (!payment.endDate || payment.nextPaymentDate <= payment.endDate)
    );
  } catch (error) {
    console.error('Error checking due payments:', error);
    throw error;
  }
}