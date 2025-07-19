import AnimalsStrip from "./components/AnimalsStrip";
import ScrollImage from "./components/ScrollImage";
import { promises as fs } from "fs";
import { rm } from "fs/promises";
import path from "path";
import { ClientSide } from "./ClientSide";
import { roboto, bitcountGridDouble, geistMono } from './fonts';

// Server component: fetch images from /public/desert-animals
async function getVacationImages() {
  const vacationDir = path.join(process.cwd(), "public", "desert-animals");
  try {
    const files = await fs.readdir(vacationDir);

    return files.filter((f) => /\.(jpe?g|png|webp|gif)$/i.test(f));
  } catch {
    return [];
  }
}

export default async function Home() {
  const images = await getVacationImages();

  return (
    <div className="
      min-h-screen
      bg-[url('/backgrounds/desert1.jpg')]
      bg-cover
      bg-center
      bg-no-repeat
    ">
      <main className="flex flex-col gap-[32px] items-center w-full pt-50">
        <div className="flex flex-col items-center sm:items-start w-full mt-10 
          text-blue-800 selection:text-yellow-100 font-extrabold
          drop-shadow-cyan-300/100 drop-shadow-xl/100"
        >
          <p className={`${bitcountGridDouble.className} text-[100px] text-center w-full`} >
            Welcome
          </p>
          <p className={`${bitcountGridDouble.className} text-[40px] text-center w-full`}>
            to
          </p>
          <div className="flex items-center justify-center w-full">
            <div className="flex text-center">
              <p className={`${bitcountGridDouble.className} text-[20px] text-center`}>
                lil
              </p>
              <p className={`${bitcountGridDouble.className} text-[50px] text-center mr-6`}>
                Desert
              </p>
            </div>
            <p className={`${bitcountGridDouble.className} text-[50px] whitespace-nowrap`}>
              Animals Classifier!
            </p>
          </div>
        </div>
        <div className="w-full gap-4 h-40 absolute top-130 ">
          <ScrollImage />
        </div>
      </main>
      <div className={`${geistMono.className} text-center text-blue-800 w-full pt-40 selection:text-yellow-100`}>
        <div>where you can upload your own image</div>
        <div>OR</div>
        <div>choose from the images we have provided</div>
      </div>
      <div className="flex flex-col w-full justify-center flex my-10 items-center ">
        <div className={`${bitcountGridDouble.className} text-[30px] text-center w-full pr-100 text-blue-600 font-extrabold selection:text-yellow-100`}>
          Photo Album:
        </div>
        <AnimalsStrip images={images} />
      </div>

      <ClientSide />
    </div>
  );
}
