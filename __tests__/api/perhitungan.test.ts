import { describe, it, expect } from "vitest";

/**
 * BMI Calculation Logic — extracted from app/api/perhitungan/route.ts
 *
 * Rumus: BMI = berat / (tinggi_meter)^2
 * Status:
 *   < 18.5  → Kurus
 *   18.5-24.9 → Normal
 *   25-29.9 → Berlebih
 *   >= 30   → Obesitas
 */

function hitungBMI(tinggi_cm: number, berat_kg: number) {
  const bmi = berat_kg / Math.pow(tinggi_cm / 100, 2);
  const bmiRounded = parseFloat(bmi.toFixed(1));

  let status: string;
  if (bmi < 18.5) status = "Kurus";
  else if (bmi < 25) status = "Normal";
  else if (bmi < 30) status = "Berlebih";
  else status = "Obesitas";

  return { bmi: bmiRounded, status };
}

// ─── BMI Calculation ──────────────────────────────────────────────────────────
describe("hitungBMI (BMI Calculator)", () => {
  it("should calculate BMI correctly for Normal status", () => {
    // 70kg / (1.75m)^2 = 22.857... → 22.9 → Normal
    const { bmi, status } = hitungBMI(175, 70);
    expect(bmi).toBeCloseTo(22.9, 1);
    expect(status).toBe("Normal");
  });

  it("should classify BMI < 18.5 as Kurus", () => {
    // 45kg / (1.70m)^2 = 15.57... → Kurus
    const { status } = hitungBMI(170, 45);
    expect(status).toBe("Kurus");
  });

  it("should classify BMI exactly 18.5 as Normal", () => {
    // 18.5 * (1.70)^2 = 53.465kg
    const tinggi = 170;
    const berat = 18.5 * Math.pow(tinggi / 100, 2);
    const { status } = hitungBMI(tinggi, berat);
    expect(status).toBe("Normal");
  });

  it("should classify BMI 25-29.9 as Berlebih", () => {
    // 80kg / (1.70m)^2 = 27.68 → Berlebih
    const { status } = hitungBMI(170, 80);
    expect(status).toBe("Berlebih");
  });

  it("should classify BMI >= 30 as Obesitas", () => {
    // 95kg / (1.70m)^2 = 32.87 → Obesitas
    const { status } = hitungBMI(170, 95);
    expect(status).toBe("Obesitas");
  });

  it("should round BMI to 1 decimal place", () => {
    // 70kg / (1.75m)^2 = 22.857...
    const { bmi } = hitungBMI(175, 70);
    const decimalStr = bmi.toString().split(".")[1] ?? "";
    expect(decimalStr.length).toBeLessThanOrEqual(1);
  });

  it("should handle edge case: exactly at BMI 25 boundary", () => {
    // BMI tepat 25 → Berlebih
    const tinggi = 180;
    const berat = 25 * Math.pow(tinggi / 100, 2); // = 81kg
    const { status } = hitungBMI(tinggi, berat);
    expect(status).toBe("Berlebih");
  });

  it("should handle edge case: exactly at BMI 30 boundary", () => {
    // BMI tepat 30 → Obesitas
    const tinggi = 180;
    const berat = 30 * Math.pow(tinggi / 100, 2); // = 97.2kg
    const { status } = hitungBMI(tinggi, berat);
    expect(status).toBe("Obesitas");
  });
});

// ─── Input Validation Logic ───────────────────────────────────────────────────
describe("Perhitungan input validation logic", () => {
  function isValidInput(tinggi_badan: unknown, berat_badan: unknown): boolean {
    if (!tinggi_badan || !berat_badan) return false;
    const tinggi = parseFloat(String(tinggi_badan));
    const berat = parseFloat(String(berat_badan));
    if (isNaN(tinggi) || isNaN(berat) || tinggi <= 0 || berat <= 0)
      return false;
    return true;
  }

  it("should return false when tinggi_badan is missing", () => {
    expect(isValidInput(undefined, 70)).toBe(false);
  });

  it("should return false when berat_badan is missing", () => {
    expect(isValidInput(170, undefined)).toBe(false);
  });

  it("should return false when tinggi_badan is zero", () => {
    expect(isValidInput(0, 70)).toBe(false);
  });

  it("should return false when berat_badan is negative", () => {
    expect(isValidInput(170, -5)).toBe(false);
  });

  it("should return false for non-numeric strings", () => {
    expect(isValidInput("seratus", 70)).toBe(false);
  });

  it("should return true for valid string numbers", () => {
    expect(isValidInput("170", "70")).toBe(true);
  });

  it("should return true for valid numeric inputs", () => {
    expect(isValidInput(175, 65)).toBe(true);
  });
});
