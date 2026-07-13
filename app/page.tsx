import { HeroSection } from "@/components/home/HeroSection";
import { PopularSearches } from "@/components/home/PopularSearches";
import { LatestJobs } from "@/components/home/LatestJobs";
import { CareerPassportSection } from "@/components/home/CareerPassportSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { VerifiedEmployers } from "@/components/home/VerifiedEmployers";
import { ApplicationStatus } from "@/components/home/ApplicationStatus";
import { FeaturedCompanies } from "@/components/home/FeaturedCompanies";
import { RemoteAbroad } from "@/components/home/RemoteAbroad";
import { SalarySection } from "@/components/home/SalarySection";
import { EmployersSection } from "@/components/home/EmployersSection";
import { CareerCenterSection } from "@/components/home/CareerCenterSection";
import { Newsletter } from "@/components/home/Newsletter";

export default function Home() {
  return (
    <>
      <HeroSection />
      <PopularSearches />
      <LatestJobs />
      <CareerPassportSection />
      <HowItWorks />
      <VerifiedEmployers />
      <ApplicationStatus />
      <FeaturedCompanies />
      <RemoteAbroad />
      <SalarySection />
      <EmployersSection />
      <CareerCenterSection />
      <Newsletter />
    </>
  );
}
