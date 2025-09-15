import SocialLinks from "@/components/SocialLinks";
import HeroTexts from "@/components/HeroTexts";
import HeroImage from "@/components/HeroImage";
import GithubBtn from "@/components/animation/GithubBtn";
import DownLoadResumeBtn from "@/components/DownLoadResumeBtn";
import FramerWrapper from "@/components/animation/FramerWrapper";

import Girl from "@/components/Girl";

export default function Home() {
  return (
    <>
      <section className="flex flex-col lg:flex-row items-stretch gap-6 w-full">
        {/* RIGHT (SVG) – lên trên ở mobile */}
        <FramerWrapper
          className="order-1 lg:order-2 w-full lg:w-[47%] relative block  items-center justify-center"
          y={0}
          x={100}
        >
          <Girl message="Hi!" autoHideMs={1400} bubble={{ x: 150, y: 38 }} />
        </FramerWrapper>

        {/* LEFT (text) – xuống dưới ở mobile */}
        <FramerWrapper
          className="order-2 lg:order-1 w-full lg:w-auto h-full flex flex-col justify-start gap-4"
          y={0}
          x={-100}
        >
          <HeroTexts />
          <div className="h-fit w-full p-4 flex gap-4">
            <SocialLinks />
          </div>
          <DownLoadResumeBtn />
        </FramerWrapper>
      </section>

      <GithubBtn />
    </>
  );
}
