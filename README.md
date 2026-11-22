# AI 숲 홈페이지 시안

온라인·오프라인으로 모이고 강의를 여는 AI 숲의 정적 홈페이지입니다. 서버와 데이터베이스 없이 GitHub Pages에 무료로 올릴 수 있습니다.

이 저장소의 글, 일정, 강사, 파트너, 사진은 **시안용 예시**입니다. 카드와 배너에 `예시`라고 적혀 있습니다. 실제 내용으로 바꾼 뒤 공개하세요.

## 기술

- [Astro](https://astro.build)로 정적 HTML을 만듭니다.
- 자주 바뀌는 내용은 `src/data`의 YAML과 `src/content/posts`의 마크다운에 있습니다.
- 배포는 `.github/workflows/pages.yml`이 `main`에 푸시될 때 GitHub Pages로 올립니다.

## 로컬에서 보기

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:4321` 을 엽니다.

```bash
npm run check
npm run build
npm run preview
```

`check`는 강사·파트너 데이터에 연락처가 섞이지 않았는지 확인합니다. `build`가 되어야 페이지가 만들어집니다.

## 내용을 고치는 곳

레이아웃 코드는 건드리지 않아도 됩니다. 파일을 저장하고 푸시하면 사이트가 다시 배포됩니다.

| 바꿀 내용 | 파일 |
| --- | --- |
| 이름, 소개 문장, 참가 신청 주소, 문의 주소, 메일, 커뮤니티 링크, 규모 숫자, 시안 배너 | `src/data/site.yaml` |
| 모임 소개 문장, 구성, 만나는 곳 | `src/data/about.yaml` |
| 모임·강의 일정 | `src/data/events.yaml` |
| 강사 (사진, 이름, 주제, 짧은 경력) | `src/data/instructors.yaml` |
| 파트너 제품 카드 | `src/data/partners.yaml` |
| 활동 사진 목록 | `src/data/gallery.yaml` |
| 참가 후기 | `src/data/reviews.yaml` |
| 강의 자료·블로그 글 | `src/content/posts/*.md` |
| 강사 그림, 활동 그림 | `public/images/` |

일정 한 칸은 이렇게 생겼습니다.

```yaml
- id: 2026-winter-meetup
  example: false
  title: 겨울 모임
  kind: 모임          # 모임 또는 강의
  date: 2026-12-06    # 연-월-일
  time: 14:00–16:30
  place: 서울 구로
  mode: 오프라인      # 온라인, 오프라인, 온·오프라인
  status: upcoming    # upcoming(예정) 또는 past(종료)
  summary: 한 줄 소개
```

`example: true`이면 카드에 예시 배지가 붙습니다. 실제 내용이면 `false`로 바꿉니다.

블로그 글은 `src/content/posts/`에 마크다운 파일을 새로 만들면 됩니다. 파일 이름은 주소가 됩니다. 맨 위는 이렇게 적습니다.

```markdown
---
title: 글 제목
description: 목록에 보일 한 줄
date: 2026-12-01
tags:
  - 강의 자료
example: false
---

본문은 여기에 적습니다.
```

사진 파일은 `public/images/gallery/내사진.jpg`처럼 넣고, YAML의 `image`에는 `images/gallery/내사진.jpg`라고 적습니다. `public`은 주소에 포함하지 않습니다.

## 참가 신청과 문의 주소

참가 신청과 문의는 이 사이트가 저장하지 않습니다. Google Forms 같은 **무료 외부 폼** 주소만 연결합니다.

`src/data/site.yaml`

- `joinFormUrl`: 참가 신청 버튼
- `inquiryFormUrl`: 강의 의뢰, 제휴, 제품 소개, 강사 등록이 함께 쓰는 문의 폼
- `inquiryEmail`: 같은 문의용 메일
- `community`: 카카오톡, 인스타그램 같은 모임 링크

지금 들어 있는 주소는 `PLACEHOLDER`와 `example.com` 입니다. 공개 전에 실제 주소로 바꾸세요. 자리표시자인 동안 페이지에 “예시 주소” 안내가 보입니다.

## 문의는 AI 숲 한 곳

강의·제휴 문의는 AI 숲으로만 받습니다. 운영자가 문의를 보고 강사를 연결합니다.

그래서 강사와 파트너 데이터에는 아래를 넣지 않습니다.

- 메일, 전화번호
- 개인 SNS, 개인 사이트
- 강사마다 다는 “강의 요청” 버튼

문의 종류는 네 가지이며, 모두 같은 폼으로 갑니다.

- 강의 의뢰
- 제휴
- 제품 소개
- 강사 등록

이 규칙을 어기면 `npm run check`와 사이트 빌드가 실패합니다. 제품 카드에 링크를 넣고 싶어도, 방문자가 회사를 직접 부르게 두지 않는 것이 이 시안의 기준입니다.

## 메뉴

홈의 두 축은 모임과 강의입니다. 위쪽 메뉴는 소개, 모임, 강의, 활동, 자료, 파트너이고, 오른쪽에 참가 신청과 강조된 강의·제휴 문의가 있습니다.

| 메뉴 | 담는 내용 | 주소 |
| --- | --- | --- |
| 소개 | 모임 소개, 구성, 만나는 곳 | `/about` |
| 모임 | 모임 일정. 지난 사진과 후기는 활동 | `/meetups`, 사진은 `/gallery` |
| 강의 | 강의 프로그램과 강사 | `/lectures`, 강사 상세는 `/instructors` |
| 활동 | 지난 모임 사진과 후기 | `/gallery` |
| 자료 | 강의 자료·블로그 | `/blog` |
| 파트너 | 파트너 이름과 제품 소개 | `/partners` |
| 참가 신청 | 외부 참가 폼 | `/join` |
| 강의·제휴 문의 | 강의 의뢰, 제휴, 제품 소개, 강사 등록. 모두 같은 폼 | `/contact` |
| 전체 일정 | 모임과 강의를 한 목록으로. 위 메뉴에는 없고 홈과 바닥에서 이어집니다. | `/schedule` |

지난 모임 사진은 `src/data/gallery.yaml`에 항목을 추가하면 홈과 활동 페이지에 같이 늘어납니다. 홈은 가장 최근 세 장만 보여 줍니다. 일정은 `src/data/events.yaml`의 `kind`가 `모임` 또는 `강의`입니다.

## 첫 화면의 나무

첫 화면의 큰 나무는 3D 모델입니다. 유럽 너도밤나무이고, 줄기와 가지, 겹친 잎이 있습니다. 뒤쪽에는 같은 나무를 작게 두어 숲의 깊이를 만듭니다. 조명은 밝은 크림색 배경에 맞춥니다.

- 출처: [tevy · European Beech](https://tevy.dev/models/european-beech) v1
- 파일: `public/models/european-beech.glb` (원본 `https://tevy.dev/models/european-beech/v1/lod0.glb`)
- 라이선스: [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/). 출처 표기는 필수가 아닙니다.
- 파일 안의 출처 메모: `public/models/SOURCE.txt`

모델은 이미 meshopt과 KTX2로 압축되어 있습니다. 데스크톱에서는 장면을 늦게 불러오고, 픽셀 비율은 1.5를 넘기지 않습니다. 화면 밖으로 나가거나 탭이 가려지면 멈춥니다. 바람은 모델의 `_WIND` 값으로 가지와 잎만 살짝 움직이고, 카메라는 천천히 흔들리며 마우스에 조금 반응합니다.

휴대폰, 데이터 절약, 메모리가 2GB 이하로 표시되는 환경, 움직임 줄이기에서는 3D를 켜지 않고 `public/images/hero-tree.png` 정지 화면을 보여 줍니다. 그 이미지는 같은 나무를 같은 조명으로 미리 그린 것입니다.

## GitHub Pages에 올리기

1. 이 저장소를 GitHub에 둡니다. 저장소 이름은 `ai-soop` 이어야 주소가 아래와 같습니다.
2. GitHub 저장소 **Settings → Pages → Build and deployment → Source** 를 **GitHub Actions** 로 선택합니다.
3. `main` 브랜치에 코드를 푸시합니다.
4. **Actions** 탭에서 “GitHub Pages” 워크플로가 끝날 때까지 기다립니다.
5. 사이트 주소는 `https://chegom.github.io/ai-soop/` 입니다.

워크플로는 `main`에 푸시될 때만 배포합니다. 풀 리퀘스트에서는 빌드와 콘텐츠 검사만 합니다.

로컬 `npm run dev`의 주소는 `/` 입니다. GitHub Pages 빌드만 `/ai-soop/` 아래에 맞춥니다. 워크플로가 `GITHUB_PAGES=true`로 빌드하기 때문에, 저장소 페이지에서도 링크가 맞습니다.

시안 배너를 지울 때는 `src/data/site.yaml`의 `showDraftBanner`를 `false`로 바꿉니다.
