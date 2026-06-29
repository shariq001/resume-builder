"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, LogOut, Trash2, Edit2, FileText, Check, Loader2, Key, Upload, User as UserIcon, Eye } from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useRouter } from "next/navigation";
import { PasswordStrengthIndicator } from "./auth/PasswordStrengthIndicator";

export function ProfileModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user, logout, fetchUser } = useAuthStore();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const [resumes, setResumes] = useState<any[]>([]);
  const [isLoadingResumes, setIsLoadingResumes] = useState(false);
  const [editingResumeId, setEditingResumeId] = useState<string | null>(null);
  const [editingResumeTitle, setEditingResumeTitle] = useState("");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || "");
      if (isOpen) {
        fetchResumes();
      }
    }
  }, [user, isOpen]);

  const fetchResumes = async () => {
    setIsLoadingResumes(true);
    try {
      const token = sessionStorage.getItem("access_token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}`}/api/v1/resumes", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setResumes(data);
      }
    } catch (error) {
      console.error("Failed to fetch resumes", error);
    } finally {
      setIsLoadingResumes(false);
    }
  };

  const handleRenameResume = async (id: string) => {
    if (!editingResumeTitle.trim()) return;
    try {
      const token = sessionStorage.getItem("access_token");
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}`}/api/v1/resumes/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title: editingResumeTitle })
      });
      setEditingResumeId(null);
      await fetchResumes();
    } catch (error) {
      console.error("Failed to rename resume", error);
    }
  };

  const handleDeleteResume = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resume?")) return;
    try {
      const token = sessionStorage.getItem("access_token");
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}`}/api/v1/resumes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchResumes();
    } catch (error) {
      console.error("Failed to delete resume", error);
    }
  };

  const [isViewing, setIsViewing] = useState<string | null>(null);

  const handleViewResume = async (id: string) => {
    setIsViewing(id);
    try {
      const token = sessionStorage.getItem("access_token");
      
      // Generate PDF
      const genRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}`}/api/v1/resumes/${id}/generate-pdf`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!genRes.ok) throw new Error("Failed to generate");
      
      // Download PDF Blob
      const downRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}`}/api/v1/resumes/${id}/download`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!downRes.ok) throw new Error("Failed to download");
      
      const blob = await downRes.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error(error);
      alert("Failed to view resume. Make sure you have completely filled out the form.");
    } finally {
      setIsViewing(null);
    }
  };

  const handleUpdateProfile = async () => {
    setIsSaving(true);
    try {
      const token = sessionStorage.getItem("access_token");
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}`}/api/v1/users/me", {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ full_name: fullName })
      });
      await fetchUser();
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError("");
    setPasswordSuccess(false);
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill out all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    
    // Validate rules
    if (newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword) || !/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      setPasswordError("Password does not meet the requirements.");
      return;
    }

    setIsSavingPassword(true);
    try {
      const token = sessionStorage.getItem("access_token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}`}/api/v1/users/me/change-password", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ current_password: oldPassword, new_password: newPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        setPasswordError(data.detail || "Failed to change password.");
      } else {
        setPasswordSuccess(true);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setIsChangingPassword(false), 2000);
      }
    } catch (error) {
      setPasswordError("Network error.");
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleDeleteProfile = async () => {
    setDeleteError("");
    if (!deletePassword) {
      setDeleteError("Please enter your password to confirm deletion.");
      return;
    }
    
    setIsDeleting(true);
    try {
      const token = sessionStorage.getItem("access_token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}`}/api/v1/users/me", {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ password: deletePassword })
      });
      if (!res.ok) {
        const data = await res.json();
        setDeleteError(data.detail || "Incorrect password.");
        return;
      }
      logout();
      onClose();
      router.push("/");
    } catch (error) {
      setDeleteError("Network error.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = sessionStorage.getItem("access_token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}`}/api/v1/users/me/avatar", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        await fetchUser();
      } else {
        const errorData = await res.json();
        alert(`Failed to upload avatar: ${errorData.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleLogout = () => {
    logout();
    onClose();
    router.push("/");
  };

  if (!isOpen || !user) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
          className="relative bg-[var(--color-bg-primary)] border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
            <h2 className="text-2xl font-bold font-display">Your Profile</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <X size={20} />
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto flex-1 space-y-8">
            {/* User Details */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Personal Details</h3>
                {!isEditing ? (
                  <button onClick={() => setIsEditing(true)} className="text-sm flex items-center gap-2 text-[var(--color-accent)] hover:text-blue-400">
                    <Edit2 size={16} /> Edit
                  </button>
                ) : (
                  <button onClick={handleUpdateProfile} disabled={isSaving} className="text-sm flex items-center gap-2 bg-[var(--color-accent)] text-white px-3 py-1.5 rounded-lg hover:bg-blue-600">
                    {isSaving ? <Loader2 className="animate-spin" size={16}/> : <Check size={16} />} Save
                  </button>
                )}
              </div>
              
              <div className="bg-white/5 rounded-xl p-4 border border-white/5 flex flex-col sm:flex-row gap-6">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-20 h-20 rounded-full border border-white/20 overflow-hidden bg-[var(--color-bg-secondary)] flex items-center justify-center relative group">
                    {user.profile_picture_url ? (
                      <img src={user.profile_picture_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon size={32} className="text-gray-400" />
                    )}
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                    >
                      {isUploadingAvatar ? <Loader2 size={20} className="animate-spin text-white" /> : <Upload size={20} className="text-white" />}
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/jpeg,image/png,image/webp" onChange={handleAvatarUpload} />
                  </div>
                  <span className="text-xs text-gray-400">Click to upload</span>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Email</label>
                    <p className="font-medium text-gray-200">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Full Name</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={fullName} 
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white outline-none focus:border-[var(--color-accent)]"
                      />
                    ) : (
                      <p className="font-medium text-gray-200">{user.full_name || "Not provided"}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Change Password */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Security</h3>
                {!isChangingPassword ? (
                  <button onClick={() => setIsChangingPassword(true)} className="text-sm flex items-center gap-2 text-[var(--color-accent)] hover:text-blue-400">
                    <Key size={16} /> Change Password
                  </button>
                ) : (
                  <button onClick={() => setIsChangingPassword(false)} className="text-sm text-gray-400 hover:text-white">
                    Cancel
                  </button>
                )}
              </div>
              
              {isChangingPassword && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-white/5 rounded-xl p-4 border border-white/5 space-y-4">
                  {passwordError && <div className="p-2 bg-red-500/10 text-red-400 text-sm rounded-lg border border-red-500/20">{passwordError}</div>}
                  {passwordSuccess && <div className="p-2 bg-green-500/10 text-green-400 text-sm rounded-lg border border-green-500/20">Password changed successfully!</div>}
                  
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Current Password</label>
                    <input 
                      type="password" 
                      value={oldPassword} 
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white outline-none focus:border-[var(--color-accent)]"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">New Password</label>
                    <input 
                      type="password" 
                      value={newPassword} 
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white outline-none focus:border-[var(--color-accent)] mb-2"
                    />
                    {newPassword && <PasswordStrengthIndicator password={newPassword} />}
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Confirm New Password</label>
                    <input 
                      type="password" 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white outline-none focus:border-[var(--color-accent)]"
                    />
                  </div>
                  <button 
                    onClick={handleChangePassword} 
                    disabled={isSavingPassword} 
                    className="w-full text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-[var(--color-accent)] text-white px-3 py-2.5 rounded-lg hover:opacity-90 font-bold mt-2 shadow-lg disabled:opacity-50"
                  >
                    {isSavingPassword ? <Loader2 className="animate-spin" size={16}/> : <Check size={16} />} Update Password
                  </button>
                </motion.div>
              )}
            </div>

            {/* Saved Resumes */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Saved Resumes</h3>
              <div className="space-y-3">
                {isLoadingResumes ? (
                  <div className="flex justify-center p-4"><Loader2 className="animate-spin text-[var(--color-accent)]" /></div>
                ) : resumes.length === 0 ? (
                  <p className="text-gray-400 italic">No saved resumes yet. Build one from the homepage!</p>
                ) : (
                  resumes.map(resume => {
                    const templateMapReverse: Record<number, string> = { 1: "Modern", 2: "Classic", 3: "Minimal" };
                    return (
                      <div key={resume.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/5 p-4 rounded-xl border border-white/5 hover:border-[var(--color-accent)]/50 transition-colors gap-4 sm:gap-0">
                        <div className="flex items-start sm:items-center gap-3">
                          <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                            <FileText size={20} />
                          </div>
                          <div>
                            {editingResumeId === resume.id ? (
                              <div className="flex items-center gap-2">
                                <input 
                                  type="text" 
                                  value={editingResumeTitle} 
                                  onChange={(e) => setEditingResumeTitle(e.target.value)}
                                  className="bg-black/20 border border-white/10 rounded px-2 py-1 text-sm text-white focus:border-[var(--color-accent)] outline-none"
                                />
                                <button onClick={() => handleRenameResume(resume.id)} className="text-[var(--color-accent)] hover:text-blue-400"><Check size={16}/></button>
                                <button onClick={() => setEditingResumeId(null)} className="text-gray-400 hover:text-white"><X size={16}/></button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <p className="font-bold">{resume.title || "Untitled Resume"}</p>
                                <button 
                                  onClick={() => { setEditingResumeId(resume.id); setEditingResumeTitle(resume.title || ""); }} 
                                  className="text-gray-400 hover:text-[var(--color-accent)]"
                                >
                                  <Edit2 size={14} />
                                </button>
                              </div>
                            )}
                            <p className="text-xs text-gray-400 mt-1">
                              Saved: {new Date(resume.updated_at || resume.created_at).toLocaleDateString()} • Template: {templateMapReverse[resume.template_id] || "Unknown"}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full sm:w-auto justify-end">
                          <button 
                            onClick={() => handleViewResume(resume.id)}
                            disabled={isViewing === resume.id}
                            className="flex-1 sm:flex-none px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 rounded-lg text-sm font-semibold transition-colors flex justify-center items-center gap-2"
                            title="View & Download PDF"
                          >
                            {isViewing === resume.id ? <Loader2 size={16} className="animate-spin" /> : <Eye size={16} />} 
                            View
                          </button>
                          <button 
                            onClick={() => {
                              localStorage.setItem("edit_resume_id", resume.id);
                              onClose();
                              router.push("/builder/new");
                            }}
                            className="flex-1 sm:flex-none px-4 py-2 bg-white/10 hover:bg-[var(--color-accent)] rounded-lg text-sm font-semibold transition-colors flex justify-center items-center"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteResume(resume.id)}
                            className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors flex justify-center items-center"
                            title="Delete Resume"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
          
          <div className="p-4 border-t border-white/10 flex flex-col bg-black/20">
            {!showDeleteConfirm ? (
              <div className="flex justify-between items-center w-full">
                <button 
                  onClick={() => setShowDeleteConfirm(true)} 
                  className="flex items-center gap-2 text-red-500 hover:text-red-400 hover:bg-red-500/10 px-4 py-2 rounded-lg transition-colors font-semibold text-sm"
                >
                  <Trash2 size={16} />
                  Delete Account
                </button>
                
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 px-6 py-2 rounded-lg transition-colors font-bold"
                >
                  <LogOut size={18} />
                  Log Out
                </button>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="w-full p-4 border border-red-500/30 bg-red-500/5 rounded-xl">
                <h4 className="text-red-400 font-bold mb-2">Danger Zone</h4>
                <p className="text-sm text-gray-400 mb-4">Deleting your account is permanent. Please enter your password to confirm.</p>
                {deleteError && <p className="text-sm text-red-400 mb-2">{deleteError}</p>}
                <div className="flex gap-2">
                  <input 
                    type="password" 
                    placeholder="Enter password..."
                    value={deletePassword} 
                    onChange={(e) => setDeletePassword(e.target.value)}
                    className="flex-1 bg-black/40 border border-red-500/20 rounded-lg p-2 text-white outline-none focus:border-red-500 text-sm"
                  />
                  <button 
                    onClick={handleDeleteProfile} 
                    disabled={isDeleting}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-600 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isDeleting ? <Loader2 className="animate-spin" size={16}/> : <Trash2 size={16} />} Confirm
                  </button>
                  <button 
                    onClick={() => { setShowDeleteConfirm(false); setDeletePassword(""); setDeleteError(""); }}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
