"use client";

import { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

type UserProfile = {
  contentTypes: string[];
  tags: string[];
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [contentTypesInput, setContentTypesInput] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  // Fetch the profile data when the session is loaded
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/user/profile")
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setProfile({
              contentTypes: data.user.contentTypes,
              tags: data.user.tags,
            });
          }
        });
    }
  }, [status]);

  const handleUpdate = async () => {
    // Assume contentTypes and tags are comma-separated strings
    const contentTypes = contentTypesInput.split(",").map(s => s.trim()).filter(Boolean);
    const tags = tagsInput.split(",").map(s => s.trim()).filter(Boolean);
    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contentTypes, tags }),
    });
    const data = await res.json();
    if (data.user) {
      setProfile({
        contentTypes: data.user.contentTypes,
        tags: data.user.tags,
      });
      alert("Profile updated");
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return (
      <div className="p-4">
        <p>You are not signed in.</p>
        <button 
          onClick={() => signIn("google")}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1>Profile Preferences</h1>
      {profile ? (
        <div>
          <p>
            <strong>Content Types:</strong> {profile.contentTypes.join(", ")}
          </p>
          <p>
            <strong>Tags:</strong> {profile.tags.join(", ")}
          </p>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}

      <div className="mt-4">
        <label>
          Update Content Types (comma-separated):{" "}
          <input
            type="text"
            value={contentTypesInput}
            onChange={(e) => setContentTypesInput(e.target.value)}
            className="border px-2 py-1"
          />
        </label>
      </div>

      <div className="mt-4">
        <label>
          Update Tags (comma-separated):{" "}
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            className="border px-2 py-1"
          />
        </label>
      </div>

      <div className="mt-4">
        <button
          onClick={handleUpdate}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Update Profile
        </button>
      </div>

      <div className="mt-4">
        <button
          onClick={() => signOut()}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
