import { HomePageClient } from "@/components/home-page-client";
import { getHomepageRestaurants } from "@/lib/restaurants";

export default async function HomePage() {
  const { restaurants, source } = await getHomepageRestaurants();

  return <HomePageClient initialRestaurants={restaurants} dataSource={source} />;
}
