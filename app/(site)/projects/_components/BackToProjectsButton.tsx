"use client";
import { useRouter } from "next/navigation";

export default function BackToProjectsButton() {
    const router = useRouter();
    return (
        <button
            type="button"
            onClick={() => router.back()}
            className="text-sm text-white/70 hover:text-white"
        >
            ← Back to projects
        </button>
    );
}
