import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { useState, useEffect } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { divIcon } from "leaflet";
import {
  MapPin,
  Car,
  Navigation,
  Users,
  Clock,
  Phone,
  ShieldCheck,
  Loader2,
  XCircle,
  Bike
} from "lucide-react";
import Navbar from "../components/Navbar";
import { useAuthStore } from "../store/useAuthStore.js";

import "leaflet/dist/leaflet.css";

/* =======================
   Custom Icon Definition
   ======================= */
const createCustomIcon = (color = "#6366f1") => {
  const iconMarkup = renderToStaticMarkup(
    <div className="relative flex items-center justify-center">
      <div className="absolute w-8 h-8 bg-indigo-500/30 rounded-full animate-ping"></div>
      <MapPin size={32} color={color} fill={color} fillOpacity={0.2} strokeWidth={2.5} />
    </div>
  );

  return divIcon({
    html: iconMarkup,
    className: "custom-leaflet-icon",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

/* =======================
   Location Marker Component
   ======================= */
function LocationMarker({ setSelectedLocation, setPlace, setLoadingPlace, disabled, existingPosition }) {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    if (existingPosition) setPosition(existingPosition);
  }, [existingPosition]);

  useMapEvents({
    async click(e) {
      if (disabled) return;
      const { lat, lng } = e.latlng;
      setPosition(e.latlng);
      setSelectedLocation({ lat, lng });

      try {
        setLoadingPlace(true);
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
          { headers: { "User-Agent": "RideShareApp/1.0" } }
        );
        const data = await res.json();
        setPlace(data?.display_name || "Unknown location");
      } catch (error) {
        console.error("Reverse geocoding error:", error);
        setPlace("Location unavailable");
      } finally {
        setLoadingPlace(false);
      }
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={createCustomIcon()}>
      <Popup className="custom-popup">
        <div className="font-sans font-medium text-slate-900">Destination Selected</div>
      </Popup>
    </Marker>
  );
}

/* =======================
   Main Ride Share Page
   ======================= */
const RideSharePage = () => {
  const { createRide, assignedPassenger, getOptedRide, optedRide, cancelRide } = useAuthStore();

  const [checkingRide, setCheckingRide] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [place, setPlace] = useState("");
  const [loadingPlace, setLoadingPlace] = useState(false);

  // NEW: State for the submission process
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [mode, setMode] = useState("bike");
  const [passengers, setPassengers] = useState(1);
  const [leaveTime, setLeaveTime] = useState(10);

  useEffect(() => {
    const checkRide = async () => {
      await getOptedRide();
      setCheckingRide(false);
    };
    checkRide();
  }, [getOptedRide]);

  // ... existing state ...
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancel = async () => {
    if (!optedRide?._id) return; // Ensure the ride ID exists

    if (window.confirm("Are you sure you want to cancel this ride request?")) {
      try {
        setIsCancelling(true);
        await cancelRide(optedRide._id); // Calling your store function
        // The store should ideally update optedRide to null, triggering a re-render
      } catch (error) {
        console.error("Cancellation error:", error);
        alert("Failed to cancel the ride. Please try again.");
      } finally {
        setIsCancelling(false);
      }
    }
  };
  const handleConfirm = async () => {
    if (!selectedLocation) return alert("Please select a location on the map.");
    if (!place || loadingPlace) return alert("Location still loading...");

    const rideDetails = {
      location: selectedLocation,
      mode,
      passengers,
      leaveInMinutes: leaveTime,
      place,
    };

    try {
      setIsSubmitting(true); // Disable button and show loader
      await createRide(rideDetails);
      setSelectedLocation(null);
      setPlace("");
    } catch (error) {
      console.error("Confirmation error:", error);
      alert("Failed to create ride. Please try again.");
    } finally {
      setIsSubmitting(false); // Re-enable button
    }
  };

  if (checkingRide) {
    return (
      <div className="flex flex-col gap-4 justify-center items-center h-screen bg-[#0f172a] text-white">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
        <p className="text-gray-400 animate-pulse font-medium">Syncing your journey...</p>
      </div>
    );
  }

  const hasActiveRide = !!optedRide;

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200">
      <Navbar />

      <main className="max-w-[1600px] mx-auto p-4 lg:p-8 flex flex-col lg:flex-row gap-8">

        {/* MAP SECTION */}
        <div className="relative w-full lg:w-[65%] h-[50vh] lg:h-[80vh] rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50 group">
          <MapContainer
            center={optedRide?.location || [13.0827, 80.2707]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
            dragging={!hasActiveRide}
            scrollWheelZoom={!hasActiveRide}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker
              setSelectedLocation={setSelectedLocation}
              setPlace={setPlace}
              setLoadingPlace={setLoadingPlace}
              disabled={hasActiveRide}
              existingPosition={hasActiveRide ? { lat: optedRide.lat, lng: optedRide.lng } : null}
            />
          </MapContainer>
        </div>

        {/* INTERACTION PANEL */}
        <div className="w-full lg:w-96 flex flex-col gap-6">
          <div className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-700 shadow-xl flex-grow overflow-y-auto">

            {/* CASE 1: MATCH FOUND */}
            {assignedPassenger ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center">
                  <div className="inline-flex p-3 bg-emerald-500/20 rounded-full mb-4">
                    <ShieldCheck className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h1 className="text-2xl font-bold text-white">Ride Matched!</h1>
                  <p className="text-slate-400 text-sm">Your companion is ready to go.</p>
                </div>

                <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-700 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center font-bold text-lg text-white">
                      {assignedPassenger.fullName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Passenger</p>
                      <p className="font-semibold text-white">{assignedPassenger.fullName}</p>
                    </div>
                  </div>
                  <div className="h-px bg-slate-700"></div>
                  <div className="space-y-2 text-sm">
                    <p className="flex justify-between"><span className="text-slate-500">Email</span> <span className="text-slate-300">{assignedPassenger.email}</span></p>
                    <p className="flex justify-between"><span className="text-slate-500">Mobile</span> <span className="text-slate-300 font-mono">{assignedPassenger.mobile}</span></p>
                  </div>
                </div>

                <a href={`tel:${assignedPassenger.mobile}`} className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.98]">
                  <Phone className="w-5 h-5" /> Call Passenger
                </a>
              </div>
            )

              /* CASE 2: SEARCHING */
              : hasActiveRide ? (
                <div className="text-center py-12 space-y-6 animate-in fade-in duration-700">
                  <div className="relative mx-auto w-24 h-24">
                    <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Navigation className="w-8 h-8 text-indigo-400" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">Broadcasting Ride...</h1>
                    <p className="text-slate-400 mt-2 text-sm leading-relaxed">We're finding passengers heading toward your destination.</p>
                  </div>
                  <div className="bg-indigo-500/5 p-4 rounded-xl border border-indigo-500/20">
                    <p className="text-xs text-indigo-400 font-bold uppercase mb-1 flex items-center gap-2">
                      <MapPin className="w-3 h-3" /> To
                    </p>
                    <p className="text-sm text-slate-300 italic line-clamp-2">{optedRide.place}</p>
                  </div>
                  <button
                    onClick={handleCancel}
                    disabled={isCancelling}
                    className="flex items-center justify-center gap-2 mx-auto text-xs text-rose-400 font-bold hover:text-rose-300 transition uppercase tracking-widest pt-4 disabled:opacity-50"
                  >
                    {isCancelling ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                    {isCancelling ? "Cancelling..." : "Cancel Request"}
                  </button>
                </div>
              )

                /* CASE 3: INITIAL STATE */
                : !selectedLocation ? (
                  <div className="h-full flex flex-col justify-center items-center text-center py-12 px-4 space-y-6">
                    <div className="w-20 h-20 bg-slate-700/50 rounded-3xl flex items-center justify-center border border-slate-600">
                      <MapPin className="w-10 h-10 text-indigo-400 animate-bounce" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-white mb-2">Set Destination</h1>
                      <p className="text-slate-400 text-sm leading-relaxed">Select a point on the map where you want to drop or pick up passengers.</p>
                    </div>
                  </div>
                )

                  /* CASE 4: FORM STATE */
                  : (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                      <h1 className="text-xl font-bold text-white flex items-center gap-2">
                        <Car className="w-6 h-6 text-indigo-400" /> Ride Details
                      </h1>

                      <div className="space-y-4">
                        <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-700">
                          <label className="text-[10px] text-indigo-400 uppercase font-black tracking-widest mb-1 block">Destination</label>
                          {loadingPlace ? (
                            <div className="flex items-center gap-2 text-yellow-500">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span className="text-sm">Locating...</span>
                            </div>
                          ) : (
                            <p className="text-sm text-slate-200 line-clamp-2 leading-snug font-medium">📍 {place}</p>
                          )}
                        </div>

                        <div className="grid gap-4">
                          <div className="relative">
                            <label className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-2 italic">
                              <Bike className="w-4 h-4" /> Vehicle Category
                            </label>
                            <select
                              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500 transition appearance-none"
                              value={mode}
                              onChange={(e) => {
                                setMode(e.target.value);
                                if (e.target.value === "bike") setPassengers(1);
                              }}
                            >
                              <option value="bike">Motorcycle</option>
                              <option value="car">Four Wheeler</option>
                            </select>
                          </div>

                          {mode === "car" && (
                            <div className="animate-in fade-in">
                              <label className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-2 italic">
                                <Users className="w-4 h-4" /> Available Seats
                              </label>
                              <select
                                className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                value={passengers}
                                onChange={(e) => setPassengers(Number(e.target.value))}
                              >
                                {[1, 2, 3, 4].map((num) => <option key={num} value={num}>{num} {num === 1 ? 'Seat' : 'Seats'}</option>)}
                              </select>
                            </div>
                          )}

                          <div>
                            <label className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-2 italic">
                              <Clock className="w-4 h-4" /> Departure In
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                min="1"
                                className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                value={leaveTime}
                                onChange={(e) => setLeaveTime(Number(e.target.value))}
                              />
                              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">Mins</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={handleConfirm}
                        disabled={loadingPlace || isSubmitting}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:cursor-not-allowed disabled:text-slate-500 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-900/30 active:scale-[0.98] mt-2 flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Creating Ride...</span>
                          </>
                        ) : (
                          "Confirm & Request Ride"
                        )}
                      </button>
                    </div>
                  )}
          </div>

          <div className="bg-slate-800/30 p-4 rounded-2xl border border-slate-700 flex items-center justify-center gap-3 grayscale opacity-60">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Secure Ride-Share Network</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RideSharePage;