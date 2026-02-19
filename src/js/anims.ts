class Butterfly {
    element: NodeListOf<Element>;
  
    constructor(selector: string) {
      this.element = document.querySelectorAll(selector) as NodeListOf<Element>;
    }
  
    fadeIn(duration = 1000, delay = 0) {
        this.element.forEach(el => {
          setTimeout(() => {
            if(el instanceof HTMLElement){
                el.style.transition = `opacity ${duration}ms`;
                el.style.opacity = "1";
            }
          }, delay);
        });
    }
  }
  
  (window as any).Butterfly = Butterfly;
