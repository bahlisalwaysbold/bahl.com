import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getArticles } from '@/lib/cms';

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = (await getArticles()).find((item) => item.slug === slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: 'https://bahl.com.ng/journal/' + article.slug },
  };
}

export default async function JournalArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = (await getArticles()).find((item) => item.slug === slug);
  if (!article) notFound();

  return (
    <div className="page-shell">
      <article className="journal-article">
        <div className="container narrow">
          <Link className="text-link journal-back" href="/journal">← Back to journal</Link>
          <p className="eyebrow">{article.category ?? 'Bahl Update'}</p>
          <h1>{article.title}</h1>
          <p className="journal-article__date">{new Date(article.publishedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
        </div>
        <div className="container">
          <div className="journal-article__hero">
            <Image
              src={article.coverImage ?? 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2000&q=86'}
              alt=""
              fill
              priority
              sizes="100vw"
              className="cover-image"
            />
          </div>
        </div>
        <div className="container narrow journal-article__body">
          <p className="journal-article__lead">{article.excerpt}</p>
          <p>{article.body}</p>
          <Link className="text-link" href="/contact">Talk to Bahl about your project <span aria-hidden="true">→</span></Link>
        </div>
      </article>
    </div>
  );
}
