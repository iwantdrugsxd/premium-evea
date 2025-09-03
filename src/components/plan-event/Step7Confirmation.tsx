'use client';

interface Step7Props {
  formData: {
    eventType: string;
    selectedServices: string[];
    eventLocation: string;
    eventDate: string;
    guestCount: string;
    budget: string;
    additionalNotes: string;
    selectedPackage: string;
    scheduledDate: string;
    scheduledTime: string;
    callDuration: string;
    flexibility: string;
    userName: string;
    userPhone: string;
    userEmail: string;
  };
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export default function Step7Confirmation({ formData, onSubmit, onBack, isSubmitting }: Step7Props) {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getServiceName = (service: string) => {
    const serviceMap: { [key: string]: string } = {
      'venue': 'Venue Booking',
      'coordination': 'Event Coordination',
      'catering': 'Catering',
      'photography': 'Photography',
      'decoration': 'Decoration',
      'music': 'Music & Entertainment',
      'transportation': 'Transportation',
      'invitations': 'Invitations',
      'livestream': 'Live Streaming',
      'security': 'Security Services',
      'guest-mgmt': 'Guest Management',
      'branding': 'Custom Branding',
      'valet': 'Valet Parking'
    };
    return serviceMap[service] || service;
  };

  const getPackageName = (packageType: string) => {
    const packageMap: { [key: string]: string } = {
      'basic': 'Basic Package (₹50,000+)',
      'professional': 'Professional Package (₹1,50,000+)',
      'premium': 'Premium Package (₹3,00,000+)'
    };
    return packageMap[packageType] || 'Not selected';
  };

  const formatBudget = (budget: string) => {
    if (!budget) return 'Not specified';
    return budget.replace('-', ' - ₹').replace('000000', ',00,000').replace('00000', ',00,000');
  };

  return (
    <div>
      <h2 className="text-4xl font-black mb-2.5 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
        Request Confirmation
      </h2>
      <p className="text-gray-400 mb-10 text-lg leading-relaxed">
        Review your event planning request before submission
      </p>

      <div className="bg-white/3 border border-white/10 rounded-2xl p-8 mb-8">
        <div className="space-y-6">
          {/* Event Type */}
          <div className="pb-6 border-b border-white/10">
            <div className="text-lg font-bold mb-2 text-purple-500">Event Type</div>
            <div className="text-gray-300 capitalize">{formData.eventType}</div>
          </div>

          {/* Selected Services */}
          <div className="pb-6 border-b border-white/10">
            <div className="text-lg font-bold mb-2 text-purple-500">Selected Services</div>
            <div className="text-gray-300">
              {formData.selectedServices.map(getServiceName).join(', ')}
            </div>
          </div>

          {/* Event Details */}
          <div className="pb-6 border-b border-white/10">
            <div className="text-lg font-bold mb-2 text-purple-500">Event Details</div>
            <div className="text-gray-300 space-y-1">
              <div><strong>Location:</strong> {formData.eventLocation || 'Not specified'}</div>
              <div><strong>Date:</strong> {formData.eventDate || 'Not specified'}</div>
              <div><strong>Guests:</strong> {formData.guestCount || 'Not specified'}</div>
              <div><strong>Budget:</strong> ₹{formatBudget(formData.budget)}</div>
              <div><strong>Notes:</strong> {formData.additionalNotes || 'None'}</div>
            </div>
          </div>

          {/* Package */}
          <div className="pb-6 border-b border-white/10">
            <div className="text-lg font-bold mb-2 text-purple-500">Package</div>
            <div className="text-gray-300">{getPackageName(formData.selectedPackage)}</div>
          </div>

          {/* Consultation Schedule */}
          <div className="pb-6 border-b border-white/10">
            <div className="text-lg font-bold mb-2 text-purple-500">Consultation Schedule</div>
            <div className="text-gray-300 space-y-1">
              <div><strong>Date:</strong> {formatDate(formData.scheduledDate)}</div>
              <div><strong>Time:</strong> {formatTime(formData.scheduledTime)}</div>
              <div><strong>Duration:</strong> {formData.callDuration} minutes</div>
              <div><strong>Flexibility:</strong> {formData.flexibility}</div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <div className="text-lg font-bold mb-2 text-purple-500">Contact Information</div>
            <div className="text-gray-300 space-y-1">
              <div><strong>Name:</strong> {formData.userName}</div>
              <div><strong>Phone:</strong> {formData.userPhone}</div>
              <div><strong>Email:</strong> {formData.userEmail}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-5">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-bold hover:bg-white/10 transition-all disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 border-none rounded-xl text-white font-bold hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-3"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Submitting...
            </>
          ) : (
            'Confirm & Submit'
          )}
        </button>
      </div>
    </div>
  );
}
