"use client";

import { useState } from "react";
import { Edit, Save } from "lucide-react";

export default function ProfilePage() {
  const [edit, setEdit] = useState(false);
  const [profile, setProfile] = useState({
    name: "Khaled Mahmud",
    email: "khaled@email.com",
    phone: "+880 1234 567890",
    bio: "Real estate investor & tech enthusiast.",
    photo: "https://i.pravatar.cc/150?img=3",
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({
        ...profile,
        photo: URL.createObjectURL(file),
      });
    }
  };

  return (
    <div className="p-8">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-40 rounded-3xl relative"></div>

      <div className="bg-white dark:bg-gray-900 shadow-2xl rounded-3xl -mt-20 p-8 relative">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <img
              src={profile.photo}
              alt="profile"
              className="w-36 h-36 rounded-full border-4 border-white shadow-lg object-cover"
            />
            {edit && (
              <input
                type="file"
                onChange={handlePhotoChange}
                className="absolute bottom-0 left-0 opacity-0 w-full h-full cursor-pointer"
              />
            )}
          </div>

          <div className="flex-1 space-y-3">
            {edit ? (
              <>
                <input
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border"
                />
                <input
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border"
                />
                <input
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border"
                />
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border"
                />
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold">{profile.name}</h2>
                <p className="text-gray-500">{profile.email}</p>
                <p>{profile.phone}</p>
                <p className="text-gray-600">{profile.bio}</p>
              </>
            )}
          </div>

          <button
            onClick={() => setEdit(!edit)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition"
          >
            {edit ? <Save size={18} /> : <Edit size={18} />}
            {edit ? "Save" : "Edit Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}