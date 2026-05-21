export default function EmptyState() {
  return (
    <div className="text-center py-14 px-5" role="status">
      <div className="text-[2.6rem] opacity-25 mb-2.5">🎞</div>
      <div className="text-[0.82rem] text-muted dark:text-dark-muted">
        No results match your filters.<br />
        Try clearing genres or searching differently.
      </div>
    </div>
  );
}
