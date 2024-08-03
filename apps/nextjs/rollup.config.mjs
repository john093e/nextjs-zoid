import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import replace from '@rollup/plugin-replace';
import fs from 'fs';
import path from 'path';
// import { env } from '~/env';

const isProduction = process.env.NODE_ENV === 'production';

// Path to the directory containing the .ts files
const componentsDir = 'src/components/zoid';

// // Get all .ts files in the components directory
const files = fs.readdirSync(componentsDir).filter(file => file.endsWith('.ts'));


// Generate Rollup configuration for each .ts file
const rollupConfig = files.map(file => {
  const inputPath = path.join(componentsDir, file);
  const outputFileName = file.replace('.ts', '.js');

  return {
    input: inputPath,
    output: {
      file: `dist/${outputFileName}`, // Output directory and file name
      format: 'iife', // Format suitable for browsers
      name: path.basename(outputFileName, '.js')
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(''),
      sourcemap: !isProduction,
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
      }),      
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'process.env.ZOID_FRAME_ONLY': JSON.stringify(process.env.ZOID_FRAME_ONLY),
        'process': JSON.stringify(true),
        'process.env': JSON.stringify(process.env.NODE_ENV),
      }),
      isProduction && terser(),
    ].filter(Boolean),
    watch: {
      include: 'src/components/zoid/**',
      exclude: 'node_modules/**',
    },
  };
})

export default rollupConfig;

