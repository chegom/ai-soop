import { getCollection, getEntry } from 'astro:content';

export async function getSite() {
  const entry = await getEntry('site', 'site');
  if (!entry) throw new Error('src/data/site.yaml 을 읽지 못했습니다.');
  return entry.data;
}

export async function getAbout() {
  const entry = await getEntry('about', 'about');
  if (!entry) throw new Error('src/data/about.yaml 을 읽지 못했습니다.');
  return entry.data;
}

export async function getEvents() {
  const events = await getCollection('events');
  const upcoming = events
    .filter((event) => event.data.status === 'upcoming')
    .sort((a, b) => a.data.date.localeCompare(b.data.date));
  const past = events
    .filter((event) => event.data.status === 'past')
    .sort((a, b) => b.data.date.localeCompare(a.data.date));
  return { upcoming, past, all: [...upcoming, ...past] };
}

export async function getInstructors() {
  const items = await getCollection('instructors');
  return items.sort((a, b) => a.id.localeCompare(b.id));
}

export async function getPartners() {
  const items = await getCollection('partners');
  return items.sort((a, b) => a.id.localeCompare(b.id));
}

export async function getGallery() {
  const items = await getCollection('gallery');
  return items.sort((a, b) => b.data.date.localeCompare(a.data.date));
}

export async function getReviews() {
  const items = await getCollection('reviews');
  return items.sort((a, b) => a.id.localeCompare(b.id));
}

export async function getPosts() {
  const posts = await getCollection('posts');
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}
