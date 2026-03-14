import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.js";
import Navbar from "../components/Navbar.jsx";

const RideConfirmedPage = () => {
  const navigate = useNavigate();
  const { bookedDriver } = useAuthStore();

  if (!bookedDriver) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white px-4">
        <div className="bg-gray-800 p-8 rounded-3xl border border-gray-700 text-center shadow-2xl">
          <div className="mb-4 text-orange-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <p className="text-xl font-bold mb-6">Ride details not found</p>
          <button onClick={() => navigate("/")} className="btn btn-primary w-full">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      <div className="flex flex-col justify-center items-center py-12 px-6">
        <div className="card bg-gray-800 border border-gray-700 shadow-2xl w-full max-w-md overflow-hidden">
          
          {/* SUCCESS HEADER */}
          <div className="bg-emerald-500/10 py-10 flex flex-col items-center border-b border-gray-700">
            <div className="bg-emerald-500 p-3 rounded-full mb-4 shadow-lg shadow-emerald-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-white">
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-emerald-400">
              Ride Confirmed!
            </h1>
            <p className="text-emerald-500/70 text-sm font-medium mt-1">You're all set to go.</p>
          </div>

          <div className="card-body p-8">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">
              Driver Information
            </h2>

            {/* DRIVER CARD */}
            <div className="flex items-center gap-4 bg-gray-900/50 p-4 rounded-2xl border border-gray-700 mb-8">
              <div className="avatar placeholder">
                <div className="bg-blue-600 text-white rounded-xl w-14 h-14">
                  <span className="text-2xl font-bold">{bookedDriver.fullName.charAt(0)}</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold">{bookedDriver.fullName}</h3>
                <p className="text-blue-500 text-xs font-bold flex items-center gap-1">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  VERIFIED NEIGHBOR
                </p>
              </div>
            </div>

            {/* DETAILS LIST */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between group">
                <span className="text-gray-400 text-sm">Mobile</span>
                <span className="font-semibold">{bookedDriver.mobile}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Email</span>
                <span className="font-semibold text-sm">{bookedDriver.email}</span>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="space-y-3">
              <a
                href={`tel:${bookedDriver.mobile}`}
                className="btn btn-primary btn-lg w-full font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l.54 2.16c.19.759-.149 1.547-.813 1.946L6.116 7.737a13.931 13.931 0 0 0 10.147 10.147l.711-1.304a1.875 1.875 0 0 1 1.946-.813l2.16.54c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" clipRule="evenodd" />
                </svg>
                Call Driver
              </a>

              <button
                className="btn btn-ghost w-full text-gray-400 hover:text-white"
                onClick={() => navigate("/")}
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* HELPER TEXT */}
        <p className="mt-8 text-gray-500 text-sm text-center max-w-xs leading-relaxed">
          Please meet your neighbor at the main gate or the agreed pickup point in the lobby.
        </p>
      </div>
    </div>
  );
};

export default RideConfirmedPage;