export interface ImagePlaceholder {
    id: string;
    imageUrl: string;
    imageHint: string;
}

export const PlaceHolderImages: ImagePlaceholder[] = [
    {
        id: "book_1",
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80",
        imageHint: "textbook on a desk",
    },
    {
        id: "chair_1",
        imageUrl: "https://images.unsplash.com/photo-1505797149-43b0ad766a0e?w=800&q=80",
        imageHint: "ergonomic office chair",
    },
    {
        id: "calc_1",
        imageUrl: "https://images.unsplash.com/photo-1587141766460-435dd602d3c8?w=800&q=80",
        imageHint: "graphing calculator",
    },
    {
        id: "fridge_1",
        imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80",
        imageHint: "mini fridge in a room",
    },
];
