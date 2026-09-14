/** Illustrated cover for a cause: its colour gradient with the cause icon on top. */
export function CauseArt({ cause, className = '', iconSize = 'md' }) {
  const Icon = cause.icon;
  const tile = iconSize === 'lg' ? 'size-24 rounded-3xl' : 'size-16 rounded-2xl';
  const glyph = iconSize === 'lg' ? 'size-12' : 'size-8';

  return (
    <div
      className={`relative overflow-hidden bg-linear-to-br ${cause.theme.gradient} ${className}`}
      aria-hidden="true"
    >
      <div className="absolute -top-10 -right-10 size-44 rounded-full bg-white/15" />
      <div className="absolute -bottom-16 -left-8 size-52 rounded-full bg-white/10" />
      <div className="absolute top-6 left-1/4 size-3 rounded-full bg-white/40" />
      <div className="absolute right-1/4 bottom-8 size-2 rounded-full bg-white/50" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={`flex items-center justify-center bg-white/95 shadow-lg ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-110 ${tile} ${cause.theme.accent}`}
        >
          <Icon className={glyph} strokeWidth={1.75} />
        </span>
      </div>
    </div>
  );
}

/** Small rounded icon for a cause, used in lists and tables. */
export function CauseIcon({ cause, className = '' }) {
  const Icon = cause.icon;
  return (
    <span
      className={`flex size-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br text-white ${cause.theme.gradient} ${className}`}
      aria-hidden="true"
    >
      <Icon className="size-4" />
    </span>
  );
}
