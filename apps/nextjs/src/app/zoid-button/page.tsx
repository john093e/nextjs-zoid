import Script from "next/script";
import Button from "./_components/button";

const ButtonPage = () => {

  return (
    <>
      <Script src="/api/widgets/button"  />
      <Button />
    </>
  );
};

export default ButtonPage;
