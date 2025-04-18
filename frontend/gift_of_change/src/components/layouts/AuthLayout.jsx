import React from 'react';

const AuthLayout = ({ children }) => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-md">
                {children}
            </div>
        </div>
    )
}

export default AuthLayout;