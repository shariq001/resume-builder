import { ProfileEditor } from "@/components/dashboard/ProfileEditor";

export default function ProfilePage() {
  const dummyUser = {
    full_name: "Jane Doe",
    username: "janedoe",
    email: "jane@example.com",
    theme_preference: "system" as const,
    profile_picture_url: null
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <ProfileEditor initialData={dummyUser} />
    </div>
  );
}
