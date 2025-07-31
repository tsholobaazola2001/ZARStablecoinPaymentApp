// Receipt generation and PDF creation service
export interface Receipt {
  id: string;
  transactionHash: string;
  amount: string;
  recipient: string;
  recipientName?: string;
  sender: string;
  senderName?: string;
  timestamp: Date;
  note?: string;
  fee: string;
  status: 'completed' | 'pending' | 'failed';
}

export async function generateReceipt(
  transactionHash: string,
  amount: string,
  recipient: string,
  sender: string,
  note?: string
): Promise<Receipt> {
  try {
    const receipt: Receipt = {
      id: 'receipt_' + Math.random().toString(36).substr(2, 9),
      transactionHash,
      amount,
      recipient,
      sender,
      timestamp: new Date(),
      note,
      fee: '0.10', // Mock transaction fee
      status: 'completed'
    };

    // In real implementation, save to database
    // await database.saveReceipt(receipt);
    
    console.log('Receipt generated:', receipt);
    return receipt;
  } catch (error) {
    console.error('Error generating receipt:', error);
    throw error;
  }
}

export async function getReceipt(receiptId: string): Promise<Receipt | null> {
  try {
    // In real implementation, fetch from database
    // const receipt = await database.getReceipt(receiptId);
    
    // Mock receipt for demo
    const mockReceipt: Receipt = {
      id: receiptId,
      transactionHash: 'tx_abc123def456',
      amount: '150.00',
      recipient: 'lsk24cd35u4jdq8szo3pnsqe5dsxwrnazyqqqg5eu',
      recipientName: 'John Doe',
      sender: 'lsk98765432109876543210987654321098765432',
      senderName: 'Your Wallet',
      timestamp: new Date(),
      note: 'Coffee payment',
      fee: '0.10',
      status: 'completed'
    };
    
    return mockReceipt;
  } catch (error) {
    console.error('Error fetching receipt:', error);
    return null;
  }
}

export function formatReceiptText(receipt: Receipt): string {
  return `
═══════════════════════════════════
           ZAR PAY RECEIPT
═══════════════════════════════════

Receipt ID: ${receipt.id}
Transaction Hash: ${receipt.transactionHash}

Date: ${receipt.timestamp.toLocaleString()}
Status: ${receipt.status.toUpperCase()}

───────────────────────────────────

FROM: ${receipt.senderName || receipt.sender}
TO: ${receipt.recipientName || receipt.recipient}

AMOUNT: R${receipt.amount} ZAR
NETWORK FEE: R${receipt.fee} ZAR
TOTAL: R${(parseFloat(receipt.amount) + parseFloat(receipt.fee)).toFixed(2)} ZAR

${receipt.note ? `NOTE: ${receipt.note}` : ''}

───────────────────────────────────

This is an official receipt for your
ZAR stablecoin transaction on the
Lisk blockchain network.

For support, contact: support@zarpay.co.za
═══════════════════════════════════
  `.trim();
}

export async function generatePDFReceipt(receipt: Receipt): Promise<string> {
  try {
    // In real implementation, use a PDF generation library like react-native-pdf-lib
    // const pdfDoc = await PDFDocument.create();
    // const page = pdfDoc.addPage();
    // ... add receipt content to PDF
    // const pdfBytes = await pdfDoc.save();
    
    // For demo, return formatted text
    const receiptText = formatReceiptText(receipt);
    
    console.log('PDF Receipt generated for:', receipt.id);
    return receiptText;
  } catch (error) {
    console.error('Error generating PDF receipt:', error);
    throw error;
  }
}

export async function emailReceipt(
  receipt: Receipt,
  emailAddress: string
): Promise<void> {
  try {
    const receiptText = formatReceiptText(receipt);
    
    // In real implementation, integrate with email service
    // await emailService.send({
    //   to: emailAddress,
    //   subject: `ZAR Pay Receipt - ${receipt.id}`,
    //   text: receiptText,
    //   attachments: [
    //     {
    //       filename: `receipt-${receipt.id}.pdf`,
    //       content: await generatePDFReceipt(receipt)
    //     }
    //   ]
    // });
    
    console.log(`Receipt emailed to: ${emailAddress}`);
  } catch (error) {
    console.error('Error emailing receipt:', error);
    throw error;
  }
}

export async function shareReceipt(receipt: Receipt): Promise<void> {
  try {
    const receiptText = formatReceiptText(receipt);
    
    // In real implementation, use React Native Share
    // await Share.share({
    //   message: receiptText,
    //   title: `ZAR Pay Receipt - ${receipt.id}`,
    // });
    
    console.log('Receipt shared:', receipt.id);
  } catch (error) {
    console.error('Error sharing receipt:', error);
    throw error;
  }
}