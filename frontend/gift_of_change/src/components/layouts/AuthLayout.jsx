import React from 'react';

const AuthLayout = ({ children }) => {
    return (
        <div className="flex h-screen w-screen bg-gray-900">
            <div className="w-screen h-screen md:w-[60vw] px-8 md:px-12 pt-8 pb-12 bg-black bg-opacity-90 text-white">
                <h2 className="text-xl font-semibold text-white tracking-wide"> 
                    <span className="text-purple-500">Gift</span> of <span className="text-purple-500">Change</span> 
                </h2>
                <div className="h-full">
                    {children}
                </div>
            </div>

            <div className="hidden md:flex w-[40vw] h-screen items-center justify-center bg-gradient-to-br from-gray-800 to-black relative overflow-hidden">
                <div className="absolute inset-0 opacity-60 bg-blend-overlay" style={{
                    backgroundImage: "url('/images/login-page.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "contrast(1.2) brightness(0.7)"
                }}></div>
                <div className="relative z-10 p-8 text-center">
                    <h3 className="text-2xl font-bold text-white mb-4">Make an Impact</h3>
                    <p className="text-gray-300 max-w-md">Join our platform and be part of the change you want to see in the world</p>
                </div>
            </div>
        </div>
    )
}

export default AuthLayout;