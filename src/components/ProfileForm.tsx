"use client";
import { useActionState } from "react";
import { updateProfile } from "@/app/actions/site";

export default function ProfileForm({ name, email }: { name: string; email: string }) {
  const [state, action, pending] = useActionState(updateProfile, undefined);
  return (
    <form action={action} className="card space-y-4 p-6">
      <h2 className="font-display text-2xl font-bold">Profile</h2>
      <div><label className="label" htmlFor="pname">Name</label><input id="pname" name="name" defaultValue={name} className="input" /></div>
      <div><label className="label">Email</label><p className="font-semibold opacity-70">{email}</p></div>
      <div className="flex items-center gap-3">
        <button disabled={pending} className="btn btn-dark">{pending ? "Saving…" : "Save"}</button>
        {state?.message && <span className="text-sm font-bold text-mint">{state.message}</span>}
        {state?.error && <span className="text-sm font-bold text-leaf">{state.error}</span>}
      </div>
    </form>
  );
}
