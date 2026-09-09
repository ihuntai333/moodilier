import { revalidatePath, revalidateTag } from "next/cache";

/** Bust data cache + HTML for every public surface that shows project covers. */
export function bustProjectCaches() {
  try {
    revalidateTag("projects", "max");
  } catch {
    /* ignore */
  }
  for (const path of ["/", "/proiecte", "/frontpage-v2", "/despre-noi"]) {
    try {
      revalidatePath(path);
    } catch {
      /* ignore */
    }
  }
  try {
    revalidatePath("/proiecte/[slug]", "page");
  } catch {
    /* ignore */
  }
}
