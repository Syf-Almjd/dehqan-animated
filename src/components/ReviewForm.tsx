"use client";
import { useActionState, useState } from "react";
import { addReview } from "@/app/actions/site";

export default function ReviewForm({ productId, slug }: { productId: string; slug: string }) {
  const [state, action, pending] = useActionState(addReview, undefined);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  if (state?.ok) return <p className="rounded-2xl bg-mint/15 p-4 font-bold text-mint">{state.message}</p>;
  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="product_id" value={productId} />
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="rating" value={rating} />
      <div className="flex gap-1" onMouseLeave={() => setHover(0)} role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n} type="button" role="radio" aria-checked={rating === n} aria-label={`${n} star${n > 1 ? "s" : ""}`}
            onMouseEnter={() => setHover(n)} onClick={() => setRating(n)}
            className={`text-3xl transition-transform hover:scale-125 ${(hover || rating) >= n ? "text-[#ffb800]" : "text-ink/20"}`}
          >★</button>
        ))}
      </div>
      <input name="title" placeholder="Sum it up (optional)" className="input" maxLength={80} />
      <textarea name="body" required minLength={3} rows={3} placeholder="What did you think?" className="input" />
      {state?.error && <p role="alert" className="text-sm font-bold text-leaf">{state.error}</p>}
      <button disabled={pending} className="btn btn-dark">{pending ? "Posting…" : "Post review"}</button>
    </form>
  );
}
