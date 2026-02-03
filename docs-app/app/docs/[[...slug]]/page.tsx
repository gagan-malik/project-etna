import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDocBySlug, getDocSlugs } from "@/lib/docs";
import { DocMarkdown } from "@/components/docs/doc-markdown";
import { TableOfContents } from "@/components/docs/table-of-contents";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export async function generateStaticParams() {
  const slugs = getDocSlugs();
  return slugs.map((s) => ({ slug: s }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = rawSlug === undefined ? [] : Array.isArray(rawSlug) ? rawSlug : [rawSlug];
  const doc = getDocBySlug(slug);
  if (!doc) return { title: "Docs" };
  const title = (doc.meta.title as string) || (slug.length ? slug[slug.length - 1] : "Docs");
  const description = doc.meta.description as string | undefined;
  return { title: `${title} | Project Etna Docs`, description };
}

export default async function DocPage({ params }: PageProps) {
  const { slug: rawSlug } = await params;
  const slug = rawSlug === undefined ? [] : Array.isArray(rawSlug) ? rawSlug : [rawSlug];
  const doc = getDocBySlug(slug);
  if (!doc) notFound();

  const currentTitle = (doc.meta.title as string) || (slug.length ? slug[slug.length - 1] : "Home");

  return (
    <>
      <div className="mx-auto w-full min-w-0 max-w-3xl px-5 py-5">
        <div className="mb-3 flex items-center space-x-1 text-sm text-muted-foreground">
          <div className="overflow-hidden text-ellipsis whitespace-nowrap">Docs</div>
        </div>
        <div className="space-y-1.5">
          <h1 className="scroll-m-20 text-xl font-semibold tracking-tight">{currentTitle}</h1>
          {doc.meta.description && (
            <p className="text-sm text-muted-foreground">{doc.meta.description as string}</p>
          )}
        </div>
        <div className="mdx mt-6">
          <DocMarkdown content={doc.content} />
        </div>
      </div>
      <div className="hidden text-sm xl:block">
        <TableOfContents content={doc.content} />
      </div>
    </>
  );
}
