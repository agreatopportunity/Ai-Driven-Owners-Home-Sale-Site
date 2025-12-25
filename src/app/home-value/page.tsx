'use client';

import { useState } from 'react';
import { 
  Sparkles, 
  Home, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Loader2,
  ArrowRight,
  Info
} from 'lucide-react';
import toast from 'react-hot-toast';

interface EstimateResult {
  estimatedPrice: number;
  priceRange: { low: number; high: number };
  confidence: 'low' | 'medium' | 'high';
  reasoning: string;
  comparables: string[];
}

const propertyTypes = [
  { value: 'SINGLE_FAMILY', label: 'Single Family' },
  { value: 'CONDO', label: 'Condo' },
  { value: 'TOWNHOUSE', label: 'Townhouse' },
  { value: 'MULTI_FAMILY', label: 'Multi-Family' },
];

export default function HomeValuePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EstimateResult | null>(null);
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: '',
    propertyType: 'SINGLE_FAMILY',
    bedrooms: 3,
    bathrooms: 2,
    sqft: '',
    yearBuilt: '',
    lotSize: '',
    condition: 'good',
    features: [] as string[],
  });

  const conditions = [
    { value: 'excellent', label: 'Excellent', desc: 'Move-in ready, recently updated' },
    { value: 'good', label: 'Good', desc: 'Well maintained, minor updates needed' },
    { value: 'fair', label: 'Fair', desc: 'Functional, needs some work' },
    { value: 'poor', label: 'Poor', desc: 'Major repairs needed' },
  ];

  const featureOptions = [
    'Pool', 'Garage', 'Finished Basement', 'Updated Kitchen', 
    'Hardwood Floors', 'New Roof', 'Solar Panels', 'Smart Home',
    'Waterfront', 'Mountain View', 'Corner Lot', 'Gated Community'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/ai/estimate-value', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to get estimate');

      const data = await response.json();
      setResult(data);
    } catch (error) {
      toast.error('Failed to generate estimate. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);

  const confidenceColors = {
    high: 'bg-forest-100 text-forest-700',
    medium: 'bg-amber-100 text-amber-700',
    low: 'bg-red-100 text-red-700',
  };

  return (
    <div className="min-h-screen bg-cream-50 py-12">
      <div className="container-narrow">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-100 text-brand-700 text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            AI-Powered
          </div>
          <h1 className="text-4xl font-display font-semibold text-brand-950 mb-4">
            What's Your Home Worth?
          </h1>
          <p className="text-lg text-brand-600 max-w-2xl mx-auto">
            Get an instant AI-powered home value estimate. More transparent than Zillow's Zestimate.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-cream-200 p-6 space-y-6">
              {/* Address */}
              <div>
                <h3 className="font-display font-semibold text-brand-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-brand-500" />
                  Property Location
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="label">Street Address</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="123 Main Street"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="label">City</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="Branson"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="label">State</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="MO"
                        maxLength={2}
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                        required
                      />
                    </div>
                    <div>
                      <label className="label">ZIP</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="65616"
                        value={formData.zipCode}
                        onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div className="pt-6 border-t border-cream-200">
                <h3 className="font-display font-semibold text-brand-900 mb-4 flex items-center gap-2">
                  <Home className="w-5 h-5 text-brand-500" />
                  Property Details
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="label">Property Type</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {propertyTypes.map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, propertyType: type.value })}
                          className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                            formData.propertyType === type.value
                              ? 'bg-brand-600 text-white'
                              : 'bg-cream-100 text-brand-700 hover:bg-cream-200'
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="label flex items-center gap-1">
                        <Bed className="w-4 h-4" /> Beds
                      </label>
                      <input
                        type="number"
                        className="input text-center"
                        min={0}
                        value={formData.bedrooms}
                        onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label className="label flex items-center gap-1">
                        <Bath className="w-4 h-4" /> Baths
                      </label>
                      <input
                        type="number"
                        className="input text-center"
                        min={0}
                        step={0.5}
                        value={formData.bathrooms}
                        onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label className="label flex items-center gap-1">
                        <Square className="w-4 h-4" /> Sq Ft
                      </label>
                      <input
                        type="number"
                        className="input text-center"
                        placeholder="1,800"
                        value={formData.sqft}
                        onChange={(e) => setFormData({ ...formData, sqft: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="label flex items-center gap-1">
                        <Calendar className="w-4 h-4" /> Year
                      </label>
                      <input
                        type="number"
                        className="input text-center"
                        placeholder="2005"
                        value={formData.yearBuilt}
                        onChange={(e) => setFormData({ ...formData, yearBuilt: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label">Condition</label>
                    <div className="grid grid-cols-2 gap-2">
                      {conditions.map((cond) => (
                        <button
                          key={cond.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, condition: cond.value })}
                          className={`p-3 rounded-lg text-left transition-colors ${
                            formData.condition === cond.value
                              ? 'bg-brand-600 text-white'
                              : 'bg-cream-100 text-brand-700 hover:bg-cream-200'
                          }`}
                        >
                          <div className="font-medium">{cond.label}</div>
                          <div className={`text-xs ${formData.condition === cond.value ? 'text-brand-200' : 'text-brand-500'}`}>
                            {cond.desc}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="label">Special Features</label>
                    <div className="flex flex-wrap gap-2">
                      {featureOptions.map((feature) => (
                        <button
                          key={feature}
                          type="button"
                          onClick={() => {
                            const features = formData.features.includes(feature)
                              ? formData.features.filter((f) => f !== feature)
                              : [...formData.features, feature];
                            setFormData({ ...formData, features });
                          }}
                          className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                            formData.features.includes(feature)
                              ? 'bg-brand-600 text-white'
                              : 'bg-cream-100 text-brand-700 hover:bg-cream-200'
                          }`}
                        >
                          {feature}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full text-lg py-4"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Get AI Estimate
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            {result ? (
              <div className="space-y-6 sticky top-24">
                {/* Main Estimate */}
                <div className="bg-brand-600 rounded-2xl p-6 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-brand-200">Estimated Value</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${confidenceColors[result.confidence]}`}>
                      {result.confidence} confidence
                    </span>
                  </div>
                  <div className="text-5xl font-display font-bold mb-4">
                    {formatPrice(result.estimatedPrice)}
                  </div>
                  
                  {/* Range */}
                  <div className="bg-brand-700 rounded-lg p-4 mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-brand-300">Value Range</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <TrendingDown className="w-4 h-4 mx-auto text-brand-300 mb-1" />
                        <div className="font-semibold">{formatPrice(result.priceRange.low)}</div>
                        <div className="text-xs text-brand-300">Low</div>
                      </div>
                      <div className="flex-1 h-2 bg-brand-500 rounded-full relative">
                        <div 
                          className="absolute h-4 w-1 bg-white rounded top-1/2 -translate-y-1/2"
                          style={{ 
                            left: `${((result.estimatedPrice - result.priceRange.low) / (result.priceRange.high - result.priceRange.low)) * 100}%` 
                          }}
                        />
                      </div>
                      <div className="text-center">
                        <TrendingUp className="w-4 h-4 mx-auto text-brand-300 mb-1" />
                        <div className="font-semibold">{formatPrice(result.priceRange.high)}</div>
                        <div className="text-xs text-brand-300">High</div>
                      </div>
                    </div>
                  </div>

                  <a href="/list-your-home" className="btn bg-white text-brand-900 hover:bg-cream-100 w-full">
                    List Your Home Free
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>

                {/* Analysis */}
                <div className="bg-white rounded-2xl border border-cream-200 p-6">
                  <h3 className="font-display font-semibold text-brand-900 mb-3">
                    AI Analysis
                  </h3>
                  <p className="text-brand-600 text-sm leading-relaxed">
                    {result.reasoning}
                  </p>
                </div>

                {/* Comparables */}
                <div className="bg-white rounded-2xl border border-cream-200 p-6">
                  <h3 className="font-display font-semibold text-brand-900 mb-3">
                    Market Context
                  </h3>
                  <ul className="space-y-2">
                    {result.comparables.map((comp, i) => (
                      <li key={i} className="text-sm text-brand-600 flex items-start gap-2">
                        <Info className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                        {comp}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Disclaimer */}
                <p className="text-xs text-brand-400 text-center">
                  This is an AI-generated estimate for informational purposes only. 
                  Actual market value may vary. Consult a professional for accurate valuation.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-cream-200 p-8 text-center sticky top-24">
                <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-brand-600" />
                </div>
                <h3 className="font-display font-semibold text-brand-900 mb-2">
                  Get Your Free Estimate
                </h3>
                <p className="text-sm text-brand-600">
                  Fill in your property details and our AI will analyze market data to estimate your home's value.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
