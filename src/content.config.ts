import { defineCollection, z } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { parse } from 'yaml';

function singleEntry(id: string) {
  return (text: string) => {
    const data = parse(text);
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      throw new Error(`${id} 데이터는 키와 값으로 이루어진 파일이어야 합니다.`);
    }
    return [{ id, ...data }];
  };
}

const text = z.string().min(1);
const day = z.preprocess((value) => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const year = value.getUTCFullYear();
    const month = String(value.getUTCMonth() + 1).padStart(2, '0');
    const date = String(value.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${date}`;
  }
  return value;
}, z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '날짜는 2026-12-06처럼 적습니다.'));
const link = z.strictObject({
  name: text,
  href: text,
  note: text,
});

const site = defineCollection({
  loader: file('src/data/site.yaml', { parser: singleEntry('site') }),
  schema: z.strictObject({
    id: text,
    name: text,
    description: text,
    showDraftBanner: z.boolean(),
    draftBanner: text,
    joinFormUrl: text,
    inquiryFormUrl: text,
    inquiryEmail: text,
    inquiryNote: text,
    inquiryTypes: z.array(z.strictObject({ title: text, description: text })).min(1),
    community: z.array(link),
    stats: z.array(z.strictObject({ label: text, value: text })),
  }),
});

const about = defineCollection({
  loader: file('src/data/about.yaml', { parser: singleEntry('about') }),
  schema: z.strictObject({
    id: text,
    lead: text,
    story: z.array(text).min(1),
    people: z.array(z.strictObject({ title: text, text })).min(1),
    practices: z.array(z.strictObject({ title: text, text })).min(1),
    locations: z.array(z.strictObject({ name: text, text })).min(1),
  }),
});

const events = defineCollection({
  loader: file('src/data/events.yaml'),
  schema: z.strictObject({
    id: text,
    example: z.boolean(),
    title: text,
    kind: z.enum(['모임', '강의']),
    date: day,
    time: text,
    place: text,
    mode: z.enum(['온라인', '오프라인', '온·오프라인']),
    status: z.enum(['upcoming', 'past']),
    summary: text,
  }),
});

const instructors = defineCollection({
  loader: file('src/data/instructors.yaml'),
  schema: z.strictObject({
    id: text,
    example: z.boolean(),
    name: text,
    photo: text,
    topics: z.array(text).min(1),
    highlights: z.array(text).min(1),
  }),
});

const partners = defineCollection({
  loader: file('src/data/partners.yaml'),
  schema: z.strictObject({
    id: text,
    example: z.boolean(),
    company: text,
    product: text,
    summary: text,
    points: z.array(text).min(1),
  }),
});

const gallery = defineCollection({
  loader: file('src/data/gallery.yaml'),
  schema: z.strictObject({
    id: text,
    example: z.boolean(),
    title: text,
    date: day,
    image: text,
    caption: text,
  }),
});

const reviews = defineCollection({
  loader: file('src/data/reviews.yaml'),
  schema: z.strictObject({
    id: text,
    example: z.boolean(),
    event: text,
    quote: text,
    author: text,
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.strictObject({
    title: text,
    description: text,
    date: z.coerce.date(),
    tags: z.array(text).default([]),
    example: z.boolean().default(true),
  }),
});

export const collections = { site, about, events, instructors, partners, gallery, reviews, posts };
