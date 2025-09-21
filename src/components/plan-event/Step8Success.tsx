'use client';

interface Step8Props {
  formData: {
    scheduledDate: string;
    scheduledTime: string;
  };
  requestId: string;
  userName?: string;
}

export default function Step8Success({ formData, requestId, userName }: Step8Props) {
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
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };



  return (
    <div className="text-center">
      {/* Success Animation */}
      <div className="mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full mx-auto mb-8 flex items-center justify-center text-4xl animate-pulse">
          ✓
        </div>
        <h2 className="text-4xl font-black mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
          {userName ? `Thank you, ${userName}!` : 'Request Submitted Successfully!'}
        </h2>
        <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
          {userName ? (
            <>
              Thank you for choosing EVEA, {userName}! Your event planning request has been received and our team is excited to help you create an unforgettable experience.
              <br /><br />
              <span className="text-purple-400 font-semibold">We'll contact you at your scheduled time</span> to discuss your requirements and provide a detailed quote.
            </>
          ) : (
            <>
              Thank you for choosing EVEA! Your event planning request has been received. 
              <br /><br />
              <span className="text-purple-400 font-semibold">The EVEA team will contact you at your scheduled time</span> to discuss your requirements and provide a detailed quote.
            </>
          )}
        </p>
      </div>

      {/* Request Details */}
      <div className="bg-white/3 border border-white/10 rounded-2xl p-8 mb-10 text-left max-w-2xl mx-auto">
        <h4 className="text-lg font-bold mb-5 text-purple-500">
          Your Request ID: <span className="text-white">{requestId}</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="font-semibold mb-1 text-white">Scheduled Call</div>
            <div className="text-gray-400">
              {formatDate(formData.scheduledDate)} at {formatTime(formData.scheduledTime)}
            </div>
          </div>
          <div>
            <div className="font-semibold mb-1 text-white">Expected Quote</div>
            <div className="text-gray-400">Within 24 hours after call</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => window.location.href = '/'}
          className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-bold hover:bg-white/10 transition-all"
        >
          Return Home
        </button>
        <button
          onClick={() => window.location.href = '/community'}
          className="px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 border-none rounded-xl text-white font-bold hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/40 transition-all"
        >
          Share Your Story
        </button>
      </div>

      {/* Additional Information */}
      <div className="mt-12 text-center">
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6 max-w-3xl mx-auto">
          <h3 className="text-xl font-bold mb-4 text-purple-500">What's Next?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="text-center">
              <div className="text-2xl mb-2">📞</div>
              <div className="font-semibold text-white mb-1">Expert Call</div>
              <div className="text-gray-400">Our team will call you at the scheduled time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">📋</div>
              <div className="font-semibold text-white mb-1">Detailed Quote</div>
              <div className="text-gray-400">Receive a comprehensive proposal within 24 hours</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🎉</div>
              <div className="font-semibold text-white mb-1">Start Planning</div>
              <div className="text-gray-400">Begin creating your perfect event experience</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
