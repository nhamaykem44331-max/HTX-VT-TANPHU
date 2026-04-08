import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFields } from "@/lib/data-service";
import FieldDetail from "@/components/shared/FieldDetail";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const fields = await getFields();
  const field = fields.find((f: any) => f.slug === slug);
  
  if (!field) return {};
  
  return {
    title: `${field.name} — HTX Tân Phú`,
    description: field.description,
  };
}

// Generate static params for the 8 expected fields
export async function generateStaticParams() {
  const fields = await getFields();
  return fields.map((f: any) => ({
    slug: f.slug,
  }));
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const fields = await getFields();
  const field = fields.find((f: any) => f.slug === slug);
  
  if (!field) notFound();
  
  return <FieldDetail field={field} isTicketing={field.slug === 've-may-bay'} />;
}
