
/**
 * Animation utility functions for smooth transitions and effects
 */

// Function to apply staggered animations to children of a container
export const staggerChildren = (
  containerSelector: string, 
  childSelector: string,
  baseDelay: number = 0.1,
  baseClass: string = "animate-fade-in"
) => {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  
  const children = container.querySelectorAll(childSelector);
  
  children.forEach((child, index) => {
    const delay = baseDelay * index;
    (child as HTMLElement).style.animationDelay = `${delay}s`;
    (child as HTMLElement).style.animationFillMode = "forwards";
    (child as HTMLElement).classList.add(baseClass);
  });
};

// Function to trigger animations when element is in viewport
export const animateOnScroll = (
  selector: string, 
  animationClass: string = "animate-fade-in"
) => {
  const elements = document.querySelectorAll(selector);
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add(animationClass);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  elements.forEach(element => {
    observer.observe(element);
  });
};

// Function to apply loading state animations
export const applyLoadingAnimation = (
  element: HTMLElement, 
  isLoading: boolean
) => {
  if (isLoading) {
    element.classList.add("animate-pulse-slow");
  } else {
    element.classList.remove("animate-pulse-slow");
  }
};

// Parallax scrolling effect
export const createParallaxEffect = (
  selector: string, 
  speedFactor: number = 0.5
) => {
  const elements = document.querySelectorAll(selector);
  
  const handleScroll = () => {
    const scrollY = window.scrollY;
    
    elements.forEach((element) => {
      const y = scrollY * speedFactor;
      (element as HTMLElement).style.transform = `translateY(${y}px)`;
    });
  };
  
  window.addEventListener("scroll", handleScroll);
  
  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
};

// Apply floating animation with random parameters
export const applyFloatingAnimation = (selector: string) => {
  const elements = document.querySelectorAll(selector);
  
  elements.forEach((element, index) => {
    const delay = (Math.random() * 2).toFixed(1);
    const duration = (3 + Math.random() * 2).toFixed(1);
    
    (element as HTMLElement).style.animationDelay = `${delay}s`;
    (element as HTMLElement).style.animationDuration = `${duration}s`;
    (element as HTMLElement).classList.add("animate-float");
  });
};
