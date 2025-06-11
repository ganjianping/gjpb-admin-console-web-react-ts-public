/**
 * Mock API service for development and testing
 * This service mocks the API endpoints and mimics their responses
 */

import type { LoginCredentials, AuthResponse } from './auth-service';

// Mock user data
const mockUsers = [
  {
    username: 'gjpb',
    email: 'gjpb@gmail.com',
    mobileCountryCode: '65',
    mobileNumber: '89765432',
    password: '123456',
    nickname: 'GJP',
    accountStatus: 'active',
    lastLoginAt: '2025-06-01T14:55:37.607879',
    lastLoginIp: '127.0.0.1',
    lastFailedLoginAt: null,
    failedLoginAttempts: 0,
    roleCodes: ['SUPER_ADMIN']
  },
  {
    username: 'admin',
    email: 'admin@example.com',
    mobileCountryCode: '65',
    mobileNumber: '88887777',
    password: '123456',
    nickname: 'Admin',
    accountStatus: 'active',
    lastLoginAt: '2025-06-01T14:55:37.607879',
    lastLoginIp: '127.0.0.1',
    lastFailedLoginAt: null,
    failedLoginAttempts: 0,
    roleCodes: ['ADMIN']
  },
  {
    username: 'user',
    email: 'user@example.com',
    mobileCountryCode: '65',
    mobileNumber: '99998888',
    password: '123456',
    nickname: 'Regular User',
    accountStatus: 'active',
    lastLoginAt: '2025-06-01T14:55:37.607879',
    lastLoginIp: '127.0.0.1',
    lastFailedLoginAt: null,
    failedLoginAttempts: 0,
    roleCodes: ['USER']
  }
];

// Generate JWT-like tokens (mock only)
const generateToken = (username: string): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ 
    sub: username, 
    exp: Date.now() + 3600000, // 1 hour from now
    iat: Date.now()
  }));
  const signature = btoa(Math.random().toString(36).substring(2));
  
  return `${header}.${payload}.${signature}`;
};

class MockApiService {
  /**
   * Mock login endpoint
   */
  public async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Add a delay to simulate network latency
    await this.delay(800);
    
    // Find user by credentials
    const user = this.findUser(credentials);
    
    if (!user) {
      throw new Error('Invalid credentials');
    } else {
      console.log('Login successful! Welcome ' + user.username);
    }
    
    // Generate tokens
    const accessToken = generateToken(user.username);
    const refreshToken = generateToken(`refresh_${user.username}`);
    
    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: 3600, // 1 hour in seconds
      username: user.username,
      email: user.email,
      mobileCountryCode: user.mobileCountryCode,
      mobileNumber: user.mobileNumber,
      nickname: user.nickname,
      accountStatus: user.accountStatus,
      lastLoginAt: new Date().toISOString(),
      lastLoginIp: '127.0.0.1',
      lastFailedLoginAt: null,
      failedLoginAttempts: 0,
      roleCodes: user.roleCodes
    };
  }
  
  /**
   * Mock refresh token endpoint
   */
  public async refreshToken(refreshToken: string): Promise<Partial<AuthResponse>> {
    await this.delay(500);
    
    if (!refreshToken || refreshToken.trim() === '') {
      throw new Error('Invalid refresh token');
    }
    
    // In a real implementation, we'd validate the token
    // Here we just generate a new token
    return {
      accessToken: generateToken('user_' + Date.now()),
      refreshToken: generateToken('refresh_' + Date.now()),
      tokenType: 'Bearer',
      expiresIn: 3600
    };
  }
  
  /**
   * Mock get current user endpoint
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getCurrentUser(token: string): Promise<any> {
    await this.delay(300);
    
    if (!token) {
      throw new Error('Unauthorized');
    }
    
    // For mock purposes, we just return the first user
    const user = mockUsers[0];
    
    return {
      username: user.username,
      email: user.email,
      mobileCountryCode: user.mobileCountryCode,
      mobileNumber: user.mobileNumber,
      nickname: user.nickname,
      accountStatus: user.accountStatus,
      roleCodes: user.roleCodes
    };
  }
  
  /**
   * Helper: Find a user by different credential types
   */
  private findUser(credentials: LoginCredentials): typeof mockUsers[0] | null {
    if (credentials.username) {
      return mockUsers.find(u => u.username === credentials.username && u.password === credentials.password) || null;
    }
    
    if (credentials.email) {
      return mockUsers.find(u => u.email === credentials.email && u.password === credentials.password) || null;
    }
    
    if (credentials.mobileCountryCode && credentials.mobileNumber) {
      return mockUsers.find(
        u => u.mobileCountryCode === credentials.mobileCountryCode && 
             u.mobileNumber === credentials.mobileNumber && 
             u.password === credentials.password
      ) || null;
    }
    
    return null;
  }
  
  /**
   * Helper: Add delay to simulate network latency
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const mockApiService = new MockApiService();
export default mockApiService;
