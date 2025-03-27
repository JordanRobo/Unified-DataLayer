// test/productDisplay.test.ts
import { describe, expect, it } from "bun:test";
import { DataLayer } from "../src/index";

describe("ProductDisplay module", () => {
    it("should have a view method", () => {
        expect(typeof DataLayer.pdp.view).toBe("function");
    });
});