/* eslint-disable no-restricted-properties */
import zoid from 'zoid';

// Handle Local and Production URLs
const isProduction = process.env.NODE_ENV === 'production';
const BASE_URL = isProduction ? "https://nextjs-zoid.vercel.app"  : "http://localhost:3000";

const Button = zoid.create({
  tag: 'button',
  // Dynamic URL
  url: () => {
    try {
        const scriptSrc = document.getElementById('widget-id')?.getAttribute('src')
        if(!scriptSrc) {
            throw new Error('No script source found')
        }
        return `${new URL(scriptSrc).origin}/zoid-button`
    } catch {
        return BASE_URL
    }
  },
  dimensions: {
    width: '120px',
    height: '0px'
  },
  autoResize: {
    width: false,
    height: true
  },
  props: {
    name: {
      type: 'string',
      required: false
    }
  }
});

// Attach to the global scope
export default Button;
