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

// pont entre le texte du mode et sa strategie
export const shippingStrategies: Record<string, ShippingStrategy> = {
  STANDARD: new StandardShipping(),
  EXPRESS: new ExpressShipping(),
  RETRAIT: new RetraitShipping(),
};
