import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFieldBySlug } from "@/data/fields";
import FieldDetail from "@/components/shared/FieldDetail";

export async function generateMetadata(): Promise<Metadata> {
  const field = getFieldBySlug("khach-san-phuong-anh");
  if (!field) return {};
  return {
    title: `${field.name} — HTX Tân Phú`,
    description: field.description,
  };
}

export default function Page() {
  const field = getFieldBySlug("khach-san-phuong-anh");
  if (!field) notFound();
  return <FieldDetail field={field} isTicketing={false} />;
}
