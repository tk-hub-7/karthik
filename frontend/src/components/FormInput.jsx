const FormInput = ({ label, error, ...props }) => {
    return (
        <div className="mb-4">
            {label && <label className="label">{label}</label>}
            <input className={`input ${error ? 'border-red-500' : ''}`} {...props} />
            {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
        </div>
    );
};

export default FormInput;
