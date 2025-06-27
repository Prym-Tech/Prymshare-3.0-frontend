const MobilePreview = () => {
    // This will eventually fetch and display the live page data.
    // For now, it's a styled placeholder.

    return (
        <div className="w-full max-w-xs h-[700px] bg-white rounded-[40px] shadow-2xl p-4 border-8 border-gray-800 overflow-hidden">
            <div className="w-full h-full bg-gray-100 rounded-[32px] overflow-y-auto">
                {/* Header */}
                <div className="bg-prym-dark-green p-6 text-center text-white">
                    <div className="w-20 h-20 rounded-full bg-prym-green mx-auto mb-2"></div>
                    <h1 className="font-bold">@yourbrand</h1>
                    <p className="text-sm">Your Title Here</p>
                </div>

                {/* Placeholder Content */}
                <div className="p-4 space-y-4">
                    <div className="w-full h-12 bg-gray-300 rounded-lg"></div>
                    <div className="w-full h-12 bg-gray-300 rounded-lg"></div>
                    <div className="w-full h-24 bg-gray-300 rounded-lg"></div>
                </div>
            </div>
        </div>
    );
};

export default MobilePreview;

