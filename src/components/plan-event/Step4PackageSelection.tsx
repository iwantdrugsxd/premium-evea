'use client';

interface Step4Props {
  selectedPackage: string;
  onSelectPackage: (packageType: string) => void;
  onNext: () => void;
  onBack: () => void;
  eventPackages: any[];
}

export default function Step4PackageSelection({ selectedPackage, onSelectPackage, onNext, onBack, eventPackages }: Step4Props) {
  // Use real packages from database or fallback to default
  const packages = eventPackages.length > 0 ? eventPackages.map(pkg => ({
    id: pkg.name.toLowerCase().replace(/\s+/g, '-'),
    name: pkg.name,
    price: pkg.price,
    description: pkg.description,
    features: pkg.features || []
  })) : [
    {
      id: 'basic',
      name: 'Basic Package',
      price: 'Starting from ₹50,000',
      features: [
        'Team of 5 coordinators',
        'Venue booking assistance',
        'Basic decoration',
        'Vendor coordination',
        'Day-of event management',
        'Email support'
      ]
    },
    {
      id: 'professional',
      name: 'Professional Package',
      price: 'Starting from ₹1,50,000',
      features: [
        'Team of 8 coordinators',
        'Premium venue options',
        'Custom decoration themes',
        'Photography & videography',
        'Catering coordination',
        'Guest management system',
        'Live streaming setup',
        '24/7 phone support'
      ],
      popular: true
    },
    {
      id: 'premium',
      name: 'Premium Package',
      price: 'Starting from ₹3,00,000',
      features: [
        'Team of 10+ coordinators',
        'Luxury venue partnerships',
        'Designer decoration & themes',
        'Professional A/V setup',
        'Gourmet catering options',
        'VIP guest services',
        'Multi-camera live streaming',
        'Security & logistics',
        'Personal event manager',
        'Post-event cleanup'
      ]
    }
  ];

  return (
    <div>
      <h2 className="text-4xl font-black mb-2.5 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
        Choose Your Package
      </h2>
      <p className="text-gray-400 mb-10 text-lg leading-relaxed">
        Select the package that best fits your needs and budget
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            onClick={() => {
              onSelectPackage(pkg.id);
              // Auto-route to next step after selecting a package
              setTimeout(() => {
                onNext();
              }, 500);
            }}
            className={`bg-white/3 border-2 rounded-2xl p-8 cursor-pointer transition-all relative hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/20 ${
              selectedPackage === pkg.id 
                ? 'border-purple-500 bg-purple-500/10' 
                : 'border-white/10 hover:border-purple-500/50'
            }`}
          >
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 px-5 py-1 rounded-full text-xs font-bold uppercase text-white">
                Most Popular
              </div>
            )}
            
            <div className="text-2xl font-bold mb-2.5">{pkg.name}</div>
            <div className="text-xl font-bold text-purple-500 mb-5">{pkg.price}</div>
            
            <ul className="space-y-3">
              {pkg.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3 text-gray-300">
                  <span className="text-purple-500 font-bold">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={onBack}
          className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-bold hover:bg-white/10 transition-all"
        >
          Back
        </button>
      </div>
    </div>
  );
}
