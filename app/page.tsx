import AnimalsStrip from "./components/AnimalsStrip";
import ScrollImage from "./components/ScrollImage";
// import { UploadForm } from "./components/UploadForm";
import { promises as fs } from "fs";
import { rm } from "fs/promises";
import path from "path";
import { ClientSide } from "./ClientSide";

// Server component: fetch images from /public/vacation
async function getVacationImages() {
  const vacationDir = path.join(process.cwd(), "public", "desert-animals");
  try {
    const files = await fs.readdir(vacationDir);

    return files.filter((f) => /\.(jpe?g|png|webp|gif)$/i.test(f));
  } catch {
    return [];
  }
}

async function getUploadedImage() {
  const uploadedImagePath = path.join(process.cwd(), "public", "uploads");
  try {
    // 1. Read directory entries
    const files = await fs.readdir(uploadedImagePath);

    // 2. Pick the first one that looks like an image
    const imageFile = files.find((f) => /\.(png|jpe?g|gif|webp|svg)$/i.test(f));

    // 3. Return a public-URL path the browser can request
    return imageFile ? `public/uploads/${imageFile}` : null;
  } catch (err) {
    // Directory does not exist or is not readable
    return null;
  }
}


export default async function Home() {
  const images = await getVacationImages();

  // const [lastUrl, setLastUrl] = useState<string | null>(null);
  // const [prediction,  setPrediction]  = useState<{
  //   label: string;
  //   confidences: { label: string; confidence: number }[];
  // } | null>(null);


  // if (lastUrl) {
  //   const uploadedImage = await getUploadedImage();
  //   const space = await Client.connect(
  //     "staciabenita/desert-animals-classifier"
  //   );
  //   const localPath = await path.join(
  //     process.cwd(),
  //     "public",
  //     "uploads",
  //     "img.jpg"
  //   );
  //   const result = await space.predict("/predict", [handle_file(localPath)]); //uploadedImage

  //   // extracting the result from the prediction
  //   const items = result.data;
  //   const top = items[0];
  //   const label = top.label;
  //   const confidences = top.confidences;
  //   console.log("Classification result:", label, confidences);
  // }
  return (
    <div className="min-h-screen sm:p-0 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] items-center sm:items-start w-full mt-50">
        <div className="flex flex-col items-center sm:items-start bg-blue-100/10 w-full mt-10">
          <p className="text-[100px] bitcount-grid-double-title text-center w-full bg-indigo-100/10">
            Welcome
          </p>
          <p className="text-[40px] bitcount-grid-double-title text-center w-full bg-yellow-100/20">
            to
          </p>
          <div className="flex items-center justify-center w-full">
            <div className="flex text-center bg-purple-100/20">
              <p className="text-[20px] bitcount-grid-double-title text-center bg-red-200/40">
                lil
              </p>
              <p className="text-[50px] bitcount-grid-double-title text-center bg-green-100/20 mr-6">
                Desert
              </p>
            </div>
            <p className="text-[50px] bitcount-grid-double-title bg-green-100/20 whitespace-nowrap">
              Animals Classifier!
            </p>
          </div>
        </div>
        <div className="w-full bg-blue-100/10 gap-4 h-40 absolute top-130 ">
          <ScrollImage />
        </div>
      </main>
      <div className="text-center w-full pt-40 font-mono">
        <div>where you can upload your own image</div>
        <div>OR</div>
        <div>choose from the images we have provided</div>
      </div>
      <div className="flex flex-col w-full justify-center flex my-10 items-center ">
        <div className="text-[30px] bitcount-grid-double-title text-center w-full pr-100 text-blue-600">
          Photo Album:
        </div>
        <AnimalsStrip images={images} />
      </div>

      <ClientSide />
    </div>
  );
}
