/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
"use client"

import {useEffect, useState} from 'react'
import { Button as ShadButton } from '@acme/ui/button';
const Button = () => {
  const [xProps, setXProps] = useState<typeof window.xprops | undefined>(undefined);

  useEffect(() => {
    const checkForXProps = () => {
      if (window.xprops) {
        setXProps(window.xprops);
        window.xprops.onProps((props: unknown) => setXProps(props as typeof window.xprops));
      } else {
        setTimeout(checkForXProps, 100); // Check again in 100ms
      }
    };

    checkForXProps();
  }, []);

  if(!xProps){
    return (
      <ShadButton  className='w-full' >
        Loading...
      </ShadButton>
    )
  }

  return (
    <ShadButton onClick={() => xProps?.close()} className='w-full' >
      Close frame
    </ShadButton>
  )
}
export default Button