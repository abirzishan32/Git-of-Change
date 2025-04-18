import React from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useState } from 'react';

const Input = ({ value, onChange, label, placeholder, type, required }) => {

    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => {
        setShowPassword(!showPassword);
    }

    return (
        <div>
            <label className="text-[13px] text-slate-800"> {label} </label>

            <div className="input-box">
                <input
                    type={
                        type == "password" ? (showPassword ? "text" : "password") : type
                    }
                    placeholder={placeholder}
                    className="w-full bg-transparent outline-none"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    required={required}
                />

                {type == "password" && (
                    <>
                    {showPassword ? (
                        <FaEyeSlash onClick={togglePassword} />
                    ) : (
                        <FaEye onClick={togglePassword} />
                    )}
                    </>
                )}

            </div>

        </div>
    )
}

export default Input;