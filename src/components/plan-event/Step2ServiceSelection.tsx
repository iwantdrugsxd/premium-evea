'use client';

interface Step2Props {
  selectedServices: string[];
  onUpdateServices: (services: string[]) => void;
  onNext: () => void;
  onBack: () => void;
  eventServices: any[];
}

export default function Step2ServiceSelection({ selectedServices, onUpdateServices, onNext, onBack, eventServices }: Step2Props) {
  const toggleService = (service: string) => {
    console.log('Toggling service:', service);
    console.log('Current selected services:', selectedServices);
    if (selectedServices.includes(service)) {
      onUpdateServices(selectedServices.filter(s => s !== service));
    } else {
      onUpdateServices([...selectedServices, service]);
    }
  };

  // Debug logging
  console.log('Event services:', eventServices);
  console.log('Selected services:', selectedServices);

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 sm:mb-3 md:mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
        Select Your Services
      </h2>
      <p className="text-sm sm:text-base md:text-lg text-gray-400 mb-6 sm:mb-8 md:mb-10 leading-relaxed">
        Choose the services you need for your event
      </p>

      <div className="mb-6 sm:mb-8 md:mb-10">
        {eventServices.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-purple-500">Available Services</h3>
              <div className="text-xs sm:text-sm text-gray-400">
                {selectedServices.length} of {eventServices.length} selected
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
              {eventServices.map((service: any) => (
                <div
                  key={service.id}
                  onClick={() => toggleService(service.service_name)}
                  className={`group relative p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-300 cursor-pointer h-full ${
                    selectedServices.includes(service.service_name)
                      ? 'border-purple-500 bg-gradient-to-br from-purple-500/20 to-pink-500/20 shadow-lg shadow-purple-500/25'
                      : 'border-white/10 bg-white/5 hover:border-purple-500/50 hover:bg-purple-500/10'
                  }`}
                >
                  {/* Selection indicator */}
                  <div className={`absolute top-2 right-2 sm:top-3 sm:right-3 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedServices.includes(service.service_name)
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-gray-400 group-hover:border-purple-500'
                  }`}>
                    {selectedServices.includes(service.service_name) && (
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>

                  {/* Service content */}
                  <div className="pr-6 sm:pr-8">
                    <h4 className="font-bold text-white mb-1 sm:mb-2 group-hover:text-purple-300 transition-colors text-xs sm:text-sm">
                      {service.service_name}
                    </h4>
                    <p className="text-xs text-gray-400 mb-1 sm:mb-2 leading-relaxed overflow-hidden" style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {service.service_description}
                    </p>
                    
                    {/* Service badges */}
                    <div className="flex flex-wrap gap-1 mb-1 sm:mb-2">
                      {service.is_required && (
                        <span className="px-1.5 sm:px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full border border-red-500/30">
                          Required
                        </span>
                      )}
                      {service.is_popular && (
                        <span className="px-1.5 sm:px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
                          Popular
                        </span>
                      )}
                    </div>

                    {/* Price if available */}
                    {service.price && (
                      <div className="text-xs font-semibold text-purple-400">
                        {service.price}
                      </div>
                    )}
                  </div>

                  {/* Hover effect overlay */}
                  <div className={`absolute inset-0 rounded-lg sm:rounded-xl transition-opacity duration-300 ${
                    selectedServices.includes(service.service_name)
                      ? 'bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-100'
                      : 'bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100'
                  }`}></div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-8 sm:py-12 text-gray-400">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-white/5 flex items-center justify-center">
              <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-sm sm:text-base md:text-lg mb-1 sm:mb-2">No services available</p>
            <p className="text-xs sm:text-sm">Please select an event type first to see available services.</p>
          </div>
        )}
      </div>

      {/* Selected Services Summary */}
      {selectedServices.length > 0 && (
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
          <h3 className="text-base sm:text-lg font-bold text-purple-500 mb-3 sm:mb-4">Selected Services ({selectedServices.length})</h3>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {selectedServices.map((service) => (
              <span
                key={service}
                className="px-2 sm:px-3 py-1.5 sm:py-2 bg-purple-500/20 text-purple-300 rounded-full text-xs sm:text-sm border border-purple-500/30 flex items-center gap-1 sm:gap-2"
              >
                {service}
                <button
                  onClick={() => toggleService(service)}
                  className="ml-1 hover:text-white transition-colors"
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-5">
        <button
          onClick={onBack}
          className="px-6 sm:px-8 py-3 sm:py-4 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white font-bold hover:bg-white/10 transition-all text-sm sm:text-base"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={selectedServices.length === 0}
          className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 border-none rounded-lg sm:rounded-xl text-white font-bold hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
        >
          Continue ({selectedServices.length} selected)
        </button>
      </div>
    </div>
  );
}
