'use client';

interface Step6Props {
  formData: {
    userName: string;
    userPhone: string;
    userEmail: string;
  };
  onUpdateField: (field: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step6ContactInformation({ formData, onUpdateField, onNext, onBack }: Step6Props) {
  const isStepValid = formData.userName && formData.userPhone && formData.userEmail;

  return (
    <div>
      <h2 className="text-4xl font-black mb-2.5 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
        Contact Information
      </h2>
      <p className="text-gray-400 mb-10 text-lg leading-relaxed">
        Share your details so we can reach out with your personalized quote
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <div>
          <label className="block font-semibold mb-2 text-white">Full Name *</label>
          <input
            type="text"
            value={formData.userName}
            onChange={(e) => onUpdateField('userName', e.target.value)}
            placeholder="Enter your full name"
            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:shadow-lg focus:shadow-purple-500/20 transition-all"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-2 text-white">Phone Number *</label>
          <input
            type="tel"
            value={formData.userPhone}
            onChange={(e) => onUpdateField('userPhone', e.target.value)}
            placeholder="+91 98765 43210"
            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:shadow-lg focus:shadow-purple-500/20 transition-all"
            required
          />
        </div>
      </div>

      <div className="mb-8">
        <label className="block font-semibold mb-2 text-white">Email Address *</label>
        <input
          type="email"
          value={formData.userEmail}
          onChange={(e) => onUpdateField('userEmail', e.target.value)}
          placeholder="your.email@example.com"
          className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:shadow-lg focus:shadow-purple-500/20 transition-all"
          required
        />
      </div>

      {/* What happens next section */}
      <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-6 mb-8">
        <h4 className="text-lg font-bold mb-4 text-purple-500">What happens next?</h4>
        <ul className="space-y-3">
          <li className="flex items-center gap-3 text-gray-300">
            <span className="text-purple-500 text-lg">📅</span>
            Our team will call you at your scheduled time
          </li>
          <li className="flex items-center gap-3 text-gray-300">
            <span className="text-purple-500 text-lg">💬</span>
            We'll discuss your requirements in detail
          </li>
          <li className="flex items-center gap-3 text-gray-300">
            <span className="text-purple-500 text-lg">📄</span>
            You'll receive a personalized quote within 24 hours
          </li>
          <li className="flex items-center gap-3 text-gray-300">
            <span className="text-purple-500 text-lg">✨</span>
            Start planning your perfect event!
          </li>
        </ul>
      </div>

      <div className="flex justify-center gap-5">
        <button
          onClick={onBack}
          className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-bold hover:bg-white/10 transition-all"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!isStepValid}
          className="px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 border-none rounded-xl text-white font-bold hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          Submit Request
        </button>
      </div>
    </div>
  );
}
