import { headers } from "next/headers";
import { getSessionProfile } from "@/lib/auth/session";
import { getCandidateProfileFull } from "@/lib/data/db-candidate";
import { CareerPassportMarketing } from "@/components/career-passport/CareerPassportMarketing";
import { CareerPassportEditor } from "@/components/career-passport/CareerPassportEditor";

async function getOrigin() {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  const protocol = headerList.get("x-forwarded-proto") ?? "https";
  return `${protocol}://${host}`;
}

export default async function CareerPassportPage() {
  const profile = await getSessionProfile();

  if (!profile || profile.role !== "candidate") {
    return <CareerPassportMarketing />;
  }

  const data = await getCandidateProfileFull(profile.id);
  if (!data) return <CareerPassportMarketing />;

  const origin = await getOrigin();
  return <CareerPassportEditor data={data} origin={origin} />;
}
