/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
"use client"

import { Button } from '@acme/ui/button';
import Image from 'next/image';
import {useEffect, useRef, useState} from 'react'


const WebView = () => {
  // xProps state
  const [xProps, setXProps] = useState<typeof window.xprops | undefined>(undefined);

  // Effect to check for xProps
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



  // Handle loading xprops
  if(!xProps){
    return (
      <div>
        <h1>Loading ...</h1>
      </div>
    )
  }

  return (
    <section>
        <div className="grid max-w-screen-xl px-4 py-8 mx-auto md:gap-8 lg:gap-0 md:py-16 md:grid-cols-12">
            <div className="mr-auto place-self-center md:col-span-7">
                <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none sm:text-5xl lg:text-6xl dark:text-white">NextJs & Zoid</h1>
                <p className="max-w-2xl mb-6 font-light text-gray-500 md:mb-8 sm:text-lg md:text-xl dark:text-gray-400">From NextJs written in Typescript to Vanilla Html</p>

                <div className="flex gap-2" >
                  <Button onClick={() => xProps?.close()}>
                    Close frame
                  </Button>

                  <Button onClick={() => xProps?.onConfetti()}>
                    {xProps.buttonTxt}
                  </Button>
                </div>
            </div>
            <div className="hidden md:mt-0 md:col-span-5 md:flex">
                <Image 
                    width="200"
                    height="150"
                    className='cover w-full'
                    src="https://illustrations.popsy.co/gray/web-design.svg"
                    alt="mockup"
                />
            </div>                
        </div>
    </section>
  )
}
export default WebView