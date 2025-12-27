import { useState, useEffect } from 'react';
import { Package, Check, Star, ArrowRight, Loader2, Database } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { samplePackages } from '../utils/seedPackages';
import { SeedPackagesButton } from './SeedPackagesButton';

interface PricingPackage {
  id: string;
  name: string;
  price: number;
  credits: number;
  validityDays: number;
  description?: string;
  isActive: boolean;
  isBestSeller?: boolean;
  features?: string[];
}

interface PricingProps {
  isAuthenticated: boolean;
  onNavigate: (page: string, packageId?: string) => void;
}

export function Pricing({ isAuthenticated, onNavigate }: PricingProps) {
  const [packages, setPackages] = useState<PricingPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-baa97425/packages`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch packages');
      }

      const data = await response.json();
      setPackages(data.packages || []);
    } catch (err) {
      console.error('Error fetching packages:', err);
      setError('Unable to load packages. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyClick = (packageId: string) => {
    if (isAuthenticated) {
      // Redirect to member dashboard with package ID to open modal
      onNavigate('member', packageId);
    } else {
      // Redirect to register page
      // Store intended package in sessionStorage for post-registration redirect
      sessionStorage.setItem('intendedPackage', packageId);
      onNavigate('login');
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US');
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-white to-[var(--color-cream)]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="mb-4 text-[var(--color-earth-dark)]">
            Class Packages & Pricing
          </h1>
          <p className="text-[var(--color-stone)] max-w-2xl mx-auto text-lg">
            Choose the perfect package for your yoga journey. All packages include access to our full class schedule.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 size={48} className="text-[var(--color-sage)] animate-spin mb-4" />
            <p className="text-[var(--color-stone)]">Loading packages...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md mx-auto">
            <p className="text-red-800">{error}</p>
            <button
              onClick={fetchPackages}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Pricing Cards Grid */}
        {!isLoading && !error && packages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group ${
                  pkg.isBestSeller
                    ? 'ring-2 ring-[var(--color-sage)] transform hover:scale-105'
                    : 'hover:-translate-y-2'
                }`}
              >
                {/* Best Seller Badge */}
                {pkg.isBestSeller && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-[var(--color-sage)] to-[var(--color-clay)] text-white px-6 py-2 rounded-bl-2xl flex items-center gap-2 shadow-lg z-10">
                    <Star size={16} fill="currentColor" />
                    <span className="text-sm font-semibold">Recommended</span>
                  </div>
                )}

                <div className="p-8">
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${
                      pkg.isBestSeller
                        ? 'bg-gradient-to-br from-[var(--color-sage)] to-[var(--color-clay)]'
                        : 'bg-[var(--color-sand)]'
                    }`}
                  >
                    <Package
                      size={32}
                      className={pkg.isBestSeller ? 'text-white' : 'text-[var(--color-earth-dark)]'}
                    />
                  </div>

                  {/* Package Name */}
                  <h3 className="mb-2 text-[var(--color-earth-dark)]">
                    {pkg.name}
                  </h3>

                  {/* Description */}
                  {pkg.description && (
                    <p className="text-sm text-[var(--color-stone)] mb-6">
                      {pkg.description}
                    </p>
                  )}

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold text-[var(--color-earth-dark)]">
                        {formatPrice(pkg.price)}
                      </span>
                      <span className="text-xl text-[var(--color-stone)]">THB</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-[var(--color-stone)]">
                      <Check size={20} className="text-[var(--color-sage)] flex-shrink-0" />
                      <span>{pkg.credits} classes included</span>
                    </div>
                    <div className="flex items-center gap-3 text-[var(--color-stone)]">
                      <Check size={20} className="text-[var(--color-sage)] flex-shrink-0" />
                      <span>Valid for {pkg.validityDays} days</span>
                    </div>
                    <div className="flex items-center gap-3 text-[var(--color-stone)]">
                      <Check size={20} className="text-[var(--color-sage)] flex-shrink-0" />
                      <span>All class types included</span>
                    </div>
                    {pkg.features?.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 text-[var(--color-stone)]">
                        <Check size={20} className="text-[var(--color-sage)] flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Buy Now Button */}
                  <button
                    onClick={() => handleBuyClick(pkg.id)}
                    className={`w-full py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 group/btn shadow-md hover:shadow-lg ${
                      pkg.isBestSeller
                        ? 'bg-gradient-to-r from-[var(--color-sage)] to-[var(--color-clay)] text-white hover:opacity-90'
                        : 'bg-[var(--color-sage)] text-white hover:bg-[var(--color-clay)]'
                    }`}
                  >
                    <span className="font-semibold text-lg">
                      {isAuthenticated ? 'Buy Now' : 'Sign Up to Buy'}
                    </span>
                    <ArrowRight
                      size={20}
                      className="group-hover/btn:translate-x-1 transition-transform"
                    />
                  </button>

                  {!isAuthenticated && (
                    <p className="text-xs text-center text-[var(--color-stone)] mt-3">
                      Create an account to purchase
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Packages Available */}
        {!isLoading && !error && packages.length === 0 && (
          <>
            <div className="text-center py-20">
              <Package size={64} className="text-[var(--color-stone)] mx-auto mb-4 opacity-50" />
              <h3 className="mb-2 text-[var(--color-earth-dark)]">
                No Packages Available
              </h3>
              <p className="text-[var(--color-stone)]">
                Check back soon for our class packages!
              </p>
            </div>
            
            {/* Seed Button - Development Helper */}
            <SeedPackagesButton />
          </>
        )}

        {/* Additional Info */}
        <div className="mt-16 bg-white rounded-2xl shadow-md p-8 max-w-4xl mx-auto">
          <h3 className="mb-6 text-center text-[var(--color-earth-dark)]">
            Frequently Asked Questions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-[var(--color-earth-dark)] mb-2">
                How do class credits work?
              </h4>
              <p className="text-sm text-[var(--color-stone)]">
                Each class booking uses one credit from your package. Credits are valid for the number of days specified in your package.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-[var(--color-earth-dark)] mb-2">
                Can I share my package?
              </h4>
              <p className="text-sm text-[var(--color-stone)]">
                Packages are non-transferable and can only be used by the purchaser. Each person needs their own package.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-[var(--color-earth-dark)] mb-2">
                What payment methods do you accept?
              </h4>
              <p className="text-sm text-[var(--color-stone)]">
                We accept bank transfers and cash payments at the studio. Contact us via WhatsApp or Instagram for cash payments.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-[var(--color-earth-dark)] mb-2">
                Can I get a refund?
              </h4>
              <p className="text-sm text-[var(--color-stone)]">
                Packages are non-refundable but can be paused in case of medical emergencies with valid documentation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}