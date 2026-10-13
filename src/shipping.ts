// Strategy : une classe par mode de livraison

export interface ShippingStrategy {
  cost(): number;
}

export class StandardShipping implements ShippingStrategy {
  cost(): number {
    return 5.9;
  }
}

export class ExpressShipping implements ShippingStrategy {
  cost(): number {
    return 14.9;
  }
}

export class RetraitShipping implements ShippingStrategy {
  cost(): number {
    return 0;
  }
}
