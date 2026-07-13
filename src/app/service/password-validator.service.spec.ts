import { TestBed } from '@angular/core/testing';
import { PasswordValidatorService, PasswordValidationResult } from './password-validator.service';
import { LoggerService } from './logger.service';

describe('PasswordValidatorService', () => {
  let service: PasswordValidatorService;
  let mockLoggerService: any;

  beforeEach(() => {
    mockLoggerService = {
      debug: jasmine.createSpy('debug'),
      error: jasmine.createSpy('error'),
      info: jasmine.createSpy('info'),
      warn: jasmine.createSpy('warn')
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: LoggerService, useValue: mockLoggerService }
      ]
    });

    service = TestBed.inject(PasswordValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('validate', () => {
    it('should return valid result for null password', () => {
      const result = service.validate(null as any);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should return valid result for undefined password', () => {
      const result = service.validate(undefined as any);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should return valid result for empty string', () => {
      const result = service.validate('');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should reject password with less than 8 characters', () => {
      const result = service.validate('Abc1!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Au moins 8 caractères requis');
    });

    it('should reject password without uppercase letter', () => {
      const result = service.validate('password1!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Au moins 1 majuscule requise');
    });

    it('should reject password without special character', () => {
      const result = service.validate('Password1');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Au moins 1 caractère ponctuel requis (! @ # $ % ^ & * etc.)');
    });

    it('should reject password with all criteria missing', () => {
      const result = service.validate('password');
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBe(2); // length and uppercase, no special char check
    });

    it('should accept valid password with all criteria', () => {
      const result = service.validate('Password1!');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should accept password with exactly 8 characters', () => {
      const result = service.validate('Pass1!@#');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should accept password with special characters', () => {
      const result = service.validate('P@ssw0rd!');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should accept password with different special characters', () => {
      const passwords = [
        'Password#',
        'Password$',
        'Password%',
        'Password^',
        'Password&',
        'Password*',
        'Password(',
        'Password)',
        'Password_',
        'Password+',
        'Password-',
        'Password=',
        'Password[',
        'Password]',
        'Password{',
        'Password}',
        'Password;',
        'Password:',
        'Password"',
        'Password\'',
        'Password|',
        'Password,',
        'Password.',
        'Password<',
        'Password>',
        'Password/',
        'Password?'
      ];

      passwords.forEach(password => {
        const result = service.validate(password);
        expect(result.isValid).toBe(true);
        expect(result.errors).toEqual([]);
      });
    });

    it('should reject password that is only lowercase and numbers', () => {
      const result = service.validate('password123');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Au moins 1 majuscule requise');
      expect(result.errors).toContain('Au moins 1 caractère ponctuel requis (! @ # $ % ^ & * etc.)');
    });

    it('should reject password that is only uppercase and numbers', () => {
      const result = service.validate('PASSWORD123');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Au moins 1 caractère ponctuel requis (! @ # $ % ^ & * etc.)');
    });

    it('should accept password with only uppercase and special chars', () => {
      const result = service.validate('PASSWORD!@#');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should reject password with only lowercase and special chars', () => {
      const result = service.validate('password!@#');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Au moins 1 majuscule requise');
    });

    it('should accept long valid password', () => {
      const result = service.validate('VeryLongPassword123!@#');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should return multiple errors for password with multiple issues', () => {
      const result = service.validate('pass');
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors).toContain('Au moins 8 caractères requis');
    });

    it('should handle password with spaces', () => {
      const result = service.validate('Pass 123!');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should handle password with unicode characters', () => {
      const result = service.validate('Pässwörd1!');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });
  });

  describe('PasswordValidationResult interface', () => {
    it('should return result structure matching interface', () => {
      const result: PasswordValidationResult = service.validate('Invalid');
      expect(result.isValid).toBeDefined();
      expect(result.errors).toBeDefined();
      expect(Array.isArray(result.errors)).toBe(true);
    });
  });
});