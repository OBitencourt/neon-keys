export type OwnedGame = {
  id: string;
  name: string;
  image?: string;
  platform: string;
  activationCountry: string;
  purchaseDate: string;
  orderId: string;
  key?: string;
  keyRevealed: boolean;
};