import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';

const MyDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.DONATIONS.GET_DONATION_HISTORY);
        setDonations(response.data);
      } catch (err) {
        console.error('Error fetching donations:', err);
        setError('Failed to load your donation history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  // Calculate total donations
  const totalDonated = donations.reduce((sum, donation) => sum + donation.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="charity-header mb-2">My Donations</h1>
          
          <div className="text-xl text-green-700 font-medium mb-6">
            Thank you for being a part of making a difference, {user?.name || 'generous donor'}!
          </div>
          
          <div className="bg-white rounded-xl p-6 mb-8 shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-green-50 rounded-lg border border-green-100">
                <h3 className="text-lg text-gray-600 mb-1">Total Donated</h3>
                <p className="text-3xl font-bold text-green-600">${totalDonated.toFixed(2)}</p>
              </div>
              
              <div className="p-6 bg-green-50 rounded-lg border border-green-100">
                <h3 className="text-lg text-gray-600 mb-1">Donations</h3>
                <p className="text-3xl font-bold text-green-600">{donations.length}</p>
              </div>
              
              <div className="p-6 bg-green-50 rounded-lg border border-green-100">
                <h3 className="text-lg text-gray-600 mb-1">Impact Made</h3>
                <p className="text-3xl font-bold text-green-600">Significant</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="charity-subheader">Donation History</h2>
            <Link 
              to="/home" 
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-all"
            >
              Make a New Donation
            </Link>
          </div>
          
          {loading ? (
            <div className="text-center py-10">
              <div className="animate-pulse text-green-600 text-xl">Loading your donations...</div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 p-4 rounded-md text-red-600">
              {error}
            </div>
          ) : donations.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center shadow-md">
              <div className="w-20 h-20 mx-auto mb-4 bg-green-50 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">No Donations Yet</h3>
              <p className="text-gray-600 mb-6">You haven't made any donations yet. Start making a difference today!</p>
              <Link 
                to="/donate" 
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md transition-all inline-block"
              >
                Make Your First Donation
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-xl overflow-hidden shadow-md">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {donations.map((donation) => (
                    <tr key={donation._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {donation.donationCategory}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        ${donation.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          donation.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {donation.status === 'completed' ? 'Completed' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyDonations;