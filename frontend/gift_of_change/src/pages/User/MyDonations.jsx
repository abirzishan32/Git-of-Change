import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const MyDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <div className="min-h-screen bg-black text-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-6">My Donations</h1>
          
          <div className="bg-gray-900 rounded-xl p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-gray-800 rounded-lg">
                <h3 className="text-lg text-gray-400 mb-1">Total Donated</h3>
                <p className="text-3xl font-bold text-purple-500">${totalDonated.toFixed(2)}</p>
              </div>
              
              <div className="p-6 bg-gray-800 rounded-lg">
                <h3 className="text-lg text-gray-400 mb-1">Donations</h3>
                <p className="text-3xl font-bold text-purple-500">{donations.length}</p>
              </div>
              
              <div className="p-6 bg-gray-800 rounded-lg">
                <h3 className="text-lg text-gray-400 mb-1">Impact Made</h3>
                <p className="text-3xl font-bold text-green-500">Significant</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Donation History</h2>
            <Link 
              to="/donate" 
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-all"
            >
              Make a New Donation
            </Link>
          </div>
          
          {loading ? (
            <div className="text-center py-10">
              <div className="animate-pulse text-purple-500 text-xl">Loading your donations...</div>
            </div>
          ) : error ? (
            <div className="bg-red-900 bg-opacity-30 p-4 rounded-md text-red-400">
              {error}
            </div>
          ) : donations.length === 0 ? (
            <div className="bg-gray-900 rounded-xl p-8 text-center">
              <h3 className="text-xl font-semibold mb-4">No Donations Yet</h3>
              <p className="text-gray-400 mb-6">You haven't made any donations yet. Start making a difference today!</p>
              <Link 
                to="/donate" 
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-all inline-block"
              >
                Make Your First Donation
              </Link>
            </div>
          ) : (
            <div className="bg-gray-900 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {donations.map((donation) => (
                    <tr key={donation._id} className="hover:bg-gray-800 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {donation.donationCategory}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-500">
                        ${donation.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          donation.status === 'completed' 
                            ? 'bg-green-900 bg-opacity-30 text-green-500' 
                            : 'bg-yellow-900 bg-opacity-30 text-yellow-500'
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