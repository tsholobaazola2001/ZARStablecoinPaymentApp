// Payment request and deep linking service
export interface PaymentRequest {
  id: string;
  recipient: string;
  amount: string;
  note?: string;
  expiresAt: Date;
  status: 'pending' | 'paid' | 'expired';
  createdAt: Date;
}

export async function generatePaymentRequest(
  recipient: string,
  amount: string,
  note?: string,
  expiresIn: number = 24 * 60 * 60 * 1000 // 24 hours
): Promise<PaymentRequest> {
  try {
    const paymentRequest: PaymentRequest = {
      id: 'req_' + Math.random().toString(36).substr(2, 9),
      recipient,
      amount,
      note,
      expiresAt: new Date(Date.now() + expiresIn),
      status: 'pending',
      createdAt: new Date()
    };

    // In real implementation, save to database
    // await database.savePaymentRequest(paymentRequest);
    
    console.log('Payment request created:', paymentRequest);
    return paymentRequest;
  } catch (error) {
    console.error('Error creating payment request:', error);
    throw error;
  }
}

export function generatePaymentURL(paymentRequest: PaymentRequest): string {
  const baseUrl = 'zarpay://pay';
  const params = new URLSearchParams({
    recipient: paymentRequest.recipient,
    amount: paymentRequest.amount,
    id: paymentRequest.id,
    ...(paymentRequest.note && { note: paymentRequest.note })
  });
  
  return `${baseUrl}?${params.toString()}`;
}

export function generatePaymentQRData(paymentRequest: PaymentRequest): string {
  return generatePaymentURL(paymentRequest);
}

export async function processPaymentRequest(requestId: string): Promise<PaymentRequest | null> {
  try {
    // In real implementation, fetch from database
    // const request = await database.getPaymentRequest(requestId);
    
    // Mock implementation
    console.log('Processing payment request:', requestId);
    
    // Check if request exists and is valid
    const mockRequest: PaymentRequest = {
      id: requestId,
      recipient: 'lsk24cd35u4jdq8szo3pnsqe5dsxwrnazyqqqg5eu',
      amount: '150.00',
      note: 'Coffee payment',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      status: 'pending',
      createdAt: new Date()
    };
    
    if (mockRequest.expiresAt < new Date()) {
      mockRequest.status = 'expired';
      return null;
    }
    
    return mockRequest;
  } catch (error) {
    console.error('Error processing payment request:', error);
    return null;
  }
}

export async function markPaymentRequestAsPaid(requestId: string, txHash: string): Promise<void> {
  try {
    // In real implementation, update database
    // await database.updatePaymentRequest(requestId, { status: 'paid', txHash });
    
    console.log(`Payment request ${requestId} marked as paid with tx: ${txHash}`);
  } catch (error) {
    console.error('Error marking payment request as paid:', error);
    throw error;
  }
}

export function parsePaymentURL(url: string): PaymentRequest | null {
  try {
    const urlObj = new URL(url);
    
    if (urlObj.protocol !== 'zarpay:' || urlObj.pathname !== '//pay') {
      return null;
    }
    
    const params = urlObj.searchParams;
    const recipient = params.get('recipient');
    const amount = params.get('amount');
    const id = params.get('id');
    const note = params.get('note');
    
    if (!recipient || !amount || !id) {
      return null;
    }
    
    return {
      id,
      recipient,
      amount,
      note: note || undefined,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      status: 'pending',
      createdAt: new Date()
    };
  } catch (error) {
    console.error('Error parsing payment URL:', error);
    return null;
  }
}