import { AlertCircle } from "lucide-react";
import { useState } from "react";

interface ResponsiveVideoProps {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
}

export default function ResponsiveVideo({
  src,
  poster,
  className = "",
  autoPlay = true,
  loop = true,
  muted = true,
  controls = false,
}: ResponsiveVideoProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-muted ${className}`}>
        <div className="text-center p-6">
          <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Video failed to load</p>
        </div>
      </div>
    );
  }

  return (
    <video
      src={src}
      poster={poster}
      className={`w-full h-full object-cover ${className}`}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      controls={controls}
      playsInline
      onError={() => setHasError(true)}
    >
      <p className="text-sm text-muted-foreground">
        Your browser does not support the video tag.
      </p>
    </video>
  );
}
