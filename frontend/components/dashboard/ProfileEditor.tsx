"use client";

import { useState } from "react";
import { Edit2, Check, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { AvatarUpload } from "./AvatarUpload";

interface UserProfile {
  full_name: string;
  username: string;
  email: string;
  theme_preference: "light" | "dark" | "system";
  profile_picture_url?: string | null;
}

const InlineEdit = ({ value, label, onSave }: { value: string, label: string, onSave: (v: string) => void }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [val, setVal] = useState(value);

  const save = () => {
    onSave(val);
    setIsEditing(false);
  };

  return (
    <div className="mb-4 group flex items-center gap-4 border-b border-border py-2">
      <div className="w-32 text-sm font-semibold opacity-70">{label}</div>
      {isEditing ? (
        <div className="flex-1 flex gap-2">
          <input 
            value={val} 
            onChange={(e) => setVal(e.target.value)} 
            className="flex-1 bg-transparent border-b border-primary outline-none" 
            autoFocus 
          />
          <button onClick={save} className="text-primary hover:bg-primary/10 p-1 rounded"><Check size={16}/></button>
          <button onClick={() => { setVal(value); setIsEditing(false); }} className="text-red-500 hover:bg-red-500/10 p-1 rounded"><X size={16}/></button>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-between">
          <span>{value}</span>
          <button onClick={() => setIsEditing(true)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-primary hover:bg-primary/10 rounded"><Edit2 size={16}/></button>
        </div>
      )}
    </div>
  );
};

export function ProfileEditor({ initialData }: { initialData: UserProfile }) {
  const [profile, setProfile] = useState(initialData);

  const handleUpdate = async (field: string, value: string) => {
    setProfile({ ...profile, [field]: value });
    console.log(`PATCH /users/me - ${field}: ${value}`);
  };

  const handleAvatarUpload = async (file: File) => {
    console.log("Uploading avatar:", file.name);
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-background border border-border rounded-xl shadow-sm">
      <h1 className="text-3xl font-bold mb-8 text-primary">Profile Management</h1>
      
      <div className="mb-12">
        <AvatarUpload initialUrl={profile.profile_picture_url} onUpload={handleAvatarUpload} />
      </div>

      <div className="flex flex-col gap-2 mb-10">
        <InlineEdit label="Full Name" value={profile.full_name} onSave={(v) => handleUpdate("full_name", v)} />
        <InlineEdit label="Username" value={profile.username} onSave={(v) => handleUpdate("username", v)} />
        <div className="mb-4 flex items-center gap-4 border-b border-border py-2">
          <div className="w-32 text-sm font-semibold opacity-70">Email</div>
          <div className="flex-1 text-opacity-50">{profile.email}</div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4 text-primary">Appearance</h2>
        <ThemeToggle initialTheme={profile.theme_preference} onThemeChange={(t) => handleUpdate("theme_preference", t)} />
      </div>
    </div>
  );
}
