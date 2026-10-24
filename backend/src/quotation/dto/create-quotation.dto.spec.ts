import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateQuotationDto } from './create-quotation.dto';

describe('CreateQuotationDto - Phone Validation & Normalization', () => {
  const baseValidPayload = {
    fullName: 'Ramesh Singh',
    address: 'Kutubpur, Bahadurpur',
    city: 'Mau',
  };

  async function validateDto(phoneInput: any) {
    const dto = plainToInstance(CreateQuotationDto, {
      ...baseValidPayload,
      phone: phoneInput,
    });
    const errors = await validate(dto);
    return {
      dto,
      isValid: errors.length === 0,
      errors,
    };
  }

  describe('Valid Indian Mobile Numbers & Normalization', () => {
    it.each([
      ['standard 10-digit', '9876543210', '9876543210'],
      ['with +91 country code and space', '+91 9876543210', '9876543210'],
      ['with +91 country code without space', '+919876543210', '9876543210'],
      ['with +91 and hyphens', '+91-9876-543210', '9876543210'],
      ['with leading 0 trunk prefix', '09876543210', '9876543210'],
      ['with 91 prefix without plus', '919876543210', '9876543210'],
      ['with surrounding whitespace', '  9876543210  ', '9876543210'],
      ['starting with 6 series', '+91 6123456789', '6123456789'],
      ['starting with 7 series', '+91 7123456789', '7123456789'],
      ['starting with 8 series', '+91 8123456789', '8123456789'],
      ['starting with 9 series', '+91 9123456789', '9123456789'],
    ])('should accept and normalize %s (%s)', async (_, input, expectedNormalized) => {
      const result = await validateDto(input);
      expect(result.isValid).toBe(true);
      expect(result.dto.phone).toBe(expectedNormalized);
    });
  });

  describe('Invalid Phone Numbers Rejection', () => {
    it.each([
      ['too short (5 digits)', '12345'],
      ['too long (13 digits)', '9876543210123'],
      ['alphabetic string', 'abcdefghij'],
      ['alphanumeric mix', '98765abcde'],
      ['invalid country code (+1 USA)', '+1 9876543210'],
      ['invalid country code (+44 UK)', '+44 9876543210'],
      ['invalid starting digit (starts with 1)', '+91 1234567890'],
      ['invalid starting digit (starts with 5)', '+91 5555555555'],
      ['empty string', ''],
      ['whitespace only', '   '],
      ['null value', null],
      ['undefined value', undefined],
    ])('should reject %s (%s)', async (_, input) => {
      const result = await validateDto(input);
      expect(result.isValid).toBe(false);
      const phoneErrors = result.errors.filter((e) => e.property === 'phone');
      expect(phoneErrors.length).toBeGreaterThan(0);
    });
  });

  describe('Solar Type Validation', () => {
    it.each([
      ['On-Grid Solar', 'On-Grid Solar'],
      ['Hybrid Solar', 'Hybrid Solar'],
      ['On-Grid', 'On-Grid'],
      ['Hybrid', 'Hybrid'],
    ])('should accept %s solar system type', async (_, solarType) => {
      const dto = plainToInstance(CreateQuotationDto, {
        fullName: 'Anurag Sharma',
        phone: '9876543210',
        address: 'Mau, UP',
        city: 'Mau',
        solarType,
      });
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
      expect(dto.solarType).toBe(solarType);
    });
  });
});
