import type { Action } from 'svelte/action';

interface TiltOptions {
  maxAngle?: number;
}

export const tilt: Action<HTMLElement, TiltOptions | undefined> = (
  node,
  options = {},
) => {
  const maxAngle = options.maxAngle ?? 8;

  function onMouseMove(e: MouseEvent) {
    const rect = node.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    const rotY = dx * maxAngle;
    const rotX = -dy * maxAngle;
    node.style.transform = `perspective(800px) rotateY(${rotY}deg) rotateX(${rotX}deg)`;
  }

  function onMouseLeave() {
    node.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg)';
  }

  // Disable tilt on touch devices
  if (!window.matchMedia('(hover: none)').matches) {
    node.addEventListener('mousemove', onMouseMove);
    node.addEventListener('mouseleave', onMouseLeave);
  }

  return {
    destroy() {
      node.removeEventListener('mousemove', onMouseMove);
      node.removeEventListener('mouseleave', onMouseLeave);
    },
  };
};
