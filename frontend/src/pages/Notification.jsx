import { useNavigate } from "react-router";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import Navbar from "../components/Navbar.jsx";

const Notification = () => {
  const { pendingRides, getPendingRide, bookRide, isBooking } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    getPendingRide();
  }, [getPendingRide]);

  const handleBookRide = async (ride) => {
    const result = await bookRide(ride._id);
    if (result.success) {
      navigate("/ride-confirmed");
    }
  };

  const handleViewPlace = (ride) => {
    navigate(`/ride/${ride._id}`, { state: ride });
  };

  if (!pendingRides || pendingRides.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="flex flex-col justify-center items-center h-[70vh] text-center px-4">
          <div className="bg-gray-800 p-6 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-gray-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white">No rides found</h3>
          <p className="text-gray-400 mt-2">There are no neighbors heading out right now. <br/> Check back in a few minutes!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white">Available Rides</h1>
            <p className="text-gray-400 text-sm mt-1">See who's "On the Way" from your building</p>
          </div>
          <div className="badge badge-primary badge-md">{pendingRides.length} Live</div>
        </div>

        <div className="grid gap-6">
          {pendingRides.map((ride) => (
            <div key={ride._id} className="card bg-gray-800 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 shadow-xl">
              <div className="card-body p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  {/* USER & DESTINATION INFO */}
                  <div className="flex items-start gap-4">
                    <div className="avatar placeholder">
                      <div className="bg-blue-600 text-white rounded-full w-12 h-12">
                        <span className="text-xl font-bold">{ride.user.fullName.charAt(0)}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h2 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                        {ride.user.fullName}
                      </h2>
                      <div className="flex items-center gap-1.5 text-gray-400 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-blue-500">
                          <path fillRule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 3.58-3.14c.6-.739 1.15-1.56 1.587-2.445L17.612 16.5a4.5 4.5 0 1 0-7.224 0l.004.007a16.747 16.747 0 0 0 1.588 2.445 16.951 16.951 0 0 0 3.56 3.4Z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm line-clamp-1">{ride.place}</span>
                      </div>
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleViewPlace(ride)}
                      className="btn btn-ghost bg-gray-700/50 hover:bg-gray-700 btn-md text-sm font-bold"
                    >
                      Map View
                    </button>

                    <button
                      onClick={() => handleBookRide(ride)}
                      className={`btn btn-primary btn-md px-6 font-bold ${isBooking ? 'loading' : ''}`}
                      disabled={isBooking}
                    >
                      {isBooking ? "Joining..." : "Join Ride"}
                    </button>
                  </div>
                </div>

                {/* DIVIDER */}
                <div className="divider before:bg-gray-700 after:bg-gray-700 my-2"></div>

                {/* DETAILS BADGES */}
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 rounded-lg border border-gray-700 text-xs font-semibold uppercase tracking-wider">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-emerald-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.129-1.125V14.25M11.25 7.5h6.75a2.25 2.25 0 0 1 2.25 2.25v6.75M7.125 15.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75m-15 6h15m-16.5-4.5h1.5m.75-3.75a3.375 3.375 0 0 0-3.375 3.375M6.75 20.25v-2.25m0-13.5v2.25m0 0a3.375 3.375 0 0 0 0 6.75m0-6.75a3.375 3.375 0 0 1 0 6.75m0 0v2.25m0-13.5H3.75m3 0h3" />
                    </svg>
                    {ride.mode}
                  </div>
                  
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 rounded-lg border border-gray-700 text-xs font-semibold uppercase tracking-wider">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-purple-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                    {ride.passengers} Seats
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 rounded-lg border border-gray-700 text-xs font-semibold uppercase tracking-wider text-orange-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    Leaves in {ride.leaveInMinutes} min
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notification;