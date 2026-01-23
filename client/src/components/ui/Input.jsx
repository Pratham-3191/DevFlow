export default function Input({
  label,
  icon,
  disabled,
  ...props
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div
        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all
          ${
            disabled
              ? "bg-gray-100 border-gray-200 cursor-not-allowed"
              : "bg-white border-gray-300 focus-within:ring-2 focus-within:ring-blue-500"
          }
        `}
      >
        {icon && (
          <span
            className={`${
              disabled ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {icon}
          </span>
        )}

        <input
          {...props}
          disabled={disabled}
          className={`w-full bg-transparent outline-none
            ${
              disabled
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-900"
            }
          `}
        />
      </div>
    </div>
  );
}
