import { PRESET_AMOUNTS_CENTS } from '../../lib/donation-amount';
import { TextField } from '../ui/TextField';

export function AmountPicker({
  selectedPreset,
  customAmount,
  error,
  onPresetChange,
  onCustomChange,
}) {
  return (
    <fieldset>
      <legend className="text-sm font-medium text-slate-800">Choose an amount</legend>
      <div className="mt-2 grid grid-cols-4 gap-2">
        {PRESET_AMOUNTS_CENTS.map((cents) => {
          const isSelected = selectedPreset === cents;
          return (
            <button
              key={cents}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onPresetChange(cents)}
              className={`rounded-lg border py-2.5 text-sm font-semibold transition-colors ${
                isSelected
                  ? 'border-brand-700 bg-brand-700 text-white'
                  : 'border-slate-300 bg-white text-slate-800 hover:border-brand-600 hover:bg-brand-50'
              }`}
            >
              ${cents / 100}
            </button>
          );
        })}
      </div>

      <TextField
        className="mt-4"
        label="Or enter another amount"
        prefix="$"
        inputMode="decimal"
        placeholder="40"
        value={customAmount}
        onChange={(event) => onCustomChange(event.target.value)}
        error={error}
      />
    </fieldset>
  );
}
