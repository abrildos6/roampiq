

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.



## 포트폴리오 사진 추가 규칙

`public/images/`에 새 사진이 추가되면 `lib/portfolio-data.ts`에 자동으로 항목을 등록한다. 확인 질문 없이 바로 추가할 것.

- **id**: 기존 마지막 id + 1
- **aspectRatio**: `sips -g pixelWidth -g pixelHeight <파일>` 로 실제 픽셀 크기 확인 후 결정
  - 가로 > 세로 → `landscape`
  - 세로 > 가로 → `portrait`
  - 동일 → `square`
- **year**: `sips -g creation <파일>` 로 파일 생성일 확인해서 해당 연도 사용
- **category**: 파일명 prefix로 추론
  - `ros-` → `rostro`
  - `ord-` → `ordinary`
  - `ath-` → `athletic`
  - `mot-` → `motion piq`
- **title**: 같은 카테고리 내 마지막 항목의 로마숫자 + 1 (예: `Ordinary I` 다음은 `Ordinary II`)
- **images**: `-main`, `-sub1`, `-sub2`, ... 순으로 존재하는 파일 모두 포함
- **thumbnail**: `-main` 파일
- **description**: 빈 문자열 `""`
- **type**: `"image"`

