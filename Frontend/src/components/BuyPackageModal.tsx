import { useState } from 'react';
import { 
  X, 
  Package, 
  CreditCard, 
  Upload, 
  Check, 
  MessageCircle, 
  Info,
  ChevronRight,
  Building2,
  Send,
  Instagram
} from 'lucide-react';

interface PackageItem {
  id: string;
  name: string;
  price: number;
  credits: number;
  description?: string;
}

interface BuyPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
}

// Mock packages data - in real app, fetch from Supabase packages table
const mockPackages: PackageItem[] = [
  {
    id: 'pkg_1',
    name: 'Single Class',
    price: 400,
    credits: 1,
    description: 'Perfect for trying out a class'
  },
  {
    id: 'pkg_2',
    name: '5-Class Pack',
    price: 1800,
    credits: 5,
    description: 'Save 10% with this pack'
  },
  {
    id: 'pkg_3',
    name: '10-Class Pack',
    price: 3200,
    credits: 10,
    description: 'Most popular! Save 20%'
  },
  {
    id: 'pkg_4',
    name: '20-Class Pack',
    price: 5600,
    credits: 20,
    description: 'Best value! Save 30%'
  },
  {
    id: 'pkg_5',
    name: 'Monthly Unlimited',
    price: 4500,
    credits: 999,
    description: 'Unlimited classes for 30 days'
  }
];

// Bank details - in real app, fetch from admin settings
const BANK_DETAILS = {
  bankName: 'Bangkok Bank',
  accountName: 'Annie Bliss Yoga Studio',
  accountNumber: '123-4-56789-0',
  qrCodeUrl: 'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=400&h=400&fit=crop' // Placeholder QR code
};

type Step = 'select' | 'payment' | 'success';
type PaymentMethod = 'transfer' | 'cash';

