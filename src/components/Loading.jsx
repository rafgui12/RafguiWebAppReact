import React from 'react';

const Loading = () => {
    return (
        <div className="relative min-h-screen bg-black text-white flex justify-center items-center">
            <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <h1 className="text-xl font-light tracking-wider">Loading...</h1>
            </div>
        </div>
    );
};

export default Loading;
