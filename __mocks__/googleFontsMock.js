/**
 * Mocked Google Fonts CSS responses for offline builds.
 * Used via NEXT_FONT_GOOGLE_MOCKED_RESPONSES env variable.
 * Each key is the exact Google Fonts API URL; each value is minimal CSS with @font-face.
 */

const latin =
  'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD';

// Geist variable font
const geistUrl =
  'https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap';
const geistCss = `
/* latin */
@font-face {
  font-family: 'Geist';
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
  src: url(https://fonts.gstatic.com/mock/geist.woff2) format('woff2');
  unicode-range: ${latin};
}
`;

// DM Serif Display — normal + italic at weight 400
const dmSerifUrl =
  'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital,wght@0,400;1,400&display=swap';
const dmSerifCss = `
/* latin */
@font-face {
  font-family: 'DM Serif Display';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/mock/dmserif-normal.woff2) format('woff2');
  unicode-range: ${latin};
}
/* latin italic */
@font-face {
  font-family: 'DM Serif Display';
  font-style: italic;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/mock/dmserif-italic.woff2) format('woff2');
  unicode-range: ${latin};
}
`;

// DM Mono — weights 400 and 500 (normal only by default)
const dmMonoUrl =
  'https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap';
const dmMonoCss = `
/* latin */
@font-face {
  font-family: 'DM Mono';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/mock/dmmono-400.woff2) format('woff2');
  unicode-range: ${latin};
}
/* latin */
@font-face {
  font-family: 'DM Mono';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/mock/dmmono-500.woff2) format('woff2');
  unicode-range: ${latin};
}
`;

// DM Sans — weights 300, 400, 500
const dmSansUrl =
  'https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap';
const dmSansCss = `
/* latin */
@font-face {
  font-family: 'DM Sans';
  font-style: normal;
  font-weight: 300;
  font-display: swap;
  src: url(https://fonts.gstatic.com/mock/dmsans-300.woff2) format('woff2');
  unicode-range: ${latin};
}
/* latin */
@font-face {
  font-family: 'DM Sans';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/mock/dmsans-400.woff2) format('woff2');
  unicode-range: ${latin};
}
/* latin */
@font-face {
  font-family: 'DM Sans';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/mock/dmsans-500.woff2) format('woff2');
  unicode-range: ${latin};
}
`;

module.exports = {
  [geistUrl]: geistCss,
  [dmSerifUrl]: dmSerifCss,
  [dmMonoUrl]: dmMonoCss,
  [dmSansUrl]: dmSansCss,
};
