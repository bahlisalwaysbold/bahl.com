import Image from 'next/image';
import Link from 'next/link';
import type { Article } from '@/types/content';

export default function JournalCard({ article, featured = false }: { article: Article; featured?: boolean }) {
  return (
    <Link href={'/journal/' + article.slug} className={'journal-card' + (featured ? ' journal-card--featured' : '')}>
      <div className="journal-card__media">
        <Image
          src={article.coverImage ?? 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=82'}
          alt=""
          fill
          sizes="(max-width: 760px) 100vw, 33vw"
          className="cover-image"
        />
        <span className="journal-card__tag">{article.category ?? 'Bahl Update'}</span>
      </div>
      <div className="journal-card__body">
        <div className="journal-card__meta">
          <span>{new Date(article.publishedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
          <span aria-hidden="true">↗</span>
        </div>
        <h3>{article.title}</h3>
        <p className="journal-card__excerpt">{article.excerpt}</p>
        <span className="text-link">Read note <span aria-hidden="true">→</span></span>
      </div>
    </Link>
  );
}
