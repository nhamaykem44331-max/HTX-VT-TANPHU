import { getAwards } from "@/lib/data-service";
import AwardsSectionClient from "./AwardsSectionClient";

export default async function AwardsSection() {
  const awards = await getAwards();
  return <AwardsSectionClient awards={awards} />
}
