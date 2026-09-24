import { getSpotFiltersFromSearchParams } from "@/features/filter-spots";
import { SpotsPage } from "@/views/spots";

export default async function Page(props: PageProps<"/spots">) {
  const searchParams = await props.searchParams;

  return <SpotsPage initialFilters={getSpotFiltersFromSearchParams(searchParams)} />;
}
