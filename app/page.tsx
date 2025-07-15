import AnimalsStrip from './components/AnimalsStrip';
import ScrollImage from './components/ScrollImage';
import UploadForm from './components/UploadForm';
import { promises as fs } from 'fs';
import path from 'path';


// Server component: fetch images from /public/vacation
async function getVacationImages() {
  const vacationDir = path.join(process.cwd(), 'public', 'desert-animals');
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
      <div className="min-h-screen sm:p-0 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-[32px] items-center sm:items-start w-full mt-50">
          <div className="flex flex-col items-center sm:items-start bg-blue-100/10 w-full mt-10">
            <p className="text-[100px] font-bitcount text-center w-full bg-indigo-100/10">Welcome</p>
            <p className="text-[40px] font-bitcount text-center w-full bg-yellow-100/20">to</p>
            <div className="flex items-center justify-center w-full">
              <div className="flex text-center bg-purple-100/20">
                <p className="text-[20px] font-bitcount text-center bg-red-200/40">lil</p>
                <p className="text-[50px] font-bitcount text-center bg-green-100/20 mr-6">Desert</p>
              </div>
              <p className="text-[50px] font-bitcount bg-green-100/20 whitespace-nowrap">Animals Classifier!</p>
            </div>
          </div>
          <div className="w-full bg-gray-100/10 gap-4 h-40 absolute top-130 ">
            <ScrollImage />
          </div>
        </main>
        <div className='text-center w-full pt-40 font-mono'>
          <div>where you can upload your own image</div>
          <div>OR</div>
          <div>choose from the images we have provided</div>
        </div>
        <div className="w-full justify-center flex">
          <AnimalsStrip images={images}/>
        </div>
        <div className='bg-pink-100/20 w-full flex justify-center items-center p-4'>
          <UploadForm />
        </div>
        
        <article className="prose mx-auto my-32">
          {[...Array(10)].map((_, i) => (
            <p key={i}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam
              recusandae quia consequuntur vel, nemo doloribus doloremque maxime
              impedit laudantium repudiandae sed quaerat aliquid reprehenderit at
              suscipit a beatae fugit aut.
            </p>
          ))}
        </article>
      </div>
    );
  }
