import Script from "next/script";
import WebView from "./_components/web-view";

const ZoidAdvancedPage = () => {

  return (
    <>
      <Script src="/api/widgets/advanced-zoid"  />
      <WebView />
    </>
  );
};

export default ZoidAdvancedPage;
