import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

export function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    return null;
  }

  if (!browserClient) {
    browserClient = createClient(url, anon);
  }

  return browserClient;
}

export async function saveRsvp(
  confirmedGuests: Array<{ id: string; name: string; group_id: string; table_id: string; confirmed: boolean }>,
) {
  const supabase = getSupabase();
  if (!supabase) {
    localStorage.setItem("wedding:rsvp", JSON.stringify(confirmedGuests));
    return { demo: true };
  }

  const { error } = await supabase.from("guests").upsert(
    confirmedGuests.map((guest) => ({
      id: guest.id,
      name: guest.name,
      group_id: guest.group_id,
      table_id: guest.table_id,
      rsvp_status: guest.confirmed ? "confirmed" : "declined",
    })),
  );

  if (error) {
    throw error;
  }

  return { demo: false };
}

export async function uploadMediaBlob(blob: Blob, fileName: string, type: "photo" | "video" | "audio", guestName: string) {
  const supabase = getSupabase();
  if (!supabase) {
    return { publicUrl: URL.createObjectURL(blob), demo: true };
  }

  const path = `${type}/${Date.now()}-${fileName}`;
  const { error: uploadError } = await supabase.storage.from("wedding-media").upload(path, blob, {
    contentType: blob.type,
    upsert: false,
  });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage.from("wedding-media").getPublicUrl(path);
  await supabase.from("media_uploads").insert({
    type,
    storage_path: path,
    public_url: data.publicUrl,
    guest_name: guestName || "Гость",
  });

  return { publicUrl: data.publicUrl, demo: false };
}
