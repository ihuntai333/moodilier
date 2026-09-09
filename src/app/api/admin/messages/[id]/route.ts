import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdminMutation } from "@/lib/admin-auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdminMutation(request);
  if (denied) return denied;

  try {
    const { id } = await params;
    const body = await request.json();
    const isRead =
      typeof body.is_read === "boolean"
        ? body.is_read
        : typeof body.read === "boolean"
          ? body.read
          : undefined;

    if (typeof isRead !== "boolean") {
      return NextResponse.json(
        { error: "Lipsește is_read / read (boolean)." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("messages")
      .update({ is_read: isRead })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Mesajul nu a fost găsit." },
          { status: 404 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Message PATCH error:", error);
    return NextResponse.json({ error: "Eroare internă." }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdminMutation(request);
  if (denied) return denied;

  try {
    const { id } = await params;

    // Verify the message exists before deleting
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from("messages")
      .select("id")
      .eq("id", id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json(
        { error: "Mesajul nu a fost găsit." },
        { status: 404 }
      );
    }

    const { error } = await supabaseAdmin
      .from("messages")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Message DELETE error:", error);
    return NextResponse.json({ error: "Eroare internă." }, { status: 500 });
  }
}
