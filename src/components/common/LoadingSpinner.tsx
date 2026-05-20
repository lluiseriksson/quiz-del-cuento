import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
const LoadingSpinner = () => {
    return (_jsx("div", { className: "flex justify-center items-center", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-500" }) }));
};
export default LoadingSpinner;
