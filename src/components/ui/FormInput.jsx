import React from 'react';

const FormInput = React.forwardRef(({ type = 'text', name, placeholder, icon: Icon, ...props }, ref) => {
    return (
        <div className="relative">
            {Icon && <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><Icon/></span>}
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                ref={ref}
                {...props}
                className={`w-full py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-prym-green focus:border-prym-green transition-shadow ${Icon ? 'pl-10' : 'px-4'}`}
            />
        </div>
    );
});

export default FormInput;