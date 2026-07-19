# Markdownist

Markdown을 바로 인쇄할 수 있는 웹 서비스 MVP입니다.

## 기능

- 왼쪽 미리보기 / 오른쪽 Monaco Markdown 편집기
- 상단 파일명 입력과 인쇄 버튼
- 인쇄 테마 프리셋: Classic / Clean / Compact / Report / Academic / Memo / Resume / Blog (미리보기·PDF 동일)
- `react-markdown` + GFM (표, 체크리스트, 취소선)
- 단독 줄 `<!-- pagebreak -->`로 명시적 페이지 나누기
- `@media print`로 미리보기만 A4 다중 페이지 인쇄
- `localStorage`에 초안·글자 크기·인쇄 테마 자동 저장

## 실행

```bash
npm install
npm run dev
```

## 검증

```bash
npm test
npm run lint
npm run build
```

인쇄는 브라우저의 인쇄 대화상자(권장: Chromium)에서 PDF로 저장하면 됩니다.
