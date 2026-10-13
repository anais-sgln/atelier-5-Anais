import { OrderManager } from "../src/orderManager";

test("l'email de confirmation garde son texte exact", () => {
  const log = jest.spyOn(console, "log").mockImplementation(() => {});
  const m = new OrderManager();
  m.processOrder("Alice", "PARTICULIER", [["Clavier", 50, 2]], "STANDARD", null, true);
  expect(log).toHaveBeenCalledWith("EMAIL a Alice : votre commande de 123.50 EUR est confirmee");
  log.mockRestore();
});
 
