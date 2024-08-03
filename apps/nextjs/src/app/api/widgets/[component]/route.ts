import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export function GET(
  request: Request,
  { params }: { params: { component: string } }
) {
  const component = params.component // 'a', 'b', or 'c'

  const allowedComponents = ['advanced-zoid', 'button']; // TODO: Change the following line with your own components zoid tag 

  if (!allowedComponents.includes(component)) {
    return new NextResponse('Invalid Component', { status: 400 });
  }

  try {
    // Construct the path to the component's JavaScript file
    const filePath = join(process.cwd(), 'dist', `${component}.js`);

    // Read the file content
    const file = readFileSync(filePath, 'utf8');

    // Return the file content with the appropriate Content-Type header
    return new NextResponse(file, {
      headers: {
        'Content-Type': 'application/javascript',
      },
    });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // If the file is not found, return a 404 response
    return new NextResponse('Component not found', { status: 404 });
  }
}