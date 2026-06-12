export default function LoadingOverlay() {
  return (
    <div className="loading-overlay" id="loading-overlay">
      <div className="loading-box">
        <div className="spinner" />
        <span id="loading-msg">Loading...</span>
      </div>
    </div>
  );
}
