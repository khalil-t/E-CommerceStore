// postcss.config.js (using ES Module syntax)
import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

export default {
  plugins: [
    tailwindcss,       // Add Tailwind CSS plugin
    autoprefixer,      // Add Autoprefixer
  ],
}

