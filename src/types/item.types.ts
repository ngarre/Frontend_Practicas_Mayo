export interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
  isNew: boolean;
  releaseDate: string;
  imageUrl: string;
}

export interface ItemInDto {
  name: string;
  description: string;
  price: number;
  isNew: boolean;
  releaseDate: string;
  image?: string;
}