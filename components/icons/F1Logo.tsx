
import React from 'react';

/**
 * Renders the official Formula 1 logo (introduced in 2017) as an SVG component.
 */
export const F1Logo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 812 281"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M 225.16,134.14 H 296.95 V 110.4 C 270.78,76.34 270.78,52.91 270.78,13.75 V 0 H 156.36 v 101.9 h 68.8 v 32.24 z M 301.76,75.89 h 54.92 v 26.17 h -54.92 z M 361.61,49.74 h 54.92 v 84.4 h -54.92 z M 421.36,75.89 h 66.21 v 58.25 h -66.21 z M 784.79,134.14 724.51,0 H 889 v 49.74 H 784.79 v 26.17 H 900 V 125.65 H 784.79 v 8.49 z"
      fill="currentColor"
    />
  </svg>
);
