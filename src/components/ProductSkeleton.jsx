export default function ProductSkeleton({ count = 4 }) {
  return (
    <div className="grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="product-card skeleton-card" aria-hidden="true">
          <div className="sk sk-img" />
          <div className="sk-body">
            <div className="sk sk-line" />
            <div className="sk sk-line short" />
            <div className="sk sk-btn" />
          </div>
        </div>
      ))}
    </div>
  );
}
