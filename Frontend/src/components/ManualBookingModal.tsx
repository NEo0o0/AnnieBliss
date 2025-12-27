import { useState, useEffect } from 'react';
import { X, Search, UserPlus, Users, Loader2, DollarSign, CreditCard, CheckCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Member {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar?: string;
  packageType: 'unlimited' | 'class-pack' | 'drop-in' | null;
  packageName: string;
  creditsLeft?: number;
}

interface ManualBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  classId: number;
  className: string;
  classTime: string;
  onBookingComplete: (booking: any, payment?: any) => void;
  members: Member[];
}

type BookingMode = 'select' | 'existing' | 'guest';

export function ManualBookingModal({ 
  isOpen, 
  onClose, 
  classId, 
  className, 
  classTime,
  onBookingComplete,
  members 
}: ManualBookingModalProps) {
  const [mode, setMode] = useState<BookingMode>('select');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Guest booking form
  const [guestForm, setGuestForm] = useState({
    name: '',
    phone: '',
    contact: ''
  });

  // Payment form for walk-in guests
  const [paymentForm, setPaymentForm] = useState({
    amount: 400,
    method: 'cash' as 'cash' | 'transfer' | 'qr',
    isPaid: false // Default to false - user explicitly marks as paid
  });

  // Filter members based on search
  const filteredMembers = members.filter(member => {
    const query = searchQuery.toLowerCase();
    return (
      member.fullName.toLowerCase().includes(query) ||
      member.email.toLowerCase().includes(query) ||
      member.phone.includes(query)
    );
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setMode('select');
      setSearchQuery('');
      setSelectedMember(null);
      setGuestForm({ name: '', phone: '', contact: '' });
      setPaymentForm({ amount: 400, method: 'cash', isPaid: false });
    }
  }, [isOpen]);

  const handleMemberSelect = (member: Member) => {
    setSelectedMember(member);
  };

  const handleBookMember = async () => {
    if (!selectedMember) return;

    try {
      setIsSubmitting(true);

      // Create booking for existing member
      const booking = {
        id: `booking-${Date.now()}`,
        class_id: classId,
        user_id: selectedMember.id,
        guest_name: null,
        guest_contact: null,
        studentId: selectedMember.id,
        name: selectedMember.fullName,
        avatar: selectedMember.avatar || selectedMember.fullName.split(' ').map(n => n[0]).join(''),
        phone: selectedMember.phone,
        contactInfo: '',
        contactPlatform: '',
        status: 'confirmed' as const,
        bookingTime: new Date().toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        }),
        isGuest: false
      };

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      onBookingComplete(booking);
      toast.success(`${selectedMember.fullName} booked successfully!`);
      onClose();
    } catch (error) {
      console.error('Error booking member:', error);
      toast.error('Failed to book member');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBookGuest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!guestForm.name || !guestForm.phone) {
      toast.error('Guest name and phone are required');
      return;
    }

    try {
      setIsSubmitting(true);

      // Create booking for guest (no user_id)
      const booking = {
        id: `guest-${Date.now()}`,
        class_id: classId,
        user_id: null,
        guest_name: guestForm.name,
        guest_contact: guestForm.phone + (guestForm.contact ? ` | ${guestForm.contact}` : ''),
        studentId: `guest-${Date.now()}`,
        name: guestForm.name,
        avatar: guestForm.name.split(' ').map(n => n[0]).join(''),
        phone: guestForm.phone,
        contactInfo: guestForm.contact,
        contactPlatform: '',
        status: 'confirmed' as const,
        bookingTime: new Date().toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        }),
        isGuest: true,
        paymentStatus: paymentForm.isPaid ? 'paid' : 'unpaid',
        paymentAmount: paymentForm.amount
      };

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Pass payment info only if isPaid is true
      onBookingComplete(booking, paymentForm.isPaid ? paymentForm : null);
      
      const paymentMessage = paymentForm.isPaid 
        ? ` Payment (฿${paymentForm.amount}) recorded.` 
        : ' Payment marked as unpaid.';
      toast.success(`Walk-in guest "${guestForm.name}" booked successfully!${paymentMessage}`);
      onClose();
    } catch (error) {
      console.error('Error booking guest:', error);
      toast.error('Failed to book guest');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-sand)]">
          <div>
            <h2 className="text-2xl text-[var(--color-earth-dark)]">
              {mode === 'select' ? 'Manual Booking' : mode === 'existing' ? 'Select Member' : 'Walk-in Guest'}
            </h2>
            <p className="text-sm text-[var(--color-stone)] mt-1">
              {className} • {classTime}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--color-cream)] rounded-full transition-colors duration-300"
          >
            <X size={24} />
          </button>
        </div>

        {/* Mode Selection */}
        {mode === 'select' && (
          <div className="p-8">
            <h3 className="text-lg text-[var(--color-earth-dark)] mb-4">Choose booking type:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Existing Member */}
              <button
                onClick={() => setMode('existing')}
                className="p-6 border-2 border-[var(--color-sand)] rounded-xl hover:border-[var(--color-sage)] hover:bg-[var(--color-cream)]/30 transition-all duration-300 group"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-[var(--color-sage)]/10 flex items-center justify-center group-hover:bg-[var(--color-sage)]/20 transition-colors">
                    <Users size={32} className="text-[var(--color-sage)]" />
                  </div>
                  <div className="text-center">
                    <h4 className="text-lg text-[var(--color-earth-dark)] mb-1">Existing Member</h4>
                    <p className="text-sm text-[var(--color-stone)]">Search and select from registered members</p>
                  </div>
                </div>
              </button>

              {/* Walk-in Guest */}
              <button
                onClick={() => setMode('guest')}
                className="p-6 border-2 border-[var(--color-sand)] rounded-xl hover:border-[var(--color-clay)] hover:bg-[var(--color-cream)]/30 transition-all duration-300 group"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-[var(--color-clay)]/10 flex items-center justify-center group-hover:bg-[var(--color-clay)]/20 transition-colors">
                    <UserPlus size={32} className="text-[var(--color-clay)]" />
                  </div>
                  <div className="text-center">
                    <h4 className="text-lg text-[var(--color-earth-dark)] mb-1">Walk-in Guest</h4>
                    <p className="text-sm text-[var(--color-stone)]">Add guest without creating account</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Existing Member Mode */}
        {mode === 'existing' && (
          <div className="flex flex-col h-[600px]">
            <div className="p-6 border-b border-[var(--color-sand)]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-stone)]" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, email, or phone..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-[var(--color-sand)] focus:ring-2 focus:ring-[var(--color-sage)] focus:border-transparent"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {filteredMembers.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 rounded-full bg-[var(--color-cream)] mx-auto mb-4 flex items-center justify-center">
                    <Users size={40} className="text-[var(--color-sage)]" />
                  </div>
                  <p className="text-[var(--color-stone)]">No members found</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredMembers.map((member) => (
                    <button
                      key={member.id}
                      onClick={() => handleMemberSelect(member)}
                      className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                        selectedMember?.id === member.id
                          ? 'border-[var(--color-sage)] bg-[var(--color-sage)]/10'
                          : 'border-[var(--color-sand)] hover:border-[var(--color-sage)]/50 hover:bg-[var(--color-cream)]/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-sage)] to-[var(--color-clay)] flex items-center justify-center text-white flex-shrink-0">
                          {member.avatar || member.fullName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-base text-[var(--color-earth-dark)] truncate">{member.fullName}</div>
                          <div className="text-sm text-[var(--color-stone)]">{member.email}</div>
                          <div className="text-xs text-[var(--color-stone)]">{member.phone}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-[var(--color-stone)]">{member.packageName}</div>
                          {member.creditsLeft !== undefined && (
                            <div className="text-xs text-[var(--color-sage)]">{member.creditsLeft} credits left</div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-[var(--color-sand)] flex items-center justify-between gap-3">
              <button
                onClick={() => setMode('select')}
                className="px-6 py-3 rounded-lg text-[var(--color-stone)] hover:bg-[var(--color-cream)] transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleBookMember}
                disabled={!selectedMember || isSubmitting}
                className="bg-[var(--color-sage)] hover:bg-[var(--color-clay)] text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Booking...</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={20} />
                    <span>Book Member</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Guest Mode */}
        {mode === 'guest' && (
          <form onSubmit={handleBookGuest} className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm text-[var(--color-stone)] mb-2">
                  Guest Name *
                </label>
                <input
                  type="text"
                  value={guestForm.name}
                  onChange={(e) => setGuestForm({ ...guestForm, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-[var(--color-sand)] focus:ring-2 focus:ring-[var(--color-sage)] focus:border-transparent"
                  placeholder="Enter guest full name"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm text-[var(--color-stone)] mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={guestForm.phone}
                  onChange={(e) => setGuestForm({ ...guestForm, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-[var(--color-sand)] focus:ring-2 focus:ring-[var(--color-sage)] focus:border-transparent"
                  placeholder="+66 XX XXX XXXX"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-[var(--color-stone)] mb-2">
                  Additional Contact (Optional)
                </label>
                <input
                  type="text"
                  value={guestForm.contact}
                  onChange={(e) => setGuestForm({ ...guestForm, contact: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-[var(--color-sand)] focus:ring-2 focus:ring-[var(--color-sage)] focus:border-transparent"
                  placeholder="Line ID, Instagram, etc."
                />
                <p className="text-xs text-[var(--color-stone)] mt-1">
                  Any additional contact information for this guest
                </p>
              </div>

              {/* Payment Section */}
              <div className="border-t border-[var(--color-sand)] pt-6 mt-6">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign size={20} className="text-[var(--color-sage)]" />
                  <h4 className="text-base text-[var(--color-earth-dark)]">Drop-in Payment</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm text-[var(--color-stone)] mb-2">
                      Amount (฿) *
                    </label>
                    <input
                      type="number"
                      value={paymentForm.amount}
                      onChange={(e) => setPaymentForm({ ...paymentForm, amount: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-3 rounded-lg border border-[var(--color-sand)] focus:ring-2 focus:ring-[var(--color-sage)] focus:border-transparent"
                      placeholder="400"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-[var(--color-stone)] mb-2">
                      Payment Method *
                    </label>
                    <select
                      value={paymentForm.method}
                      onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value as 'cash' | 'transfer' | 'qr' })}
                      className="w-full px-4 py-3 rounded-lg border border-[var(--color-sand)] focus:ring-2 focus:ring-[var(--color-sage)] focus:border-transparent bg-white"
                    >
                      <option value="cash">Cash</option>
                      <option value="transfer">Bank Transfer</option>
                      <option value="qr">QR Code</option>
                    </select>
                  </div>
                </div>

                {/* Payment Received Checkbox - PROMINENT VERSION */}
                <div className={`border-2 rounded-lg p-4 mb-4 transition-all duration-300 ${
                  paymentForm.isPaid 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-orange-300 bg-orange-50'
                }`}>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={paymentForm.isPaid}
                      onChange={(e) => setPaymentForm({ ...paymentForm, isPaid: e.target.checked })}
                      className="w-6 h-6 mt-0.5 rounded border-2 border-[var(--color-stone)] text-[var(--color-sage)] focus:ring-2 focus:ring-[var(--color-sage)] cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {paymentForm.isPaid ? (
                          <CheckCircle size={20} className="text-green-600" />
                        ) : (
                          <DollarSign size={20} className="text-orange-600" />
                        )}
                        <span className={`text-base ${
                          paymentForm.isPaid ? 'text-green-900' : 'text-orange-900'
                        }`}>
                          {paymentForm.isPaid 
                            ? '✓ Payment Received (Create Revenue Record)' 
                            : 'Payment NOT Received (Mark as Unpaid)'}
                        </span>
                      </div>
                      <p className={`text-xs mt-1 ${
                        paymentForm.isPaid ? 'text-green-700' : 'text-orange-700'
                      }`}>
                        {paymentForm.isPaid 
                          ? `A revenue record of ฿${paymentForm.amount} will be created immediately in your Payments dashboard.`
                          : 'Booking will be saved as "Unpaid". You can mark it as paid later from the admin dashboard.'}
                      </p>
                    </div>
                  </label>
                </div>

                {/* Info Box */}
                <div className={`border rounded-lg p-3 ${
                  paymentForm.isPaid 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex gap-2">
                    <CreditCard size={18} className={`flex-shrink-0 mt-0.5 ${
                      paymentForm.isPaid ? 'text-green-600' : 'text-blue-600'
                    }`} />
                    <div className={`text-xs ${
                      paymentForm.isPaid ? 'text-green-800' : 'text-blue-800'
                    }`}>
                      <p className="font-medium">
                        {paymentForm.isPaid ? 'Revenue Recording Enabled' : 'No Revenue Record'}
                      </p>
                      <p className="mt-1">
                        {paymentForm.isPaid 
                          ? 'Transaction will appear immediately under Income in your financial dashboard.'
                          : 'Guest will be marked as "Unpaid". Use the "Mark as Paid" button later to record revenue.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-4 border-t border-[var(--color-sand)] sticky bottom-0 bg-white">
              <button
                type="button"
                onClick={() => setMode('select')}
                className="px-6 py-3 rounded-lg text-[var(--color-stone)] hover:bg-[var(--color-cream)] transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[var(--color-clay)] hover:bg-[var(--color-sage)] text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Booking...</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={20} />
                    <span>Book Guest</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
