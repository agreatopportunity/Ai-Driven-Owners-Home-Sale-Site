'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Camera, 
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Upload,
  X,
  Loader2
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';

const propertyTypes = [
  { value: 'SINGLE_FAMILY', label: 'Single Family', icon: '🏠' },
  { value: 'CONDO', label: 'Condo', icon: '🏢' },
  { value: 'TOWNHOUSE', label: 'Townhouse', icon: '🏘️' },
  { value: 'MULTI_FAMILY', label: 'Multi Family', icon: '🏗️' },
  { value: 'LAND', label: 'Land', icon: '🌳' },
  { value: 'MANUFACTURED', label: 'Manufactured', icon: '🏕️' },
];

const features = [
  'Central AC', 'Hardwood Floors', 'Fireplace', 'Pool', 'Garage',
  'Updated Kitchen', 'New Roof', 'Basement', 'Deck/Patio', 'Fenced Yard',
  'Smart Home', 'Solar Panels', 'EV Charger', 'Home Office', 'Walk-in Closet',
];

interface FormData {
  propertyType: string;
  address: string;
  unit: string;
  city: string;
  state: string;
  zipCode: string;
  bedrooms: number;
  bathrooms: number;
  sqft: string;
  yearBuilt: string;
  lotSize: string;
  price: string;
  features: string[];
  sellerNotes: string;
  images: File[];
}

