/** Mobile slider breakpoint — below this width shows 1 card per slide. */
export const SERVICE_SLIDER_MOBILE_MAX = 767;

export function buildServiceSlides<T>(services: T[], isMobileSlider: boolean): T[][] {
  if (isMobileSlider) {
    return services.map((service) => [service]);
  }

  const slides: T[][] = [];
  for (let i = 0; i < services.length; i += 3) {
    slides.push(services.slice(i, i + 3));
  }
  return slides;
}
