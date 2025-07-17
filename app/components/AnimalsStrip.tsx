/* app/components/VacationStrip.tsx
   Server Component – can use fs/path
*/

import Image from 'next/image';

interface AnimalsStripProps {
  images: string[];
}

export default function AnimalsStrip({ images }: AnimalsStripProps) {
  return (
    <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 bg-blue-900/100 w-150 items-center p-4 rounded-lg border-3 border-blue-500/100">
      {images.map((file) => (
        <div key={file} className="snap-center shrink-0 ">
          <Image
            src={`/desert-animals/${file}`}
            alt={file}
            width={300}
            height={100}
            className="object-cover rounded-lg drop-shadow-cyan-300/100 drop-shadow-xl/100"
            priority
          />
        </div>
      ))}
    </div>
  );
}