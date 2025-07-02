"use client";

import React, { useState, MouseEvent, useEffect } from "react";
import ColorSelector from "./ColorSelector";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { cn } from "@/lib/utils";
// import { product } from "@/lib/data";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  removeFromCart,
} from "@/lib/store/features/cart/cart-slice";
import { RootState } from "@/lib/store/store";
import Image from "next/image";

type SelectedVariantType = {
  id: number;
  selectedColor: string;
  selectedSize: ProductVariant["size"];
  TotalQuantity: number;
  selectedQuantity: number;
};

function ProductOverview({ product }: { product: Product }) {
  // Image zooming and active image states
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart);

  const [isShowZooming, setIsShowZooming] = useState<boolean>(false);
  const [activeImage, setActiveImage] = useState<string>(
    product.images[0]?.url || ""
  );
  const [zoomImageCoordinate, setZoomImageCoordinate] = useState({
    x: 0,
    y: 0,
  });

  const handleImageZooming = (e: MouseEvent<HTMLImageElement>) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;

    setZoomImageCoordinate({ x, y });
  };

  const changeActiveImage = (url: string) => {
    setActiveImage(url);
  };

  // variants values
  const sizes = [...new Set(product.variants.map((v) => v.size))];
  const colors = [
    ...new Map(product.variants.map((v) => [v.color.hex, v.color])).values(),
  ];

  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const [selectedColor, setSelectedColor] = useState(colors[0].hex);
  const [quantity, setQuantity] = useState(1);

  const availableSizesForColor = product.variants
    .filter((v) => v.color.hex === selectedColor)
    .map((v) => v.size);

  const availableColorsForSize = product.variants
    .filter((v) => v.size === selectedSize)
    .map((v) => v.color.hex);

  const selectedVariant = (() => {
    const variant = product.variants.find(
      (v) => v.size === selectedSize && v.color.hex === selectedColor
    );
    if (!variant) return undefined;
    return {
      id: variant.id,
      selectedColor: variant.color.hex,
      selectedSize: variant.size,
      TotalQuantity: variant.quantity,
      selectedQuantity: quantity,
    } as SelectedVariantType;
  })();
  const isProductInCart = cartItems.find(
    (item) => item.id === product.id && item.variant.id === selectedVariant?.id
  );
  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error("Please select a valid size, color and quantity.");
      return;
    }

    const cartProduct: CartProduct = {
      id: product.id,
      name: product.name,
      category: product.category,
      gender: product.gender,
      price: product.price,
      image: product.images[0]?.url,
      quantity: quantity,
      variant: {
        id: selectedVariant.id,
        color: {
          hex: selectedVariant.selectedColor,
          name:
            colors.find((c) => c.hex === selectedVariant.selectedColor)?.name ||
            "Unknown",
        },
        size: selectedVariant.selectedSize,
        quantity: selectedVariant.TotalQuantity,
      },
    };

    if (isProductInCart) {
      dispatch(
        removeFromCart({ id: product.id, variantId: selectedVariant.id })
      );
    } else {
      dispatch(addToCart(cartProduct));
    }
    // Here you would typically dispatch an action to add the product to the cart
    // For example: dispatch(addToCart({ ...product, variant: selectedVariant, quantity }));

    console.log("Product added to cart:", {
      ...product,
      variant: selectedVariant,
      quantity,
    });
  };

  useEffect(() => {
    if (selectedVariant) {
      setQuantity(1);
    } else {
      setQuantity(0);
    }
  }, [selectedSize, selectedColor]);

  return (
    <>
      {/* {isBuyOpened && <BuyModal close={toggleBuyModal} product={product} />} */}
      <div className="flex md:flex-row flex-col gap-3 md:min-h-[400px]  h-auto">
        {/* Image thumbnails */}
        <div className="md:w-[110px]  order-2 md:order-1 p-2 flex flex-row md:flex-col gap-2 md:h-[310px] border">
          {product.images?.map((image) => (
            <div
              key={image.id}
              onClick={() => changeActiveImage(image.url)}
              onMouseEnter={() => changeActiveImage(image.url)}
              className={`rounded-lg border-gray-500 border cursor-pointer overflow-hidden w-[70px] h-[70px] ${
                activeImage === image.url && "border-4"
              }`}
            >
              <Image
                src={image.url}
                width={90}
                height={90}
                alt="Product image"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Main product image */}
        <div className="relative md:order-2 order-1 p-2 md:h-full md:w-[470px]">
          <img
            src={activeImage}
            alt="Main product"
            className="w-full border cursor-zoom-in border-black h-full object-contain"
            onMouseMove={handleImageZooming}
            onMouseEnter={() => setIsShowZooming(true)}
            onMouseLeave={() => setIsShowZooming(false)}
          />
          {isShowZooming && (
            <div className="hidden p-2 lg:block absolute min-w-[350px] z-10 -right-[358px] top-1 min-h-[350px] bg-slate-200">
              <div
                className="w-full h-full min-w-[350px] min-h-[350px] bg-slate-200 mix-blend-multiply"
                style={{
                  backgroundImage: `url(${activeImage})`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: `${zoomImageCoordinate.x * 100}% ${
                    zoomImageCoordinate.y * 100
                  }%`,
                  backgroundSize: "170%",
                }}
              ></div>
            </div>
          )}
        </div>

        {/* Product details */}
        <div className="order-3 w-full p-2 flex flex-col">
          {/* Name & Category */}
          <div className="mt-3 mb-2">
            <h1 className="font-bold text-2xl">{product.name}</h1>
            <div className="opacity-35  font-medium">{product.category}</div>
          </div>
          <hr />

          {/* Price */}
          <div className="text-2xl mt-3 font-bold">
            PKR:{" "}
            {product.discountPrice ? (
              <>
                <span className="line-through text-gray-500 mr-2">
                  {product.discountPrice.toLocaleString()}
                </span>
                <span className="text-red-700">
                  {product.price.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-red-700">
                {product.price.toLocaleString()}
              </span>
            )}
          </div>

          <hr />
          {/*Variants  */}
          <div className="mt-3 mb-2">
            {/* Choose color */}
            <div>
              <h2 className="font-semibold">Choose a Color:</h2>
              <div>
                <ColorSelector
                  selectedColor={selectedColor}
                  setSelectedColor={(color) => {
                    setSelectedColor(color);
                  }}
                  className="flex gap-2 p-3"
                  colors={colors}
                  disabledColors={colors
                    .filter((c) => !availableColorsForSize.includes(c.hex))
                    .map((c) => c.hex)}
                />
              </div>
            </div>
            {/* Choose size */}
            <div>
              <h2 className="font-semibold">Choose a Size:</h2>
              <div className="p-3">
                <RadioGroup
                  value={selectedSize}
                  onValueChange={(value) =>
                    setSelectedSize(value as typeof selectedSize)
                  }
                  className="flex gap-3"
                >
                  {sizes.map((size) => {
                    const isDisabled = !availableSizesForColor.includes(size);

                    return (
                      <div key={size}>
                        <RadioGroupItem
                          value={size}
                          id={size}
                          className="peer sr-only"
                          disabled={isDisabled}
                        />
                        <label
                          htmlFor={size}
                          className={cn(
                            "cursor-pointer px-4 py-1 rounded border font-semibold transition-all",
                            isDisabled
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-gray-100 text-gray-800",
                            selectedSize === size &&
                              !isDisabled &&
                              "bg-primary text-white"
                          )}
                        >
                          {size}
                        </label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>
            </div>
            {/* Quantity */}
            <div>
              <div className="flex items-center gap-2 mt-2 mb-2 p-3">
                <button
                  type="button"
                  className="px-3 py-1 cursor-pointer rounded border bg-gray-200 text-lg font-bold"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="min-w-[22px] text-center">{quantity}</span>
                <button
                  type="button"
                  className="px-3 py-1 cursor-pointer rounded border bg-gray-200 text-lg font-bold"
                  onClick={() =>
                    setQuantity((q) =>
                      selectedVariant
                        ? Math.min(selectedVariant.TotalQuantity, q + 1)
                        : q
                    )
                  }
                  disabled={
                    !selectedVariant ||
                    quantity >= (selectedVariant?.TotalQuantity || 1)
                  }
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
            <Button className="" onClick={handleAddToCart}>
              {isProductInCart ? "Remove from Cart" : "Add to Cart"}
            </Button>
          </div>
          <hr />
          {/* Description */}
          <div className="md:min-w-1/2 w-[90%] py-3 text-lg">
            {product.description}
          </div>
          <hr />
          {/* Characteristics */}
          <div className="mt-3 mb-2">
            <h2 className="font-semibold mb-1">Characteristics</h2>
            <ul className="list-none space-y-1 text-base">
              <li>
                <span className="font-medium">Gender:</span> {product.gender}
              </li>
              <li>
                <span className="font-medium">Category:</span>{" "}
                {product.category}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductOverview;
