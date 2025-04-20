import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layouts/Navbar';

const Home = () => {
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


  return (
    
    <div className="min-h-screen bg-white text-gray-800">
      <div className="bg-white">
        <Navbar />
      </div>
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white opacity-70 z-10"></div>
          <img 
            src="/hero-background.jpg" 
            alt="Giving back" 
            className="w-full h-full object-cover object-center"
            style={{ filter: 'brightness(0.9) saturate(1.2)' }}
          />
        </div>
        
        <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-md">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-green-800">
              <span className="text-green-600">Make</span> a <span className="text-green-600">Difference</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8">
              Your generosity can transform lives. Choose a cause you care about and create lasting change today.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              
              <Link
                to="/user/my-donations"
                className="px-6 py-3 bg-white border-2 border-green-600 text-green-600 hover:bg-green-50 rounded-md font-medium transition-all duration-300"
              >
                View My Donations
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="py-12 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center transform hover:-translate-y-2 transition-all duration-300">
              <div className="text-green-600 text-4xl font-bold mb-2">$2.5M+</div>
              <p className="text-gray-700">Donations Raised</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center transform hover:-translate-y-2 transition-all duration-300">
              <div className="text-green-600 text-4xl font-bold mb-2">10,000+</div>
              <p className="text-gray-700">Lives Improved</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center transform hover:-translate-y-2 transition-all duration-300">
              <div className="text-green-600 text-4xl font-bold mb-2">50+</div>
              <p className="text-gray-700">Partner Organizations</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center transform hover:-translate-y-2 transition-all duration-300">
              <div className="text-green-600 text-4xl font-bold mb-2">25</div>
              <p className="text-gray-700">Countries Reached</p>
            </div>
          </div>
        </div>
      </section>

      {/* Organization Description */}
      <section className="charity-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="charity-header">
              About <span className="text-green-600">Gift of Change</span>
            </h2>
            <p className="text-gray-700 max-w-3xl mx-auto">
              We connect compassionate donors with impactful causes around the world, ensuring your contribution 
              creates meaningful change. Our platform provides transparent tracking of donations and showcases 
              the direct impact of your generosity.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md transform hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="charity-subheader mb-2">Transparency</h3>
              <p className="text-gray-700">We ensure that 98% of your donation reaches the intended cause, with minimal overhead costs.</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md transform hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="charity-subheader mb-2">Community</h3>
              <p className="text-gray-700">Join thousands of donors creating a global impact through coordinated giving and community support.</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md transform hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="charity-subheader mb-2">Impact Reports</h3>
              <p className="text-gray-700">Track exactly where your donation goes and see the impact through regular updates and detailed reports.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Domains */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="charity-header">
              Donation <span className="text-green-600">Domains</span>
            </h2>
            <p className="text-gray-700 max-w-3xl mx-auto">
              Choose a cause that resonates with you. Every contribution, no matter the size, creates a ripple effect of positive change.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {donationDomains.map((domain) => (
              <div 
                key={domain.id} 
                className="charity-card group"
              >
                <div className="h-48 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br opacity-60 z-10 group-hover:opacity-70 transition-opacity"></div>
                  <img 
                    src={domain.image} 
                    alt={domain.title} 
                    className="w-full h-full object-cover object-center transition-transform group-hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/400x200/f9fafb/4f7942?text="+domain.title;
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-green-800">{domain.title}</h3>
                  <p className="text-gray-700 mb-4">{domain.description}</p>
                  <Link
                    to={`/donate/${domain.id}`}
                    className="inline-block px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-all duration-300"
                  >
                    Donate Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      

      {/* Call To Action */}
      <section className="py-16 bg-gradient-to-r from-green-500 to-green-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to Make a Difference?</h2>
          <p className="text-xl text-white mb-8 max-w-3xl mx-auto">
            Join thousands of donors who have already created positive change through our platform.
          </p>
          
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            
            
            
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Gift of Change. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
