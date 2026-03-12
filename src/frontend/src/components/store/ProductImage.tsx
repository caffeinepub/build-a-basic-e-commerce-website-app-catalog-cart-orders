import { useState } from "react";

interface ProductImageProps {
  productId: bigint;
  imageURL?: string;
  alt: string;
  className?: string;
}

export default function ProductImage({
  productId,
  imageURL,
  alt,
  className,
}: ProductImageProps) {
  const [imageError, setImageError] = useState(false);

  // Use product ID to deterministically select a placeholder
  const placeholderIndex = (Number(productId) % 3) + 1;
  const placeholderSrc = `/assets/generated/product-placeholder-${placeholderIndex}.dim_800x800.png`;

  // Determine which image to use
  const shouldUseImageURL =
    imageURL &&
    imageURL.trim() !== "" &&
    !imageError &&
    !imageURL.includes("/default.jpg");
  const imageSrc = shouldUseImageURL ? imageURL : placeholderSrc;

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      onError={() => setImageError(true)}
    />
  );
}
