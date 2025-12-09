

const DataCard = ({ title, value, icon: Icon, trend, color = 'primary', onClick }) => {
    const colorClasses = {
        primary: 'bg-primary-600 border-primary-500',
        success: 'bg-green-600 border-green-500',
        warning: 'bg-yellow-600 border-yellow-500',
        danger: 'bg-red-600 border-red-500',
        info: 'bg-blue-600 border-blue-500',
    };

    return (
        <div
            className={`card card-hover p-6 ${onClick ? 'cursor-pointer' : ''}`}
            onClick={onClick}
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 ${colorClasses[color]} rounded-lg shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                {trend && (
                    <span className={`text-sm font-medium ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {trend > 0 ? '+' : ''}{trend}%
                    </span>
                )}
            </div>
            <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
            <p className="text-3xl font-bold text-white">{value}</p>
        </div>
    );
};

export default DataCard;
