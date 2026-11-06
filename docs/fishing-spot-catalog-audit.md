# Fishing spot catalog: baseline and improvement backlog

Audit date: 2026-10-24

This document records the current catalog baseline and a practical sequence for growing BiteMap toward a useful fishing-location discovery service. It is an audit and implementation plan, not a claim that all listed capabilities are already implemented.

## Current baseline

- The curated catalog is a static array of **14 locations** in `src/entities/fishing-spot/model/spot-data.ts`, including Rusanivskyi Canal and five Dnipro River/cascade locations. New entries with uncertain access or species details are explicitly left unverified.
- Public community locations are loaded separately and combined with curated locations in `src/views/spots/ui/spots-page.tsx`.
- The catalog supports text search, region, water type, and fish filters. Filter state is reflected in the URL.
- The catalog has access-category filtering and sorting (default/name/updated) and settlement search. There is no price range or distance/radius search yet.
- Curated records include name, slug, coordinates, region, water type, fish, description, access text, tone, and English translations.
- Curated records now carry `accessCategory`, `verificationStatus`, optional `sourceUrl`, optional `settlement` (only where certain), `updatedAt` (date the record was last edited) and `verifiedAt` (only when facts were actually checked; currently none). Price/currency fields are still missing.
- User-submitted records have region/community/settlement IDs and optional coordinates, but catalog and community data do not yet share one full normalized schema.
- Spot pages show a map/location panel, weather, fish list, community photo gallery, and reports. Location truth and access details are not presented with provenance/freshness information.

## Minimum data standard for a public location

### Required to publish

- Stable ID and URL slug; localized display name.
- Valid latitude/longitude, validated against Ukraine bounds and shown on a map.
- Water type from a controlled vocabulary: river, lake, pond, reservoir, canal, estuary/lagoon, other.
- Administrative location: oblast and settlement (community optional where boundary data is unavailable).
- Access category: free, paid, restricted/closed, or unknown. Do not infer “free” from missing price/details.
- A concise factual description; fish species are optional unless sourced or community-reported.
- Provenance: who/what supplied the record and when it was last updated.
- Publication/moderation state and a clear way to report incorrect or outdated information.

### Optional, but strongly useful when verified

- Paid access: price, currency, pricing unit (per person/day/rod/etc.), what it includes, contact/booking link, and date checked.
- Access notes: shore/boat, vehicle access, parking, opening hours, restrictions, facilities, seasonal closures.
- Photos with author/source, caption, and moderation state.
- Species list with evidence/source and last-confirmed date.
- Link to official rules or owner’s current terms where applicable.
- `verifiedAt`, `updatedAt`, and a visible freshness label derived from those timestamps.

Never show missing or unverified values as authoritative facts. In particular, legal fishing rules and paid-access prices need a source and a checked-on date.

## Prioritized backlog

### P0 — Trustworthy catalog records

1. Introduce structured fields for access category, settlement/community, provenance, and freshness; migrate current curated and community records without breaking existing documents.
2. Validate coordinates, controlled water-type values, and required publication fields at submission/moderation time.
3. Show access status and “information checked”/“not verified” indicators on cards and detail pages; provide a report-correction action.
4. Continue reviewing all 14 curated records for coordinate/name/description/species correctness before expanding them further.

### P1 — Useful discovery

1. Add access-category filtering (free/paid/unknown) and stable sorting (name, newest/updated, distance when user explicitly enables location).
2. Keep filters shareable in the URL and add tests for combinations, reset, and invalid query values.
3. Add settlement search and region/settlement context in result cards.
4. Improve map results for missing coordinates and provide a clear list/map view toggle on small screens.

### P2 — Location detail completeness

1. Add structured paid-access details and source/freshness labels.
2. Add verified photos and field-level contribution flow (suggest an edit rather than submitting a duplicate place).
3. Show reports and fish observations with dates; distinguish community observations from verified species data.

### P3 — Coverage and organic discovery

1. Expand location coverage region-by-region using vetted/importable datasets with attribution and deduplication.
2. Add useful region/settlement landing pages only when they have enough unique, maintained information; avoid thin pages generated solely for SEO.
3. Add species/season/rules guides with reliable sources and review dates.

## First implementation slice

Start with P0 items 1–3 and P1 item 1. Keep the initial schema migration backward-compatible, retain unknown access as an explicit state, and add unit/rules/E2E coverage for publication validation and the new access filter. Do not bulk-import a large external dataset until its license, attribution requirements, coordinate quality, and duplicate-matching approach are confirmed.

## External product reference

FishMap.in.ua currently presents an all-Ukraine catalog with access, water-type, and region filters, plus catch reports and broader fishing references. BiteMap should learn from that discovery structure while differentiating itself through transparent data freshness, safer provenance, and a clean contribution workflow rather than copying features without the data and maintenance needed to support them.

## Photo and Rusanivskyi Canal slice

The catalogue now includes Rusanivskyi Canal and locally stored photographs for records with a matching open-license image. Photo credits and license links appear beside the images and are also listed in `public/images/fishing-spots/ATTRIBUTION.md`. Blue Lake near Pidhirtsi remains without a photo because the located images did not have a confirmed reuse license. Fish lists and access conditions remain marked as unverified unless supported by an authoritative source.

## Structured catalog slice (2026-11-06)

- Added `settlement`, `updatedAt`, `verifiedAt` to curated records; cards show access category, verification state and last-updated date.
- Added `validateFishingSpot` (Ukraine bounds, required fields, ISO dates, source required for any stated access category or verified status) with a unit test over the whole catalog (`npm test`).
- Added the shared `isWithinUkraine` bounds check and applied it to the user-spot form, so swapped latitude/longitude is rejected before publishing.
- Still open: structured price data, correction-report flow, settlement/community data for the remaining curated records, Firestore rules enforcing the same bounds server-side.
