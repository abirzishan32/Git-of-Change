import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const donationDomains = [
    {
      id: 1,
      title: "Education",
      description: "Scholarships, schools, books, resources for underprivileged children",
      image: "/public/education.webp",
    },
    {
      id: 2,
      title: "Health & Medicine",
      description: "Cancer research, mental health, medical aid, hospitals, vaccinations",
      image: "/public/health.webp",
    },
    {
      id: 3,
      title: "Poverty & Hunger",
      description: "Food banks, shelter, basic income initiatives, clean water",
      image: "/public/poverty.webp",
    },
    
    {
      id: 4,
      title: "Disaster Relief",
      description: "Earthquakes, floods, war zones, emergency aid",
      image: "/public/disaster.jpg",
    },
    {
      id: 5,
      title: "Animal Welfare",
      description: "Rescue shelters, wildlife protection, anti-poaching",
      image: "/public/animal.jpg",
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-90 z-10"></div>
          <img 
            src="/public/hero-background.jpg" 
            alt="Giving back" 
            className="w-full h-full object-cover object-center"
            style={{ filter: 'brightness(0.4) contrast(1.2)' }}
          />
        </div>
        
        <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            <span className="text-purple-500">Make</span> a <span className="text-purple-500">Difference</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8">
            Your generosity can transform lives. Choose a cause you care about and create change today.
          </p>
          <Link 
            to="/donate" 
            className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-medium transition-all duration-300 transform hover:translate-y-[-4px] hover:shadow-lg inline-block"
          >
            Donate Now
          </Link>
        </div>
      </section>

      {/* Organization Description */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              About <span className="text-purple-500">Gift of Change</span>
            </h2>
            <p className="text-gray-400 max-w-3xl mx-auto">
              We connect donors with impactful causes around the world, ensuring your contribution creates meaningful change. 
              Our platform provides transparent tracking of donations and showcases the direct impact of your generosity.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-8 rounded-lg transform hover:-translate-y-2 transition-all duration-300">
              <div className="text-purple-500 text-4xl mb-4">98%</div>
              <h3 className="text-xl font-bold mb-2">Funds Delivered</h3>
              <p className="text-gray-400">We ensure that 98% of your donation reaches the intended cause, with minimal overhead costs.</p>
            </div>
            
            <div className="bg-gray-800 p-8 rounded-lg transform hover:-translate-y-2 transition-all duration-300">
              <div className="text-purple-500 text-4xl mb-4">50+</div>
              <h3 className="text-xl font-bold mb-2">Partner Organizations</h3>
              <p className="text-gray-400">We've partnered with over 50 vetted organizations across all our donation domains.</p>
            </div>
            
            <div className="bg-gray-800 p-8 rounded-lg transform hover:-translate-y-2 transition-all duration-300">
              <div className="text-purple-500 text-4xl mb-4">100%</div>
              <h3 className="text-xl font-bold mb-2">Transparency</h3>
              <p className="text-gray-400">Track exactly where your donation goes and see the impact through regular updates.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Domains */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Donation <span className="text-purple-500">Domains</span>
            </h2>
            <p className="text-gray-400 max-w-3xl mx-auto">
              Choose a cause that resonates with you. Every contribution, no matter the size, creates a ripple effect of positive change.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {donationDomains.map((domain) => (
              <div 
                key={domain.id} 
                className="bg-gray-900 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="h-48 relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${domain.color} opacity-80 z-10`}></div>
                  <img 
                    src={domain.image} 
                    alt={domain.title} 
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/400x200/111827/f3f4f6?text=Image+Not+Found";
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-white">{domain.title}</h3>
                  <p className="text-gray-400 mb-4">{domain.description}</p>
                  <Link
                    to={`/donate/${domain.id}`}
                    className="inline-block px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition-all duration-300"
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
      <section className="py-16 bg-gradient-to-r from-purple-900 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Join thousands of donors who have already created positive change through our platform.
          </p>
          <div className="space-x-4">
            <Link 
              to="/donate" 
              className="px-8 py-4 bg-white text-purple-900 hover:bg-gray-200 rounded-md font-medium transition-all duration-300 inline-block"
            >
              Donate Now
            </Link>
            <Link 
              to="/register" 
              className="px-8 py-4 bg-transparent border border-white text-white hover:bg-white hover:text-purple-900 rounded-md font-medium transition-all duration-300 inline-block"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
