/**
 * Reusable Pulsing Table Row Skeleton for eliminating layout shifts
 * during async CRUD state updates.
 */
export default function TableSkeleton({ cols = 5, rows = 5 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rIdx) => (
        <tr key={rIdx} className="animate-pulse border-b border-slate-100 last:border-0">
          {Array.from({ length: cols }).map((_, cIdx) => (
            <td key={cIdx} className="px-6 py-4">
              <div 
                className="h-3.5 bg-slate-200 rounded"
                style={{ 
                  width: cIdx === 0 
                    ? '60%' 
                    : cIdx === cols - 1 
                      ? '40%' 
                      : '85%' 
                }}
              ></div>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
