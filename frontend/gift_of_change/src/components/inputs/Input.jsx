import React from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useState } from 'react';

const Input = ({ value, onChange, label, placeholder, type, required }) => {

    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => {
        setShowPassword(!showPassword);
    }

    return (
        <div className="mb-4">
            <label className="text-[13px] text-gray-300 font-medium tracking-wide mb-1 block"> {label} </label>

            <div className="relative border-b border-gray-700 focus-within:border-purple-500 transition-all duration-300 py-2 group">
                <input
                    type={
                        type == "password" ? (showPassword ? "text" : "password") : type
                    }
                    placeholder={placeholder}
                    className="w-full bg-transparent outline-none text-white placeholder-gray-500 pr-8"
                    value={value}
                    onChange={(e) => onChange(e)}
                    required={required}
                />

                {type == "password" && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-purple-500 transition-colors">
                    {showPassword ? (
                        <FaEyeSlash onClick={togglePassword} />
                    ) : (
                        <FaEye onClick={togglePassword} />
                    )}
                    </div>
                )}

            </div>

        </div>
    )
}

export default Input;