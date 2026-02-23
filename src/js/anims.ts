function scrollTrigger(
  elements: NodeListOf<HTMLElement> | HTMLElement[],
  callback: (el: HTMLElement) => void,
  options: IntersectionObserverInit = {},
  once = true
) {
  const els = Array.isArray(elements) ? elements : Array.from(elements);

  els.forEach(el => {
    if ((el as any)._animated) return; // prevent retrigger if once=true

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback(el);
          if (once) {
            (el as any)._animated = true;
            obs.unobserve(el);
          }
        }
      });
    }, options);

    observer.observe(el);
  });
}

class Butterfly {
  element: NodeListOf<Element>;

  constructor(selector: string) {
    this.element = document.querySelectorAll(selector) as NodeListOf<Element>;
  }

  left(distance: number, duration = 1000, delay = 0, threshold = 0.1) {
    scrollTrigger(
      this.element as NodeListOf<HTMLElement>,
      el => {
        setTimeout(() => {
          el.style.willChange = "transform";
          el.style.transition = `transform ${duration}ms ease`;
          el.style.transform = `translateX(-${distance}px)`;
        }, delay);
      },
      { threshold }
    );
  }

  right(distance: number, duration = 1000, delay = 0, threshold = 0.1) {
    scrollTrigger(
      this.element as NodeListOf<HTMLElement>,
      el => {
        setTimeout(() => {
          el.style.willChange = "transform";
          el.style.transition = `transform ${duration}ms ease`;
          el.style.transform = `translateX(${distance}px)`;
        }, delay);
      },
      { threshold }
    );
  }

  top(distance: number, duration = 1000, delay = 0, threshold = 0.1) {
    scrollTrigger(
      this.element as NodeListOf<HTMLElement>,
      el => {
        setTimeout(() => {
          el.style.willChange = "transform";
          el.style.transition = `transform ${duration}ms ease`;
          el.style.transform = `translateY(-${distance}px)`;
        }, delay);
      },
      { threshold }
    );
  }

  bottom(distance: number, duration = 1000, delay = 0, threshold = 0.1) {
    scrollTrigger(
      this.element as NodeListOf<HTMLElement>,
      el => {
        setTimeout(() => {
          el.style.willChange = "transform";
          el.style.transition = `transform ${duration}ms ease`;
          el.style.transform = `translateY(${distance}px)`;
        }, delay);
      },
      { threshold }
    );
  }

  scale(value: number, duration = 1000, delay = 0, threshold = 0.1) {
    scrollTrigger(
      this.element as NodeListOf<HTMLElement>,
      el => {
        setTimeout(() => {
          el.style.willChange = "transform";
          el.style.transition = `transform ${duration}ms ease`;
          el.style.transform = `scale(${value})`;
        }, delay);
      },
      { threshold }
    );
  }

  fadeIn(duration = 1000, delay = 0, threshold = 0.1) {
    scrollTrigger(
      this.element as NodeListOf<HTMLElement>,
      el => {
        setTimeout(() => {
          el.style.transition = `opacity ${duration}ms ease`;
          el.style.opacity = "1";
        }, delay);
      },
      { threshold }
    );
  }

  fadeInLeft(distance = 50, duration = 1000, delay = 0, threshold = 0.1) {
    this.element.forEach(el => {
      if (!(el instanceof HTMLElement)) return;
      el.style.opacity = "0";
      el.style.transform = `translateX(-${distance}px)`;

      scrollTrigger(
        [el],
        () => {
          setTimeout(() => {
            el.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
            el.style.opacity = "1";
            el.style.transform = `translateX(0)`;
          }, delay);
        },
        { threshold }
      );
    });
  }

  // Fade in from right
  fadeInRight(distance = 50, duration = 1000, delay = 0, threshold = 0.1) {
    this.element.forEach(el => {
      if (!(el instanceof HTMLElement)) return;
      el.style.opacity = "0";
      el.style.transform = `translateX(${distance}px)`;

      scrollTrigger(
        [el],
        () => {
          setTimeout(() => {
            el.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
            el.style.opacity = "1";
            el.style.transform = `translateX(0)`;
          }, delay);
        },
        { threshold }
      );
    });
  }

  // Fade in from top
  fadeInTop(distance = 50, duration = 1000, delay = 0, threshold = 0.1) {
    this.element.forEach(el => {
      if (!(el instanceof HTMLElement)) return;
      el.style.opacity = "0";
      el.style.transform = `translateY(-${distance}px)`;

      scrollTrigger(
        [el],
        () => {
          setTimeout(() => {
            el.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
            el.style.opacity = "1";
            el.style.transform = `translateY(0)`;
          }, delay);
        },
        { threshold }
      );
    });
  }

  // Fade in from bottom
  fadeInBottom(distance = 50, duration = 1000, delay = 0, threshold = 0.1) {
    this.element.forEach(el => {
      if (!(el instanceof HTMLElement)) return;
      el.style.opacity = "0";
      el.style.transform = `translateY(${distance}px)`;

      scrollTrigger(
        [el],
        () => {
          setTimeout(() => {
            el.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
            el.style.opacity = "1";
            el.style.transform = `translateY(0)`;
          }, delay);
        },
        { threshold }
      );
    });
  }


  fadeOut(duration = 1000, delay = 0, threshold = 0.1) {
    scrollTrigger(
      this.element as NodeListOf<HTMLElement>,
      el => {
        setTimeout(() => {
          el.style.transition = `opacity ${duration}ms ease`;
          el.style.opacity = "0";
        }, delay);
      },
      { threshold }
    );
  }

  fadeOutLeft(distance = 50, duration = 1000, delay = 0, threshold = 0.1) {
    this.element.forEach(el => {
      if (!(el instanceof HTMLElement)) return;
      el.style.opacity = "1";
      el.style.transform = `translateX(-${distance}px)`;

      scrollTrigger(
        [el],
        () => {
          setTimeout(() => {
            el.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
            el.style.opacity = "0";
            el.style.transform = `translateY(0)`;
          }, delay);
        },
        { threshold }
      );
    });
  }

  fadeOutRight(distance = 50, duration = 1000, delay = 0, threshold = 0.1) {
    this.element.forEach(el => {
      if (!(el instanceof HTMLElement)) return;
      el.style.opacity = "1";
      el.style.transform = `translateX(${distance}px)`;

      scrollTrigger(
        [el],
        () => {
          setTimeout(() => {
            el.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
            el.style.opacity = "0";
            el.style.transform = `translateY(0)`;
          }, delay);
        },
        { threshold }
      );
    });
  }
}
(window as any).Butterfly = Butterfly;
