import React, { useState, useEffect } from 'react';
import { useUserAuth } from '../../hooks/useUserAuth';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { UserContext } from '../../context/userContext';
import { useContext } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const Dashboard = () => { 
  useUserAuth();
  const { user } = useContext(UserContext);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalAmount: 0,
    uniqueUsers: 0,
    domains: {}
  });

  useEffect(() => {
    const fetchAllDonations = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.DONATIONS.GET_ALL_DONATIONS);
        setDonations(response.data);
        
        // Calculate dashboard statistics
        const totalAmount = response.data.reduce((sum, donation) => sum + donation.amount, 0);
        const uniqueUsersSet = new Set(response.data.map(donation => donation.user?._id));
        
        // Count donations by domain
        const domainCounts = {};
        response.data.forEach(donation => {
          const category = donation.donationCategory;
          if (domainCounts[category]) {
            domainCounts[category].count += 1;
            domainCounts[category].amount += donation.amount;
          } else {
            domainCounts[category] = { 
              count: 1, 
              amount: donation.amount 
            };
          }
        });

        setStats({
          totalDonations: response.data.length,
          totalAmount,
          uniqueUsers: uniqueUsersSet.size,
          domains: domainCounts
        });
      } catch (err) {
        console.error('Error fetching donations:', err);
        setError('Failed to load donation data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'admin') {
      fetchAllDonations();
    }
  }, [user]);

  return (
    <DashboardLayout>
      <div className="py-8">
        <h1 className="charity-header mb-8 text-center md:text-left">Admin Dashboard</h1>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-pulse text-green-600 text-xl">Loading donation data...</div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 p-6 rounded-xl text-red-600 mb-8">
            {error}
          </div>
        ) : (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <h3 className="text-lg text-gray-600 mb-2">Total Donations</h3>
                <p className="text-3xl font-bold text-green-600">{stats.totalDonations}</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <h3 className="text-lg text-gray-600 mb-2">Total Amount</h3>
                <p className="text-3xl font-bold text-green-600">${stats.totalAmount.toFixed(2)}</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <h3 className="text-lg text-gray-600 mb-2">Unique Donors</h3>
                <p className="text-3xl font-bold text-green-600">{stats.uniqueUsers}</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <h3 className="text-lg text-gray-600 mb-2">Most Popular Domain</h3>
                <p className="text-3xl font-bold text-green-600">
                  {Object.entries(stats.domains).sort((a, b) => b[1].count - a[1].count)[0]?.[0] || 'N/A'}
                </p>
              </div>
            </div>
            
            {/* Donation Categories */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-10 hover:shadow-md transition-shadow">
              <h2 className="charity-subheader mb-6">Donation by Category</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
                {Object.entries(stats.domains).map(([domain, data]) => (
                  <div key={domain} className="bg-green-50 p-4 rounded-lg border border-green-100 hover:bg-green-100 transition-colors">
                    <h3 className="font-semibold text-green-800 mb-3">{domain}</h3>
                    <div className="flex justify-between mt-2">
                      <div>
                        <p className="text-sm text-gray-600">Count</p>
                        <p className="font-bold text-green-600">{data.count}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Amount</p>
                        <p className="font-bold text-green-600">${data.amount.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Donations Table */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                <h2 className="charity-subheader">All Donations</h2>
                <div className="text-sm text-gray-500">
                  Showing {donations.length} donation{donations.length !== 1 ? 's' : ''}
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">User</th>
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
                          <div className="font-medium">{donation.user?.name || 'Unknown'}</div>
                          <div className="text-xs text-gray-500">{donation.user?.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
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
              
              {donations.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No donations have been made yet.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;