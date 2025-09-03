'use client';

interface Step5Props {
  formData: {
    scheduledDate: string;
    scheduledTime: string;
    callDuration: string;
    flexibility: string;
  };
  onUpdateField: (field: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step5ScheduleConsultation({ formData, onUpdateField, onNext, onBack }: Step5Props) {
  const timeSlots = [
    '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
  ];

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const isStepValid = formData.scheduledDate && formData.scheduledTime;

  return (
    <div>
      <h2 className="text-4xl font-black mb-2.5 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
        Schedule Your Consultation
      </h2>
      <p className="text-gray-400 mb-10 text-lg leading-relaxed">
        Book a call with our experts to discuss your requirements and get a detailed quote
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Date Picker */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4 text-white">Select Date</h3>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-sm font-semibold text-gray-400 py-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {/* Calendar days - simplified version */}
            {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
              <div
                key={day}
                onClick={() => onUpdateField('scheduledDate', `2025-01-${day.toString().padStart(2, '0')}`)}
                className={`text-center py-2 rounded-lg cursor-pointer transition-all text-sm ${
                  formData.scheduledDate === `2025-01-${day.toString().padStart(2, '0')}`
                    ? 'bg-purple-500 text-white'
                    : 'text-gray-300 hover:bg-purple-500/20'
                }`}
              >
                {day}
              </div>
            ))}
          </div>
        </div>

        {/* Time Slots */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4 text-white">Available Times</h3>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {timeSlots.map((time) => (
              <div
                key={time}
                onClick={() => onUpdateField('scheduledTime', time)}
                className={`text-center py-3 rounded-lg cursor-pointer transition-all text-sm ${
                  formData.scheduledTime === time
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-purple-500/20'
                }`}
              >
                {formatTime(time)}
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-white">Call Duration</label>
              <select
                value={formData.callDuration}
                onChange={(e) => onUpdateField('callDuration', e.target.value)}
                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-all"
              >
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">1 hour</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-white">Flexibility</label>
              <select
                value={formData.flexibility}
                onChange={(e) => onUpdateField('flexibility', e.target.value)}
                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-all"
              >
                <option value="strict">Exact time only</option>
                <option value="flexible">Flexible ±2 hours</option>
                <option value="very-flexible">Very flexible (any time)</option>
              </select>
            </div>
          </div>
        </div>
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
          Continue
        </button>
      </div>
    </div>
  );
}
