import { useLocation, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { divIcon } from "leaflet";
import { 
  MapPin, 
  ChevronLeft, 
  Car, 
  Users, 
  Clock, 
  Navigation, 
  ShieldCheck 
} from "lucide-react";
import Navbar from "../components/Navbar";

// Leaflet CSS
import "leaflet/dist/leaflet.css";

/* =======================
   Custom Icon Definition
   ======================= */
const createCustomIcon = (color = "#6366f1") => {
  const iconMarkup = renderToStaticMarkup(
    <div className="relative flex items-center justify-center">
      {/* Dynamic Pulse Effect */}
      <div className="absolute w-10 h-10 bg-indigo-500/20 rounded-full animate-ping"></div>
      <div className="absolute w-6 h-6 bg-indigo-500/40 rounded-full animate-pulse"></div>
      
      {/* The Pin Icon */}
      <div className="relative drop-shadow-xl">
        <MapPin size={34} color={color} fill={color} fillOpacity={0.2} strokeWidth={2.5} />
      </div>
    </div>
  );

  return divIcon({
    html: iconMarkup,
    className: "custom-marker-icon",
    iconSize: [40, 40],
    iconAnchor: [20, 35],
    popupAnchor: [0, -35],
  });
};

const RideLocationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const ride = location.state;

  if (!ride) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center text-white">
        <div className="bg-slate-800 p-8 rounded-[2rem] border border-slate-700 text-center shadow-2xl">
          <Navigation className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <p className="text-xl font-bold mb-4">Ride details not found</p>
          <button onClick={() => navigate("/notification")} className="bg-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-indigo-500 transition">
            Back to Notifications
          </button>
        </div>
      </div>
    );
  }

  const lat = Number(ride.lat);
  const lng = Number(ride.lng);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200">
      <Navbar />

      <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-6">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className="p-3 bg-slate-800 border border-slate-700 rounded-2xl hover:bg-slate-700 transition shadow-lg group"
            >
              <ChevronLeft className="w-6 h-6 group-active:scale-90 transition" />
            </button>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white">Ride Location</h1>
              <p className="text-slate-500 text-sm font-medium">Coordinate: {lat.toFixed(4)}, {lng.toFixed(4)}</p>
            </div>
          </div>
          <div className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold px-4 py-2 rounded-full uppercase tracking-wider text-xs flex items-center gap-2 self-start">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
            {ride.status || "Live"}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* INFO PANEL */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 shadow-2xl rounded-[2.5rem] overflow-hidden">
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-indigo-600 text-white rounded-2xl w-16 h-16 flex items-center justify-center shadow-lg shadow-indigo-900/40">
                    <span className="text-2xl font-black">{ride.user.fullName.charAt(0)}</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white leading-tight">{ride.user.fullName}</h2>
                    <p className="text-slate-400 text-sm flex items-center gap-1 uppercase font-bold tracking-tighter">
                      <ShieldCheck className="w-3 h-3 text-emerald-500" /> Verified Member
                    </p>
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent my-6"></div>

                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                      <Car className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Vehicle Mode</p>
                      <p className="font-bold text-slate-200 capitalize">{ride.mode}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                      <Users className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Availability</p>
                      <p className="font-bold text-slate-200">{ride.passengers} Seat(s) Available</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-500/10 rounded-2xl border border-orange-500/20">
                      <Clock className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Scheduled Departure</p>
                      <p className="font-bold text-slate-200">In {ride.leaveInMinutes} minutes</p>
                    </div>
                  </div>
                </div>

                <div className="mt-10">
                    <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-indigo-900/40 transition-all active:scale-[0.98]">
                      Join This Ride
                    </button>
                </div>
              </div>
            </div>
          </div>

          {/* MAP CONTAINER */}
          <div className="lg:col-span-2 h-[500px] lg:h-[75vh] rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-700/50 relative">
            <MapContainer
              key={ride._id}
              center={[lat, lng]}
              zoom={15}
              style={{ height: "100%", width: "100%" }}
              className="z-0"
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Marker position={[lat, lng]} icon={createCustomIcon()}>
                <Popup closeButton={false} className="dark-popup">
                  <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-700 shadow-2xl min-w-[150px]">
                    <p className="text-xs font-black uppercase text-indigo-400 mb-1">Pick-up Location</p>
                    <p className="text-[11px] leading-relaxed text-slate-300 italic">Target: {ride.place}</p>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
            
            {/* FLOATING ADDRESS BAR */}
            <div className="absolute bottom-8 left-8 right-8 z-[400]">
                <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-5 rounded-3xl shadow-2xl flex items-center gap-4 max-w-2xl mx-auto">
                    <div className="p-3 bg-indigo-600 rounded-2xl shrink-0 shadow-lg shadow-indigo-900/20">
                        <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-0.5">Destination Address</p>
                      <p className="text-sm font-bold text-white truncate">
                        {ride.place}
                      </p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Overrides for Dark Mode Map Elements */}
      <style>{`
        .leaflet-popup-content-wrapper {
          background: transparent !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .leaflet-popup-tip {
          background: #0f172a !important;
          border: 1px solid #334155;
        }
        .custom-marker-icon {
          background: none !important;
          border: none !important;
        }
        .leaflet-container {
          background-color: #0f172a !important;
        }
      `}</style>
    </div>
  );
};

export default RideLocationPage;