'use client';

interface Step3Props {
  formData: {
    eventLocation: string;
    eventDate: string;
    guestCount: string;
    budget: string;
    additionalNotes: string;
  };
  onUpdateField: (field: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step3EventDetails({ formData, onUpdateField, onNext, onBack }: Step3Props) {
  return (
    <div>
      <h2 className="text-4xl font-black mb-2.5 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
        Event Details
      </h2>
      <p className="text-gray-400 mb-10 text-lg leading-relaxed">
        Tell us more about your event requirements
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <div>
          <label className="block font-semibold mb-2 text-white">Event Location</label>
          <input
            type="text"
            value={formData.eventLocation}
            onChange={(e) => onUpdateField('eventLocation', e.target.value)}
            placeholder="Mumbai, Maharashtra"
            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:shadow-lg focus:shadow-purple-500/20 transition-all"
          />
        </div>
        <div>
          <label className="block font-semibold mb-2 text-white">Preferred Event Date</label>
          <input
            type="date"
            value={formData.eventDate}
            onChange={(e) => onUpdateField('eventDate', e.target.value)}
            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:shadow-lg focus:shadow-purple-500/20 transition-all"
          />
        </div>
        <div>
          <label className="block font-semibold mb-2 text-white">Expected Guest Count</label>
          <input
            type="number"
            value={formData.guestCount}
            onChange={(e) => onUpdateField('guestCount', e.target.value)}
            placeholder="100"
            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:shadow-lg focus:shadow-purple-500/20 transition-all"
          />
        </div>
        <div>
          <label className="block font-semibold mb-2 text-white">Budget Range (INR)</label>
          <select
            value={formData.budget}
            onChange={(e) => onUpdateField('budget', e.target.value)}
            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:shadow-lg focus:shadow-purple-500/20 transition-all"
          >
            <option value="">Select budget range</option>
            <option value="50000-100000">₹50,000 - ₹1,00,000</option>
            <option value="100000-300000">₹1,00,000 - ₹3,00,000</option>
            <option value="300000-500000">₹3,00,000 - ₹5,00,000</option>
            <option value="500000-1000000">₹5,00,000 - ₹10,00,000</option>
            <option value="1000000+">₹10,00,000+</option>
          </select>
        </div>
      </div>

      <div className="mb-8">
        <label className="block font-semibold mb-2 text-white">Additional Notes</label>
        <textarea
          value={formData.additionalNotes}
          onChange={(e) => onUpdateField('additionalNotes', e.target.value)}
          placeholder="Any specific requirements, themes, or special requests..."
          rows={4}
          className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:shadow-lg focus:shadow-purple-500/20 transition-all resize-vertical"
        />
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
          className="px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 border-none rounded-xl text-white font-bold hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/40 transition-all"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
