import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import { UserContext } from '../context/userContext';

// Initialize Stripe with the public key - replace with your actual publishable key
const stripePromise = loadStripe('pk_test_51RFgjIGgd6saM2FuNpp5dEKOA2GmwxLSkxQ4TqGOmpgrKL76NdkbVZOoGc1fkkCtMKAw2Af50ruffef2c8QVx4pz00Jr4DadPy');

const DonateForm = () => {
  const { domainId } = useParams();
  const navigate = useNavigate();
  const [domain, setDomain] = useState(null);
  
  // Define the donation domains
  const donationDomains = [
    {
      id: 1,
      title: "Education",
      description: "Scholarships, schools, books, resources for underprivileged children",
      image: "/education.webp",
    },
    {
      id: 2,
      title: "Health & Medicine",
      description: "Cancer research, mental health, medical aid, hospitals, vaccinations",
      image: "/health.webp",
    },
    {
      id: 3,
      title: "Poverty & Hunger",
      description: "Food banks, shelter, basic income initiatives, clean water",
      image: "/poverty.webp",
    },
    {
      id: 4,
      title: "Disaster Relief",
      description: "Earthquakes, floods, war zones, emergency aid",
      image: "/disaster.jpg",
    },
    {
      id: 5,
      title: "Animal Welfare",
      description: "Help animals in need, rescue shelters, wildlife protection, anti-poaching",
      image: "/animal.jpg",
    }
  ];
  
  useEffect(() => {
    // Find the donation domain based on the ID
    const domainData = donationDomains.find(d => d.id === parseInt(domainId));
    
    if (!domainData) {
      // Redirect to donation page if no valid domain is found
      navigate('/donate');
      return;
    }
    
    setDomain(domainData);
  }, [domainId, navigate]);
  
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {domain && (
          <>
            <div className="text-center mb-12">
              <h1 className="charity-header">
                Donate to <span className="text-green-600">{domain.title}</span>
              </h1>
              <p className="text-gray-600 max-w-3xl mx-auto">
                {domain.description}
              </p>
            </div>
            
            <div className="bg-white rounded-xl overflow-hidden shadow-md">
              <div className="h-48 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-700 opacity-70 z-10"></div>
                <img 
                  src={domain.image} 
                  alt={domain.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/800x400/f9fafb/4f7942?text="+domain.title;
                  }}
                />
              </div>
              
              <div className="p-8">
                <Elements stripe={stripePromise}>
                  <CheckoutForm donationCategory={domain.title} />
                </Elements>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const CheckoutForm = ({ donationCategory }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  
  const [amount, setAmount] = useState(1000); // Default $10.00
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [succeeded, setSucceeded] = useState(false);
  
  const predefinedAmounts = [1000, 2500, 5000, 10000]; // $10, $25, $50, $100
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    
    if (!stripe || !elements) {
      setLoading(false);
      return;
    }
    
    try {
      // Create a payment intent on the server
      const response = await axiosInstance.post(API_PATHS.DONATIONS.CREATE_PAYMENT_INTENT, {
        amount,
        donationCategory,
      });
      
      setClientSecret(response.data.clientSecret);
      
      // Confirm the payment with Stripe
      const result = await stripe.confirmCardPayment(response.data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user.name,
            email: user.email,
          },
        },
      });
      
      if (result.error) {
        setError(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        // Record the donation in our database
        await axiosInstance.post(API_PATHS.DONATIONS.RECORD_DONATION, {
          amount,
          paymentIntentId: result.paymentIntent.id,
          donationCategory,
        });
        
        setSucceeded(true);
        setTimeout(() => {
          navigate('/user/my-donations');
        }, 2000);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.response?.data?.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {succeeded ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-green-800 mb-2">Thank You!</h3>
          <p className="text-gray-600">Your donation was successful. You're making a difference!</p>
        </div>
      ) : (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Donation Amount
            </label>
            
            <div className="grid grid-cols-4 gap-3 mb-4">
              {predefinedAmounts.map((presetAmount) => (
                <button
                  key={presetAmount}
                  type="button"
                  className={`py-3 px-4 rounded-md transition-all ${
                    amount === presetAmount 
                      ? 'bg-green-600 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setAmount(presetAmount)}
                >
                  ${presetAmount / 100}
                </button>
              ))}
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Amount
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  value={amount / 100}
                  onChange={(e) => setAmount(Math.max(100, Math.round(parseFloat(e.target.value) * 100)))}
                  className="w-full py-3 pl-8 pr-4 bg-white border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-gray-700"
                  placeholder="Enter amount"
                  min="1"
                  step="0.01"
                />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Details
            </label>
            <div className="p-4 bg-white border border-gray-300 rounded-md">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#4b5563',
                      '::placeholder': {
                        color: '#9ca3af',
                      },
                    },
                    invalid: {
                      color: '#ef4444',
                      iconColor: '#ef4444',
                    },
                  },
                }}
              />
            </div>
          </div>
          
          {error && (
            <div className="text-red-600 text-sm p-3 bg-red-50 border border-red-200 rounded">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={!stripe || loading}
            className={`w-full py-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Processing...' : `Donate $${(amount / 100).toFixed(2)}`}
          </button>
        </>
      )}
    </form>
  );
};

export default DonateForm; 