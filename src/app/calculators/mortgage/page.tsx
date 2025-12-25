'use client';

import { useState, useMemo } from 'react';
import { Calculator, DollarSign, Percent, Calendar, TrendingDown, Info } from 'lucide-react';

export default function MortgageCalculatorPage() {
  const [homePrice, setHomePrice] = useState(350000);
  const [downPayment, setDownPayment] = useState(70000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [propertyTax, setPropertyTax] = useState(3500);
  const [homeInsurance, setHomeInsurance] = useState(1200);
  const [pmi, setPmi] = useState(0);

  // Sync down payment amount and percentage
  const handleHomePriceChange = (value: number) => {
    setHomePrice(value);
    setDownPayment(Math.round(value * (downPaymentPercent / 100)));
  };

  const handleDownPaymentChange = (value: number) => {
    setDownPayment(value);
    setDownPaymentPercent(Math.round((value / homePrice) * 100));
  };

  const handleDownPaymentPercentChange = (value: number) => {
    setDownPaymentPercent(value);
    setDownPayment(Math.round(homePrice * (value / 100)));
  };

  // Calculate mortgage
  const calculations = useMemo(() => {
    const principal = homePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm * 12;

    // Monthly P&I payment
    const monthlyPI =
      monthlyRate === 0
        ? principal / numPayments
        : (principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
          (Math.pow(1 + monthlyRate, numPayments) - 1);

    const monthlyTax = propertyTax / 12;
    const monthlyInsurance = homeInsurance / 12;
    
    // PMI if down payment < 20%
    const monthlyPMI = downPaymentPercent < 20 ? (principal * 0.005) / 12 : 0;

    const totalMonthly = monthlyPI + monthlyTax + monthlyInsurance + monthlyPMI;
    const totalInterest = monthlyPI * numPayments - principal;
    const totalCost = monthlyPI * numPayments + propertyTax * loanTerm + homeInsurance * loanTerm;

    return {
      principal,
      monthlyPI: Math.round(monthlyPI),
      monthlyTax: Math.round(monthlyTax),
      monthlyInsurance: Math.round(monthlyInsurance),
      monthlyPMI: Math.round(monthlyPMI),
      totalMonthly: Math.round(totalMonthly),
      totalInterest: Math.round(totalInterest),
      totalCost: Math.round(totalCost),
    };
  }, [homePrice, downPayment, downPaymentPercent, interestRate, loanTerm, propertyTax, homeInsurance]);

  // Amortization schedule (first 12 months)
  const amortizationPreview = useMemo(() => {
    const schedule = [];
    let balance = calculations.principal;
    const monthlyRate = interestRate / 100 / 12;

    for (let i = 1; i <= 12; i++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = calculations.monthlyPI - interestPayment;
      balance -= principalPayment;

      schedule.push({
        month: i,
        payment: calculations.monthlyPI,
        principal: Math.round(principalPayment),
        interest: Math.round(interestPayment),
        balance: Math.round(balance),
      });
    }

    return schedule;
  }, [calculations, interestRate]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

  return (
    <div className="min-h-screen bg-cream-50 py-12">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-100 text-brand-700 text-sm mb-4">
            <Calculator className="w-4 h-4" />
            Free Tool
          </div>
          <h1 className="text-4xl font-display font-semibold text-brand-950 mb-4">
            Mortgage Calculator
          </h1>
          <p className="text-lg text-brand-600">
            Estimate your monthly mortgage payment and see how much home you can afford.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calculator Inputs */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-cream-200 p-6">
              <h2 className="text-lg font-display font-semibold text-brand-900 mb-6">
                Loan Details
              </h2>

              {/* Home Price */}
              <div className="mb-6">
                <label className="label flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Home Price
                </label>
                <input
                  type="range"
                  min={50000}
                  max={2000000}
                  step={5000}
                  value={homePrice}
                  onChange={(e) => handleHomePriceChange(Number(e.target.value))}
                  className="w-full h-2 bg-cream-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-brand-500">$50k</span>
                  <input
                    type="number"
                    value={homePrice}
                    onChange={(e) => handleHomePriceChange(Number(e.target.value))}
                    className="input w-32 text-center py-1"
                  />
                  <span className="text-sm text-brand-500">$2M</span>
                </div>
              </div>

              {/* Down Payment */}
              <div className="mb-6">
                <label className="label flex items-center gap-2">
                  <TrendingDown className="w-4 h-4" />
                  Down Payment
                </label>
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-500">$</span>
                      <input
                        type="number"
                        value={downPayment}
                        onChange={(e) => handleDownPaymentChange(Number(e.target.value))}
                        className="input pl-8"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="relative">
                      <input
                        type="number"
                        value={downPaymentPercent}
                        onChange={(e) => handleDownPaymentPercentChange(Number(e.target.value))}
                        className="input pr-8"
                        min={0}
                        max={100}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-500">%</span>
                    </div>
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={50}
                  step={1}
                  value={downPaymentPercent}
                  onChange={(e) => handleDownPaymentPercentChange(Number(e.target.value))}
                  className="w-full h-2 bg-cream-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                />
                {downPaymentPercent < 20 && (
                  <p className="text-sm text-amber-600 mt-2 flex items-center gap-1">
                    <Info className="w-4 h-4" />
                    PMI required for down payments under 20%
                  </p>
                )}
              </div>

              {/* Interest Rate */}
              <div className="mb-6">
                <label className="label flex items-center gap-2">
                  <Percent className="w-4 h-4" />
                  Interest Rate
                </label>
                <input
                  type="range"
                  min={1}
                  max={12}
                  step={0.125}
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full h-2 bg-cream-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-brand-500">1%</span>
                  <input
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    step={0.125}
                    className="input w-24 text-center py-1"
                  />
                  <span className="text-sm text-brand-500">12%</span>
                </div>
              </div>

              {/* Loan Term */}
              <div className="mb-6">
                <label className="label flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Loan Term
                </label>
                <div className="flex gap-3">
                  {[15, 20, 30].map((term) => (
                    <button
                      key={term}
                      onClick={() => setLoanTerm(term)}
                      className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                        loanTerm === term
                          ? 'bg-brand-600 text-white'
                          : 'bg-cream-100 text-brand-700 hover:bg-cream-200'
                      }`}
                    >
                      {term} years
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional Costs */}
              <div className="pt-6 border-t border-cream-200">
                <h3 className="font-medium text-brand-900 mb-4">Additional Costs (Annual)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Property Tax</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-500">$</span>
                      <input
                        type="number"
                        value={propertyTax}
                        onChange={(e) => setPropertyTax(Number(e.target.value))}
                        className="input pl-8"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label">Home Insurance</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-500">$</span>
                      <input
                        type="number"
                        value={homeInsurance}
                        onChange={(e) => setHomeInsurance(Number(e.target.value))}
                        className="input pl-8"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Amortization Preview */}
            <div className="bg-white rounded-2xl border border-cream-200 p-6">
              <h2 className="text-lg font-display font-semibold text-brand-900 mb-4">
                First Year Amortization
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-cream-200">
                      <th className="text-left py-2 text-brand-500 font-medium">Month</th>
                      <th className="text-right py-2 text-brand-500 font-medium">Payment</th>
                      <th className="text-right py-2 text-brand-500 font-medium">Principal</th>
                      <th className="text-right py-2 text-brand-500 font-medium">Interest</th>
                      <th className="text-right py-2 text-brand-500 font-medium">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {amortizationPreview.map((row) => (
                      <tr key={row.month} className="border-b border-cream-100">
                        <td className="py-2 text-brand-700">{row.month}</td>
                        <td className="py-2 text-right text-brand-700">{formatCurrency(row.payment)}</td>
                        <td className="py-2 text-right text-forest-600">{formatCurrency(row.principal)}</td>
                        <td className="py-2 text-right text-brand-500">{formatCurrency(row.interest)}</td>
                        <td className="py-2 text-right text-brand-700">{formatCurrency(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Results Sidebar */}
          <div className="space-y-6">
            {/* Monthly Payment Card */}
            <div className="bg-brand-600 rounded-2xl p-6 text-white sticky top-24">
              <h2 className="text-lg font-medium mb-2 text-brand-100">
                Estimated Monthly Payment
              </h2>
              <div className="text-5xl font-display font-bold mb-6">
                {formatCurrency(calculations.totalMonthly)}
              </div>

              {/* Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-brand-200">Principal & Interest</span>
                  <span className="font-medium">{formatCurrency(calculations.monthlyPI)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-200">Property Tax</span>
                  <span className="font-medium">{formatCurrency(calculations.monthlyTax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-200">Home Insurance</span>
                  <span className="font-medium">{formatCurrency(calculations.monthlyInsurance)}</span>
                </div>
                {calculations.monthlyPMI > 0 && (
                  <div className="flex justify-between">
                    <span className="text-brand-200">PMI</span>
                    <span className="font-medium">{formatCurrency(calculations.monthlyPMI)}</span>
                  </div>
                )}
              </div>

              {/* Visual Breakdown */}
              <div className="h-4 rounded-full overflow-hidden flex mb-6">
                <div
                  className="bg-white"
                  style={{ width: `${(calculations.monthlyPI / calculations.totalMonthly) * 100}%` }}
                />
                <div
                  className="bg-brand-300"
                  style={{ width: `${(calculations.monthlyTax / calculations.totalMonthly) * 100}%` }}
                />
                <div
                  className="bg-brand-400"
                  style={{ width: `${(calculations.monthlyInsurance / calculations.totalMonthly) * 100}%` }}
                />
                {calculations.monthlyPMI > 0 && (
                  <div
                    className="bg-brand-500"
                    style={{ width: `${(calculations.monthlyPMI / calculations.totalMonthly) * 100}%` }}
                  />
                )}
              </div>

              <div className="pt-4 border-t border-brand-500 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-brand-200">Loan Amount</span>
                  <span>{formatCurrency(calculations.principal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-200">Total Interest</span>
                  <span>{formatCurrency(calculations.totalInterest)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-200">Total Cost</span>
                  <span>{formatCurrency(calculations.totalCost)}</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-white rounded-2xl border border-cream-200 p-6 text-center">
              <h3 className="font-display font-semibold text-brand-900 mb-2">
                Ready to buy?
              </h3>
              <p className="text-sm text-brand-600 mb-4">
                Browse homes in your price range
              </p>
              <a
                href={`/listings?maxPrice=${homePrice}`}
                className="btn-primary w-full"
              >
                Find Homes Under {formatCurrency(homePrice)}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
