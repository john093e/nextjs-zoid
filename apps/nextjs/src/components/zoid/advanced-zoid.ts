/* eslint-disable no-restricted-properties */
import zoid from 'zoid';

// Handle Local and Production URLs
const isProduction = process.env.NODE_ENV === 'production';
const BASE_URL = isProduction ? "https://nextjs-zoid.vercel.app"  : "http://localhost:3000";

const AdvancedZoid = zoid.create({
  tag: 'advanced-zoid',
  // Dynamic URL
  url: () => {
    try {
        const scriptSrc = document.getElementById('widget-id')?.getAttribute('src')
        if(!scriptSrc) {
            throw new Error('No script source found')
        }
        return `${new URL(scriptSrc).origin}/zoid-advanced`
    } catch {
        return BASE_URL
    }
  },
  dimensions: {
    width: '100%',
    height: '100%'
  },
  props: {
    buttonTxt: {
      type: 'string',
      required: true
    },
    onConfetti: {
      type: 'function',
      required: true
    },
  }
});

// Attach to the global scope
export default AdvancedZoid;