export function BuyPackageModal({ isOpen, onClose, userId, userName }: BuyPackageModalProps) {
  const [step, setStep] = useState<Step>('select');
  const [selectedPackage, setSelectedPackage] = useState<PackageItem | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('transfer');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  if (!isOpen) return null;

  const handleSelectPackage = (pkg: PackageItem) => {
    setSelectedPackage(pkg);
    setStep('payment');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmitBankTransfer = async () => {
    if (!uploadedFile || !selectedPackage) return;

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      // 1. Upload image to Supabase Storage bucket 'payment_slips'
      const { supabase } = await import('@/utils/supabase/client');
      
      const fileExt = uploadedFile.name.split('.').pop();
      const fileName = `${userId}_${Date.now()}.${fileExt}`;
      const filePath = `payment_slips/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('payment_slips')
        .upload(filePath, uploadedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // 2. Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('payment_slips')
        .getPublicUrl(filePath);

      // 3. Call API to create user_package with payment data
      const response = await fetch('/api/packages/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packageId: selectedPackage.id,
          paymentMethod: 'bank_transfer',
          paymentSlipUrl: publicUrl,
          paymentNote: `Package purchase: ${selectedPackage.name}`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit payment');
      }

      const result = await response.json();
      console.log('Payment submitted successfully:', result);

      setStep('success');
    } catch (error: any) {
      console.error('Error submitting payment:', error);
      setSubmissionError(error.message || 'Failed to submit payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateLineMessage = () => {
    if (!selectedPackage) return '';
    const message = `Hello, I would like to purchase the package: ${selectedPackage.name} (${selectedPackage.price} THB). I will pay via Cash at the studio.`;
    return encodeURIComponent(message);
  };

  const generateWhatsAppMessage = () => {
    if (!selectedPackage) return '';
    const message = `Hello, I would like to buy ${selectedPackage.name}.`;
    return encodeURIComponent(message);
  };

  const generateFacebookMessage = () => {
    if (!selectedPackage) return '';
    const message = `Hi! I'd like to buy: ${selectedPackage.name} (฿${selectedPackage.price}). Cash payment.`;
    return encodeURIComponent(message);
  };

  const showToastNotification = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleContactViaLine = () => {
    const message = generateLineMessage();
    window.open(`https://line.me/R/msg/text/?${message}`, '_blank');
    
    setTimeout(() => {
      setStep('success');
    }, 500);
  };

  const handleContactViaWhatsApp = () => {
    const message = generateWhatsAppMessage();
    // Replace with actual phone number (IMPORTANT: DO NOT DISPLAY THIS NUMBER PUBLICLY)
    const phoneNumber = '66812345678'; // Format: country code + number (no + or spaces)
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    
    setTimeout(() => {
      setStep('success');
    }, 500);
  };

  const handleContactViaInstagram = () => {
    if (!selectedPackage) return;
    
    // Show toast before redirecting
    showToastNotification(`Please send us a DM mentioning ${selectedPackage.name}`);
    
    // Open Instagram DM after short delay
    setTimeout(() => {
      // Replace with actual Instagram username
      const igUsername = 'annieblissyoga';
      window.open(`https://ig.me/m/${igUsername}`, '_blank');
      
      setTimeout(() => {
        setStep('success');
      }, 500);
    }, 1500);
  };

  const handleContactViaFacebook = () => {
    const message = generateFacebookMessage();
    // Facebook Messenger link format
    window.open(`https://m.me/annieblissyoga?text=${message}`, '_blank');
    
    setTimeout(() => {
      setStep('success');
    }, 500);
  };

  const handleClose = () => {
    setStep('select');
    setSelectedPackage(null);
    setPaymentMethod('transfer');
    setUploadedFile(null);
    setPreviewUrl(null);
    setSubmissionError(null);
    onClose();
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[60] animate-fade-in-down">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 max-w-md">
            <Send size={24} className="flex-shrink-0" />
            <div>
              <p className="font-semibold">Opening Instagram...</p>
              <p className="text-sm opacity-90">{toastMessage}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[var(--color-sand)] px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-sage)] to-[var(--color-clay)] flex items-center justify-center">
              <Package size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl text-[var(--color-earth-dark)]">
                {step === 'select' && 'Choose Your Package'}
                {step === 'payment' && 'Payment Method'}
                {step === 'success' && 'Payment Submitted'}
              </h2>
              <p className="text-sm text-[var(--color-stone)]">
                {step === 'select' && 'Select the perfect package for your practice'}
                {step === 'payment' && selectedPackage?.name}
                {step === 'success' && 'Thank you for your purchase'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-[var(--color-stone)] hover:text-[var(--color-earth-dark)] transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Package Selection */}
          {step === 'select' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="border-2 border-[var(--color-sand)] rounded-xl p-6 hover:border-[var(--color-sage)] hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="text-center mb-4">
                    <h3 className="text-xl text-[var(--color-earth-dark)] mb-2">
                      {pkg.name}
                    </h3>
                    <div className="text-3xl text-[var(--color-sage)] mb-1">
                      ฿{pkg.price.toLocaleString()}
                    </div>
                    <div className="text-sm text-[var(--color-stone)]">
                      {pkg.credits === 999 ? 'Unlimited' : `${pkg.credits} ${pkg.credits === 1 ? 'Credit' : 'Credits'}`}
                    </div>
                  </div>

                  {pkg.description && (
                    <p className="text-sm text-[var(--color-stone)] text-center mb-4">
                      {pkg.description}
                    </p>
                  )}

                  <button
                    onClick={() => handleSelectPackage(pkg)}
                    className="w-full bg-[var(--color-sage)] text-white py-3 rounded-lg hover:bg-[var(--color-clay)] transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-md"
                  >
                    <span>Select</span>
                    <ChevronRight size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Step 2: Payment Method */}
          {step === 'payment' && selectedPackage && (
            <div className="space-y-6">
              {/* Package Summary */}
              <div className="bg-gradient-to-br from-[var(--color-sage)] to-[var(--color-clay)] rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl mb-1">{selectedPackage.name}</h3>
                    <p className="text-white/80">
                      {selectedPackage.credits === 999 ? 'Unlimited classes' : `${selectedPackage.credits} class credits`}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl">฿{selectedPackage.price.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {/* Payment Method Tabs */}
              <div className="flex gap-2 border-b border-[var(--color-sand)]">
                <button
                  onClick={() => setPaymentMethod('transfer')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 transition-all duration-300 ${
                    paymentMethod === 'transfer'
                      ? 'border-b-2 border-[var(--color-sage)] text-[var(--color-sage)]'
                      : 'text-[var(--color-stone)] hover:text-[var(--color-earth-dark)]'
                  }`}
                >
                  <Building2 size={20} />
                  <span>Bank Transfer</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('cash')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 transition-all duration-300 ${
                    paymentMethod === 'cash'
                      ? 'border-b-2 border-[var(--color-sage)] text-[var(--color-sage)]'
                      : 'text-[var(--color-stone)] hover:text-[var(--color-earth-dark)]'
                  }`}
                >
                  <MessageCircle size={20} />
                  <span>Pay Cash / Contact Admin</span>
                </button>
              </div>

              {/* Payment Method Content */}
              {paymentMethod === 'transfer' && (
                <div className="space-y-6">
                  {/* Bank Details */}
                  <div className="bg-[var(--color-cream)] rounded-xl p-6">
                    <h4 className="text-lg text-[var(--color-earth-dark)] mb-4 flex items-center gap-2">
                      <Building2 size={20} className="text-[var(--color-sage)]" />
                      Bank Account Details
                    </h4>
                    <div className="space-y-2 text-[var(--color-earth-dark)]">
                      <div className="flex justify-between">
                        <span className="text-[var(--color-stone)]">Bank:</span>
                        <span>{BANK_DETAILS.bankName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--color-stone)]">Account Name:</span>
                        <span>{BANK_DETAILS.accountName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--color-stone)]">Account Number:</span>
                        <span className="font-mono">{BANK_DETAILS.accountNumber}</span>
                      </div>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="text-center">
                    <h4 className="text-lg text-[var(--color-earth-dark)] mb-3">Scan to Pay</h4>
                    <div className="inline-block bg-white p-4 rounded-xl shadow-md">
                      <img 
                        src={BANK_DETAILS.qrCodeUrl} 
                        alt="Payment QR Code" 
                        className="w-64 h-64 object-cover rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Upload Slip */}
                  <div className="space-y-3">
                    <label className="block text-[var(--color-earth-dark)]">
                      Upload Payment Slip <span className="text-red-600">*</span>
                    </label>
                    
                    <div className="border-2 border-dashed border-[var(--color-sand)] rounded-xl p-8 text-center hover:border-[var(--color-sage)] transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="payment-slip-upload"
                      />
                      <label
                        htmlFor="payment-slip-upload"
                        className="cursor-pointer flex flex-col items-center gap-3"
                      >
                        <div className="w-16 h-16 rounded-full bg-[var(--color-cream)] flex items-center justify-center">
                          <Upload size={32} className="text-[var(--color-sage)]" />
                        </div>
                        <div>
                          <p className="text-[var(--color-earth-dark)] mb-1">
                            {uploadedFile ? uploadedFile.name : 'Click to upload payment slip'}
                          </p>
                          <p className="text-sm text-[var(--color-stone)]">
                            PNG, JPG up to 10MB
                          </p>
                        </div>
                      </label>
                    </div>

                    {previewUrl && (
                      <div className="mt-4 text-center">
                        <p className="text-sm text-[var(--color-stone)] mb-2">Preview:</p>
                        <img 
                          src={previewUrl} 
                          alt="Payment slip preview" 
                          className="max-w-sm mx-auto rounded-lg shadow-md"
                        />
                      </div>
                    )}
                  </div>

                  {/* Info Message */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                    <Info size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-900">
                      After uploading your payment slip, please wait for admin verification. 
                      You'll receive a notification once your payment is approved and credits are added to your account.
                    </p>
                  </div>

                  {/* Error Message */}
                  {submissionError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-red-800 text-sm flex-1">{submissionError}</p>
                        <button
                          onClick={handleReload}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors flex-shrink-0"
                        >
                          Reload Page
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Validation Warning */}
                  {!uploadedFile && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                      <p className="text-sm text-orange-800">
                        ⚠️ Please upload your payment slip to submit
                      </p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmitBankTransfer}
                    disabled={!uploadedFile || isSubmitting}
                    className={`w-full py-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-md ${
                      !uploadedFile || isSubmitting
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                        : 'bg-[var(--color-sage)] text-white hover:bg-[var(--color-clay)] hover:shadow-lg'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Check size={20} />
                        <span>Submit Payment</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {paymentMethod === 'cash' && (
                <div className="space-y-6">
                  <div className="bg-[var(--color-cream)] rounded-xl p-6 text-center">
                    <h4 className="text-lg text-[var(--color-earth-dark)] mb-2">
                      Contact Admin to Complete Purchase
                    </h4>
                    <p className="text-[var(--color-stone)] mb-6">
                      Click below to contact us via your preferred messaging app. 
                      We'll help you complete your purchase and arrange cash payment at the studio.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                      {/* WhatsApp Button - Primary */}
                      <button
                        onClick={handleContactViaWhatsApp}
                        className="bg-[#25D366] text-white py-6 rounded-xl hover:bg-[#21C457] transition-all duration-300 flex flex-col items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1"
                      >
                        <MessageCircle size={32} />
                        <div>
                          <div className="text-sm opacity-90">Chat via</div>
                          <div className="text-xl font-semibold">WhatsApp</div>
                        </div>
                      </button>

                      {/* Instagram Button - Secondary */}
                      <button
                        onClick={handleContactViaInstagram}
                        className="bg-gradient-to-br from-[#E4405F] via-[#E1306C] to-[#C13584] text-white py-6 rounded-xl hover:opacity-90 transition-all duration-300 flex flex-col items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1"
                      >
                        <Instagram size={32} />
                        <div>
                          <div className="text-sm opacity-90">DM via</div>
                          <div className="text-xl font-semibold">Instagram</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Info Note */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                    <Info size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <p className="mb-1"><strong>WhatsApp:</strong> Message will auto-fill with package details</p>
                      <p><strong>Instagram:</strong> Please mention "{selectedPackage.name}" in your DM</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Success */}
          {step === 'success' && (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <Check size={40} className="text-green-600" />
              </div>
              
              <h3 className="text-2xl text-[var(--color-earth-dark)] mb-3">
                {paymentMethod === 'transfer' ? 'Payment Submitted!' : 'Message Sent!'}
              </h3>
              
              <p className="text-[var(--color-stone)] mb-8 max-w-md mx-auto">
                {paymentMethod === 'transfer' 
                  ? 'Your payment slip has been submitted. Please wait for admin verification. You will receive a notification once your payment is approved and credits are added to your account.'
                  : 'Your message has been sent to our admin team. They will contact you shortly to complete your purchase.'}
              </p>

              <button
                onClick={handleClose}
                className="px-8 py-3 bg-[var(--color-sage)] text-white rounded-lg hover:bg-[var(--color-clay)] transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}