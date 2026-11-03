# Production lab measurements

Measured 2026-11-03 with Lighthouse 13.6.0, headless Chrome, local Next production builds, and the real remote WordPress origin. Mobile used the default mobile profile; desktop used the desktop preset. Each baseline/final pair below is a single run. Mobile/desktop runs were launched together. These are lab samples, not field CWV or percentile guarantees. The final showcase reader was checked to return ten real records before its run.

All cells show **before -> after**.

| Route / device | Performance | Accessibility | Best practices | SEO |
| --- | ---: | ---: | ---: | ---: |
| Home / mobile | 75 -> 97 | 83 -> 87 | 96 -> 96 | 100 -> 100 |
| Home / desktop | 96 -> 100 | 82 -> 86 | 96 -> 96 | 100 -> 100 |
| Showcase / mobile | 77 -> 99 | 91 -> 94 | 96 -> 96 | 100 -> 100 |
| Showcase / desktop | 100 -> 100 | 88 -> 91 | 96 -> 96 | 100 -> 100 |

| Route / device | LCP (s) | CLS | TTFB (ms) | TBT (ms) |
| --- | ---: | ---: | ---: | ---: |
| Home / mobile | 5.59 -> 1.22 | 0.00041 -> 0.00136 | 69 -> 9 | 184 -> 100 |
| Home / desktop | 1.37 -> 0.35 | 0.00548 -> 0.00060 | 21 -> 48 | 19 -> 0 |
| Showcase / mobile | 5.44 -> 1.22 | 0.00960 -> 0.01565 | 12 -> 13 | 201 -> 94 |
| Showcase / desktop | 0.36 -> 0.33 | 0.00017 -> 0.00300 | 36 -> 3 | 0 -> 0 |

LCP improved in these runs. CLS increased slightly on some routes after font swapping and streaming; all sampled values remain below 0.1. TBT is a lab responsiveness proxy and **is not INP**. Field INP was not measured.

| Route / device | Font transfer (KiB) | Script transfer (KiB) | Image transfer (KiB) | Total transfer (KiB) |
| --- | ---: | ---: | ---: | ---: |
| Home / mobile | 489.8 -> 438.1 | 198.9 -> 199.4 | 45.1 -> 45.0 | 838.6 -> 779.2 |
| Home / desktop | 599.7 -> 548.1 | 181.4 -> 199.4 | 173.9 -> 173.9 | 1059.9 -> 1015.6 |
| Showcase / mobile | 467.1 -> 415.5 | 182.6 -> 158.6 | 29.9 -> 29.9 | 773.6 -> 719.1 |
| Showcase / desktop | 599.7 -> 548.1 | 182.6 -> 158.6 | 637.0 -> 29.9 | 1513.4 -> 851.4 |

Image totals vary with lazy-loading/streaming timing and WordPress image-origin timeouts. The lower showcase image totals are **not claimed as an image optimization gain**. The same card sizing/quality is retained. Unknown-dimension process images still require WordPress metadata.

Font transfers fall after unused Geist fonts were removed. JavaScript transfer does not decrease on every route: the reusable cache/race/storage handling has a bundle cost. All emitted JS/CSS totals also include optional route chunks and are not equivalent to initial download size.

| All emitted chunks | Baseline gzip (bytes) | Final gzip (bytes) |
| --- | ---: | ---: |
| JavaScript | 258,412 | 261,592 |
| CSS | 23,631 | 23,044 |

The final real-data browser probe rendered ten cards with ten image elements.
After scrolling, the first four image elements had successfully loaded intrinsic
widths, and the gallery screenshot was visually inspected. Remaining images stay
lazy until approached. This separates a functioning image gallery from the
incomplete image transfers seen in some Lighthouse capture windows.

Remaining Lighthouse findings include existing color contrast/heading order issues and a prefetch to the unimplemented `/blog` link. No colors or destinations were changed to improve a score.

See [the audit and implementation report](./performance-audit.md) for build/test status, cache design, file list, operational limits, and WordPress setup. Raw JSON reports and test logs are in the ignored `.performance/` directory.
