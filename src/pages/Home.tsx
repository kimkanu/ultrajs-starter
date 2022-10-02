import { tw } from "twind";
import type { FunctionComponent } from "react";

const HomePage: FunctionComponent = () => {
  return (
    <main className={tw`w-full h-full`}>
      <div className={tw`w-full h-full grid place-items-center`}>
        <h1>Home Page</h1>
      </div>
    </main>
  );
};

export default HomePage;
