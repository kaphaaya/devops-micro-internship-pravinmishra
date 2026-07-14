import { Test, TestingModule } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'
import { getRepositoryToken } from '@nestjs/typeorm'
import { AuthService } from './auth.service'
import { User } from './entities/user.entity'
import { AuthenticationMethod } from './entities/authentication-method.entity'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { ConflictException, UnauthorizedException } from '@nestjs/common'

describe('AuthService', () => {
  let service: AuthService
  let jwtService: JwtService
  let mockUsersRepository: any
  let mockAuthMethodsRepository: any

  beforeEach(async () => {
    // Mock repositories
    mockUsersRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    }

    mockAuthMethodsRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    }

    // Mock JWT service
    const mockJwtService = {
      sign: jest.fn().mockReturnValue('mock-token'),
      verify: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
        {
          provide: getRepositoryToken(AuthenticationMethod),
          useValue: mockAuthMethodsRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
    jwtService = module.get<JwtService>(JwtService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'SecurePassword123!',
        fullName: 'Test User',
        tenantName: 'Test Tenant',
      }

      const mockUser = {
        id: 'user-id',
        tenantId: 'tenant-id',
        ...registerDto,
        status: 'active',
      }

      mockUsersRepository.findOne.mockResolvedValue(null)
      mockUsersRepository.create.mockReturnValue(mockUser)
      mockUsersRepository.save.mockResolvedValue(mockUser)

      const result = await service.register(registerDto)

      expect(result).toHaveProperty('accessToken')
      expect(result).toHaveProperty('refreshToken')
      expect(result.tokenType).toBe('Bearer')
    })

    it('should throw ConflictException if email already exists', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'SecurePassword123!',
        fullName: 'Test User',
      }

      mockUsersRepository.findOne.mockResolvedValue({ id: 'existing-user' })

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException)
    })
  })

  describe('login', () => {
    it('should login user successfully', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'SecurePassword123!',
      }

      const mockUser = {
        id: 'user-id',
        tenantId: 'tenant-id',
        email: 'test@example.com',
        passwordHash: '$2b$10$...',
        status: 'active',
        failedLoginAttempts: 0,
        lockedUntil: null,
      }

      mockUsersRepository.findOne.mockResolvedValue(mockUser)
      mockUsersRepository.save.mockResolvedValue(mockUser)

      // Mock bcrypt comparison
      jest.spyOn(require('bcrypt'), 'compare').mockResolvedValue(true)

      const result = await service.login(loginDto)

      expect(result).toHaveProperty('accessToken')
      expect(result).toHaveProperty('refreshToken')
    })

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'WrongPassword123!',
      }

      mockUsersRepository.findOne.mockResolvedValue(null)

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException)
    })

    it('should lock account after 5 failed attempts', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'WrongPassword123!',
      }

      const mockUser = {
        id: 'user-id',
        tenantId: 'tenant-id',
        email: 'test@example.com',
        passwordHash: '$2b$10$...',
        status: 'active',
        failedLoginAttempts: 4,
        lockedUntil: null,
      }

      mockUsersRepository.findOne.mockResolvedValue(mockUser)
      mockUsersRepository.save.mockResolvedValue({
        ...mockUser,
        failedLoginAttempts: 5,
        lockedUntil: expect.any(Date),
      })

      jest.spyOn(require('bcrypt'), 'compare').mockResolvedValue(false)

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException)
      expect(mockUsersRepository.save).toHaveBeenCalled()
    })
  })

  describe('validateUser', () => {
    it('should return user if credentials are valid', async () => {
      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        passwordHash: '$2b$10$...',
      }

      mockUsersRepository.findOne.mockResolvedValue(mockUser)
      jest.spyOn(require('bcrypt'), 'compare').mockResolvedValue(true)

      const result = await service.validateUser('test@example.com', 'SecurePassword123!')

      expect(result).toEqual(mockUser)
    })

    it('should return null if user not found', async () => {
      mockUsersRepository.findOne.mockResolvedValue(null)

      const result = await service.validateUser('test@example.com', 'password')

      expect(result).toBeNull()
    })

    it('should return null if password is invalid', async () => {
      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        passwordHash: '$2b$10$...',
      }

      mockUsersRepository.findOne.mockResolvedValue(mockUser)
      jest.spyOn(require('bcrypt'), 'compare').mockResolvedValue(false)

      const result = await service.validateUser('test@example.com', 'WrongPassword123!')

      expect(result).toBeNull()
    })
  })

  describe('generateTokens', () => {
    it('should generate access and refresh tokens', async () => {
      const mockUser = {
        id: 'user-id',
        tenantId: 'tenant-id',
        email: 'test@example.com',
      }

      const result = await service.generateTokens(mockUser)

      expect(result).toHaveProperty('accessToken', 'mock-token')
      expect(result).toHaveProperty('refreshToken', 'mock-token')
      expect(result.tokenType).toBe('Bearer')
    })
  })
})
