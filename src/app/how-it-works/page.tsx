import Link from 'next/link';
import { 
  Camera, 
  Sparkles, 
  Users, 
  FileText, 
  DollarSign, 
  CheckCircle2,
  ArrowRight,
  Shield,
  Clock,
  TrendingUp
} from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Camera,
    title: 'Upload Your Photos',
    description: 'Take photos with your phone or camera. Our AI automatically enhances them - adjusting lighting, colors, and clarity to make your home look its best.',
    features: ['Auto-enhancement', 'Virtual staging', 'Twilight conversion'],
  },
  {
    number: '02',
    icon: Sparkles,
    title: 'AI Creates Your Listing',
    description: 'Our AI analyzes your photos and property details to write a compelling, professional listing description. Better than what most agents write.',
    features: ['Professional copywriting', 'SEO optimization', 'Highlight key features'],
  },
  {
    number: '03',
    icon: DollarSign,
    title: 'Set Your Price',
    description: 'Use our AI-powered pricing tool to get an accurate home value estimate based on recent sales, market trends, and your property features.',
    features: ['Comparable sales analysis', 'Market trend data', 'Transparent methodology'],
  },
  {
    number: '04',
    icon: Users,
    title: 'Connect With Buyers',
    description: 'Your listing goes live and starts appearing in search results. Serious buyers contact you directly - no middleman, no agent pressure.',
    features: ['Direct buyer contact', 'Inquiry management', 'Showing scheduler'],
  },
  {
    number: '05',
    icon: FileText,
    title: 'Close the Deal',
    description: 'Use our contract generator for state-specific purchase agreements. We guide you through every step of the closing process.',
    features: ['Legal documents', 'Closing checklist', 'Expert support'],
  },
];

const benefits = [
  {
    icon: DollarSign,
    title: 'Save $23,000+ on Average',
    description: 'Keep the 6% commission that would go to agents. On a $400,000 home, that\'s $24,000 in your pocket.',
  },
  {
    icon: Clock,
    title: 'List in Under 5 Minutes',
    description: 'Our streamlined process with AI assistance means you can go from photos to live listing in minutes, not days.',
  },
  {
    icon: TrendingUp,
    title: 'Maximum Exposure',
    description: 'Our SEO strategy means your listing ranks in local searches. Get found by buyers actively searching in your area.',
  },
  {
    icon: Shield,
    title: 'You Stay in Control',
    description: 'Set your own price, schedule your own showings, and negotiate directly. It\'s your home, your sale, your way.',
  },
];

const faqs = [
  {
    question: 'Is it really free?',
    answer: 'Yes, listing your home is completely free. We make money through optional premium services and affiliate partnerships with mortgage lenders and title companies - never from sellers.',
  },
  {
    question: 'How do I handle showings?',
    answer: 'You schedule showings at your convenience. Many sellers use a lockbox for flexibility. We provide a showing request system so buyers can easily request times that work for you.',
  },
  {
    question: 'What about the legal paperwork?',
    answer: 'Our contract generator creates state-specific purchase agreements and required disclosures. For complex transactions, we recommend consulting with a real estate attorney (which costs far less than agent commissions).',
  },
  {
    question: 'Will buyers take me seriously without an agent?',
    answer: 'Absolutely. FSBO sales account for 10% of all home sales. Serious buyers care about the home, not who\'s selling it. Our professional AI-generated listings look just as polished as agent listings.',
  },
  {
    question: 'What if I need help?',
    answer: 'We provide guides, checklists, and support throughout the process. You can also upgrade to premium support for personalized assistance.',
  },
  {
    question: 'How long does it take to sell?',
    answer: 'It depends on your market and pricing. Well-priced homes in active markets often sell within 30 days. Our pricing tool helps you set a competitive price to attract buyers quickly.',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero */}
      <section className="bg-white border-b border-cream-200 py-16">
        <div className="container-wide text-center">
          <h1 className="text-4xl md:text-5xl font-display font-semibold text-brand-950 mb-4">
            How It Works
          </h1>
          <p className="text-xl text-brand-600 max-w-2xl mx-auto">
            Sell your home without the 6% agent commission. Our AI-powered platform 
            makes FSBO easier than ever.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20">
        <div className="container-wide">
          <div className="space-y-16">
            {steps.map((step, index) => (
              <div 
                key={step.number}
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}
              >
                {/* Content */}
                <div className="flex-1">
                  <div className="text-6xl font-display font-bold text-brand-200 mb-4">
                    {step.number}
                  </div>
                  <h2 className="text-3xl font-display font-semibold text-brand-900 mb-4">
                    {step.title}
                  </h2>
                  <p className="text-lg text-brand-600 mb-6 leading-relaxed">
                    {step.description}
                  </p>
                  <ul className="space-y-2">
                    {step.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-brand-700">
                        <CheckCircle2 className="w-5 h-5 text-forest-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Visual */}
                <div className="flex-1">
                  <div className="bg-white rounded-2xl border border-cream-200 p-8 shadow-warm">
                    <div className="w-20 h-20 rounded-2xl bg-brand-100 flex items-center justify-center mx-auto mb-6">
                      <step.icon className="w-10 h-10 text-brand-600" />
                    </div>
                    <div className="h-32 bg-cream-100 rounded-xl flex items-center justify-center">
                      <span className="text-brand-400 text-sm">
                        [Interactive Demo Coming Soon]
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-display font-semibold text-brand-950 mb-4">
              Why Sell Without an Agent?
            </h2>
            <p className="text-lg text-brand-600">
              FSBO sellers keep more money and stay in control of their sale.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="text-center">
                <div className="w-14 h-14 rounded-xl bg-brand-100 flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-7 h-7 text-brand-600" />
                </div>
                <h3 className="text-lg font-display font-semibold text-brand-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-brand-600 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20">
        <div className="container-narrow">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-semibold text-brand-950 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl border border-cream-200 p-6"
              >
                <h3 className="font-display font-semibold text-brand-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-brand-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-brand-900">
        <div className="container-wide text-center">
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-white mb-4">
            Ready to Save Thousands?
          </h2>
          <p className="text-xl text-brand-200 max-w-2xl mx-auto mb-8">
            Join thousands of homeowners who sold their homes without paying 
            agent commissions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/list-your-home" className="btn bg-white text-brand-900 hover:bg-cream-100 text-lg px-8 py-3.5">
              List Your Home Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/home-value" className="btn border-2 border-brand-300 text-white hover:bg-brand-800 text-lg px-8 py-3.5">
              Get Home Value Estimate
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
