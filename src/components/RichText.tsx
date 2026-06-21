import { RichText as HygraphRichText } from "@graphcms/rich-text-react-renderer";
import type { RichTextContent } from "@graphcms/rich-text-types";
import Image from "next/image";

interface RichTextProps {
  content: RichTextContent;
}

export default function RichText({ content }: RichTextProps) {
  return (
    <div className="space-y-6 text-body-lg text-white/85">
      <HygraphRichText
        content={content}
        renderers={{
          h2: ({ children }) => (
            <h2 className="text-display text-heading-md text-white pt-6 first:pt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-heading-sm font-semibold text-white pt-4">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-lg font-semibold text-white pt-2">{children}</h4>
          ),
          p: ({ children }) => (
            <p className="leading-relaxed text-white/85">{children}</p>
          ),
          a: ({ children, href, openInNewTab }) => (
            <a
              href={href}
              target={openInNewTab ? "_blank" : undefined}
              rel={openInNewTab ? "noopener noreferrer" : undefined}
              className="text-page-primary underline decoration-page-primary/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
            >
              {children}
            </a>
          ),
          bold: ({ children }) => (
            <strong className="font-semibold text-white">{children}</strong>
          ),
          italic: ({ children }) => <em className="italic">{children}</em>,
          code: ({ children }) => (
            <code className="rounded-md bg-white/10 px-1.5 py-0.5 font-mono text-[0.9em] text-white">
              {children}
            </code>
          ),
          code_block: ({ children }) => (
            <pre className="overflow-x-auto rounded-2xl border border-white/10 bg-black/50 p-5 font-mono text-sm leading-relaxed text-white/90">
              <code>{children}</code>
            </pre>
          ),
          ul: ({ children }) => (
            <ul className="list-disc space-y-2 pl-6 marker:text-page-primary">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal space-y-2 pl-6 marker:text-page-primary">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="pl-1">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-page-primary bg-white/5 py-3 pl-5 pr-4 text-white/90 italic rounded-r-xl">
              {children}
            </blockquote>
          ),
          img: ({ src, altText, width, height }) => (
            <span className="block my-8 overflow-hidden rounded-2xl border border-white/10">
              <Image
                src={src ?? ""}
                alt={altText ?? ""}
                width={width ?? 1200}
                height={height ?? 800}
                className="h-auto w-full object-cover"
              />
            </span>
          ),
          table: ({ children }) => (
            <div className="my-6 overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full border-collapse text-left text-body-sm">
                {children}
              </table>
            </div>
          ),
          table_header_cell: ({ children }) => (
            <th className="border-b border-white/10 bg-white/5 px-4 py-3 font-semibold text-white">
              {children}
            </th>
          ),
          table_cell: ({ children }) => (
            <td className="border-b border-white/5 px-4 py-3 text-white/80">
              {children}
            </td>
          ),
        }}
      />
    </div>
  );
}
