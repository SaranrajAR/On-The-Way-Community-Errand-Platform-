import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

const Profile = () => {
  const { authUser, updateProfile } = useAuthStore();

  const [preview, setPreview] = useState(authUser?.profilePic);
  const [isUploading, setIsUploading] = useState(false);

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image size must be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result;
      setPreview(base64Image);

      try {
        setIsUploading(true);
        await updateProfile({ profilePic: base64Image });
        toast.success("Profile updated!");
      } catch (error) {
        toast.error("Upload failed");
      } finally {
        setIsUploading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-gray-800 rounded-3xl p-8 border border-gray-700 shadow-2xl">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black tracking-tight">Your Profile</h1>
            <p className="text-gray-400 mt-1">Manage your identity in the community</p>
          </div>

          {/* AVATAR SECTION */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative group">
              <label
                htmlFor="fileUpload"
                className={`relative block cursor-pointer group ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
              >
                <div className="avatar">
                  <div className="w-32 h-32 rounded-full ring ring-blue-500 ring-offset-base-100 ring-offset-2 overflow-hidden bg-gray-700">
                    <img
                      src={preview || "/default-avatar.png"}
                      alt="Profile"
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                  </svg>
                </div>
              </label>

              <input
                type="file"
                accept="image/*"
                hidden
                id="fileUpload"
                onChange={handleChange}
              />
            </div>

            <p className="mt-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
              {isUploading ? (
                <span className="flex items-center gap-2">
                  <span className="loading loading-spinner loading-xs"></span> Uploading...
                </span>
              ) : (
                "Click to change photo"
              )}
            </p>
          </div>

          {/* USER INFO FORM */}
          <div className="space-y-6">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-gray-400 font-bold uppercase text-xs">Full Name</span>
              </label>
              <div className="input input-bordered bg-gray-900 border-gray-700 flex items-center gap-3 h-12">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-500">
                  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                </svg>
                <input type="text" value={authUser?.fullName} readOnly className="grow bg-transparent" />
              </div>
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-gray-400 font-bold uppercase text-xs">Email Address</span>
              </label>
              <div className="input input-bordered bg-gray-900 border-gray-700 flex items-center gap-3 h-12">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-500">
                  <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                  <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                </svg>
                <input type="text" value={authUser?.email} readOnly className="grow bg-transparent" />
              </div>
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-gray-400 font-bold uppercase text-xs">Mobile Number</span>
              </label>
              <div className="input input-bordered bg-gray-900 border-gray-700 flex items-center gap-3 h-12">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-500">
                  <path fillRule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l.54 2.16c.19.759-.149 1.547-.813 1.946L6.116 7.737a13.931 13.931 0 0 0 10.147 10.147l.711-1.304a1.875 1.875 0 0 1 1.946-.813l2.16.54c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" clipRule="evenodd" />
                </svg>
                <input type="text" value={authUser?.mobile} readOnly className="grow bg-transparent" />
              </div>
            </div>
          </div>

          {/* EXTRA INFO: ACCOUNT STATUS */}
          <div className="mt-10 pt-6 border-t border-gray-700">
            <h2 className="text-lg font-bold mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-400">Member Since</span>
                <span className="font-medium">{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-400">Account Status</span>
                <span className="text-green-500 font-bold uppercase text-xs tracking-widest">Active</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;