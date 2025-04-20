import React from 'react';

const AuthLayout = ({ children }) => {
    return (
        <div className="flex h-screen w-screen bg-gray-50">
            <div className="w-screen h-screen md:w-[60vw] px-8 md:px-12 pt-8 pb-12 bg-white shadow-md text-gray-800">
                <h2 className="text-xl font-semibold text-green-800 tracking-wide"> 
                    <span className="text-green-600">Gift</span> of <span className="text-green-600">Change</span> 
                </h2>
                <div className="h-full">
                    {children}
                </div>
            </div>

            <div className="hidden md:flex w-[40vw] h-screen items-center justify-center bg-gradient-to-br from-green-50 to-green-100 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: "url('/hand-heart-pattern.png')",
                    backgroundSize: "200px",
                    backgroundRepeat: "repeat",
                }}></div>
                <div className="relative z-10 p-8 text-center max-w-md">
                    <h3 className="text-2xl font-bold text-green-800 mb-4">Make an Impact Today</h3>
                    <p className="text-gray-700">Your generosity creates ripples of positive change in the world. Join our community of givers and see the difference you can make.</p>
                    <div className="mt-8 space-y-3">
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">1</div>
                            <p className="ml-4 text-sm text-gray-700 text-left">Create an account</p>
                        </div>
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">2</div>
                            <p className="ml-4 text-sm text-gray-700 text-left">Choose a cause you care about</p>
                        </div>
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">3</div>
                            <p className="ml-4 text-sm text-gray-700 text-left">Make a donation and track your impact</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthLayout;