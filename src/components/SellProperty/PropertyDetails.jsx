'use client';

/**
 * PropertyDetails Component
 * Captures specific structural data like Bedrooms, Bathrooms, Area, etc.
 * Includes validation to prevent negative values for physical dimensions.
 */
const PropertyDetails = ({ formData, updateField }) => {
  const handleNumericInput = (e) => {
    if (["e", "E", "+", "-"].includes(e.key)) {
      e.preventDefault();
    }
  };

  const inputStyle = `
    w-full px-4 py-3 rounded-xl 
    border border-slate-200 dark:border-slate-700 
    bg-white dark:bg-slate-900 
    text-slate-900 dark:text-slate-100 
    placeholder-slate-400 dark:placeholder-slate-500
    focus:ring-2 focus:ring-blue-500 focus:border-transparent 
    outline-none transition-all duration-200 shadow-sm
  `;

  const labelStyle = "block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1";

  return (
    <div className="p-6 md:p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors duration-300">
      
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
          Property Specifications
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Specify the structural details and dimensions of your property.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <div>
          <label className={labelStyle}>Bedrooms</label>
          <input 
            type="number" 
            min="0"
            value={formData.bedrooms}
            onKeyDown={handleNumericInput}
            onChange={(e) => updateField("bedrooms", e.target.value)}
            placeholder="e.g. 3" 
            className={inputStyle}
          />
        </div>

        <div>
          <label className={labelStyle}>Bathrooms</label>
          <input 
            type="number" 
            min="0"
            value={formData.bathrooms}
            onKeyDown={handleNumericInput}
            onChange={(e) => updateField("bathrooms", e.target.value)}
            placeholder="e.g. 2" 
            className={inputStyle}
          />
        </div>

        <div>
          <label className={labelStyle}>Total Area (sqft)</label>
          <input 
            type="number" 
            min="0"
            value={formData.area}
            onKeyDown={handleNumericInput}
            onChange={(e) => updateField("area", e.target.value)}
            placeholder="e.g. 2500" 
            className={inputStyle}
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;