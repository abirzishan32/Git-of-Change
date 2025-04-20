import React from 'react';
import { UserContext } from '../../context/userContext';
import { useContext } from 'react';
import Navbar from './Navbar';

const DashboardLayout = ({ children, activeMenu }) => {
    const { user } = useContext(UserContext);
    return (
        <div className='bg-white min-h-screen'>
            <Navbar activeMenu={activeMenu} />

            {user && (
                <div className="flex">
                    <div className="grow px-6 md:px-8 lg:px-10 max-w-[1400px] mx-auto">{children}</div>
                </div>
            )}
        </div>
    );
};

export default DashboardLayout;