import "react-toastify/dist/ReactToastify.css";

// Custom Toast Components
const SuccessToast = ({ message }: { message: string }) => (
  <div style={{ color: "#155724", background: "#d4edda", padding: "10px", borderRadius: "5px" }}>
    ✅ {message}
  </div>
);

const ErrorToast = ({ message }: { message: string }) => (
  <div style={{ color: "#721c24", background: "#f8d7da", padding: "10px", borderRadius: "5px" }}>
    ❌ {message}
  </div>
);

export {SuccessToast, ErrorToast};