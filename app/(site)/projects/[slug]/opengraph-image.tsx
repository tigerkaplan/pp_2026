import { ImageResponse } from "next/og";
import { getProjectBySlug } from "../_lib/getProjectBySlug";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const project = await getProjectBySlug(slug);

    const title = project?.title ?? "Project";
    const summary = project?.summary ?? "";

    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: 80,
                    background: "linear-gradient(135deg, #0b0b0f 0%, #111827 60%, #000 100%)",
                    color: "white",
                    fontFamily:
                        'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
                }}
            >
                <div
                    style={{
                        display: "flex",
                        fontSize: 18,
                        opacity: 0.75,
                        marginBottom: 18,
                    }}
                >
                    /projects/{slug}
                </div>

                <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.05 }}>
                    {title}
                </div>

                <div style={{ fontSize: 28, opacity: 0.85, marginTop: 20, maxWidth: 980 }}>
                    {summary}
                </div>

                <div style={{ display: "flex", gap: 10, marginTop: 36, flexWrap: "wrap" }}>
                    {(project?.stack ?? []).slice(0, 6).map((t) => (
                        <div
                            key={t}
                            style={{
                                padding: "10px 14px",
                                borderRadius: 999,
                                background: "rgba(255,255,255,0.08)",
                                border: "1px solid rgba(255,255,255,0.14)",
                                fontSize: 18,
                            }}
                        >
                            {t}
                        </div>
                    ))}
                </div>
            </div>
        ),
        size
    );
}
