import { CanvasIllustration } from '@/shared/components/canvas-illustration';
import { Chip } from '@/shared/components/chip';
import { TriggerWithHelp } from '@/shared/components/trigger-with-help';

export function HeroSection() {
  return (
    <section className="flex w-full items-center justify-center gap-[16px] py-12">
      {/* Left content */}
      <div className="flex min-w-0 flex-[1_0_0] flex-col items-start gap-[22px]">
        {/* Chip + heading + body */}
        <div className="flex flex-col items-start gap-3 shrink-0">
          <Chip label="Uma solução" iconLeading="/icons/solar-lightbulb-bolt.svg" variant="outline-v1" size="md" />
          <h1 className="w-[450px] text-display-lg font-regular font-portfolio-title leading-[55px] text-alpha-black-100">
            Do problema à solução. Tornando simples, desafios complexos.
          </h1>
          <p className="w-[450px] text-md font-regular font-portfolio text-alpha-black-80">
            Um produto pode possuir inúmeras funcionalidades e possibilidades, mas, para quem está do outro lado, a
            experiência precisa ser clara e intuitiva. Encontrar uma forma simples de resolver um problema complexo é
            tão importante quanto a própria implementação da solução.
          </p>
        </div>

        <TriggerWithHelp
          label="Vamos trocar uma ideia"
          iconSrc="/icons/lucide-arrow-up-right.svg"
          helpIconSrc="/icons/solar-tea-cup.svg"
          href="/contact"
        />
      </div>

      {/* Right illustration rendered on canvas */}
      <div className="shrink-0 size-[520px]">
        <CanvasIllustration src="/illustrations/n123-idea.svg" width={520} height={520} />
      </div>
    </section>
  );
}