export default function ListYourHomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiContent, setAiContent] = useState<{
    title: string;
    description: string;
    highlights: string[];
  } | null>(null);

  const [formData, setFormData] = useState<FormData>({
    propertyType: '',
    address: '',
    unit: '',
    city: '',
    state: '',
    zipCode: '',
    bedrooms: 3,
    bathrooms: 2,
    sqft: '',
    yearBuilt: '',
    lotSize: '',
    price: '',
    features: [],
    sellerNotes: '',
    images: [],
  });

  const totalSteps = 5;

  const updateForm = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 20,
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: (acceptedFiles) => {
      updateForm({ images: [...formData.images, ...acceptedFiles].slice(0, 20) });
    },
  });

  const removeImage = (index: number) => {
    updateForm({ images: formData.images.filter((_, i) => i !== index) });
  };

  const generateAIContent = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/generate-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: formData.address,
          city: formData.city,
          state: formData.state,
          propertyType: formData.propertyType,
          bedrooms: formData.bedrooms,
          bathrooms: formData.bathrooms,
          sqft: formData.sqft ? parseInt(formData.sqft) : undefined,
          yearBuilt: formData.yearBuilt ? parseInt(formData.yearBuilt) : undefined,
          lotSize: formData.lotSize ? parseFloat(formData.lotSize) : undefined,
          features: formData.features,
          sellerNotes: formData.sellerNotes,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate');

      const data = await response.json();
      setAiContent(data);
      toast.success('AI content generated!');
    } catch (error) {
      toast.error('Failed to generate content. Try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async () => {
    if (status !== 'authenticated') {
      router.push(`/login?callbackUrl=/list-your-home`);
      return;
    }

    setIsSubmitting(true);
    try {
      // Create FormData for file upload
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'images') {
          formData.images.forEach((file) => submitData.append('images', file));
        } else if (key === 'features') {
          submitData.append('features', JSON.stringify(value));
        } else {
          submitData.append(key, String(value));
        }
      });

      if (aiContent) {
        submitData.append('aiTitle', aiContent.title);
        submitData.append('aiDescription', aiContent.description);
        submitData.append('aiHighlights', JSON.stringify(aiContent.highlights));
      }

      const response = await fetch('/api/listings', {
        method: 'POST',
        body: submitData,
      });

      if (!response.ok) throw new Error('Failed to create listing');

      const { slug } = await response.json();
      toast.success('Listing created successfully!');
      router.push(`/listing/${slug}`);
    } catch (error) {
      toast.error('Failed to create listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return !!formData.propertyType;
      case 2:
        return formData.address && formData.city && formData.state && formData.zipCode;
      case 3:
        return formData.bedrooms > 0 && formData.bathrooms > 0;
      case 4:
        return formData.images.length > 0;
      case 5:
        return formData.price && parseInt(formData.price) > 0;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-100 to-cream-50 py-12">
      <div className="container-narrow">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {[...Array(totalSteps)].map((_, i) => (
              <div key={i} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all duration-300 ${
                    step > i + 1
                      ? 'bg-forest-600 text-white'
                      : step === i + 1
                      ? 'bg-brand-600 text-white'
                      : 'bg-cream-200 text-brand-400'
                  }`}
                >
                  {step > i + 1 ? <Check className="w-5 h-5" /> : i + 1}
                </div>
                {i < totalSteps - 1 && (
                  <div
                    className={`hidden sm:block w-full h-1 mx-2 rounded transition-colors duration-300 ${
                      step > i + 1 ? 'bg-forest-600' : 'bg-cream-200'
                    }`}
                    style={{ width: '60px' }}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center text-sm text-brand-500">
            Step {step} of {totalSteps}
          </div>
        </div>

        {/* Form Steps */}
        <div className="bg-white rounded-2xl border border-cream-200 shadow-warm p-8">
          <AnimatePresence mode="wait">
            {/* Step 1: Property Type */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-display font-semibold text-brand-900 mb-2">
                    What type of property are you selling?
                  </h1>
                  <p className="text-brand-600">Select the option that best describes your property</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {propertyTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => updateForm({ propertyType: type.value })}
                      className={`p-6 rounded-xl border-2 text-center transition-all duration-200 ${
                        formData.propertyType === type.value
                          ? 'border-brand-500 bg-brand-50'
                          : 'border-cream-200 hover:border-brand-300 hover:bg-cream-50'
                      }`}
                    >
                      <span className="text-4xl mb-2 block">{type.icon}</span>
                      <span className="font-medium text-brand-800">{type.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Address */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-display font-semibold text-brand-900 mb-2">
                    Where is your property located?
                  </h1>
                  <p className="text-brand-600">Enter the full address of your property</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="label">Street Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-400" />
                      <input
                        type="text"
                        className="input pl-12"
                        placeholder="123 Main Street"
                        value={formData.address}
                        onChange={(e) => updateForm({ address: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label">Unit/Apt (optional)</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="Apt 4B"
                      value={formData.unit}
                      onChange={(e) => updateForm({ unit: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="col-span-2 md:col-span-1">
                      <label className="label">City</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="Branson"
                        value={formData.city}
                        onChange={(e) => updateForm({ city: e.target.value })}
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
                        onChange={(e) => updateForm({ state: e.target.value.toUpperCase() })}
                      />
                    </div>
                    <div>
                      <label className="label">ZIP Code</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="65616"
                        maxLength={10}
                        value={formData.zipCode}
                        onChange={(e) => updateForm({ zipCode: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Property Details */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-display font-semibold text-brand-900 mb-2">
                    Tell us about your property
                  </h1>
                  <p className="text-brand-600">Add details that buyers want to know</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="label flex items-center gap-2">
                      <Bed className="w-4 h-4" /> Bedrooms
                    </label>
                    <input
                      type="number"
                      className="input text-center"
                      min={0}
                      max={20}
                      value={formData.bedrooms}
                      onChange={(e) => updateForm({ bedrooms: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <label className="label flex items-center gap-2">
                      <Bath className="w-4 h-4" /> Bathrooms
                    </label>
                    <input
                      type="number"
                      className="input text-center"
                      min={0}
                      max={20}
                      step={0.5}
                      value={formData.bathrooms}
                      onChange={(e) => updateForm({ bathrooms: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <label className="label flex items-center gap-2">
                      <Square className="w-4 h-4" /> Sq Ft
                    </label>
                    <input
                      type="number"
                      className="input text-center"
                      placeholder="1,500"
                      value={formData.sqft}
                      onChange={(e) => updateForm({ sqft: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="label">Year Built</label>
                    <input
                      type="number"
                      className="input text-center"
                      placeholder="2005"
                      min={1800}
                      max={new Date().getFullYear()}
                      value={formData.yearBuilt}
                      onChange={(e) => updateForm({ yearBuilt: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Lot Size (acres, optional)</label>
                  <input
                    type="number"
                    className="input"
                    placeholder="0.25"
                    step={0.01}
                    value={formData.lotSize}
                    onChange={(e) => updateForm({ lotSize: e.target.value })}
                  />
                </div>

                <div>
                  <label className="label">Features (select all that apply)</label>
                  <div className="flex flex-wrap gap-2">
                    {features.map((feature) => (
                      <button
                        key={feature}
                        onClick={() => {
                          const updated = formData.features.includes(feature)
                            ? formData.features.filter((f) => f !== feature)
                            : [...formData.features, feature];
                          updateForm({ features: updated });
                        }}
                        className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${
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

                <div>
                  <label className="label">Additional Notes (optional)</label>
                  <textarea
                    className="input min-h-[100px]"
                    placeholder="Recent renovations, special features, neighborhood highlights..."
                    value={formData.sellerNotes}
                    onChange={(e) => updateForm({ sellerNotes: e.target.value })}
                  />
                </div>
              </motion.div>
            )}

            {/* Step 4: Photos */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-display font-semibold text-brand-900 mb-2">
                    Add photos of your property
                  </h1>
                  <p className="text-brand-600">Great photos get 2x more views. We'll enhance them with AI.</p>
                </div>

                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 ${
                    isDragActive
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-cream-300 hover:border-brand-400 hover:bg-cream-50'
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="w-12 h-12 mx-auto text-brand-400 mb-4" />
                  <p className="text-brand-700 font-medium mb-1">
                    {isDragActive ? 'Drop photos here' : 'Drag & drop photos here'}
                  </p>
                  <p className="text-sm text-brand-500">or click to browse (max 20 photos, 10MB each)</p>
                </div>

                {formData.images.length > 0 && (
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                    {formData.images.map((file, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-cream-100">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-brand-600 text-white text-xs rounded">
                            Primary
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 5: Price & AI Generation */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-display font-semibold text-brand-900 mb-2">
                    Set your price & create your listing
                  </h1>
                  <p className="text-brand-600">Let AI write a compelling description for you</p>
                </div>

                <div>
                  <label className="label">Asking Price</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-500 font-medium">$</span>
                    <input
                      type="number"
                      className="input pl-8 text-2xl font-display"
                      placeholder="350,000"
                      value={formData.price}
                      onChange={(e) => updateForm({ price: e.target.value })}
                    />
                  </div>
                </div>

                {/* AI Generation */}
                <div className="bg-gradient-to-br from-brand-50 to-forest-50 rounded-xl p-6 border border-brand-200">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-600 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-brand-900 text-lg">
                        AI Listing Generator
                      </h3>
                      <p className="text-sm text-brand-600">
                        Our AI will write a professional, compelling listing description
                      </p>
                    </div>
                  </div>

                  {!aiContent ? (
                    <button
                      onClick={generateAIContent}
                      disabled={isGenerating}
                      className="btn-primary w-full"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          Generate AI Description
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4 border border-cream-200">
                        <label className="text-xs uppercase tracking-wide text-brand-500 mb-1 block">
                          Title
                        </label>
                        <p className="font-display font-semibold text-brand-900">
                          {aiContent.title}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-cream-200">
                        <label className="text-xs uppercase tracking-wide text-brand-500 mb-1 block">
                          Description
                        </label>
                        <p className="text-brand-700 whitespace-pre-wrap text-sm">
                          {aiContent.description}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-cream-200">
                        <label className="text-xs uppercase tracking-wide text-brand-500 mb-1 block">
                          Highlights
                        </label>
                        <ul className="space-y-1">
                          {aiContent.highlights.map((h, i) => (
                            <li key={i} className="text-sm text-brand-700 flex items-start gap-2">
                              <Check className="w-4 h-4 text-forest-600 flex-shrink-0 mt-0.5" />
                              {h}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <button
                        onClick={generateAIContent}
                        disabled={isGenerating}
                        className="btn-ghost w-full"
                      >
                        {isGenerating ? 'Regenerating...' : 'Regenerate'}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-cream-200">
            <button
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
              className="btn-ghost disabled:opacity-0"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            {step < totalSteps ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="btn-primary"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canProceed() || isSubmitting}
                className="btn-forest"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating Listing...
                  </>
                ) : status === 'authenticated' ? (
                  <>
                    Publish Listing
                    <Check className="w-5 h-5" />
                  </>
                ) : (
                  <>
                    Sign In & Publish
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
