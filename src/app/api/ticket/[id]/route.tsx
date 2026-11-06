import { ImageResponse } from "next/og";
import { copy } from "@/copy";
import { formatSquad } from "@/lib/squad";
import { getStore } from "@/lib/store";
import { Ticket } from "@/ticket/Ticket";
import { ticketFonts } from "@/ticket/fonts";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID.test(id)) return new Response("Not found", { status: 404 });

  const reg = await getStore().get(id);
  if (!reg) return new Response("Not found", { status: 404 });

  const squad = formatSquad(reg.squadNumber);
  const image = new ImageResponse(
    (
      <Ticket
        t={{
          firstName: reg.firstName,
          surname: reg.surname,
          squad,
          squadNumber: reg.squadNumber,
          fan: reg.fanType ? copy.fanTypes[reg.fanType].title : null,
        }}
      />
    ),
    { width: 1200, height: 480, fonts: await ticketFonts() },
  );

  const headers = new Headers(image.headers);
  headers.set("Cache-Control", "private, max-age=86400"); // holds a name, so never cache publicly
  if (new URL(req.url).searchParams.has("download")) {
    headers.set("Content-Disposition", `attachment; filename="the-alfie-bench-ticket-${squad}.png"`);
  }
  return new Response(image.body, { headers });
}
