import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ChangePasswordDialog from "@/components/ChangePasswordDialog";
import { Camera, MapPin, Phone, Mail, Shield, Pencil, Check, X, User } from "lucide-react";
import { toast } from "sonner";
import API from "@/api/axios";


const getStoredProfile = () => {
  try {
    const data = localStorage.getItem("user");
    if (!data) return null;

    const parsed = JSON.parse(data);

    // ensure all fields exist (VERY IMPORTANT)
    return {
      name: parsed.name || "",
      email: parsed.email || "",
      mobile: parsed.mobile || "",
      location: parsed.location || "",
      role: parsed.role || "",
      bio: parsed.bio || "",
      imageUrl: parsed.imageUrl || "",
    };
  } catch {
    return null;
  }
};

const ProfilePage = () => {

  const defaultProfile = {
    name: "",
    email: "",
    mobile: "",
    location: "",
    role: "",
    bio: "",
    imageUrl: "",
  };

  const storedProfile = getStoredProfile();
  const token = localStorage.getItem("token");
  const [profile, setProfile] = useState(storedProfile || defaultProfile);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(storedProfile || defaultProfile);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const fileInputRef = useRef(null);

  const handleEdit = () => {
    setDraft({ ...profile });
    setEditing(true);
  };

  const handleCancel = () => {
    setDraft({ ...profile });
    setEditing(false);
  };

  const handleSave = async() => {
    if (!draft.name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    if (!draft.mobile.trim() || !/^\d{7,15}$/.test(draft.mobile.trim())) {
      toast.error("Enter a valid mobile number");
      return;
    }

    try {
      const res = await API.patch("/user/edit",draft,{
        headers : {
          Authorization : `Bearer ${token}`
        }
      })

      const updatedProfile = res.data.user
      setProfile(updatedProfile)
      setDraft(updatedProfile)

      localStorage.setItem("user", JSON.stringify(updatedProfile));

      setEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
      
    }



  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setDraft((prev) => ({ ...prev, imageUrl: url }));
    }
  };

  const displayData = editing ? draft : profile;

  return (
    <div className="min-h-screen bg-background flex items-start justify-center px-4 py-10 sm:py-16">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">My Profile</h1>
          {!editing ? (
            <Button onClick={handleEdit} variant="outline" size="sm" className="gap-2">
              <Pencil className="h-4 w-4" /> Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm" className="gap-2">
                <Check className="h-4 w-4" /> Save
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm" className="gap-2">
                <X className="h-4 w-4" /> Cancel
              </Button>
            </div>
          )}
        </div>

        {/* Avatar Card */}
        <Card className="overflow-hidden border-border shadow-sm">
          <div className="h-28 bg-gradient-to-r from-primary/80 to-accent" />
          <CardContent className="relative pt-0 pb-6 px-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-14">
              <div className="relative group">
                <Avatar className="h-28 w-28 border-4 border-card shadow-lg">
                  <AvatarImage src={displayData.imageUrl} alt={displayData.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-bold">
                    {displayData.name
                      ?.split(" ")
                      ?.map((n) => n[0])
                      ?.join("")
                      ?.toUpperCase()
                      ?.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                {editing && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 flex items-center justify-center rounded-full bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Camera className="h-6 w-6 text-primary-foreground" />
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
              <div className="text-center sm:text-left pb-1">
                <h2 className="text-xl font-semibold text-foreground">{displayData.name}</h2>
                <div className="flex items-center gap-2 mt-1 text-muted-foreground text-sm">
                  <Mail className="h-3.5 w-3.5" />
                  <span>{displayData.email}</span>
                </div>
              </div>
              <div className="sm:ml-auto">
                <Badge variant="secondary" className="capitalize gap-1.5 px-3 py-1">
                  <Shield className="h-3 w-3" />
                  {displayData.role}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details Card */}
        <Card className="border-border shadow-sm">
          <CardContent className="p-6 space-y-5">
            <h3 className="text-base font-semibold text-foreground">Personal Information</h3>
            <Separator />

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Name */}
              <div className="space-y-2">
                <Label className="text-muted-foreground flex items-center gap-1.5 text-xs uppercase tracking-wider">
                  <User className="h-3.5 w-3.5" /> Name
                </Label>
                {editing ? (
                  <Input
                    value={draft.name}
                    onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
                    maxLength={100}
                  />
                ) : (
                  <p className="text-foreground font-medium">{profile.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label className="text-muted-foreground flex items-center gap-1.5 text-xs uppercase tracking-wider">
                  <Mail className="h-3.5 w-3.5" /> Email
                </Label>
                <p className="text-foreground font-medium">{profile.email}</p>
                <span className="text-xs text-muted-foreground">Primary key · cannot be changed</span>
              </div>

              {/* Mobile */}
              <div className="space-y-2">
                <Label className="text-muted-foreground flex items-center gap-1.5 text-xs uppercase tracking-wider">
                  <Phone className="h-3.5 w-3.5" /> Mobile
                </Label>
                {editing ? (
                  <Input
                    value={draft.mobile}
                    onChange={(e) => setDraft((p) => ({ ...p, mobile: e.target.value }))}
                    maxLength={15}
                    type="tel"
                  />
                ) : (
                  <p className="text-foreground font-medium">{profile.mobile}</p>
                )}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label className="text-muted-foreground flex items-center gap-1.5 text-xs uppercase tracking-wider">
                  <MapPin className="h-3.5 w-3.5" /> Location
                </Label>
                {editing ? (
                  <Input
                    value={draft.location}
                    onChange={(e) => setDraft((p) => ({ ...p, location: e.target.value }))}
                    maxLength={100}
                  />
                ) : (
                  <p className="text-foreground font-medium">{profile.location}</p>
                )}
              </div>

              {/* Role */}
              <div className="space-y-2">
                <Label className="text-muted-foreground flex items-center gap-1.5 text-xs uppercase tracking-wider">
                  <Shield className="h-3.5 w-3.5" /> Role
                </Label>
                <p className="text-foreground font-medium capitalize">{profile.role}</p>
                <span className="text-xs text-muted-foreground">Assigned by admin</span>
              </div>
            </div>

            <Separator />

            {/* Bio */}
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs uppercase tracking-wider">
                Bio
              </Label>
              {editing ? (
                <Textarea
                  value={draft.bio}
                  onChange={(e) => setDraft((p) => ({ ...p, bio: e.target.value }))}
                  maxLength={500}
                  rows={3}
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-foreground leading-relaxed">
                  {profile.bio || <span className="text-muted-foreground italic">No bio added yet.</span>}
                </p>
              )}
            </div>

            <Separator />

            {/* Change Password */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Password</p>
                <p className="text-xs text-muted-foreground">Update your account password</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setPasswordOpen(true)}>
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <ChangePasswordDialog open={passwordOpen} onOpenChange={setPasswordOpen} />
    </div>
  );
};

export default ProfilePage;