# Search indexing switch

Search indexing is disabled by default for BiteMap.

The default state:

- sends `noindex, nofollow` in page metadata and the `X-Robots-Tag` response header;
- keeps routes crawlable so search engines can read the noindex directive;
- omits the sitemap URL from `robots.txt` and serves an empty sitemap.

When the public site is ready to be indexed, set `BITEMAP_SEARCH_INDEXING_ENABLED=true` in the build environment and rebuild/redeploy. This enables indexing metadata and restores the sitemap reference and URLs. Pages intentionally marked `noindex` (such as login, admin, and personal pages) remain excluded.

Changing this setting does not instantly remove URLs already indexed by search engines. They must revisit the affected URLs and process the updated directives. Do not add `Disallow: /` to `robots.txt` while relying on `noindex`, because blocked pages cannot be crawled to read that directive.
