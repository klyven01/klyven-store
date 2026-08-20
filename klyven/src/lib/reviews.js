import { supabase, isSupabaseConfigured } from './supabaseClient';

/** Fetches approved reviews for a product, newest first. */
export async function getReviews(productId) {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', productId)
    .eq('approved', true)
    .order('created_at', { ascending: false });
  if (error) return [];
  return data;
}

/** Submits a new review. Returns { success, message }. */
export async function submitReview({ productId, customerName, rating, comment }) {
  if (!isSupabaseConfigured) {
    return { success: false, message: 'Reviews aren\u2019t available yet — connect Supabase to enable them.' };
  }
  if (!customerName?.trim()) return { success: false, message: 'Enter your name.' };
  if (!rating || rating < 1 || rating > 5) return { success: false, message: 'Select a star rating.' };

  const { error } = await supabase.from('reviews').insert([
    {
      product_id: productId,
      customer_name: customerName.trim(),
      rating,
      comment: comment?.trim() || '',
    },
  ]);

  if (error) return { success: false, message: 'Could not submit review. Please try again.' };
  return { success: true, message: 'Thanks for your review!' };
}

/** Computes average rating (rounded to 1 decimal) and count from a review list. */
export function summarizeReviews(reviews) {
  if (!reviews || reviews.length === 0) return { average: 0, count: 0 };
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return { average: Math.round((sum / reviews.length) * 10) / 10, count: reviews.length };
}
