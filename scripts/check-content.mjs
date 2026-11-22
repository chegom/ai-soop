import { readFileSync } from 'node:fs';
import { parse } from 'yaml';

const guarded = [
  'src/data/instructors.yaml',
  'src/data/partners.yaml',
  'src/data/events.yaml',
  'src/data/gallery.yaml',
  'src/data/reviews.yaml',
  'src/content/posts/sample-lecture-notes.md',
  'src/content/posts/sample-meetup-map.md',
  'src/content/posts/sample-one-page.md',
  'src/components/InstructorCard.astro',
  'src/components/PartnerCard.astro',
  'src/pages/instructors.astro',
  'src/pages/partners.astro',
];

const forbiddenKeys = new Set([
  'email',
  'phone',
  'tel',
  'mobile',
  'sns',
  'instagram',
  'twitter',
  'facebook',
  'linkedin',
  'kakao',
  'contact',
  'url',
  'website',
  'homepage',
  'mailto',
]);

const errors = [];

function walk(value, path, file) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => walk(item, `${path}[${index}]`, file));
    return;
  }
  if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      if (forbiddenKeys.has(key.toLowerCase())) {
        errors.push(`${file} 의 '${key}' 필드는 둘 수 없습니다. 문의는 src/data/site.yaml 만 사용합니다.`);
      }
      walk(child, `${path}.${key}`, file);
    }
    return;
  }
  if (typeof value === 'string') scanText(value, `${file} ${path}`);
}

function scanText(value, where) {
  if (/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(value) || /mailto:/i.test(value)) {
    errors.push(`${where} 에 메일 주소가 있습니다. 강사·파트너·자료에는 연락처를 넣지 않습니다.`);
  }
  if (/01[016789][- ]?\d{3,4}[- ]?\d{4}/.test(value)) {
    errors.push(`${where} 에 전화번호가 있습니다.`);
  }
  if (/instagram\.com|twitter\.com|facebook\.com|linkedin\.com|open\.kakao\.com/i.test(value)) {
    errors.push(`${where} 에 SNS 주소가 있습니다. 커뮤니티 링크는 site.yaml 에만 둡니다.`);
  }
}

for (const file of guarded) {
  const raw = readFileSync(file, 'utf8');
  if (file.endsWith('.yaml')) walk(parse(raw), '$', file);
  else scanText(raw, file);
}

const templates = [
  'src/components/InstructorCard.astro',
  'src/components/PartnerCard.astro',
  'src/pages/instructors.astro',
  'src/pages/partners.astro',
];
for (const file of templates) {
  const raw = readFileSync(file, 'utf8');
  if (/<(a|button)\b[^>]*>[^<]*(강의 요청|이 강사에게|강의 의뢰하기)/.test(raw)) {
    errors.push(`${file} 에 강사별 강의 요청 버튼이 있습니다. 문의는 사이트 한 곳만 사용합니다.`);
  }
}

const site = parse(readFileSync('src/data/site.yaml', 'utf8'));
for (const key of ['joinFormUrl', 'inquiryFormUrl', 'inquiryEmail']) {
  if (typeof site[key] !== 'string' || site[key].length < 3) {
    errors.push(`src/data/site.yaml 의 ${key} 가 없습니다.`);
  }
}
const titles = new Set((site.inquiryTypes ?? []).map((item) => item.title));
for (const title of ['강의 의뢰', '제휴', '제품 소개', '강사 등록']) {
  if (!titles.has(title)) errors.push(`문의 종류 '${title}' 가 site.yaml 에 없습니다.`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('콘텐츠 검사 통과: 강사·파트너 연락처 없음, 문의 창구는 site.yaml 한 곳입니다.');
