// WhatsApp Business API integration for transaction notifications
import axios from 'axios';

// In production, these would come from environment variables
const WHATSAPP_TOKEN = 'YOUR_WHATSAPP_BUSINESS_TOKEN';
const PHONE_NUMBER_ID = 'YOUR_PHONE_NUMBER_ID';
const WHATSAPP_API_URL = 'https://graph.facebook.com/v19.0';

export interface WhatsAppMessage {
  to: string;
  message: string;
  type?: 'text' | 'template';
}

export async function sendWhatsAppNotification(message: string, phoneNumber?: string): Promise<void> {
  try {
    // For demo purposes, we'll just log the message
    console.log('WhatsApp Notification:', message);
    
    // In production, uncomment and configure:
    /*
    const payload = {
      messaging_product: 'whatsapp',
      to: phoneNumber || 'USER_PHONE_NUMBER',
      type: 'text',
      text: {
        preview_url: false,
        body: message
      }
    };

    const response = await axios.post(
      `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('WhatsApp message sent successfully:', response.data);
    */
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
  } catch (error) {
    console.error('WhatsApp notification error:', error);
    // Don't throw error to prevent payment from failing due to notification issues
  }
}

export async function sendTransactionAlert(
  type: 'sent' | 'received',
  amount: string,
  contactName: string,
  txHash: string,
  phoneNumber?: string
): Promise<void> {
  try {
    const messageType = type === 'sent' ? 'sent to' : 'received from';
    const message = `
🏦 ZAR Payment ${type === 'sent' ? 'Sent' : 'Received'}

💰 Amount: R${amount} ZAR
${type === 'sent' ? '👤 To:' : '👤 From:'} ${contactName}
📋 Transaction ID: ${txHash}
⏰ ${new Date().toLocaleString()}

✅ Transaction completed successfully
    `.trim();

    await sendWhatsAppNotification(message, phoneNumber);
  } catch (error) {
    console.error('Error sending transaction alert:', error);
  }
}

export async function sendPaymentReminder(
  recipientName: string,
  amount: string,
  phoneNumber: string
): Promise<void> {
  try {
    const message = `
💳 Payment Reminder

Hi ${recipientName}, you have a pending payment request:

💰 Amount: R${amount} ZAR
🔗 Use the ZAR Pay app to complete this transaction

Download: [App Store Link]
    `.trim();

    await sendWhatsAppNotification(message, phoneNumber);
  } catch (error) {
    console.error('Error sending payment reminder:', error);
  }
}

// Setup webhook handler for WhatsApp message status updates
export function setupWhatsAppWebhook() {
  // In production, implement webhook endpoint to handle:
  // - Message delivery status
  // - Read receipts
  // - User responses
  console.log('WhatsApp webhook handler would be set up here');
}