// src/components/OrderStatusTracker.jsx

const orderSteps = [
    { key: 'placed', label: 'Order Placed' },
    { key: 'processing', label: 'Processing' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'delivered', label: 'Delivered' },
];

export default function OrderStatusTracker({ currentStatus }) {

    const normalizedStatus = currentStatus?.toLowerCase().replace(/\s/g, '') || '';
    const currentStatusIndex = orderSteps.findIndex(s => s.key === normalizedStatus);

    // Correct: fills to center of dot
    const totalSteps = orderSteps.length - 1;
    const completionPercentage =
        currentStatusIndex < 0 ? 0 : (currentStatusIndex / totalSteps) * 100;

    return (
        <div className="w-full pt-6">
            <div className="relative flex justify-between items-center mb-6">

                {/* Background Line */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 rounded-full"></div>

                {/* Filled Line (on top; now aligns correctly) */}
                <div
                    className="absolute top-1/2 left-0 h-1 bg-green-500 rounded-full -translate-y-1/2 transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                />

                {/* Status Dots + Labels */}
                {orderSteps.map((step, index) => {
                    const isCompleted = index <= currentStatusIndex;
                    const isActive = index === currentStatusIndex;

                    return (
                        <div key={step.key} className="flex flex-col items-center z-10 w-1/4">

                            {/* Dot */}
                            <div
                                className={`
                                    w-5 h-5 rounded-full border-2 
                                    transition-all duration-300
                                    ${isCompleted ? "border-green-600 bg-white" : "border-gray-300 bg-gray-200"}
                                    ${isActive ? "ring-4 ring-green-200/60 shadow" : ""}
                                `}
                            />

                            {/* Label (increased spacing ↓↓↓) */}
                            <span
                                className={`
                                    mt-4 text-sm text-center font-medium transition-colors duration-300
                                    ${isCompleted ? "text-green-700" : "text-slate-500"}
                                `}
                            >
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
