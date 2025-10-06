'use client'

const Loading = ({ fullScreen = true, size = "default", text = "Loading..." }) => {
    const sizeClasses = {
        sm: "w-4 h-4 border-2",
        default: "w-8 h-8 border-3",
        lg: "w-12 h-12 border-4"
    }

    const LoadingSpinner = () => (
        <div className="flex flex-col items-center gap-4">
            <div className={`${sizeClasses[size]} rounded-full border-gray-200 border-t-green-500 animate-spin`}></div>
            {text && (
                <p className="text-slate-600 font-medium animate-pulse">{text}</p>
            )}
        </div>
    )

    if (fullScreen) {
        return (
            <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-white'>
                <div className="text-center">
                    <LoadingSpinner />
                    <div className="mt-8 flex justify-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                </div>
            </div>
        )
    }

    return <LoadingSpinner />
}

export default Loading