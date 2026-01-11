export function generatePageMetadata({ title, description, path = '' }) {
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}${path}`;
  
  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
    },
    twitter: {
      title,
      description,
    },
  };
}

export function generateArticleMetadata({ title, description, publishedTime, tags = [], path = '' }) {
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}${path}`;
  
  return {
    title,
    description,
    keywords: tags,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      publishedTime,
      tags,
    },
    twitter: {
      title,
      description,
      card: 'summary_large_image',
    },
  };
}
